import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Search, 
  ArrowLeft,
  Bell,
  Settings,
  TrendingUp,
  TrendingDown,
  Home,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Header } from '../components/HeaderClean';
import { ClientVerification } from '../components/ClientVerification';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuthContext } from '../contexts/AuthContext';
import { GrupoModal } from '../components/pequenos-grupos/GrupoModal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface PequenoGrupo {
  id: string;
  nome: string;
  lider: string;
  endereco: string;
  dia_reuniao: string;
  horario: string;
  membros_count: number;
  status: 'ativo' | 'inativo';
  created_at: string;
}

interface Stats {
  total: number;
  ativos: number;
  membros: number;
  crescimento: number;
}

export function PequenosGrupos() {
  const [loading, setLoading] = useState(true);
  const [grupos, setGrupos] = useState<PequenoGrupo[]>([]);
  const [selectedGrupoId, setSelectedGrupoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<Stats>({
    total: 0,
    ativos: 0,
    membros: 0,
    crescimento: 0
  });

  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      addToast('Você precisa estar logado para acessar esta página', 'error');
      navigate('/');
      return;
    }

    fetchData();
  }, [user, navigate, addToast]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setGrupos([]); // Reset grupos state before fetching
      
      // Buscar grupos do Supabase
      const { data: gruposData, error: gruposError } = await supabase
        .from('pequenos_grupos')
        .select(`
          *,
          lider_info:membros(nome_completo)
        `)
        .eq('user_id', user?.id);

      if (gruposError) {
        console.error('Erro ao buscar grupos:', gruposError);
        addToast('Erro ao carregar grupos', 'error');
        return;
      }

      // Buscar contagem de membros para cada grupo
      const gruposComMembros = await Promise.all(
        (gruposData || []).map(async (grupo) => {
          const { count } = await supabase
            .from('membros_pequenos_grupos')
            .select('*', { count: 'exact', head: true })
            .select('*', { count: 'exact' })
            .eq('grupo_id', grupo.id);

          return {
            ...grupo,
            lider: grupo.lider_info?.nome_completo || 'Não definido',
            membros_count: count || 0
          };
        })
      );

      setGrupos(gruposComMembros);
      
      // Calcular estatísticas
      const statsCalculados: Stats = {
        total: gruposComMembros.length,
        ativos: gruposComMembros.filter(g => g.status === 'ativo').length,
        membros: gruposComMembros.reduce((acc, curr) => acc + curr.membros_count, 0),
        crescimento: 0 // Calcular baseado no histórico
      };

      setStats(statsCalculados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      addToast('Erro ao carregar dados dos grupos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Grupos',
      value: stats.total,
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Grupos Ativos',
      value: stats.ativos,
      change: '+5%',
      icon: Home,
      color: 'green'
    },
    {
      title: 'Total de Membros',
      value: stats.membros,
      change: '+8%',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Crescimento Mensal',
      value: `${stats.crescimento}%`,
      change: '+3%',
      icon: TrendingUp,
      color: 'yellow'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Grupo',
      icon: UserPlus,
      color: 'blue',
      onClick: () => {
        setSelectedGrupoId(null);
        setIsModalOpen(true);
      }
    },
    {
      title: 'Mapa de Grupos',
      icon: MapPin,
      color: 'green',
      onClick: () => addToast('Funcionalidade em desenvolvimento', 'info')
    },
    {
      title: 'Agenda de Reuniões',
      icon: Calendar,
      color: 'purple',
      onClick: () => addToast('Funcionalidade em desenvolvimento', 'info')
    }
  ];

  if (!user) return null;
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <ClientVerification>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Voltar
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">Pequenos Grupos</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <Bell className="h-6 w-6" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <Settings className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                      <div className="flex items-center space-x-1">
                        {stat.change.startsWith('+') ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center`}>
                      <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                    </div>
                    <span className="text-gray-900 font-medium">{action.title}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar grupos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800"
                  />
                </div>
              </div>

              {/* Grupos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grupos
                  .filter(grupo => 
                    grupo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    grupo.lider.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((grupo) => (
                    <div key={grupo.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{grupo.nome}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          grupo.status === 'ativo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {grupo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Users className="h-5 w-5 mr-2" />
                          <span>Líder: {grupo.lider}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span>{grupo.endereco}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>{grupo.dia_reuniao} às {grupo.horario}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Users className="h-5 w-5 mr-2" />
                          <span>{grupo.membros_count} membros</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setSelectedGrupoId(grupo.id);
                            setIsModalOpen(true);
                          }}
                          className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </ClientVerification>
      </div>
      
      <GrupoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGrupoId(null);
        }}
        grupoId={selectedGrupoId || undefined}
        onSuccess={fetchData}
      />
    </>
  );
}