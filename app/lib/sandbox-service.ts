import { supabase } from '@/lib/supabase'
import { UserCodeState, UserSession, Sandbox } from '@/lib/supabase'

export class SandboxService {
  // Code State Management
  static async saveCodeState(
    codeContent: string,
    language: string = 'javascript',
    filePath: string = '/main.js'
  ): Promise<UserCodeState | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_code_states')
      .upsert({
        user_id: user.id,
        code_content: codeContent,
        language,
        file_path: filePath,
        last_modified: new Date().toISOString(),
      }, {
        onConflict: 'user_id,file_path'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving code state:', error)
      return null
    }

    return data
  }

  static async loadCodeState(filePath: string = '/main.js'): Promise<UserCodeState | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_code_states')
      .select('*')
      .eq('user_id', user.id)
      .eq('file_path', filePath)
      .order('last_modified', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading code state:', error)
      return null
    }

    return data
  }

  static async getAllCodeStates(): Promise<UserCodeState[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_code_states')
      .select('*')
      .eq('user_id', user.id)
      .order('last_modified', { ascending: false })

    if (error) {
      console.error('Error loading code states:', error)
      return []
    }

    return data || []
  }

  // Session Management
  static async createSession(sessionName: string): Promise<UserSession | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: user.id,
        session_name: sessionName,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating session:', error)
      return null
    }

    return data
  }

  static async getUserSessions(): Promise<UserSession[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading sessions:', error)
      return []
    }

    return data || []
  }

  // Sandbox Management
  static async createSandbox(sandboxUrl: string): Promise<Sandbox | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('sandboxes')
      .insert({
        user_id: user.id,
        sandbox_url: sandboxUrl,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating sandbox:', error)
      return null
    }

    return data
  }

  static async getActiveSandbox(): Promise<Sandbox | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('sandboxes')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading sandbox:', error)
      return null
    }

    return data
  }

  static async getUserSandboxes(): Promise<Sandbox[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('sandboxes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading sandboxes:', error)
      return []
    }

    return data || []
  }

  // Clean up expired sandboxes
  static async cleanupExpiredSandboxes(): Promise<void> {
    const { error } = await supabase
      .from('sandboxes')
      .update({ status: 'expired' })
      .lt('expires_at', new Date().toISOString())

    if (error) {
      console.error('Error cleaning up sandboxes:', error)
    }
  }
}
