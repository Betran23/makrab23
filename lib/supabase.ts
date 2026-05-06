import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type CommitteeMember = {
  id: string
  division: 'perkamjin' | 'pdd' | 'acara' | 'konkos'
  name: string
  nim: string
  role: 'pj' | 'anggota'
  created_at: string
}
