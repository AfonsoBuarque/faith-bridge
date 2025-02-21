import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { FormInput } from './ui/FormInput';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ChurchEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  church: Church | null;
  onSuccess: () => void;
}

interface Church {
  id: string;
  nome_igreja: string;
  razao_social: string;
  responsavel: string;
  quantidade_membros: number;
  telefone: string;
  whatsapp: string;
  email: string;
  endereco_completo: string;
  rede_social: string;
  como_conheceu: string;
}

const COMO_CONHECEU_OPTIONS = [
  'Instagram',
  'Facebook',
  'Google',
  'Outros'
];

export function ChurchEditModal({ isOpen, onClose, church, onSuccess }: ChurchEditModalProps) {
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Church>();

  // Reset form when church data changes
  useEffect(() => {
    if (church) {
      reset({
        nome_igreja: church.nome_igreja,
        razao_social: church.razao_social,
        responsavel: church.responsavel,
        quantidade_membros: church.quantidade_membros,
        telefone: church.telefone,
        whatsapp: church.whatsapp,
        email: church.email,
        endereco_completo: church.endereco_completo,
        rede_social: church.rede_social,
        como_conheceu: church.como_conheceu
      });
    }
  }, [church, reset]);

  if (!isOpen || !church) return null;

  const onSubmit = async (data: Church) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('dados_igreja')
        .update({
          nome_igreja: data.nome_igreja,
          razao_social: data.razao_social,
          responsavel: data.responsavel,
          quantidade_membros: data.quantidade_membros,
          telefone: data.telefone,
          whatsapp: data.whatsapp,
          email: data.email,
          endereco_completo: data.endereco_completo,
          rede_social: data.rede_social,
          como_conheceu: data.como_conheceu
        })
        .eq('id', church.id);

      if (error) throw error;

      addToast('Igreja atualizada com sucesso!', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating church:', error);
      addToast('Erro ao atualizar igreja', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Editar Igreja</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nome da Igreja"
              type="text"
              registration={register('nome_igreja', { required: 'Nome da Igreja é obrigatório' })}
              error={errors.nome_igreja?.message}
            />

            <FormInput
              label="Razão Social"
              type="text"
              registration={register('razao_social')}
              error={errors.razao_social?.message}
            />

            <FormInput
              label="Responsável"
              type="text"
              registration={register('responsavel', { required: 'Responsável é obrigatório' })}
              error={errors.responsavel?.message}
            />

            <FormInput
              label="Quantidade de Membros"
              type="number"
              registration={register('quantidade_membros', { 
                valueAsNumber: true,
                min: { value: 0, message: 'Quantidade deve ser maior ou igual a 0' }
              })}
              error={errors.quantidade_membros?.message}
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
              label="Rede Social"
              type="text"
              registration={register('rede_social')}
              error={errors.rede_social?.message}
            />

            <div className="col-span-2">
              <FormInput
                label="Endereço Completo"
                type="text"
                registration={register('endereco_completo', { required: 'Endereço é obrigatório' })}
                error={errors.endereco_completo?.message}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Como nos Conheceu
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                {...register('como_conheceu')}
              >
                <option value="">Selecione uma opção</option>
                {COMO_CONHECEU_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.como_conheceu && (
                <span className="text-red-500 text-sm">{errors.como_conheceu.message}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
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