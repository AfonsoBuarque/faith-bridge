import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeekViewProps {
  date: Date;
  events: any[];
  onEventClick: (event: any) => void;
}

export function WeekView({ date, events, onEventClick }: WeekViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDateAndHour = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = parseISO(event.start_date);
      const eventHour = parseInt(event.start_time.split(':')[0]);
      return isSameDay(eventDate, date) && eventHour === hour;
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Week header */}
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          <div className="bg-gray-50 p-4 text-center text-sm font-semibold text-gray-700">
            Hora
          </div>
          {daysInWeek.map((day) => (
            <div
              key={day.toString()}
              className="bg-gray-50 p-4 text-center"
            >
              <div className="font-semibold text-gray-700">
                {format(day, 'EEEE', { locale: ptBR })}
              </div>
              <div className="text-sm text-gray-500">
                {format(day, 'd MMM', { locale: ptBR })}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              {/* Hour column */}
              <div className="bg-white p-2 text-center text-sm text-gray-500">
                {format(new Date().setHours(hour), 'HH:mm')}
              </div>

              {/* Day columns */}
              {daysInWeek.map(day => {
                const eventsForSlot = getEventsForDateAndHour(day, hour);
                
                return (
                  <div key={`${day}-${hour}`} className="bg-white p-1 min-h-[60px] relative">
                    {eventsForSlot.map(event => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`absolute inset-x-1 p-1 rounded text-xs cursor-pointer ${
                          event.type === 'leader'
                            ? 'bg-purple-100 text-purple-800'
                            : event.type === 'regular'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        style={{
                          top: '0.25rem',
                          minHeight: '1.5rem'
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-75 truncate">
                 {event.location}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}