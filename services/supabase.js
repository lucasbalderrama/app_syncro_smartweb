// services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgvxrpodfdiwbtcnxmql.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndnhycG9kZmRpd2J0Y254bXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjI1NDgsImV4cCI6MjA2MjI5ODU0OH0.HyyA89bIkbzCn1rRzkFrWOXlr4tQn8MNWaG3UM83tck';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
