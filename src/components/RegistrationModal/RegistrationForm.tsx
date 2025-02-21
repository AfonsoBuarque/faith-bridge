import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitRegistration } from '../../services/registrationService';
import { maskPhone } from '../../utils/inputMasks';
import { SuccessMessage } from './SuccessMessage';

interface RegistrationFormData {
  nome: string;
  telefone: string;
  email: string;
  igreja: string;
  pastor: string;
  redeSocial: string;
  quantidadeMembros: string;
}

const QUANTIDADE_MEMBROS_OPTIONS = [
  "Até 50 membros",
  "51 a 100 membros",
  "101 a 200 membros",
  "201 a 500 membros",
  "501 a 1000 membros",
  "Mais de 1000 membros"
];

interface RegistrationFormProps {
  onClose: () => void;
}

export function RegistrationForm({ onClose }: RegistrationFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RegistrationFormData>();
  
  const telefone = watch('telefone');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhone(e.target.value);
    setValue('telefone', maskedValue);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      await submitRegistration(data);
      setIsSuccess(true);
    } catch (error) {
      alert('Erro ao enviar solicitação. Por favor, tente novamente.');
      console.error('Error submitting registration:', error);
    }
  };

  if (isSuccess) {
    return <SuccessMessage onClose={onClose} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome*
        </label>
        <input
          id="nome"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          {...register('nome', { required: 'Nome é obrigatório' })}
        />
        {errors.nome && (
          <span className="text-red-500 text-sm">{errors.nome.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefone* (11 dígitos)
        </label>
        <input
          id="telefone"
          type="tel"
          value={telefone || ''}
          onChange={handlePhoneChange}
          placeholder="11912345678"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          {...register('telefone', { 
            required: 'Telefone é obrigatório',
            pattern: {
              value: /^\d{11}$/,
              message: 'Telefone deve ter 11 dígitos'
            }
          })}
        />
        {errors.telefone && (
          <span className="text-red-500 text-sm">{errors.telefone.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email*
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          {...register('email', { 
            required: 'Email é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="igreja" className="block text-sm font-medium text-gray-700 mb-1">
          Nome da Igreja*
        </label>
        <input
          id="igreja"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          {...register('igreja', { required: 'Nome da Igreja é obrigatório' })}
        />
        {errors.igreja && (
          <span className="text-red-500 text-sm">{errors.igreja.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="pastor" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Pastor*
        </label>
        <input
          id="pastor"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          {...register('pastor', { required: 'Nome do Pastor é obrigatório' })}
        />
        {errors.pastor && (
          <span className="text-red-500 text-sm">{errors.pastor.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="redeSocial" className="block text-sm font-medium text-gray-700 mb-1">
          Rede Social*
        </label>
        <input
          id="redeSocial"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          {...register('redeSocial', { required: 'Rede Social é obrigatória' })}
        />
        {errors.redeSocial && (
          <span className="text-red-500 text-sm">{errors.redeSocial.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="quantidadeMembros" className="block text-sm font-medium text-gray-700 mb-1">
          Quantidade de Membros*
        </label>
        <select
          id="quantidadeMembros"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
          {...register('quantidadeMembros', { required: 'Quantidade de Membros é obrigatória' })}
        >
          <option value="">Selecione uma opção</option>
          {QUANTIDADE_MEMBROS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.quantidadeMembros && (
          <span className="text-red-500 text-sm">{errors.quantidadeMembros.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
      >
        Enviar
      </button>
    </form>
  );
}