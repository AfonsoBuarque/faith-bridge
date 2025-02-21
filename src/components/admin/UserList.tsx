import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, Building2, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuthContext } from '../../contexts/AuthContext';

interface UserData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  created_at: string;
  igreja?: {
    nome_igreja: string;
    responsavel: string;
    telefone: string;
    email: string;
  };
}

export function UserList() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Verifica se é admin
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

      // Busca usuários e dados das igrejas
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles_with_church')
        .select(`
          id,
          user_id,
          full_name,
          email,
          created_at,
          nome_igreja,
          responsavel,
          igreja_telefone,
          igreja_email
        `)
        .order('created_at', { ascending: false });
      
      if (usersError) throw usersError;

      // Filtra o admin do sistema
      const filteredUsers = usersData?.filter(user => 
        user.user_id !== '594ed9f1-bddb-4383-a2d5-c6463ebdb457'
      ) || [];

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      addToast('Erro ao carregar dados dos usuários', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nome_igreja?.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="Buscar por nome, email ou igreja..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800"
        />
      </div>

      {/* Lista de Usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers.map((userData) => (
          <div key={userData.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            {/* Informações do Usuário */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {userData.full_name || userData.email}
                </h3>
                <p className="text-sm text-gray-500">
                  {userData.email}
                </p>
                <p className="text-xs text-gray-400">
                  Criado em: {new Date(userData.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Informações da Igreja */}
            {userData.nome_igreja && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Dados da Igreja</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{userData.nome_igreja}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Responsável: {userData.responsavel}
                    </span>
                  </div>

                  {userData.igreja_email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{userData.igreja_email}</span>
                    </div>
                  )}

                  {userData.igreja_telefone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{userData.igreja_telefone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-500">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}