import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from '../../contexts/ToastContext';

interface GoogleCalendarButtonProps {
  onCalendarImported: (events: any[]) => void;
}

export function GoogleCalendarButton({ onCalendarImported }: GoogleCalendarButtonProps) {
  const { addToast } = useToast();

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    onSuccess: async (response) => {
      try {
        // Get events from Google Calendar
        const result = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });

        const data = await result.json();

        // Transform Google Calendar events to our format
        const transformedEvents = data.items.map((event: any) => ({
          id: event.id,
          title: event.summary,
          description: event.description,
          start_date: event.start.date || event.start.dateTime.split('T')[0],
          end_date: event.end.date || event.end.dateTime.split('T')[0],
          start_time: event.start.dateTime ? event.start.dateTime.split('T')[1].substring(0, 5) : '00:00',
          end_time: event.end.dateTime ? event.end.dateTime.split('T')[1].substring(0, 5) : '23:59',
          location: event.location || 'Online',
          type: 'regular',
          participants: event.attendees?.map((a: any) => a.email) || [],
          status: 'confirmed'
        }));

        onCalendarImported(transformedEvents);
        addToast('Eventos do Google Calendar importados com sucesso!', 'success');
      } catch (error) {
        console.error('Error fetching Google Calendar events:', error);
        addToast('Erro ao importar eventos do Google Calendar', 'error');
      }
    },
    onError: () => {
      addToast('Erro ao conectar com Google Calendar', 'error');
    }
  });

  return (
    <button
      onClick={() => login()}
      className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 shadow-sm"
    >
      <CalendarIcon className="h-5 w-5 mr-2 text-red-500" />
      <span>Importar do Google Calendar</span>
    </button>
  );
}