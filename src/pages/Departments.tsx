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
  Edit2,
  Trash2,
  UserCheck,
  Baby
} from 'lucide-react';
import { Header } from '../components/HeaderClean';
import { ClientVerification } from '../components/ClientVerification';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuthContext } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { DepartmentModal } from '../components/departments/DepartmentModal';
import { DepartmentMembersModal } from '../components/departments/DepartmentMembersModal';

interface Department {
  id: string;
  nome: string;
  responsavel: {
    nome_completo: string;
  } | null;
  responsavel_2: {
    nome_completo: string;
  } | null;
  member_count: number;
}

interface DepartmentStats {
  total: number;
  activeMembers: number;
  newThisMonth: number;
  percentageChange: number;
  childrenMinistryCount: number;
}

export function Departments() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<DepartmentStats>({
    total: 0,
    activeMembers: 0,
    newThisMonth: 0,
    percentageChange: 0,
    childrenMinistryCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedDepartmentForMembers, setSelectedDepartmentForMembers] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      addToast('Você precisa estar logado para acessar esta página', 'error');
      navigate('/');
      return;
    }

    fetchDepartments();
  }, [user, navigate, addToast]);

  const fetchDepartments = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch departments with member count
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departamentos')
        .select(`
          id,
          nome,
          responsavel:responsavel_id(nome_completo),
          responsavel_2:responsavel_2_id(nome_completo)
        `)
        .eq('user_id', user.id)
        .order('nome');

      if (departmentsError) throw departmentsError;

      // Get member count for each department
      const departmentsWithCount = await Promise.all(
        (departmentsData || []).map(async (dept) => {
          const { count } = await supabase
            .from('membros')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('departamento', dept.nome);

          return {
            ...dept,
            member_count: count || 0
          };
        })
      );

      // Get children count
      const { count: childrenCount } = await supabase
        .from('criancas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('ativo', true);

      setDepartments(departmentsWithCount);

      // Calculate stats
      const totalDepartments = departmentsWithCount.length;
      const totalMembers = departmentsWithCount.reduce((sum, dept) => sum + dept.member_count, 0);
      
      setStats({
        total: totalDepartments,
        activeMembers: totalMembers,
        newThisMonth: 0,
        percentageChange: 0,
        childrenMinistryCount: childrenCount || 0
      });

    } catch (error) {
      console.error('Error fetching departments:', error);
      addToast('Erro ao carregar departamentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este departamento?')) return;

    try {
      const { error } = await supabase
        .from('departamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      addToast('Departamento excluído com sucesso!', 'success');
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      addToast('Erro ao excluir departamento', 'error');
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCards = [
    {
      title: 'Total de Departamentos',
      value: stats.total,
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Membros Ativos',
      value: stats.activeMembers,
      change: '+5%',
      icon: UserPlus,
      color: 'green'
    },
    {
      title: 'Novos Membros (Mês)',
      value: stats.newThisMonth,
      change: '+8%',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Ministério Infantil',
      value: stats.childrenMinistryCount,
      change: `+${Math.round((stats.childrenMinistryCount / (stats.total || 1)) * 100)}%`,
      icon: Baby,
      color: 'yellow',
      onClick: () => navigate('/children-management')
    }
  ];

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
                  <h1 className="text-2xl font-bold text-gray-900">Departamentos</h1>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Novo Departamento
                </button>
              </div>

              {/* Departments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.map((dept) => (
                  <div key={dept.id} className="bg-[#FFFFE0] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{dept.nome}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <Users className="h-5 w-5 mr-2" />
                            <div>
                              <p className="text-sm font-medium">
                                {dept.responsavel?.nome_completo}
                              </p>
                              {dept.responsavel_2?.nome_completo && (
                                <p className="text-sm text-gray-500">
                                  {dept.responsavel_2.nome_completo}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <UserCheck className="h-5 w-5 mr-2" />
                            <span className="text-sm">
                              {dept.member_count} {dept.member_count === 1 ? 'membro' : 'membros'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedDepartmentForMembers(dept.nome)}
                          className="p-2 text-blue-600 hover:text-blue-900 rounded-lg hover:bg-blue-50"
                        >
                          <Users className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDepartmentId(dept.id);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-indigo-600 hover:text-indigo-900 rounded-lg hover:bg-indigo-50"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="p-2 text-red-600 hover:text-red-900 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ClientVerification>
      </div>

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDepartmentId(null);
        }}
        departmentId={selectedDepartmentId || undefined}
        onSuccess={fetchDepartments}
      />

      <DepartmentMembersModal
        isOpen={!!selectedDepartmentForMembers}
        onClose={() => setSelectedDepartmentForMembers(null)}
        departmentName={selectedDepartmentForMembers || ''}
      />
    </>
  );
}