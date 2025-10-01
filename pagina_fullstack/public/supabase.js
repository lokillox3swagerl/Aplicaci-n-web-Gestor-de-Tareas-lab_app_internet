import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://nspcjhvamqxosjqzjkxt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcGNqaHZhbXF4b3NqcXpqa3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc5NTgsImV4cCI6MjA3NDkyMzk1OH0.CJp9GXtjexn3PoUqxjPgHYFR5b6TOHwhxBj8vH-duzs')