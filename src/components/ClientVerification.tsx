import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ClientVerificationProps {
  children?: React.ReactNode;
}

export function ClientVerification({ children }: ClientVerificationProps) {
  const [isClient, setIsClient] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkClientStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsClient(false);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('cliente_fft')
          .select('id')
          .eq('user_id', user.id);

        setIsClient(data && data.length > 0);
      } catch (error) {
        console.error('Error checking client status:', error);
        setIsClient(false);
      } finally {
        setLoading(false);
      }
    }

    checkClientStatus();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center py-8"><LoadingSpinner /></div>;
  }

  if (!isClient) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-xl text-gray-800">Você ainda não é nosso Cliente</p>
        <a
          href="https://viewer.faithflowtech.com.br/agendarconversa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Torne-se Cliente
        </a>
      </div>
    );
  }

  return <>{children}</>;
}