import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Supabase
const SUPABASE_URL = 'https://fpkhvbucnfqxjyzlexlz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwa2h2YnVjbmZxeGp5emxleGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjA3MTQsImV4cCI6MjA5NzIzNjcxNH0.9ypGlPfdivLptnhzvIVHH7sv1Nx-0xNPTJWqVHnd0yA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
