import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || url.includes('placeholder') || anonKey.includes('placeholder')) {
    throw new Error('Sign-in is temporarily unavailable. Please try again later.');
  }
  return createBrowserClient(url, anonKey);
};
