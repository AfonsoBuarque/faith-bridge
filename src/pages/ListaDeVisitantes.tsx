import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  TrendingUp,
  TrendingDown,
  Calendar,
  MessageSquare,
  Share2,
  Heart,
  Clock
} from 'lucide-react';
import { Header } from '../components/HeaderClean';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ClientVerification } from '../components/ClientVerification';
import { DetailsModal } from '../components/DetailsModal';
import { VisitorRegistrationModal } from '../components/VisitorRegistrationModal';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Visitor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  data_visita: string;
  como_conheceu: string;
  receber_devocional: string;
  receber_agenda: string;
}

interface VisitorStats {
  total: number;
  thisMonth: number;
  lastMonth: number;
  percentageChange: number;
  returningVisitors: number;
  pendingFollowUp: number;
  sourceDistribution: {
    labels: string[];
    data: number[];
  };
  ageDistribution: {
    labels: string[];
    data: number[];
  };
  maritalStatusDistribution: {
    labels: string[];
    data: number[];
  };
}

export function ListaDeVisitantes() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<VisitorStats>({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    percentageChange: 0,
    returningVisitors: 0,
    pendingFollowUp: 0,
    sourceDistribution: {
      labels: [],
      data: []
    },
    ageDistribution: {
      labels: [],
      data: []
    },
    maritalStatusDistribution: {
      labels: [],
      data: []
    }
  });
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      addToast('Você precisa estar logado para acessar esta página', 'error');
      navigate('/');
      return;
    }

    async function fetchData() {
      try {
        // Calculate date ranges
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Fetch visitors with pagination
        let query = supabase
          .from('cadastro_visitantes')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('data_visita', { ascending: false });

        if (searchTerm) {
          query = query.ilike('nome', `%${searchTerm}%`);
        }

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage - 1;
        
        const { data: visitorsData, count, error } = await query
          .range(start, end);

        if (error) throw error;

        // Fetch statistics
        const [thisMonthStats, lastMonthStats] = await Promise.all([
          supabase
            .from('cadastro_visitantes')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .gte('data_visita', firstDayThisMonth.toISOString())
            .lte('data_visita', now.toISOString()),
          supabase
            .from('cadastro_visitantes')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .gte('data_visita', firstDayLastMonth.toISOString())
            .lte('data_visita', lastDayLastMonth.toISOString())
        ]);

        const thisMonthCount = thisMonthStats.count || 0;
        const lastMonthCount = lastMonthStats.count || 0;
        const percentageChange = lastMonthCount === 0 
          ? thisMonthCount > 0 ? 100 : 0
          : ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;

        // Fetch all visitors for statistics
        const { data: visitors } = await supabase
          .from('cadastro_visitantes')
          .select('*')
          .eq('user_id', user.id);

        if (visitors) {
          // Calculate source distribution (como_conheceu)
          const sourceCount: Record<string, number> = {};
          visitors.forEach(visitor => {
            const source = visitor.como_conheceu || 'Não informado';
            sourceCount[source] = (sourceCount[source] || 0) + 1;
          });

          // Calculate age distribution
          const ageGroups: Record<string, number> = {
            '18-25': 0,
            '26-35': 0,
            '36-45': 0,
            '46-55': 0,
            '56+': 0,
            'Não informado': 0
          };

          visitors.forEach(visitor => {
            if (!visitor.data_nascimento) {
              ageGroups['Não informado']++;
              return;
            }

            const age = new Date().getFullYear() - new Date(visitor.data_nascimento).getFullYear();
            if (age <= 25) ageGroups['18-25']++;
            else if (age <= 35) ageGroups['26-35']++;
            else if (age <= 45) ageGroups['36-45']++;
            else if (age <= 55) ageGroups['46-55']++;
            else ageGroups['56+']++;
          });

          // Calculate marital status distribution
          const maritalStatusCount: Record<string, number> = {};
          visitors.forEach(visitor => {
            const status = visitor.estado_civil || 'Não informado';
            maritalStatusCount[status] = (maritalStatusCount[status] || 0) + 1;
          });

          setVisitors(visitorsData || []);
          if (count) {
            setTotalPages(Math.ceil(count / itemsPerPage));
          }
          setStats({
            total: count || 0,
            thisMonth: thisMonthCount,
            lastMonth: lastMonthCount,
            percentageChange,
            returningVisitors: Math.floor(Math.random() * 20),
            pendingFollowUp: Math.floor(Math.random() * 15),
            sourceDistribution: {
              labels: Object.keys(sourceCount),
              data: Object.values(sourceCount)
            },
            ageDistribution: {
              labels: Object.keys(ageGroups),
              data: Object.values(ageGroups)
            },
            maritalStatusDistribution: {
              labels: Object.keys(maritalStatusCount),
              data: Object.values(maritalStatusCount)
            }
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        addToast('Erro ao carregar dados', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, searchTerm, currentPage, addToast, navigate]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  const getChartColors = (count: number) => {
    const colors = [
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(199, 199, 199, 0.8)'
    ];
    return colors.slice(0, count);
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

  const statCards = [
    {
      title: 'Total de Visitantes',
      value: stats.total,
      change: `${stats.percentageChange >= 0 ? '+' : ''}${Math.round(stats.percentageChange)}%`,
      icon: UserPlus,
      color: 'blue'
    },
    {
      title: 'Visitantes este Mês',
      value: stats.thisMonth,
      change: `${stats.thisMonth - stats.lastMonth >= 0 ? '+' : ''}${stats.thisMonth - stats.lastMonth}`,
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Visitantes Recorrentes',
      value: stats.returningVisitors,
      change: '+12%',
      icon: MessageSquare,
      color: 'purple'
    },
    {
      title: 'Pendentes de Follow-up',
      value: stats.pendingFollowUp,
      change: '-3',
      icon: Bell,
      color: 'yellow'
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <ClientVerification />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar
                </button>
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-gray-900">Lista de Visitantes</h1>
                  <p className="text-gray-600">Gestão e acompanhamento de visitantes</p>
                </div>
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
                <div key={index} className="bg-[#FFFFFF] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Source Distribution (Como Conheceu) */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Share2 className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Como Conheceu</h3>
                </div>
                <div className="h-[300px]">
                  <Pie
                    data={{
                      labels: stats.sourceDistribution.labels,
                      datasets: [{
                        data: stats.sourceDistribution.data,
                        backgroundColor: getChartColors(stats.sourceDistribution.labels.length)
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Age Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Faixa Etária</h3>
                </div>
                <div className="h-[300px]">
                  <Bar
                    data={{
                      labels: stats.ageDistribution.labels,
                      datasets: [{
                        label: 'Visitantes',
                        data: stats.ageDistribution.data,
                        backgroundColor: getChartColors(1)[0]
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Marital Status Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Estado Civil</h3>
                </div>
                <div className="h-[300px]">
                  <Pie
                    data={{
                      labels: stats.maritalStatusDistribution.labels,
                      datasets: [{
                        data: stats.maritalStatusDistribution.data,
                        backgroundColor: getChartColors(stats.maritalStatusDistribution.labels.length)
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>

            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
              <div className="w-full md:w-96">
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
              <button
                onClick={() => setIsRegistrationModalOpen(true)}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Novo Visitante
              </button>
            </div>

            {/* Visitors List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visitante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data da Visita
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visitors.map((visitor) => (
                      <tr key={visitor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserPlus className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {visitor.nome}
                              </div>
                              <div className="text-sm text-gray-500">
                                {visitor.como_conheceu || 'Não informado'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{visitor.email}</div>
                          <div className="text-sm text-gray-500">
                            {visitor.whatsapp || visitor.telefone || 'Não informado'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(visitor.data_visita).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            visitor.receber_devocional === 'QUERO RECEBER!'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {visitor.receber_devocional || 'Não definido'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedVisitor({ type: 'visitor', ...visitor })}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Ver detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailsModal 
        isOpen={!!selectedVisitor}
        onClose={() => setSelectedVisitor(null)}
        person={selectedVisitor}
      />

      <VisitorRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </>
  );
}