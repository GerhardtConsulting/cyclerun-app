import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yuxkujcnsrrkwbvftkvq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eGt1amNuc3Jya3didmZ0a3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjAwNzgsImV4cCI6MjA4NTg5NjA3OH0.aQRnjS2lKDr0qQU9eKphynaHajdn5xWruAXnRx8zhZI";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  try {
    if (!_client) {
      _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return _client;
  } catch {
    return null;
  }
}
