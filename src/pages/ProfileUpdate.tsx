import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Header } from '../components/HeaderClean';
import { ClientVerification } from '../components/ClientVerification';
import { User, Building2, ArrowLeft } from 'lucide-react';
import { FormInput } from '../components/ui/FormInput';

interface ProfileData {
  full_name?: string;
  birth_date?: string;
  gender?: string;
  marital_status?: string;
  cpf?: string;
  rg?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  whatsapp?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

interface ChurchData {
  nome_igreja?: string;
  razao_social?: string;
  responsavel?: string;
  quantidade_membros?: number;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  endereco_completo?: string;
  rede_social?: string;
  como_conheceu?: string;
}

export function ProfileUpdate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [churchData, setChurchData] = useState<ChurchData>({});

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;

      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        // Fetch church data
        const { data: churchData, error: churchError } = await supabase
          .from('dados_igreja')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (churchError && churchError.code !== 'PGRST116') {
          throw churchError;
        }

        // Set data if it exists, otherwise use empty objects
        setProfileData(profileData || {});
        setChurchData(churchData || {});
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        addToast('Erro ao carregar dados do perfil', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [user, addToast]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const [profileResponse, churchResponse] = await Promise.all([
        supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            ...profileData,
            updated_at: new Date().toISOString()
          }),
        supabase
          .from('dados_igreja')
          .upsert({
            user_id: user.id,
            ...churchData
          })
      ]);

      if (profileResponse.error) throw profileResponse.error;
      if (churchResponse.error) throw churchResponse.error;

      addToast('Perfil atualizado com sucesso!', 'success');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      addToast('Erro ao salvar alterações', 'error');
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
        <ClientVerification />
        
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
              <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">Informações Pessoais</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Nome Completo"
                  type="text"
                  value={profileData.full_name || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                />

                <FormInput
                  label="Data de Nascimento"
                  type="date"
                  value={profileData.birth_date || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, birth_date: e.target.value }))}
                />

                <FormInput
                  label="CPF"
                  type="text"
                  value={profileData.cpf || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, cpf: e.target.value }))}
                />

                <FormInput
                  label="RG"
                  type="text"
                  value={profileData.rg || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, rg: e.target.value }))}
                />

                <FormInput
                  label="Email"
                  type="email"
                  value={profileData.email || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                />

                <FormInput
                  label="Telefone"
                  type="tel"
                  value={profileData.phone || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                />

                <FormInput
                  label="Celular"
                  type="tel"
                  value={profileData.mobile || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, mobile: e.target.value }))}
                />

                <FormInput
                  label="WhatsApp"
                  type="tel"
                  value={profileData.whatsapp || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, whatsapp: e.target.value }))}
                />

                <FormInput
                  label="Rua"
                  type="text"
                  value={profileData.street || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, street: e.target.value }))}
                />

                <FormInput
                  label="Número"
                  type="text"
                  value={profileData.number || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, number: e.target.value }))}
                />

                <FormInput
                  label="Complemento"
                  type="text"
                  value={profileData.complement || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, complement: e.target.value }))}
                />

                <FormInput
                  label="Bairro"
                  type="text"
                  value={profileData.neighborhood || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, neighborhood: e.target.value }))}
                />

                <FormInput
                  label="Cidade"
                  type="text"
                  value={profileData.city || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                />

                <FormInput
                  label="Estado"
                  type="text"
                  value={profileData.state || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                />

                <FormInput
                  label="CEP"
                  type="text"
                  value={profileData.zip_code || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, zip_code: e.target.value }))}
                />
              </div>
            </div>

            {/* Church Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Building2 className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">Informações da Igreja</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Nome da Igreja"
                  type="text"
                  value={churchData.nome_igreja || ''}
                  onChange={(e) => setChurchData(prev => ({ ...prev, nome_igreja: e.target.value }))}
                />

                <FormInput
                  label="Razão Social"
                  type="text"
                  value={churchData.razao_social || ''}
                  onChange={(e) => setChurchData(prev => ({ ...prev, razao_social: e.target.value }))}
                />

                <FormInput
                  label="Responsável"
                  type="text"
                  value={churchData.responsavel || ''}
                  onChange={(e) => setChurchData(prev => ({ ...prev, responsavel: e.target.value }))}
                />

                <FormInput
                  label="Quantidade de Membros"
                  type="number"
                  value={churchData.quantidade_membros || ''}
                  onChange={(e) => setChurchData(prev => ({ ...prev, quantidade_membros: parseInt(e.target.value) }))}
                />

                <FormInput
                  label="Telefone da Igreja"
                  type="tel"
                  value={churchData.telefone || ''}
                  onChange={(e) => setChurchData(prev => ({ ...prev, telefone: e.target.value }))}
                />

                <FormInput
                  label="WhatsApp da Igreja"
                  type="tel"
                  value={churchData.whatsapp || ''}
                  onChange={(e) => setChurchData(prev => ({ ...prev, whatsapp: e.target.value }))}
                />

                <FormInput
                  label="Email da Igreja"
                  type="email"
                  value={churchData.email || ''}
                  onChange={(e) => setChurchData(prev => ({ ...prev, email: e.target.value }))}
                />

                <FormInput
                  label="Rede Social"
                  type="text"
                  value={churchData.rede_social || ''}
                  onChange={(e) => setChurchData(prev => ({ ...prev, rede_social: e.target.value }))}
                />

                <div className="col-span-2">
                  <FormInput
                    label="Endereço Completo"
                    type="text"
                    value={churchData.endereco_completo || ''}
                    onChange={(e) => setChurchData(prev => ({ ...prev, endereco_completo: e.target.value }))}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Como nos Conheceu
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                    value={churchData.como_conheceu || ''}
                    onChange={(e) => setChurchData(prev => ({ ...prev, como_conheceu: e.target.value }))}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Google">Google</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {saving ? <LoadingSpinner /> : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}