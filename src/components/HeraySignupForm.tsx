'use client'

import { useState } from 'react'

interface FormData {
  fullName: string
  email: string
  phone: string
}

interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}

export default function HeraySignupForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
  })

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState({ isSubmitting: true, isSuccess: false, error: null })

    try {
      const response = await fetch('/.netlify/functions/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setFormState({ isSubmitting: false, isSuccess: true, error: null })
    } catch (error) {
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    }
  }

  if (formState.isSuccess) {
    return (
      <div className="success-message bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg animate-fade-in">
        <h3 className="text-xl font-bold mb-2 flex items-center">
          🎉 به انجمن هری خوش آمدید!
        </h3>
        <p className="text-green-100">
          Thank you for joining our community. We'll be in touch soon with information about upcoming events and activities.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formState.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {formState.error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-300 bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-300 bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-300 bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      <button
        type="submit"
        disabled={formState.isSubmitting}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-300 ${
          formState.isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-1'
        }`}
      >
        {formState.isSubmitting ? 'Joining...' : 'Join Heray Organization'}
      </button>
    </form>
  )
} 