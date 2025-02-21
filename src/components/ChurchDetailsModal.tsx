import React, { useState, useEffect } from 'react';
import { X, Search, Building2, Mail, Phone, MessageSquare, MapPin, Users, Calendar, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ChurchEditModal } from './ChurchEditModal';

interface ChurchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Church {
  id: string;
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

export function ChurchDetailsModal({ isOpen, onClose }: ChurchDetailsModalProps) {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const { addToast } = useToast();

  const fetchChurches = async () => {
    try {
      let query = supabase
        .from('dados_igreja')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('nome_igreja', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setChurches(data || []);
    } catch (error) {
      console.error('Error fetching churches:', error);
      addToast('Erro ao carregar igrejas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchChurches();
  }, [isOpen, searchTerm, addToast]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Igrejas Cadastradas</h2>
              <p className="text-sm text-gray-600 mt-1">
                Total de igrejas: <span className="font-semibold">{churches.length}</span>
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
                  placeholder="Buscar por nome da igreja..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800"
                />
              </div>
            </div>

            {/* Churches List */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <LoadingSpinner />
                </div>
              ) : churches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {churches.map((church) => (
                    <div
                      key={church.id}
                      className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow relative"
                    >
                      <button
                        onClick={() => setSelectedChurch(church)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
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

                        {church.whatsapp && (
                          <div className="flex items-center space-x-3">
                            <MessageSquare className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-600">{church.whatsapp} (WhatsApp)</span>
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma igreja encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ChurchEditModal
        isOpen={!!selectedChurch}
        onClose={() => setSelectedChurch(null)}
        church={selectedChurch}
        onSuccess={fetchChurches}
      />
    </>
  );
}