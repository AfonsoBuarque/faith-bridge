import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { FormInput } from './ui/FormInput';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

interface VisitorFormData {
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  data_nascimento: string;
  estado_civil: string;
  profissao: string;
  como_conheceu: string;
  observacoes: string;
  receber_devocional: string;
  receber_agenda: string;
}

interface VisitorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ESTADO_CIVIL_OPTIONS = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'Outro'
];

const COMO_CONHECEU_OPTIONS = [
  'Indicação',
  'Redes Sociais',
  'Google',
  'Passou em frente',
  'Pequeno grupo',
  'Outro'
];

const RECEBER_DEVOCIONAL_OPTIONS = [
  'QUERO RECEBER!',
  'NÃO QUERO MAIS RECEBER.',
  'NÃO RECEBER'
];

const RECEBER_AGENDA_OPTIONS = [
  'SIM',
  'NÃO'
];

export function VisitorRegistrationModal({ isOpen, onClose }: VisitorRegistrationModalProps) {
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VisitorFormData>();

  if (!isOpen) return null;

  const onSubmit = async (data: VisitorFormData) => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('cadastro_visitantes')
        .insert({
          ...data,
          user_id: user.id,
          data_visita: new Date().toISOString()
        });

      if (error) throw error;

      addToast('Visitante registrado com sucesso!', 'success');
      reset();
      onClose();
    } catch (error: any) {
      console.error('Error registering visitor:', error);
      addToast(error.message || 'Erro ao registrar visitante', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Registrar Novo Visitante</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nome Completo"
              type="text"
              registration={register('nome', { required: 'Nome é obrigatório' })}
              error={errors.nome?.message}
            />

            <FormInput
              label="Email"
              type="email"
              registration={register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              error={errors.email?.message}
            />

            <FormInput
              label="Telefone"
              type="tel"
              registration={register('telefone')}
              error={errors.telefone?.message}
            />

            <FormInput
              label="WhatsApp"
              type="tel"
              registration={register('whatsapp')}
              error={errors.whatsapp?.message}
            />

            <FormInput
              label="Data de Nascimento"
              type="date"
              registration={register('data_nascimento')}
              error={errors.data_nascimento?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Civil
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                {...register('estado_civil')}
              >
                <option value="">Selecione</option>
                {ESTADO_CIVIL_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <FormInput
              label="Profissão"
              type="text"
              registration={register('profissao')}
              error={errors.profissao?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Como Conheceu
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                {...register('como_conheceu')}
              >
                <option value="">Selecione</option>
                {COMO_CONHECEU_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receber Devocional
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                {...register('receber_devocional')}
              >
                <option value="">Selecione</option>
                {RECEBER_DEVOCIONAL_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receber Agenda
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                {...register('receber_agenda')}
              >
                <option value="">Selecione</option>
                {RECEBER_AGENDA_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <FormInput
              label="Endereço"
              type="text"
              registration={register('endereco')}
              error={errors.endereco?.message}
            />

            <FormInput
              label="Bairro"
              type="text"
              registration={register('bairro')}
              error={errors.bairro?.message}
            />

            <FormInput
              label="Cidade"
              type="text"
              registration={register('cidade')}
              error={errors.cidade?.message}
            />

            <FormInput
              label="Estado"
              type="text"
              registration={register('estado')}
              error={errors.estado?.message}
            />

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                rows={3}
                {...register('observacoes')}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {saving ? <LoadingSpinner /> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}