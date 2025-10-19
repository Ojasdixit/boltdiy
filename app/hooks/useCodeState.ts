import { useState, useEffect } from 'react'
import { SandboxService } from '../lib/sandbox-service'
import type { UserCodeState } from '../lib/supabase'

export const useCodeState = (filePath: string = '/main.js') => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Load code state on mount
  useEffect(() => {
    loadCodeState()
  }, [filePath])

  // Auto-save code state when it changes
  useEffect(() => {
    if (code && !loading) {
      const timeoutId = setTimeout(() => {
        saveCodeState(code)
      }, 1000) // Debounce saves by 1 second

      return () => clearTimeout(timeoutId)
    }
  }, [code, loading])

  const loadCodeState = async () => {
    try {
      setLoading(true)
      setError('')
      const savedState = await SandboxService.loadCodeState(filePath)
      if (savedState) {
        setCode(savedState.code_content)
      }
    } catch (err) {
      console.error('Error loading code state:', err)
      setError('Failed to load saved code')
    } finally {
      setLoading(false)
    }
  }

  const saveCodeState = async (newCode: string) => {
    try {
      setSaving(true)
      await SandboxService.saveCodeState(newCode, 'javascript', filePath)
    } catch (err) {
      console.error('Error saving code state:', err)
      setError('Failed to save code')
    } finally {
      setSaving(false)
    }
  }

  const manualSave = async () => {
    await saveCodeState(code)
  }

  return {
    code,
    setCode,
    loading,
    saving,
    error,
    saveCodeState: manualSave,
    reloadCodeState: loadCodeState,
  }
}
