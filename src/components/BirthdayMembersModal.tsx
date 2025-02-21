import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuthContext } from '../contexts/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { DetailsModal } from './DetailsModal';

interface BirthdayMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Member {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  celular: string;
  data_nascimento: string;
  departamento: string;
  cargo_ministerial: string;
  foto_url: string | null;
}

export function BirthdayMembersModal({ isOpen, onClose }: BirthdayMembersModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const { addToast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user || !isOpen) return;

    async function fetchMembers() {
      try {
        const currentMonth = new Date().getMonth() + 1;
        
        let query = supabase
          .from('membros')
          .select('*')
          .eq('user_id', user.id)
          .order('data_nascimento', { ascending: true });

        if (searchTerm) {
          query = query.ilike('nome_completo', `%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Filter members with birthdays in current month
        const birthdayMembers = (data || []).filter(member => {
          if (!member.data_nascimento) return false;
          const birthMonth = new Date(member.data_nascimento).getMonth() + 1;
          return birthMonth === currentMonth;
        });

        // Sort by day of month
        birthdayMembers.sort((a, b) => {
          const dayA = new Date(a.data_nascimento).getDate();
          const dayB = new Date(b.data_nascimento).getDate();
          return dayA - dayB;
        });

        setMembers(birthdayMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
        addToast('Erro ao carregar aniversariantes', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [user, isOpen, searchTerm, addToast]);

  if (!isOpen) return null;

  const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Aniversariantes de {currentMonth}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Total de aniversariantes: <span className="font-semibold">{members.length}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800"
                />
              </div>
            </div>

            {/* Members List */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <LoadingSpinner />
                </div>
              ) : members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member) => {
                    const birthDate = new Date(member.data_nascimento);
                    const day = birthDate.getDate();
                    const age = new Date().getFullYear() - birthDate.getFullYear();
                    
                    return (
                      <div
                        key={member.id}
                        className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedMember({ type: 'member', ...member })}
                      >
                        <div className="flex items-center space-x-4">
                          {member.foto_url ? (
                            <img
                              src={member.foto_url}
                              alt={member.nome_completo}
                              className="h-16 w-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserPlus className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {member.nome_completo}
                            </h3>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Dia {day} ({age} anos)</span>
                            </div>
                            {member.departamento && (
                              <p className="text-sm text-gray-500 mt-1">
                                {member.departamento}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum aniversariante encontrado neste mês</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DetailsModal 
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        person={selectedMember}
      />
    </>
  );
}