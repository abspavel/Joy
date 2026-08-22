/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ywkcfpdoduaipyzruhnz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bZA166IynMCCEysBIm-Gog_S_GBKLfG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
