import React from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DayViewProps {
  date: Date;
  events: any[];
  onEventClick: (event: any) => void;
}

export function DayView({ date, events, onEventClick }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventDate = parseISO(event.start_date);
      const eventHour = parseInt(event.start_time.split(':')[0]);
      return isSameDay(eventDate, date) && eventHour === hour;
    });
  };

  return (
    <div className="w-full">
      {/* Day header */}
      <div className="bg-gray-50 p-4 text-center border-b">
        <div className="font-semibold text-gray-700">
          {format(date, 'EEEE', { locale: ptBR })}
        </div>
        <div className="text-sm text-gray-500">
          {format(date, 'd MMM yyyy', { locale: ptBR })}
        </div>
      </div>

      {/* Time slots */}
      <div className="divide-y">
        {hours.map(hour => {
          const eventsForHour = getEventsForHour(hour);
          
          return (
            <div key={hour} className="flex min-h-[100px]">
              {/* Time column */}
              <div className="w-24 p-2 text-center text-sm text-gray-500 bg-gray-50">
                {format(new Date().setHours(hour), 'HH:mm')}
              </div>

              {/* Events column */}
              <div className="flex-1 p-2">
                {eventsForHour.map(event => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className={`mb-2 p-2 rounded cursor-pointer ${
                      event.type === 'leader'
                        ? 'bg-purple-100 hover:bg-purple-200'
                        : event.type === 'regular'
                        ? 'bg-blue-100 hover:bg-blue-200'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm">
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {event.start_time} - {event.end_time}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {event.location}
                    </div>
                    {event.participants?.length > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        {event.participants.length} participante{event.participants.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}