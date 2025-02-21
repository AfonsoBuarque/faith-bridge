import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FormInput } from '../ui/FormInput';
import { FormCheckbox } from '../ui/FormCheckbox';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { validateAuth } from '../../utils/validateAuth';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginFormProps {
  onClose: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onClose, onForgotPassword }: LoginFormProps) {
  const navigate = useNavigate();
  const { login, error, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password, data.remember);
    if (success) {
      // Validate auth status after login
      const validation = await validateAuth();
      console.log('Auth Validation:', validation);
      
      if (validation.success && validation.authenticated) {
        onClose();
        navigate('/dashboard');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <FormInput
        label="Email"
        type="email"
        registration={register('email', { 
          required: 'Email é obrigatório',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido'
          }
        })}
        error={errors.email?.message}
      />

      <FormInput
        label="Senha"
        type="password"
        registration={register('password', { required: 'Senha é obrigatória' })}
        error={errors.password?.message}
      />

      <div className="flex items-center justify-between">
        <FormCheckbox
          label="Lembrar-me"
          registration={register('remember')}
        />
        
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Esqueceu a senha?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? <LoadingSpinner /> : 'Entrar'}
      </button>
    </form>
  );
}