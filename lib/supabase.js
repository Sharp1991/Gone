import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://gtvtjoolovbtkechzlab.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0dnRqb29sb3ZidGtlY2h6bGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNjM0MzgsImV4cCI6MjA5ODYzOTQzOH0.KVoCZ3yY1YS9c18oDSmLo7ZP1xJdl_3wjhQUHI6wV9Q"

export const supabase = createClient(supabaseUrl, supabaseKey)
