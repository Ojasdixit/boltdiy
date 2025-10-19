import React from 'react'
import { AuthProvider, useAuth } from '~/components/auth/AuthProvider'
import { LoginForm } from '~/components/auth/LoginForm'

function AuthContent() {
  const { user, loading, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/auth'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600 mb-6">You are signed in as {user.email}</p>
            <div className="space-y-3">
              <a
                href="/sandbox"
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Go to Sandbox
              </a>
              <button
                onClick={handleSignOut}
                className="block w-full bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Bolt.diy</h1>
          <p className="text-gray-600">Sign in to access your personal sandbox environment</p>
        </div>
        <LoginForm onSuccess={() => window.location.reload()} />
      </div>
    </div>
  )
}

export default function Auth() {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  )
}
