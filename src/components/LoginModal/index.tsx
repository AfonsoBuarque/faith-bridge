import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { PasswordResetForm } from './PasswordResetForm';
import { TermsOfUseModal } from '../TermsOfUseModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'login' | 'register' | 'reset';

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [view, setView] = useState<ModalView>('login');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (!isOpen) return null;

  const handleRegisterSuccess = () => {
    setView('login');
  };

  const handleRegisterClick = () => {
    setShowTerms(true);
  };

  const handleTermsAccept = () => {
    setShowTerms(false);
    setView('register');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] sm:max-w-md relative overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {view === 'register' ? 'Criar Conta' : 
               view === 'reset' ? 'Recuperar Senha' : 
               'Área do Cliente'}
            </h2>

            {resetSuccess ? (
              <div className="text-center">
                <p className="text-green-600 mb-4">
                  Email de recuperação enviado com sucesso!
                </p>
                <button
                  onClick={() => {
                    setView('login');
                    setResetSuccess(false);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Voltar ao login
                </button>
              </div>
            ) : view === 'register' ? (
              <>
                <RegisterForm
                  onBack={() => setView('login')}
                  onSuccess={handleRegisterSuccess}
                />
                <p className="mt-4 text-center text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <button
                    onClick={() => setView('login')}
                    className="text-gray-900 hover:underline"
                  >
                    Faça login
                  </button>
                </p>
              </>
            ) : view === 'reset' ? (
              <PasswordResetForm
                onBack={() => setView('login')}
                onSuccess={() => setResetSuccess(true)}
              />
            ) : (
              <>
                <LoginForm
                  onClose={onClose}
                  onForgotPassword={() => setView('reset')}
                />
                <p className="mt-4 text-center text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <button
                    onClick={handleRegisterClick}
                    className="text-gray-900 hover:underline"
                  >
                    Cadastre-se
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <TermsOfUseModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleTermsAccept}
      />
    </>
  );
}