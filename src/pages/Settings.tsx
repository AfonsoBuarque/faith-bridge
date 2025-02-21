import React, { useEffect, useState } from 'react';
import { Header } from '../components/HeaderClean';
import { SettingsCard } from '../components/SettingsCard';
import { ClientVerification } from '../components/ClientVerification';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function Settings() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) {
      addToast('Você precisa estar logado para acessar esta página', 'error');
      navigate('/');
      return;
    }
    setLoading(false);
  }, [user, navigate, addToast]);

  if (!user) return null;
  if (loading) return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    </>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <ClientVerification />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            </div>

            <SettingsCard />
          </div>
        </div>
      </div>
    </>
  );
}