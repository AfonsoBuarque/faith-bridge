import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { FormInput } from '../ui/FormInput';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuthContext } from '../../contexts/AuthContext';

interface ChildFormData {
  nome_completo: string;
  data_nascimento: string;
  genero: string;
  responsavel_1_nome: string;
  responsavel_1_parentesco: string;
  responsavel_1_telefone: string;
  responsavel_1_email: string;
  responsavel_2_nome: string;
  responsavel_2_parentesco: string;
  responsavel_2_telefone: string;
  responsavel_2_email: string;
  alergias: string;
  medicamentos: string;
  condicoes_especiais: string;
  observacoes_medicas: string;
  turma_id: string;
  observacoes: string;
}

interface Class {
  id: string;
  nome: string;
  faixa_etaria_min: number;
  faixa_etaria_max: number;
}

interface ChildRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
}

export function ChildRegistrationModal({ isOpen, onClose, classes }: ChildRegistrationModalProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuthContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChildFormData>();

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('children-photos')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('children-photos')
        .getPublicUrl(fileName);

      setPhotoUrl(publicUrl);
      addToast('Foto atualizada com sucesso!', 'success');
    } catch (error) {
      console.error('Error uploading photo:', error);
      addToast('Erro ao fazer upload da foto', 'error');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ChildFormData) => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('criancas')
        .insert({
          ...data,
          user_id: user.id,
          foto_url: photoUrl,
          data_inicio: new Date().toISOString()
        });

      if (error) throw error;

      addToast('Criança cadastrada com sucesso!', 'success');
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving child:', error);
      addToast('Erro ao cadastrar criança', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Nova Criança</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Photo Upload */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Foto</h3>
            <div className="flex items-center space-x-6">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Foto da criança"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      <span>{photoUrl ? 'Alterar foto' : 'Adicionar foto'}</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Nome Completo"
                type="text"
                registration={register('nome_completo', { required: 'Nome é obrigatório' })}
                error={errors.nome_completo?.message}
              />

              <FormInput
                label="Data de Nascimento"
                type="date"
                registration={register('data_nascimento', { required: 'Data de nascimento é obrigatória' })}
                error={errors.data_nascimento?.message}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gênero
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                  {...register('genero')}
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turma
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                  {...register('turma_id')}
                >
                  <option value="">Selecione uma turma</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({c.faixa_etaria_min}-{c.faixa_etaria_max} anos)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Responsible 1 Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Responsável Principal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Nome do Responsável"
                type="text"
                registration={register('responsavel_1_nome', { required: 'Nome do responsável é obrigatório' })}
                error={errors.responsavel_1_nome?.message}
              />

              <FormInput
                label="Parentesco"
                type="text"
                registration={register('responsavel_1_parentesco', { required: 'Parentesco é obrigatório' })}
                error={errors.responsavel_1_parentesco?.message}
              />

              <FormInput
                label="Telefone"
                type="tel"
                registration={register('responsavel_1_telefone', { required: 'Telefone é obrigatório' })}
                error={errors.responsavel_1_telefone?.message}
              />

              <FormInput
                label="Email"
                type="email"
                registration={register('responsavel_1_email')}
                error={errors.responsavel_1_email?.message}
              />
            </div>
          </div>

          {/* Responsible 2 Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Responsável Secundário (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Nome do Responsável"
                type="text"
                registration={register('responsavel_2_nome')}
                error={errors.responsavel_2_nome?.message}
              />

              <FormInput
                label="Parentesco"
                type="text"
                registration={register('responsavel_2_parentesco')}
                error={errors.responsavel_2_parentesco?.message}
              />

              <FormInput
                label="Telefone"
                type="tel"
                registration={register('responsavel_2_telefone')}
                error={errors.responsavel_2_telefone?.message}
              />

              <FormInput
                label="Email"
                type="email"
                registration={register('responsavel_2_email')}
                error={errors.responsavel_2_email?.message}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Médicas</h3>
            <div className="grid grid-cols-1 gap-6">
              <FormInput
                label="Alergias"
                type="text"
                registration={register('alergias')}
                error={errors.alergias?.message}
              />

              <FormInput
                label="Medicamentos"
                type="text"
                registration={register('medicamentos')}
                error={errors.medicamentos?.message}
              />

              <FormInput
                label="Condições Especiais"
                type="text"
                registration={register('condicoes_especiais')}
                error={errors.condicoes_especiais?.message}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações Médicas
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                  rows={3}
                  {...register('observacoes_medicas')}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Adicionais</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações Gerais
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                rows={3}
                {...register('observacoes')}
              />
            </div>
          </div>

          {/* Action Buttons */}
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