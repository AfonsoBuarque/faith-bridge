import { supabase } from '../lib/supabase';

export async function validateAuth() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (session?.user) {
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id);
        
      if (profileError) throw profileError;
      
      return {
        success: true,
        authenticated: !!session,
        hasProfile: data && data.length > 0
      };
    }
    
    return {
      success: true,
      authenticated: false,
      hasProfile: false
    };
  } catch (error) {
    console.error('Validation Error:', error);
    return {
      success: false,
      error
    };
  }
}