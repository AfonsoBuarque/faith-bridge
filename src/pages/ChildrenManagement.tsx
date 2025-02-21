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
  School,
  Calendar,
  Baby,
  ChevronRight
} from 'lucide-react';
import { Header } from '../components/HeaderClean';
import { ClientVerification } from '../components/ClientVerification';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuthContext } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ChildRegistrationModal } from '../components/children/ChildRegistrationModal';
import { ClassRegistrationModal } from '../components/children/ClassRegistrationModal';
import { AttendanceModal } from '../components/children/AttendanceModal';
import { ChildDetailsModal } from '../components/children/ChildDetailsModal';

interface Stats {
  totalChildren: number;
  activeChildren: number;
  totalClasses: number;
  attendanceRate: number;
  childrenChange: number;
  classesChange: number;
}

interface Child {
  id: string;
  nome_completo: string;
  data_nascimento: string;
  responsavel_1_nome: string;
  turma_id: string | null;
  foto_url: string | null;
  ativo: boolean;
}

interface Class {
  id: string;
  nome: string;
  faixa_etaria_min: number;
  faixa_etaria_max: number;
  professor_responsavel: string;
}

export function ChildrenManagement() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalChildren: 0,
    activeChildren: 0,
    totalClasses: 0,
    attendanceRate: 0,
    childrenChange: 0,
    classesChange: 0
  });
  const [children, setChildren] = useState<Child[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

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
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Fetch current children
        const { data: currentChildren, error: childrenError } = await supabase
          .from('criancas')
          .select('*')
          .eq('user_id', user.id)
          .order('nome_completo');

        if (childrenError) throw childrenError;

        // Fetch classes
        const { data: classesData, error: classesError } = await supabase
          .from('turmas')
          .select('*')
          .eq('user_id', user.id)
          .eq('ativo', true);

        if (classesError) throw classesError;

        // Calculate stats
        const activeChildren = currentChildren?.filter(child => child.ativo).length || 0;
        const totalChildren = currentChildren?.length || 0;
        const totalClasses = classesData?.length || 0;

        // Fetch last month's attendance
        const { data: attendanceData } = await supabase
          .from('presenca_criancas')
          .select('*')
          .eq('user_id', user.id)
          .gte('data_aula', firstDayOfMonth.toISOString())
          .lte('data_aula', now.toISOString());

        const attendanceRate = attendanceData 
          ? (attendanceData.filter(a => a.presente).length / attendanceData.length) * 100 
          : 0;

        setChildren(currentChildren || []);
        setClasses(classesData || []);
        setStats({
          totalChildren,
          activeChildren,
          totalClasses,
          attendanceRate,
          childrenChange: 0, // Calculate based on historical data
          classesChange: 0 // Calculate based on historical data
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        addToast('Erro ao carregar dados', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, navigate, addToast]);

  const statCards = [
    {
      title: 'Total de Crianças',
      value: stats.totalChildren,
      change: `${stats.childrenChange >= 0 ? '+' : ''}${stats.childrenChange}%`,
      icon: Baby,
      color: 'blue'
    },
    {
      title: 'Crianças Ativas',
      value: stats.activeChildren,
      change: `${Math.round((stats.activeChildren / stats.totalChildren) * 100)}%`,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Total de Turmas',
      value: stats.totalClasses,
      change: `${stats.classesChange >= 0 ? '+' : ''}${stats.classesChange}%`,
      icon: School,
      color: 'purple'
    },
    {
      title: 'Taxa de Presença',
      value: `${Math.round(stats.attendanceRate)}%`,
      change: '+5%',
      icon: Calendar,
      color: 'yellow'
    }
  ];

  const quickActions = [
    {
      title: 'Nova Criança',
      icon: Baby,
      color: 'blue',
      onClick: () => setIsChildModalOpen(true)
    },
    {
      title: 'Nova Turma',
      icon: School,
      color: 'purple',
      onClick: () => setIsClassModalOpen(true)
    },
    {
      title: 'Registrar Presença',
      icon: Calendar,
      color: 'yellow',
      onClick: () => setIsAttendanceModalOpen(true)
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
      <div className="min-h-screen bg-[#f9fafb]">
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
                  <h1 className="text-2xl font-bold text-gray-900">Ministério Infantil</h1>
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

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="bg-[#FFFFFF] rounded-xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center`}>
                      <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                    </div>
                    <span className="text-gray-900 font-medium">{action.title}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>

              {/* Children List */}
              <div className="bg-[#FFFFE0] rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Crianças Cadastradas</h2>
                  <div className="relative w-64">
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

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Criança
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Idade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Responsável
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Turma
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
                      {children
                        .filter(child => 
                          child.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((child) => {
                          const age = Math.floor(
                            (new Date().getTime() - new Date(child.data_nascimento).getTime()) / 
                            (1000 * 60 * 60 * 24 * 365.25)
                          );
                          const childClass = classes.find(c => c.id === child.turma_id);

                          return (
                            <tr key={child.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {child.foto_url ? (
                                    <img
                                      src={child.foto_url}
                                      alt={child.nome_completo}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <Baby className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {child.nome_completo}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {age} anos
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {child.responsavel_1_nome}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {childClass?.nome || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  child.ativo
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {child.ativo ? 'Ativo' : 'Inativo'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => setSelectedChild(child)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Ver detalhes
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </ClientVerification>
      </div>

      {/* Modals */}
      <ChildRegistrationModal
        isOpen={isChildModalOpen}
        onClose={() => setIsChildModalOpen(false)}
        classes={classes}
      />

      <ClassRegistrationModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        children={children}
        classes={classes}
      />

      <ChildDetailsModal
        isOpen={!!selectedChild}
        onClose={() => setSelectedChild(null)}
        child={selectedChild}
        classes={classes}
      />
    </>
  );
}