import { createClient } from '@supabase/supabase-js';
import { AnalysisResults, Mode } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

// Save analysis results to Supabase
export async function saveAnalysis(data: {
  url: string;
  mode: Mode;
  results: AnalysisResults;
  scraped_title?: string;
  scraped_text?: string;
}) {
  let { data: session } = await supabase.auth.getSession();
  let userId = session.session?.user?.id;

  // If user is not authenticated, sign in with default guest credentials
  if (!userId) {
    const guestEmail = import.meta.env.VITE_GUEST_EMAIL || 'guest@sourcelens.app';
    const guestPassword = import.meta.env.VITE_GUEST_PASSWORD || 'guest123456';
    
    try {
      // Try to sign in first
      let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword,
      });
      
      // If sign in fails, try to sign up (create the guest user)
      if (authError) {
        console.log('Guest user does not exist, creating...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: guestEmail,
          password: guestPassword,
          options: {
            emailRedirectTo: undefined, // Skip email confirmation
          }
        });
        
        if (signUpError) {
          console.error('Failed to create guest user:', signUpError);
          throw new Error('Unable to save analysis. Please try again later.');
        }
        
        authData = signUpData;
        console.log('✓ Guest user created and signed in');
      } else {
        console.log('✓ Signed in as guest user');
      }
      
      userId = authData.user?.id;
    } catch (err) {
      console.error('Guest authentication error:', err);
      throw new Error('Unable to save analysis. Please try again later.');
    }
  }

  const { data: result, error } = await supabase
    .from('analyses')
    .insert({
      user_id: userId,
      url: data.url,
      mode: data.mode,
      scraped_title: data.scraped_title,
      scraped_text: data.scraped_text,
      brief_json: data.results.brief_json,
      structured_json: data.results.structured_json,
      raw_text: data.results.raw_text,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving analysis:', error);
    throw error;
  }

  return result;
}

// Get user's saved analyses
export async function getUserAnalyses(limit = 50) {
  let { data: session } = await supabase.auth.getSession();
  let userId = session.session?.user?.id;

  // If user is not authenticated, sign in as guest
  if (!userId) {
    const guestEmail = import.meta.env.VITE_GUEST_EMAIL || 'guest@sourcelens.app';
    const guestPassword = import.meta.env.VITE_GUEST_PASSWORD || 'guest123456';
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword,
      });
      
      if (authError || !authData.user) {
        console.log('Guest user not authenticated, returning empty array');
        return [];
      }
      
      userId = authData.user.id;
    } catch (err) {
      console.error('Guest authentication error:', err);
      return [];
    }
  }

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching analyses:', error);
    throw error;
  }

  return data;
}

// Search user's analyses by keyword
export async function searchUserAnalyses(keyword: string, limit = 50) {
  let { data: session } = await supabase.auth.getSession();
  let userId = session.session?.user?.id;

  // If user is not authenticated, sign in as guest
  if (!userId) {
    const guestEmail = import.meta.env.VITE_GUEST_EMAIL || 'guest@sourcelens.app';
    const guestPassword = import.meta.env.VITE_GUEST_PASSWORD || 'guest123456';
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword,
      });
      
      if (authError || !authData.user) {
        console.log('Guest user not authenticated, returning empty array');
        return [];
      }
      
      userId = authData.user.id;
    } catch (err) {
      console.error('Guest authentication error:', err);
      return [];
    }
  }

  const searchTerm = `%${keyword}%`;

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .or(`url.ilike.${searchTerm},scraped_title.ilike.${searchTerm},scraped_text.ilike.${searchTerm},mode.ilike.${searchTerm}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error searching analyses:', error);
    throw error;
  }

  return data;
}

// Get a specific analysis by ID
export async function getAnalysisById(id: string) {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching analysis:', error);
    throw error;
  }

  return data;
}

// Delete an analysis
export async function deleteAnalysis(id: string) {
  const { error } = await supabase
    .from('analyses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting analysis:', error);
    throw error;
  }
}
