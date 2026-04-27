import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

// Client untuk operasi Admin/Bypass
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client standar untuk public/auth operations (seperti Login)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);