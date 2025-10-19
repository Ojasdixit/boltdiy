-- Create user_code_states table for storing user code sessions
CREATE TABLE IF NOT EXISTS user_code_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code_content TEXT NOT NULL,
  language VARCHAR(50) NOT NULL DEFAULT 'javascript',
  file_path VARCHAR(500) NOT NULL DEFAULT '/main.js',
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table for managing user sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sandboxes table for managing user sandboxes
CREATE TABLE IF NOT EXISTS sandboxes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sandbox_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_code_states_user_id ON user_code_states(user_id);
CREATE INDEX IF NOT EXISTS idx_user_code_states_last_modified ON user_code_states(last_modified DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sandboxes_user_id ON sandboxes(user_id);
CREATE INDEX IF NOT EXISTS idx_sandboxes_status ON sandboxes(status);

-- Enable Row Level Security (RLS)
ALTER TABLE user_code_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sandboxes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_code_states
CREATE POLICY "Users can only access their own code states" ON user_code_states
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_sessions
CREATE POLICY "Users can only access their own sessions" ON user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for sandboxes
CREATE POLICY "Users can only access their own sandboxes" ON sandboxes
  FOR ALL USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_code_states_updated_at
  BEFORE UPDATE ON user_code_states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
