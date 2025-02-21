import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuthContext } from '../contexts/AuthContext';
import { Header } from '../components/HeaderClean';
import { FormInput } from '../components/ui/FormInput';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface MemberFormData {
  nome_completo: string;
  data_nascimento: string;
  rg: string;
  cpf: string;
  estado_civil: string;
  profissao: string;
  email: string;
  telefone: string;
  celular: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  data_conversao: string;
  data_batismo: string;
  data_membro: string;
  cargo_ministerial: string;
  departamento: string;
  dizimista: boolean;
  observacoes: string;
}

const ESTADO_CIVIL_OPTIONS = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'Outro'
];

const CARGO_MINISTERIAL_OPTIONS = [
  'Membro',
  'Diácono',
  'Presbítero',
  'Evangelista',
  'Pastor',
  'Outro'
];

const DEPARTAMENTO_OPTIONS = [
  'Louvor',
  'Infantil',
  'Jovens',
  'Casais',
  'Missões',
  'Outro'
];

export function MemberForm() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const { user } = useAuthContext();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<MemberFormData>();

  useEffect(() => {
    if (!user) {
      addToast('Você precisa estar logado para acessar esta página', 'error');
      navigate('/');
      return;
    }

    async function loadMember() {
      if (id) {
        try {
          const { data, error } = await supabase
            .from('membros')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          if (data) {
            Object.entries(data).forEach(([key, value]) => {
              if (key in data) {
                setValue(key as keyof MemberFormData, value);
              }
            });
            setPhotoUrl(data.foto_url);
          }
        } catch (error) {
          console.error('Error loading member:', error);
          addToast('Erro ao carregar dados do membro', 'error');
        }
      }
      setLoading(false);
    }

    loadMember();
  }, [id, user, setValue, navigate, addToast]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('member-photos')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('member-photos')
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

  const onSubmit = async (data: MemberFormData) => {
    if (!user) return;

    try {
      setSaving(true);
      const memberData = {
        ...data,
        user_id: user.id,
        igreja_id: user.id,
        foto_url: photoUrl,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('membros')
        .upsert({
          id: id,
          ...memberData
        });

      if (error) throw error;

      addToast(id ? 'Membro atualizado com sucesso!' : 'Membro cadastrado com sucesso!', 'success');
      navigate('/members');
    } catch (error) {
      console.error('Error saving member:', error);
      addToast('Erro ao salvar membro', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;
  if (loading) return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    </>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? 'Editar Membro' : 'Novo Membro'}
              </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Photo Upload Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Foto 3x4</h2>
                <div className="flex items-center space-x-6">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Foto do membro"
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
                    <p className="mt-2 text-sm text-gray-500">
                      Formato 3x4, máximo 2MB (PNG, JPG)
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Informações Pessoais</h2>
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
                    registration={register('data_nascimento')}
                    error={errors.data_nascimento?.message}
                  />

                  <FormInput
                    label="RG"
                    type="text"
                    registration={register('rg')}
                    error={errors.rg?.message}
                  />

                  <FormInput
                    label="CPF"
                    type="text"
                    registration={register('cpf')}
                    error={errors.cpf?.message}
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
                    label="Celular"
                    type="tel"
                    registration={register('celular')}
                    error={errors.celular?.message}
                  />

                  <FormInput
                    label="Endereço"
                    type="text"
                    registration={register('endereco')}
                    error={errors.endereco?.message}
                  />

                  <FormInput
                    label="Número"
                    type="text"
                    registration={register('numero')}
                    error={errors.numero?.message}
                  />

                  <FormInput
                    label="Complemento"
                    type="text"
                    registration={register('complemento')}
                    error={errors.complemento?.message}
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

                  <FormInput
                    label="CEP"
                    type="text"
                    registration={register('cep')}
                    error={errors.cep?.message}
                  />
                </div>
              </div>

              {/* Church Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Informações Eclesiásticas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Data de Conversão"
                    type="date"
                    registration={register('data_conversao')}
                    error={errors.data_conversao?.message}
                  />

                  <FormInput
                    label="Data de Batismo"
                    type="date"
                    registration={register('data_batismo')}
                    error={errors.data_batismo?.message}
                  />

                  <FormInput
                    label="Data de Membresia"
                    type="date"
                    registration={register('data_membro')}
                    error={errors.data_membro?.message}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo Ministerial
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      {...register('cargo_ministerial')}
                    >
                      <option value="">Selecione</option>
                      {CARGO_MINISTERIAL_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      {...register('departamento')}
                    >
                      <option value="">Selecione</option>
                      {DEPARTAMENTO_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register('dizimista')}
                        className="rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                      />
                      <span className="text-sm text-gray-700">Dizimista</span>
                    </label>
                  </div>

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
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
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
      </div>
    </>
  );
}