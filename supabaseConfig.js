import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://eexkavoksaqjybqbjvbh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleGthdm9rc2FxanlicWJqdmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDc4NTUsImV4cCI6MjA2Mjg4Mzg1NX0.KAIZsxlc6LE8iGQTyDIPg-FZePSE5oV6hy1LnrH6J5k";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        "Supabase URL ou chave não estão configuradas corretamente"
    );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);