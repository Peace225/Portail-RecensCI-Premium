// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// On contourne le fichier .env temporairement pour forcer la connexion
const supabaseUrl = 'https://bdwfaydlvwjjggkjbdsj.supabase.co';
const supabaseAnonKey = 'sb_publishable_e7kZJdXjqwMe96rlHyRL1Q_yL4rqbHP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);