import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { FormInput } from '../ui/FormInput';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface PasswordResetFormData {
  email: string;
}

interface PasswordResetFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function PasswordResetForm({ onBack, onSuccess }: PasswordResetFormProps) {
  const { resetPassword, error, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<PasswordResetFormData>();

  const onSubmit = async (data: PasswordResetFormData) => {
    const success = await resetPassword(data.email);
    if (success) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <p className="text-sm text-gray-600">
        Digite seu email para receber um link de recuperação de senha.
      </p>
      
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
          {loading ? <LoadingSpinner /> : 'Enviar'}
        </button>
      </div>
    </form>
  );
}