import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { FormInput } from '../ui/FormInput';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuthContext } from '../../contexts/AuthContext';

interface DepartmentFormData {
  nome: string;
  responsavel_id: string;
  responsavel_2_id: string;
  email: string;
  telefone: string;
}

interface Member {
  id: string;
  nome_completo: string;
}

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId?: string;
  onSuccess: () => void;
}

export function DepartmentModal({ isOpen, onClose, departmentId, onSuccess }: DepartmentModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuthContext();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<DepartmentFormData>();

  useEffect(() => {
    if (!user || !isOpen) return;

    async function loadData() {
      try {
        // Fetch members for select options
        const { data: membersData, error: membersError } = await supabase
          .from('membros')
          .select('id, nome_completo')
          .eq('user_id', user.id)
          .order('nome_completo');

        if (membersError) throw membersError;
        setMembers(membersData || []);

        // If editing, fetch department data
        if (departmentId) {
          const { data: department, error: departmentError } = await supabase
            .from('departamentos')
            .select('*')
            .eq('id', departmentId)
            .single();

          if (departmentError) throw departmentError;
          if (department) {
            Object.entries(department).forEach(([key, value]) => {
              setValue(key as keyof DepartmentFormData, value);
            });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        addToast('Erro ao carregar dados', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, departmentId, isOpen, setValue, addToast]);

  const onSubmit = async (data: DepartmentFormData) => {
    if (!user) return;

    try {
      setSaving(true);
      const departmentData = {
        ...data,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      if (departmentId) {
        const { error } = await supabase
          .from('departamentos')
          .update(departmentData)
          .eq('id', departmentId);

        if (error) throw error;
        addToast('Departamento atualizado com sucesso!', 'success');
      } else {
        const { error } = await supabase
          .from('departamentos')
          .insert(departmentData);

        if (error) throw error;
        addToast('Departamento criado com sucesso!', 'success');
      }

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving department:', error);
      addToast('Erro ao salvar departamento', 'error');
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
            {departmentId ? 'Editar Departamento' : 'Novo Departamento'}
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
              label="Nome do Departamento"
              type="text"
              registration={register('nome', { required: 'Nome é obrigatório' })}
              error={errors.nome?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável Principal
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                {...register('responsavel_id', { required: 'Responsável é obrigatório' })}
              >
                <option value="">Selecione um responsável</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.nome_completo}
                  </option>
                ))}
              </select>
              {errors.responsavel_id && (
                <span className="text-red-500 text-sm">{errors.responsavel_id.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável Secundário
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                {...register('responsavel_2_id')}
              >
                <option value="">Selecione um responsável</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.nome_completo}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Email do Departamento"
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
              label="Telefone do Departamento"
              type="tel"
              registration={register('telefone')}
              error={errors.telefone?.message}
            />

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