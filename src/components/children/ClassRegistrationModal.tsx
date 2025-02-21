import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { FormInput } from '../ui/FormInput';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuthContext } from '../../contexts/AuthContext';

interface ClassFormData {
  nome: string;
  faixa_etaria_min: number;
  faixa_etaria_max: number;
  professor_responsavel: string;
  capacidade_maxima: number;
  dia_semana: string;
  horario: string;
  sala: string;
  descricao: string;
}

interface ClassRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

export function ClassRegistrationModal({ isOpen, onClose }: ClassRegistrationModalProps) {
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuthContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClassFormData>();

  if (!isOpen) return null;

  const onSubmit = async (data: ClassFormData) => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('turmas')
        .insert({
          ...data,
          user_id: user.id
        });

      if (error) throw error;

      addToast('Turma cadastrada com sucesso!', 'success');
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving class:', error);
      addToast('Erro ao cadastrar turma', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Nova Turma</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <FormInput
            label="Nome da Turma"
            type="text"
            registration={register('nome', { required: 'Nome é obrigatório' })}
            error={errors.nome?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Idade Mínima"
              type="number"
              registration={register('faixa_etaria_min', { 
                required: 'Idade mínima é obrigatória',
                min: { value: 0, message: 'Idade deve ser maior ou igual a 0' }
              })}
              error={errors.faixa_etaria_min?.message}
            />

            <FormInput
              label="Idade Máxima"
              type="number"
              registration={register('faixa_etaria_max', { 
                required: 'Idade máxima é obrigatória',
                min: { value: 0, message: 'Idade deve ser maior ou igual a 0' }
              })}
              error={errors.faixa_etaria_max?.message}
            />
          </div>

          <FormInput
            label="Professor Responsável"
            type="text"
            registration={register('professor_responsavel', { required: 'Professor responsável é obrigatório' })}
            error={errors.professor_responsavel?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Capacidade Máxima"
              type="number"
              registration={register('capacidade_maxima', { 
                min: { value: 1, message: 'Capacidade deve ser maior que 0' }
              })}
              error={errors.capacidade_maxima?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dia da Semana
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                {...register('dia_semana')}
              >
                <option value="">Selecione</option>
                {DIAS_SEMANA.map(dia => (
                  <option key={dia} value={dia}>{dia}</option>
                ))}
              </select>
            </div>

            <FormInput
              label="Horário"
              type="time"
              registration={register('horario')}
              error={errors.horario?.message}
            />

            <FormInput
              label="Sala"
              type="text"
              registration={register('sala')}
              error={errors.sala?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              rows={3}
              {...register('descricao')}
            />
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