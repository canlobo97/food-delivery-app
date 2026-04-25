import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://snxkmkbtwicztvdehfjy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNueGtta2J0d2ljenR2ZGVoZmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDMxMDYsImV4cCI6MjA5MjUxOTEwNn0.PLxzD_y5ZwgjyssAPvc3c5HzcNQPOkzu7admAx51-fo'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})