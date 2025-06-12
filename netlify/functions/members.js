const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Simple validation function
function validateMemberData(data) {
  const errors = []
  
  if (!data.full_name || data.full_name.length < 2) {
    errors.push('Full name must be at least 2 characters')
  }
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.push('Valid email is required')
  }
  
  return { isValid: errors.length === 0, errors }
}

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body)
    console.log('Received request body:', body)
    
    // Validate input
    const validation = validateMemberData(body)
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid input data',
          details: validation.errors
        })
      }
    }
    
    const validatedData = {
      full_name: body.full_name,
      email: body.email,
      phone: body.phone || null,
    }

    // Check if email already exists
    const { data: existingMember } = await supabase
      .from('members')
      .select('email')
      .eq('email', validatedData.email)
      .single()

    if (existingMember) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ error: 'Email already registered' })
      }
    }

    // Insert new member
    console.log('Attempting to insert member:', validatedData)
    const { data, error } = await supabase
      .from('members')
      .insert([validatedData])
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to register member: ' + error.message
        })
      }
    }

    console.log('Successfully inserted member:', data)

    // Return success
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Successfully registered!'
      })
    }

  } catch (error) {
    console.error('Function Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
} 