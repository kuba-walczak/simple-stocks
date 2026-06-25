import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const SUPABASE_URL: string | undefined = Constants.expoConfig?.extra?.SUPABASE_URL
const SUPABASE_API_KEY: string | undefined = Constants.expoConfig?.extra?.SUPABASE_API_KEY

if (!SUPABASE_URL || !SUPABASE_API_KEY)
    throw new Error('env variables missing')

export const SUPABASE_CLIENT = createClient(SUPABASE_URL!, SUPABASE_API_KEY!)

export async function supabaseRequestWrapper(request : PromiseLike<{data: any, error: any}>) {
  const { data, error } = await request
  if (error)
    throw error
  return data
}