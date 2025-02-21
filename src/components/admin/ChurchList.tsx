import React, { useState, useEffect } from 'react';
import { Search, Building2, Mail, Phone, MapPin, Users, Calendar, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuthContext } from '../../contexts/AuthContext';

interface Church {
  id: string;
  user_id: string;
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
  created_at: string;
}

export function ChurchList() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingChurch, setEditingChurch] = useState<Church | null>(null);
  const { addToast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;
    fetchChurches();
  }, [user]);

  const fetchChurches = async () => {
    try {
      setLoading(true);
      
      // Primeiro verifica se o usuário é admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (adminError) {
        throw new Error('Erro ao verificar permissões de admin');
      }

      if (!adminData) {
        throw new Error('Usuário não tem permissão de admin');
      }

      // Busca todas as igrejas
      const { data: churchesData, error: churchesError } = await supabase
        .from('dados_igreja')
        .select(`
          id,
          user_id,
          nome_igreja,
          razao_social,
          responsavel,
          quantidade_membros,
          telefone,
          whatsapp,
          email,
          endereco_completo,
          rede_social,
          como_conheceu,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (churchesError) throw churchesError;

      // Filtra igrejas que não são do admin do sistema
      const filteredChurches = churchesData?.filter(church => 
        church.user_id !== '594ed9f1-bddb-4383-a2d5-c6463ebdb457'
      ) || [];

      setChurches(filteredChurches);
    } catch (error) {
      console.error('Erro ao carregar igrejas:', error);
      addToast('Erro ao carregar dados das igrejas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (churchId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta igreja?')) return;

    try {
      const { error } = await supabase
        .from('dados_igreja')
        .delete()
        .eq('id', churchId);

      if (error) throw error;

      setChurches(churches.filter(church => church.id !== churchId));
      addToast('Igreja excluída com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir igreja:', error);
      addToast('Erro ao excluir igreja', 'error');
    }
  };

  const handleEdit = async (church: Church) => {
    try {
      const { error } = await supabase
        .from('dados_igreja')
        .update({
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
        })
        .eq('id', church.id);

      if (error) throw error;

      setChurches(churches.map(c => c.id === church.id ? church : c));
      setEditingChurch(null);
      addToast('Igreja atualizada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar igreja:', error);
      addToast('Erro ao atualizar igreja', 'error');
    }
  };

  const filteredChurches = churches.filter(church => 
    church.nome_igreja.toLowerCase().includes(searchTerm.toLowerCase()) ||
    church.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome da igreja ou responsável..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800"
        />
      </div>

      {/* Lista de Igrejas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChurches.map((church) => (
          <div key={church.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{church.nome_igreja}</h3>
                <p className="text-sm text-gray-500">{church.razao_social}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  Responsável: {church.responsavel}
                </span>
              </div>

              {church.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{church.email}</span>
                </div>
              )}

              {church.telefone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{church.telefone}</span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{church.endereco_completo}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  {church.quantidade_membros} membros
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  Cadastrado em: {new Date(church.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-4">
                <button
                  onClick={() => handleEdit(church)}
                  className="p-2 text-indigo-600 hover:text-indigo-900 rounded-lg hover:bg-indigo-50"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(church.id)}
                  className="p-2 text-red-600 hover:text-red-900 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredChurches.length === 0 && (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-500">Nenhuma igreja encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}