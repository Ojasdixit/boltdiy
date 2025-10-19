import React, { useState, useEffect } from 'react'
import { useAuth } from '~/components/auth/AuthProvider'
import { SandboxService } from '~/lib/sandbox-service'

interface SandboxPreviewProps {
  code: string
  onSandboxReady?: (sandboxUrl: string) => void
}

export const SandboxPreview: React.FC<SandboxPreviewProps> = ({ code, onSandboxReady }) => {
  const { user } = useAuth()
  const [sandboxUrl, setSandboxUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      checkExistingSandbox()
    }
  }, [user])

  const checkExistingSandbox = async () => {
    try {
      const existingSandbox = await SandboxService.getActiveSandbox()
      if (existingSandbox) {
        setSandboxUrl(existingSandbox.sandbox_url)
        onSandboxReady?.(existingSandbox.sandbox_url)
      }
    } catch (err) {
      console.error('Error checking existing sandbox:', err)
    }
  }

  const createSandbox = async () => {
    if (!user) {
      setError('Please sign in to create a sandbox')
      return
    }

    setLoading(true)
    setError('')

    try {
      // In a real implementation, this would call an API to create a sandbox
      // For now, we'll simulate creating a sandbox URL
      const newSandboxUrl = `https://sandbox-${user.id.slice(0, 8)}.vercel.app`

      const sandbox = await SandboxService.createSandbox(newSandboxUrl)
      if (sandbox) {
        setSandboxUrl(newSandboxUrl)
        onSandboxReady?.(newSandboxUrl)
      } else {
        setError('Failed to create sandbox')
      }
    } catch (err) {
      console.error('Error creating sandbox:', err)
      setError('Failed to create sandbox')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-800">
          Please sign in to create and use sandboxes for previewing your code.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Sandbox Preview</h3>

      {sandboxUrl ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sandbox URL:</span>
            <a
              href={sandboxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {sandboxUrl}
            </a>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-green-800 text-sm">
              ✅ Sandbox is ready! Your code state will be automatically saved and restored.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">
            Create a sandbox environment to preview your code with persistent state.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={createSandbox}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating Sandbox...' : 'Create Sandbox'}
          </button>
        </div>
      )}
    </div>
  )
}
