import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Search,
  Filter,
  Download,
  ArrowLeft,
  Bell,
  Settings,
  Users,
  Video,
  MapPin,
  Clock,
  FileText,
  Trash2,
  Edit2
} from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Header } from '../components/HeaderClean';
import { ClientVerification } from '../components/ClientVerification';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuthContext } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EventModal } from '../components/calendar/EventModal';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { WeekView } from '../components/calendar/WeekView';
import { DayView } from '../components/calendar/DayView';
import { GoogleCalendarButton } from '../components/calendar/GoogleCalendarButton';

type ViewType = 'month' | 'week' | 'day';
type Event = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  description?: string;
  type: 'leader' | 'regular' | 'other';
  participants: string[];
  status: 'pending' | 'confirmed' | 'cancelled';
  attachments?: string[];
  notes?: string;
  created_by: string;
  created_at: string;
};

export function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      addToast('Você precisa estar logado para acessar esta página', 'error');
      navigate('/');
      return;
    }

    fetchEvents();
  }, [user, navigate, addToast]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      addToast('Erro ao carregar eventos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleExportCalendar = () => {
    // Implementation for calendar export
    addToast('Calendário exportado com sucesso!', 'success');
  };

  const handleGoogleCalendarImport = async (googleEvents: any[]) => {
    if (!user) return;
    
    try {
      // Save imported events to Supabase
      const { error } = await supabase
        .from('calendar_events')
        .insert(googleEvents.map(event => ({
          ...event,
          user_id: user.id,
          created_by: user.id
        })));

      if (error) throw error;
      
      // Refresh events list
      fetchEvents();
      addToast('Eventos importados com sucesso!', 'success');
    } catch (error) {
      console.error('Error saving imported events:', error);
      addToast('Erro ao salvar eventos importados', 'error');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

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
                  <h1 className="text-2xl font-bold text-gray-900">Calendário</h1>
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

              {/* Calendar Controls */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-6">
                  {/* Date Navigation */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setSelectedDate(newDate);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-semibold">
                      {selectedDate.toLocaleString('pt-BR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </h2>
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setSelectedDate(newDate);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewChange('month')}
                      className={`px-4 py-2 rounded-lg ${
                        view === 'month' 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Mês
                    </button>
                    <button
                      onClick={() => handleViewChange('week')}
                      className={`px-4 py-2 rounded-lg ${
                        view === 'week' 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Semana
                    </button>
                    <button
                      onClick={() => handleViewChange('day')}
                      className={`px-4 py-2 rounded-lg ${
                        view === 'day' 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Dia
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                      <GoogleCalendarButton onCalendarImported={handleGoogleCalendarImport} />
                    </GoogleOAuthProvider>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Novo Evento
                    </button>
                    <button
                      onClick={handleExportCalendar}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="w-full md:w-96 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar eventos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800"
                    >
                      <option value="all">Todos os eventos</option>
                      <option value="leader">Reuniões com Líderes</option>
                      <option value="regular">Reuniões Regulares</option>
                      <option value="other">Outros Compromissos</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Calendar View */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                {view === 'month' && (
                  <CalendarGrid
                    date={selectedDate}
                    events={filteredEvents}
                    onEventClick={handleEventClick}
                    onDateClick={handleDateChange}
                  />
                )}
                {view === 'week' && (
                  <WeekView
                    date={selectedDate}
                    events={filteredEvents}
                    onEventClick={handleEventClick}
                  />
                )}
                {view === 'day' && (
                  <DayView
                    date={selectedDate}
                    events={filteredEvents}
                    onEventClick={handleEventClick}
                  />
                )}
              </div>
            </div>
          </div>
        </ClientVerification>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSuccess={fetchEvents}
      />
    </>
  );
}