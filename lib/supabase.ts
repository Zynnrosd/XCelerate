import { createClient } from "@supabase/supabase-js"

// Replace these with your new Supabase URL and anon key
const supabaseUrl = "https://qycuozrozuvbigjyzqle.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5Y3VvenJvenV2Ymlnanl6cWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MzI5NjEsImV4cCI6MjA1NzEwODk2MX0.vA8VYc6srC8iY0qmpXNuOXC9qzU-CkvrT-t36dQpjuM"

// Create the Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "xcelerate-auth-token",
  },
})

// Log the initialization for debugging
console.log("Supabase client initialized with URL:", supabaseUrl)
