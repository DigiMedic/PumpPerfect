import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseUrl) {
    throw new Error('Chybí NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseKey) {
    throw new Error('Chybí NEXT_PUBLIC_SUPABASE_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey) 