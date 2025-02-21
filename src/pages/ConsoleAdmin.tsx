import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Building2, 
  MessageSquare, 
  Settings,
  Bell,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Header } from '../components/HeaderClean';
import { useAuthContext } from '../contexts/AuthContext';
import { UserList } from '../components/admin/UserList';
import { ChurchList } from '../components/admin/ChurchList';
import { ChurchDetailsModal } from '../components/ChurchDetailsModal';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalChurches: number;
  churchesGrowth: number;
}

export function ConsoleAdmin() {
  const [loading, setLoading] = useState(true);
  const [showUserList, setShowUserList] = useState(false);
  const [showChurchList, setShowChurchList] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalChurches: 0,
    churchesGrowth: 0
  });
  const [isChurchModalOpen, setIsChurchModalOpen] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      addToast('Você precisa estar logado para acessar esta página', 'error');
      navigate('/');
      return;
    }

    checkAdminAccess();
    fetchDashboardStats();
  }, [user, navigate, addToast]);

  const checkAdminAccess = async () => {
    try {
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error || !adminUser) {
        addToast('Acesso não autorizado', 'error');
        navigate('/consoleadmin/login');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      addToast('Erro ao verificar acesso', 'error');
      navigate('/consoleadmin/login');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch active users (users who have logged in this month)
      const { count: activeUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', firstDayOfMonth.toISOString());

      // Fetch new users this month
      const { count: newUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth.toISOString());

      // Fetch total churches - Using count directly
      const { count: totalChurches } = await supabase
        .from('dados_igreja')
        .select('*', { count: 'exact', head: true });

      // Calculate church growth
      const { count: thisMonthChurches } = await supabase
        .from('dados_igreja')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth.toISOString());

      const { count: lastMonthChurches } = await supabase
        .from('dados_igreja')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayLastMonth.toISOString())
        .lte('created_at', lastDayLastMonth.toISOString());

      // Calculate church growth percentage
      const churchesGrowth = lastMonthChurches === 0 
        ? thisMonthChurches > 0 ? 100 : 0
        : ((thisMonthChurches - lastMonthChurches) / lastMonthChurches) * 100;

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        newUsersThisMonth: newUsers || 0,
        totalChurches: totalChurches || 0,
        churchesGrowth: Math.round(churchesGrowth)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      addToast('Erro ao carregar estatísticas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Usuários Ativos',
      value: stats.activeUsers,
      change: '+5%',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Novos Usuários (Mês)',
      value: stats.newUsersThisMonth,
      change: '+8%',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Total de Igrejas',
      value: stats.totalChurches,
      change: `${stats.churchesGrowth >= 0 ? '+' : ''}${stats.churchesGrowth}%`,
      icon: Building2,
      color: 'yellow'
    }
  ];

  const quickActions = [
    {
      title: 'Gerenciar Usuários',
      icon: Users,
      color: 'blue',
      onClick: () => setShowUserList(true)
    },
    {
      title: 'Gerenciar Igrejas',
      icon: Building2,
      color: 'green',
      onClick: () => setShowChurchList(true)
    },
    {
      title: 'Mensagens',
      icon: MessageSquare,
      color: 'purple',
      onClick: () => navigate('/consoleadmin/messages')
    },
    {
      title: 'Configurações',
      icon: Settings,
      color: 'gray',
      onClick: () => navigate('/consoleadmin/settings')
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
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar
                </button>
                <h1 className="text-2xl font-bold text-gray-900">OnlyChurch Painel Admin</h1>
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
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                    <span className="text-green-500 text-sm">{stat.change}</span>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Lista de Igrejas */}
            {showChurchList && !showUserList && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Igrejas Cadastradas</h2>
                  <button
                    onClick={() => setShowChurchList(false)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Voltar
                  </button>
                </div>
                <ChurchList />
              </div>
            )}
            
            {/* Lista de Usuários */}
            {showUserList && !showChurchList && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Usuários Cadastrados</h2>
                  <button
                    onClick={() => setShowUserList(false)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Voltar
                  </button>
                </div>
                <UserList />
              </div>
            )}

            {/* Quick Actions */}
            {!showChurchList && !showUserList && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition"
                >
                  <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center`}>
                    <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                  </div>
                  <span className="text-gray-900 font-medium">{action.title}</span>
                </button>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ChurchDetailsModal
        isOpen={isChurchModalOpen}
        onClose={() => setIsChurchModalOpen(false)}
      />
    </>
  );
}