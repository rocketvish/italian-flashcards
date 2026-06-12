import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ozltecyteblwojqfwgry.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_V7EG2hCy-HRB9i4iPKqoNA_vzA3vGra';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: 'pkce',         // Uses query params instead of hash, avoids HashRouter conflict
    persistSession: true,
    autoRefreshToken: true,
  },
});
