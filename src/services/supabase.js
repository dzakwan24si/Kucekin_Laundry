import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase Project Anda
const SUPABASE_URL = "https://impjljpcvddyhfzeuafn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_RqqwWKzw8YLmUv6qPPtUyQ_Ma85wMbJ";

// Inisialisasi client Supabase resmi (dibutuhkan untuk fitur Realtime WebSockets)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
