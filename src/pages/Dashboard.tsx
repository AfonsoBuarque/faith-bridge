import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  MessageSquare, 
  Settings, 
  Bell,
  TrendingUp,
  TrendingDown,
  UserPlus,
  ChevronRight,
  Users,
  History,
  Cake
} from 'lucide-react';
import { Header } from '../components/HeaderClean';
import { ClientVerification } from '../components/ClientVerification';
import { DetailsModal } from '../components/DetailsModal';
import { VisitorRegistrationModal } from '../components/VisitorRegistrationModal';
import { MemberRegistrationModal } from '../components/MemberRegistrationModal';
import { MemberListModal } from '../components/MemberListModal';
import { MessageModal } from '../components/MessageModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Visitor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  data_visita: string;
  receber_devocional: string;
  receber_agenda: string;
}

interface Member {
  id: string;
  nome_completo: string;
  data_nascimento: string;
  foto_url: string | null;
  departamento: string;
  email: string;
  telefone: string;
  celular: string;
  cargo_ministerial: string;
  created_at: string;
}

interface BirthdayMember extends Member {
  age: number;
  day: number;
}

interface RecentActivity {
  id: string;
  type: 'visitor' | 'member';
  name: string;
  date: string;
  details: any;
}

export function Dashboard() {
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isMemberListModalOpen, setIsMemberListModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [visitorChange, setVisitorChange] = useState<number>(0);
  const [memberChange, setMemberChange] = useState<number>(0);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [birthdayMembers, setBirthdayMembers] = useState<BirthdayMember[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        // Get current month
        const currentMonth = new Date().getMonth() + 1;
        
        // Fetch members with birthdays this month
        const { data: members, error } = await supabase
          .from('membros')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Filter and process birthday members
        const birthdayMembers = (members || [])
          .filter(member => {
            if (!member.data_nascimento) return false;
            const birthMonth = new Date(member.data_nascimento).getMonth() + 1;
            return birthMonth === currentMonth;
          })
          .map(member => {
            const birthDate = new Date(member.data_nascimento);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            return {
              ...member,
              age,
              day: birthDate.getDate()
            };
          })
          .sort((a, b) => a.day - b.day);

        setBirthdayMembers(birthdayMembers);

        // Fetch visitor stats
        const [currentVisitors, previousVisitors] = await Promise.all([
          supabase
            .from('cadastro_visitantes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('data_visita', thirtyDaysAgo.toISOString())
            .lte('data_visita', now.toISOString()),
          supabase
            .from('cadastro_visitantes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('data_visita', sixtyDaysAgo.toISOString())
            .lt('data_visita', thirtyDaysAgo.toISOString())
        ]);

        // Fetch member stats
        const [currentMembers, previousMembers] = await Promise.all([
          supabase
            .from('membros')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', thirtyDaysAgo.toISOString())
            .lte('created_at', now.toISOString()),
          supabase
            .from('membros')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', sixtyDaysAgo.toISOString())
            .lt('created_at', thirtyDaysAgo.toISOString())
        ]);

        // Fetch recent activities (both visitors and members)
        const [recentVisitors, recentMembers] = await Promise.all([
          supabase
            .from('cadastro_visitantes')
            .select('*')
            .eq('user_id', user.id)
            .order('data_visita', { ascending: false })
            .limit(5),
          supabase
            .from('membros')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        // Calculate stats
        setVisitorCount(currentVisitors.count || 0);
        setMemberCount(currentMembers.count || 0);
        
        // Calculate percentage changes
        const visitorChange = previousVisitors.count === 0 ? 
          (currentVisitors.count || 0) > 0 ? 100 : 0 :
          ((currentVisitors.count || 0) - (previousVisitors.count || 0)) / (previousVisitors.count || 1) * 100;
        
        const memberChange = previousMembers.count === 0 ?
          (currentMembers.count || 0) > 0 ? 100 : 0 :
          ((currentMembers.count || 0) - (previousMembers.count || 0)) / (previousMembers.count || 1) * 100;

        setVisitorChange(Math.round(visitorChange));
        setMemberChange(Math.round(memberChange));

        // Combine and sort recent activities
        const activities: RecentActivity[] = [
          ...(recentVisitors.data || []).map(visitor => ({
            id: visitor.id,
            type: 'visitor' as const,
            name: visitor.nome,
            date: visitor.data_visita,
            details: visitor
          })),
          ...(recentMembers.data || []).map(member => ({
            id: member.id,
            type: 'member' as const,
            name: member.nome_completo,
            date: member.created_at,
            details: member
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
         .slice(0, 5);

        setRecentActivities(activities);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const stats = [
    {
      title: 'Total de Membros no Mês',
      value: memberCount.toString(),
      change: `${memberChange >= 0 ? '+' : ''}${memberChange}%`,
      icon: Users,
      color: 'blue',
      link: '/detalhes-membros'
    },
    {
      title: 'Visitantes no Mês',
      value: visitorCount.toString(),
      change: `${visitorChange >= 0 ? '+' : ''}${visitorChange}%`,
      icon: UserPlus,
      color: 'green',
      link: '/visitantes'
    },
    {
      title: 'Departamento',
      value: '12',
      change: '+5%',
      icon: Calendar,
      color: 'purple',
      link: '/departments'
    },
    {
      title: 'Mensagens',
      value: '89',
      change: '+18%',
      icon: MessageSquare,
      color: 'yellow',
      onClick: () => setIsMessageModalOpen(true)
    }
  ];

  const quickActions = [
    {
      title: 'Cadastrar Visitante',
      icon: UserPlus,
      color: 'green',
      onClick: () => setIsVisitorModalOpen(true)
    },
    {
      title: 'Cadastrar Membro',
      icon: Users,
      color: 'blue',
      onClick: () => setIsMemberModalOpen(true)
    },
    {
      title: 'Lista de Membros',
      icon: History,
      color: 'purple',
      onClick: () => setIsMemberListModalOpen(true)
    },
    {
      title: 'Calendário',
      icon: Calendar,
      color: 'yellow',
      onClick: () => navigate('/calendar')
    },
    {
      title: 'Pequenos Grupos',
      icon: Users,
      color: 'purple',
      onClick: () => navigate('/pequenosgrupos')
    },
    {
      title: 'Configurações',
      icon: Settings,
      color: 'gray',
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <ClientVerification>
          <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta!</h1>
                <p className="text-gray-600">Aqui está um resumo da sua igreja</p>
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
              {stats.map((stat, index) => (
                stat.link ? (
                  <Link key={index} to={stat.link} className="block">
                    <div className="bg-[#FFFFFF] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
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
                  </Link>
                ) : (
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
                )
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Recent Activity Section */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Atividade Recente</h2>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="space-y-6">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full ${
                            activity.type === 'visitor' ? 'bg-green-100' : 'bg-blue-100'
                          } flex items-center justify-center`}>
                            {activity.type === 'visitor' ? (
                              <UserPlus className="h-5 w-5 text-green-600" />
                            ) : (
                              <Users className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">
                              {activity.type === 'visitor' ? 'Novo visitante' : 'Novo membro'} registrado
                            </p>
                            <p className="text-gray-600 text-sm">{activity.name}</p>
                            <p className="text-gray-500 text-sm">
                              {new Date(activity.date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedPerson({
                            type: activity.type,
                            ...activity.details
                          })}
                          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                        >
                          Ver detalhes
                        </button>
                      </div>
                    ))}

                    {recentActivities.length === 0 && (
                      <p className="text-center text-gray-500">Nenhuma atividade recente</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Birthday Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Aniversariantes do Mês</h2>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleString('pt-BR', { month: 'long' })}
                  </span>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  {birthdayMembers.length > 0 ? (
                    <div className="space-y-4">
                      {birthdayMembers.map((member) => (
                        <div 
                          key={member.id}
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            {member.foto_url ? (
                              <img
                                src={member.foto_url}
                                alt={member.nome_completo}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Cake className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {member.nome_completo}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {member.departamento || 'Sem departamento'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              Dia {member.day}
                            </p>
                            <p className="text-sm text-gray-500">
                              {member.age} anos
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Cake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum aniversariante este mês</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ClientVerification>
      </div>

      <VisitorRegistrationModal 
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
      />

      <MemberRegistrationModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
      />

      <MemberListModal
        isOpen={isMemberListModalOpen}
        onClose={() => setIsMemberListModalOpen(false)}
      />

      <DetailsModal 
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        person={selectedPerson}
      />

      <MessageModal 
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
      />
    </>
  );
}