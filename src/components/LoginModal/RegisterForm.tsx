import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { FormInput } from '../ui/FormInput';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function RegisterForm({ onBack, onSuccess }: RegisterFormProps) {
  const { register: registerUser, error, loading } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser(data.email, data.password);
    if (success) onSuccess();
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
        registration={register('password', { 
          required: 'Senha é obrigatória',
          minLength: {
            value: 6,
            message: 'A senha deve ter no mínimo 6 caracteres'
          }
        })}
        error={errors.password?.message}
      />

      <FormInput
        label="Confirmar Senha"
        type="password"
        registration={register('confirmPassword', { 
          required: 'Confirmação de senha é obrigatória',
          validate: value => value === password || 'As senhas não conferem'
        })}
        error={errors.confirmPassword?.message}
      />

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? <LoadingSpinner /> : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}