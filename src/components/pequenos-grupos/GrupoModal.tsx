import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { FormInput } from '../ui/FormInput';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuthContext } from '../../contexts/AuthContext';

interface GrupoFormData {
  nome: string;
  lider: string;
  endereco: string;
  dia_reuniao: string;
  horario: string;
  capacidade_maxima: number;
  descricao: string;
}

interface Member {
  id: string;
  nome_completo: string;
}

interface GrupoModalProps {
  isOpen: boolean;
  onClose: () => void;
  grupoId?: string;
  onSuccess: () => void;
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

export function GrupoModal({ isOpen, onClose, grupoId, onSuccess }: GrupoModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuthContext();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<GrupoFormData>();

  useEffect(() => {
    if (!user || !isOpen) return;

    async function loadData() {
      try {
        // Buscar membros para select de líder
        const { data: membersData, error: membersError } = await supabase
          .from('membros')
          .select('id, nome_completo')
          .eq('user_id', user.id)
          .order('nome_completo');

        if (membersError) throw membersError;
        setMembers(membersData || []);

        // Se estiver editando, buscar dados do grupo
        if (grupoId) {
          const { data: grupo, error: grupoError } = await supabase
            .from('pequenos_grupos')
            .select('*')
            .eq('id', grupoId)
            .single();

          if (grupoError) throw grupoError;
          if (grupo) {
            Object.entries(grupo).forEach(([key, value]) => {
              setValue(key as keyof GrupoFormData, value);
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        addToast('Erro ao carregar dados', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, grupoId, isOpen, setValue, addToast]);

  const onSubmit = async (data: GrupoFormData) => {
    if (!user) return;

    try {
      setSaving(true);
      const grupoData = {
        ...data,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      if (grupoId) {
        const { error } = await supabase
          .from('pequenos_grupos')
          .update(grupoData)
          .eq('id', grupoId);

        if (error) throw error;
        addToast('Grupo atualizado com sucesso!', 'success');
      } else {
        const { error } = await supabase
          .from('pequenos_grupos')
          .insert(grupoData);

        if (error) throw error;
        addToast('Grupo criado com sucesso!', 'success');
      }

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
      addToast('Erro ao salvar grupo', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {grupoId ? 'Editar Grupo' : 'Novo Grupo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <FormInput
              label="Nome do Grupo"
              type="text"
              registration={register('nome', { required: 'Nome é obrigatório' })}
              error={errors.nome?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Líder
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                {...register('lider', { required: 'Líder é obrigatório' })}
              >
                <option value="">Selecione um líder</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.nome_completo}
                  </option>
                ))}
              </select>
              {errors.lider && (
                <span className="text-red-500 text-sm">{errors.lider.message}</span>
              )}
            </div>

            <FormInput
              label="Endereço"
              type="text"
              registration={register('endereco', { required: 'Endereço é obrigatório' })}
              error={errors.endereco?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dia da Reunião
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                  {...register('dia_reuniao', { required: 'Dia da reunião é obrigatório' })}
                >
                  <option value="">Selecione</option>
                  {DIAS_SEMANA.map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
                {errors.dia_reuniao && (
                  <span className="text-red-500 text-sm">{errors.dia_reuniao.message}</span>
                )}
              </div>

              <FormInput
                label="Horário"
                type="time"
                registration={register('horario', { required: 'Horário é obrigatório' })}
                error={errors.horario?.message}
              />
            </div>

            <FormInput
              label="Capacidade Máxima"
              type="number"
              registration={register('capacidade_maxima', { 
                valueAsNumber: true,
                min: { value: 1, message: 'Capacidade deve ser maior que 0' }
              })}
              error={errors.capacidade_maxima?.message}
            />

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
        )}
      </div>
    </div>
  );
}