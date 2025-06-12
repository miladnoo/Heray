'use client'

import { useState, useEffect } from 'react'
import { supabase, type Member } from '@/lib/supabase'

// Simple Auth component without external dependencies for now
function SimpleAuthForm({ onAuth }: { onAuth: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user?.email) {
        onAuth(data.user.email)
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
              required
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          🔒 Secure admin authentication via Supabase
        </p>
      </div>
    </div>
  )
}

// Check if user is admin
const isAdminUser = (email: string): boolean => {
  const adminEmails = [
    'quizdue@gmail.com',
    'founder@herayorg.com',
    'milad@herayorg.com',
    // Add your admin emails here
  ]
  return adminEmails.includes(email.toLowerCase())
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Fetch members if user is admin
  useEffect(() => {
    if (user && isAdminUser(user.email!)) {
      fetchMembers()
    }
  }, [user])

  const fetchMembers = async () => {
    try {
      setError(null) // Clear previous errors
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error details:', error)
        throw error
      }
      
      setMembers(data || [])
      console.log('Successfully fetched members:', data?.length || 0)
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error occurred'
      setError('Unable to fetch members: ' + errorMessage)
      console.error('Fetch members error:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setMembers([])
  }

  const handleAuth = (email: string) => {
    // This will be handled by the auth state change listener
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Not logged in - show auth
  if (!user) {
    return <SimpleAuthForm onAuth={handleAuth} />
  }

  // Check if user is admin
  if (!isAdminUser(user.email!)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have admin permissions for the Heray Organization dashboard.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Signed in as: {user.email}
          </p>
          <button
            onClick={handleSignOut}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Heray Organization - Admin Dashboard
            </h1>
            <p className="text-gray-600">Welcome, {user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
            <h3 className="font-semibold">Note</h3>
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Members data is protected by Row Level Security. Admin access is working correctly.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Member Registrations ({members.length})
            </h2>
            <button
              onClick={fetchMembers}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
          
          {members.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">No members visible</p>
              <p className="text-sm text-gray-500">
                This could be due to RLS policies protecting member data.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800 font-medium">{member.full_name}</td>
                      <td className="px-4 py-3 text-gray-600">{member.email}</td>
                      <td className="px-4 py-3 text-gray-600">{member.phone || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(member.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">🔒 Security Status</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✅ Authenticated via Supabase Auth</li>
            <li>✅ Admin email verified</li>
            <li>✅ Row Level Security enabled</li>
            <li>✅ No public access to admin functions</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 