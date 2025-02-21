import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuthContext();

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: remember
        }
      });

      if (authError) throw authError;
      if (!data?.user) throw new Error('Login failed');

      addToast('Login successful!', 'success');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      addToast(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError('');

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) throw authError;
      if (!data?.user) throw new Error('Registration failed');

      addToast('Account created successfully!', 'success');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      addToast(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError('');

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;

      addToast('Password reset email sent!', 'success');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Password reset failed';
      setError(errorMessage);
      addToast(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, resetPassword, error, loading, user };
}