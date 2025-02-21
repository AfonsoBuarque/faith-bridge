import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { FormInput } from '../components/ui/FormInput';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Header } from '../components/HeaderClean';

interface ProfileFormData {
  // Personal Information
  full_name: string;
  birth_date: string;
  gender: string;
  marital_status: string;
  cpf: string;
  rg: string;
  email: string;
  phone: string;
  mobile: string;
  whatsapp: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;

  // Church Information
  nome_igreja: string;
  razao_social: string;
  responsavel: string;
  quantidade_membros: number;
  telefone_igreja: string;
  whatsapp_igreja: string;
  email_igreja: string;
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

export function ProfileCompletion() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>();

  useEffect(() => {
    async function checkProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          navigate('/profile/update');
        }
      } catch (error) {
        console.error('Error:', error);
        addToast('Erro ao verificar perfil', 'error');
      } finally {
        setLoading(false);
      }
    }
    
    checkProfile();
  }, [user, navigate, addToast]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      // Insert user profile data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          full_name: data.full_name,
          birth_date: data.birth_date,
          gender: data.gender,
          marital_status: data.marital_status,
          cpf: data.cpf,
          rg: data.rg,
          email: data.email,
          phone: data.phone,
          mobile: data.mobile,
          whatsapp: data.whatsapp,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code
        });

      if (profileError) throw profileError;

      // Insert church data
      const { error: churchError } = await supabase
        .from('dados_igreja')
        .insert({
          user_id: user.id,
          nome_igreja: data.nome_igreja,
          razao_social: data.razao_social,
          responsavel: data.responsavel,
          quantidade_membros: data.quantidade_membros,
          telefone: data.telefone_igreja,
          whatsapp: data.whatsapp_igreja,
          email: data.email_igreja,
          endereco_completo: data.endereco_completo,
          rede_social: data.rede_social,
          como_conheceu: data.como_conheceu
        });

      if (churchError) throw churchError;

      addToast('Perfil criado com sucesso!', 'success');
      navigate('/profile/update');
    } catch (error: any) {
      console.error('Error creating profile:', error);
      addToast(error.message || 'Erro ao criar perfil', 'error');
    }
  };

  if (!user) return null;
  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Complete seu Perfil
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Nome Completo"
                  type="text"
                  registration={register('full_name', { required: 'Nome é obrigatório' })}
                  error={errors.full_name?.message}
                />
                
                <FormInput
                  label="Data de Nascimento"
                  type="date"
                  registration={register('birth_date', { required: 'Data de nascimento é obrigatória' })}
                  error={errors.birth_date?.message}
                />

                <FormInput
                  label="CPF"
                  type="text"
                  registration={register('cpf', { required: 'CPF é obrigatório' })}
                  error={errors.cpf?.message}
                />

                <FormInput
                  label="RG"
                  type="text"
                  registration={register('rg', { required: 'RG é obrigatório' })}
                  error={errors.rg?.message}
                />

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
                  label="Telefone"
                  type="tel"
                  registration={register('phone')}
                  error={errors.phone?.message}
                />

                <FormInput
                  label="Celular"
                  type="tel"
                  registration={register('mobile', { required: 'Celular é obrigatório' })}
                  error={errors.mobile?.message}
                />

                <FormInput
                  label="WhatsApp"
                  type="tel"
                  registration={register('whatsapp')}
                  error={errors.whatsapp?.message}
                />

                <FormInput
                  label="Endereço"
                  type="text"
                  registration={register('street', { required: 'Endereço é obrigatório' })}
                  error={errors.street?.message}
                />

                <FormInput
                  label="Número"
                  type="text"
                  registration={register('number', { required: 'Número é obrigatório' })}
                  error={errors.number?.message}
                />

                <FormInput
                  label="Complemento"
                  type="text"
                  registration={register('complement')}
                  error={errors.complement?.message}
                />

                <FormInput
                  label="Bairro"
                  type="text"
                  registration={register('neighborhood', { required: 'Bairro é obrigatório' })}
                  error={errors.neighborhood?.message}
                />

                <FormInput
                  label="Cidade"
                  type="text"
                  registration={register('city', { required: 'Cidade é obrigatória' })}
                  error={errors.city?.message}
                />

                <FormInput
                  label="Estado"
                  type="text"
                  registration={register('state', { required: 'Estado é obrigatório' })}
                  error={errors.state?.message}
                />

                <FormInput
                  label="CEP"
                  type="text"
                  registration={register('zip_code', { required: 'CEP é obrigatório' })}
                  error={errors.zip_code?.message}
                />
              </div>
            </div>

            {/* Church Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Informações da Igreja</h3>
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
                    required: 'Quantidade de membros é obrigatória',
                    min: { value: 0, message: 'Quantidade deve ser maior que 0' }
                  })}
                  error={errors.quantidade_membros?.message}
                />

                <FormInput
                  label="Telefone da Igreja"
                  type="tel"
                  registration={register('telefone_igreja')}
                  error={errors.telefone_igreja?.message}
                />

                <FormInput
                  label="WhatsApp da Igreja"
                  type="tel"
                  registration={register('whatsapp_igreja')}
                  error={errors.whatsapp_igreja?.message}
                />

                <FormInput
                  label="Email da Igreja"
                  type="email"
                  registration={register('email_igreja', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  error={errors.email_igreja?.message}
                />

                <FormInput
                  label="Endereço Completo"
                  type="text"
                  registration={register('endereco_completo', { required: 'Endereço é obrigatório' })}
                  error={errors.endereco_completo?.message}
                />

                <FormInput
                  label="Rede Social"
                  type="text"
                  registration={register('rede_social')}
                  error={errors.rede_social?.message}
                />

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Como nos conheceu
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                    {...register('como_conheceu', { required: 'Este campo é obrigatório' })}
                  >
                    <option value="">Selecione uma opção</option>
                    {COMO_CONHECEU_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.como_conheceu && (
                    <span className="text-red-500 text-sm">{errors.como_conheceu.message}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-semibold"
            >
              {isSubmitting ? <LoadingSpinner /> : 'Salvar Perfil'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}