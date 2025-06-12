import { NextRequest, NextResponse } from 'next/server'
import { supabase, type MemberInsert } from '@/lib/supabase'

// Simple validation function
function validateMemberData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.full_name || data.full_name.length < 2) {
    errors.push('Full name must be at least 2 characters')
  }
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.push('Valid email is required')
  }
  
  return { isValid: errors.length === 0, errors }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    console.log('Received request body:', body)
    
    // Validate input
    const validation = validateMemberData(body)
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors)
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.errors },
        { status: 400 }
      )
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
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Insert new member
    console.log('Attempting to insert member:', validatedData)
    const { data, error } = await supabase
      .from('members')
      .insert([validatedData as MemberInsert])
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to register member: ' + error.message },
        { status: 500 }
      )
    }

    console.log('Successfully inserted member:', data)

    // Return success (don't return sensitive data)
    return NextResponse.json(
      { 
        message: 'Successfully registered!'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 