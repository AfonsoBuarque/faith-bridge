import React, { useEffect, useState } from 'react';
import { Header } from '../components/HeaderClean';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Users, ArrowLeft, Bell, Settings, TrendingUp, TrendingDown, UserPlus, Church, Cake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ClientVerification } from '../components/ClientVerification';
import { useToast } from '../contexts/ToastContext';
import { MemberListModal } from '../components/MemberListModal';
import { CurrentMonthMembersModal } from '../components/CurrentMonthMembersModal';
import { BirthdayMembersModal } from '../components/BirthdayMembersModal';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface ChartData {
  faixaEtaria: {
    labels: string[];
    data: number[];
  };
  genero: {
    labels: string[];
    data: number[];
  };
  estadoCivil: {
    labels: string[];
    data: number[];
  };
  departamento: {
    labels: string[];
    data: number[];
  };
  cargoMinisterial: {
    labels: string[];
    data: number[];
  };
}

interface MemberStats {
  total: number;
  activeMembers: number;
  newThisMonth: number;
  percentageChange: number;
  baptizedMembers: number;
  departmentLeaders: number;
  birthdays: number;
  birthdayChange: number;
  ministryMembers: number;
}

export function DetalhesDeMembros() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [stats, setStats] = useState<MemberStats>({
    total: 0,
    activeMembers: 0,
    newThisMonth: 0,
    percentageChange: 0,
    baptizedMembers: 0,
    departmentLeaders: 0,
    birthdays: 0,
    birthdayChange: 0,
    ministryMembers: 0
  });
  const [isMemberListModalOpen, setIsMemberListModalOpen] = useState(false);
  const [isCurrentMonthModalOpen, setIsCurrentMonthModalOpen] = useState(false);
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) {
      addToast('Você precisa estar logado para acessar esta página', 'error');
      navigate('/');
      return;
    }

    async function fetchData() {
      try {
        // Get current date and first day of current month
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
        // Format dates as YYYY-MM-DD for SQL comparison
        const firstDayFormatted = firstDayOfMonth.toISOString().split('T')[0];
        const lastDayFormatted = now.toISOString().split('T')[0];

        // Fetch all members
        const { data: members, error } = await supabase
          .from('membros')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Calculate birthdays for current month
        const birthdays = members?.filter(member => {
          if (!member.data_nascimento) return false;
          const birthMonth = new Date(member.data_nascimento).getMonth() + 1;
          return birthMonth === currentMonth;
        }).length || 0;

        // Calculate birthdays for last month for comparison
        const lastMonthBirthdays = members?.filter(member => {
          if (!member.data_nascimento) return false;
          const birthMonth = new Date(member.data_nascimento).getMonth() + 1;
          return birthMonth === (currentMonth === 1 ? 12 : currentMonth - 1);
        }).length || 0;

        // Calculate birthday change percentage
        const birthdayChange = lastMonthBirthdays === 0 
          ? birthdays > 0 ? 100 : 0 
          : ((birthdays - lastMonthBirthdays) / lastMonthBirthdays) * 100;

        // Calculate new members this month based on data_membro
        const newThisMonth = members?.filter(member => {
          const membroDate = member.data_membro;
          return membroDate >= firstDayFormatted && membroDate <= lastDayFormatted;
        }).length || 0;

        // Calculate total members and other stats
        const total = members?.length || 0;
        const baptizedMembers = members?.filter(m => m.data_batismo).length || 0;
        const ministryMembers = members?.filter(m => m.departamento).length || 0;

        setStats({
          total,
          activeMembers: total,
          newThisMonth,
          percentageChange: 0,
          baptizedMembers,
          departmentLeaders: members?.filter(m => m.cargo_ministerial).length || 0,
          birthdays,
          birthdayChange,
          ministryMembers
        });

        // Process chart data
        if (members) {
          const chartData = processChartData(members);
          setChartData(chartData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        addToast('Erro ao carregar dados', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, navigate, addToast]);

  const processChartData = (members: any[]): ChartData => {
    // Age groups
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0
    };

    members.forEach(member => {
      if (member.data_nascimento) {
        const age = new Date().getFullYear() - new Date(member.data_nascimento).getFullYear();
        if (age <= 25) ageGroups['18-25']++;
        else if (age <= 35) ageGroups['26-35']++;
        else if (age <= 45) ageGroups['36-45']++;
        else if (age <= 55) ageGroups['46-55']++;
        else ageGroups['56+']++;
      }
    });

    // Process other data
    const stats = {
      estadoCivil: {},
      departamento: {},
      cargoMinisterial: {}
    };

    members.forEach(member => {
      if (member.estado_civil) {
        stats.estadoCivil[member.estado_civil] = (stats.estadoCivil[member.estado_civil] || 0) + 1;
      }
      if (member.departamento) {
        stats.departamento[member.departamento] = (stats.departamento[member.departamento] || 0) + 1;
      }
      if (member.cargo_ministerial) {
        stats.cargoMinisterial[member.cargo_ministerial] = (stats.cargoMinisterial[member.cargo_ministerial] || 0) + 1;
      }
    });

    return {
      faixaEtaria: {
        labels: Object.keys(ageGroups),
        data: Object.values(ageGroups)
      },
      genero: {
        labels: [],
        data: []
      },
      estadoCivil: {
        labels: Object.keys(stats.estadoCivil),
        data: Object.values(stats.estadoCivil)
      },
      departamento: {
        labels: Object.keys(stats.departamento),
        data: Object.values(stats.departamento)
      },
      cargoMinisterial: {
        labels: Object.keys(stats.cargoMinisterial),
        data: Object.values(stats.cargoMinisterial)
      }
    };
  };

  const statCards = [
    {
      title: 'Total de Membros',
      value: stats.total,
      change: `${stats.percentageChange >= 0 ? '+' : ''}${Math.round(stats.percentageChange)}%`,
      icon: Users,
      color: 'blue',
      onClick: () => setIsMemberListModalOpen(true)
    },
    {
      title: 'Novos Membros (Mês)',
      value: stats.newThisMonth,
      change: `+${stats.newThisMonth}`,
      icon: UserPlus,
      color: 'green',
      onClick: () => setIsCurrentMonthModalOpen(true)
    },
    {
      title: 'Membros Batizados',
      value: stats.baptizedMembers,
      change: `${Math.round((stats.baptizedMembers / (stats.total || 1)) * 100)}%`,
      icon: Church,
      color: 'purple'
    },
    {
      title: 'Aniversariantes do Mês',
      value: stats.birthdays,
      change: `${stats.birthdayChange >= 0 ? '+' : ''}${Math.round(stats.birthdayChange)}%`,
      icon: Cake,
      color: 'yellow',
      onClick: () => setIsBirthdayModalOpen(true)
    }
  ];

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
      'rgba(199, 199, 199, 0.8)',
      'rgba(83, 102, 255, 0.8)',
      'rgba(255, 99, 255, 0.8)',
      'rgba(255, 159, 159, 0.8)'
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <ClientVerification />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section with Toolbar */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar
                </button>
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-gray-900">Análise de Membros</h1>
                  <p className="text-gray-600">Estatísticas e informações detalhadas</p>
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
                <div 
                  key={index} 
                  className="bg-[#FFFFFF] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={stat.onClick}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                    <div className="flex items-center space-x-1">
                      {!stat.change.includes('-') ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={!stat.change.includes('-') ? 'text-green-500' : 'text-red-500'}>
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
            {chartData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Faixa Etária */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Faixa Etária</h2>
                  <div className="h-[300px]">
                    <Bar
                      data={{
                        labels: chartData.faixaEtaria.labels,
                        datasets: [{
                          label: 'Membros',
                          data: chartData.faixaEtaria.data,
                          backgroundColor: getChartColors(chartData.faixaEtaria.labels.length)
                        }]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Estado Civil */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Estado Civil</h2>
                  <div className="h-[300px]">
                    <Pie
                      data={{
                        labels: chartData.estadoCivil.labels,
                        datasets: [{
                          data: chartData.estadoCivil.data,
                          backgroundColor: getChartColors(chartData.estadoCivil.labels.length)
                        }]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Departamento */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Departamentos</h2>
                  <div className="h-[300px]">
                    <Pie
                      data={{
                        labels: chartData.departamento.labels,
                        datasets: [{
                          data: chartData.departamento.data,
                          backgroundColor: getChartColors(chartData.departamento.labels.length)
                        }]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Cargo Ministerial */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Cargos Ministeriais</h2>
                  <div className="h-[300px]">
                    <Bar
                      data={{
                        labels: chartData.cargoMinisterial.labels,
                        datasets: [{
                          label: 'Membros',
                          data: chartData.cargoMinisterial.data,
                          backgroundColor: getChartColors(chartData.cargoMinisterial.labels.length)
                        }]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MemberListModal
        isOpen={isMemberListModalOpen}
        onClose={() => setIsMemberListModalOpen(false)}
      />
      
      <CurrentMonthMembersModal
        isOpen={isCurrentMonthModalOpen}
        onClose={() => setIsCurrentMonthModalOpen(false)}
      />

      <BirthdayMembersModal
        isOpen={isBirthdayModalOpen}
        onClose={() => setIsBirthdayModalOpen(false)}
      />
    </>
  );
}