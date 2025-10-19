import React, { useState } from 'react'
import { AuthProvider, useAuth } from '~/components/auth/AuthProvider'
import { LoginForm } from '~/components/auth/LoginForm'
import { SandboxPreview } from '~/components/sandbox/SandboxPreview'
import { useCodeState } from '~/hooks/useCodeState'

function SandboxContent() {
  const { user, signOut } = useAuth()
  const { code, setCode, loading, saving } = useCodeState()
  const [showSandbox, setShowSandbox] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/auth'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your code...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-8">Access Restricted</h1>
          <p className="text-gray-600 text-center mb-6">Please sign in to access the sandbox.</p>
          <LoginForm onSuccess={() => window.location.reload()} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold">Bolt.diy Sandbox</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8">
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Code Editor</h2>
            <button
              onClick={() => setShowSandbox(!showSandbox)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showSandbox ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm"
            placeholder="Start coding here..."
          />

          {saving && (
            <div className="text-sm text-gray-600">Saving...</div>
          )}

          {showSandbox && (
            <SandboxPreview
              code={code}
              onSandboxReady={(url) => console.log('Sandbox ready:', url)}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default function Sandbox() {
  return (
    <AuthProvider>
      <SandboxContent />
    </AuthProvider>
  )
}
