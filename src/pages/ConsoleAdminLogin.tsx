import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { FormInput } from '../components/ui/FormInput';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Lock, Mail } from 'lucide-react';

export function ConsoleAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Primeiro faz o login
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      if (!data?.user) throw new Error('Usuário não encontrado');

      // Depois verifica se é admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminError) {
        throw new Error('Erro ao verificar status de admin');
      }

      if (!adminUser) {
        await supabase.auth.signOut();
        throw new Error('Acesso não autorizado');
      }

      addToast('Login realizado com sucesso!', 'success');
      navigate('/consoleadmin');
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Erro ao fazer login';
      
      if (error.message.includes('Invalid login credentials')) {
        message = 'Email ou senha inválidos';
      } else if (error.message.includes('Acesso não autorizado')) {
        message = 'Usuário não tem permissão de admin';
      }
      
      addToast(message, 'error');
      
      // Garante que o usuário está deslogado em caso de erro
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
      <div className="relative">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/20 mb-4">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-white">
              OnlyChurch Admin
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Painel administrativo para gerenciamento do sistema
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white/10 backdrop-blur-xl px-6 py-12 shadow-xl ring-1 ring-white/10 sm:rounded-lg sm:px-12">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm font-semibold leading-6">
                  <span className="bg-transparent px-6 text-white">Acesso restrito</span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white/5 py-2.5 pl-10 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Senha
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white/5 py-2.5 pl-10 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center rounded-md bg-indigo-500 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Entrar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}