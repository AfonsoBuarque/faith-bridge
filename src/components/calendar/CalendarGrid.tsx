import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarGridProps {
  date: Date;
  events: any[];
  onEventClick: (event: any) => void;
  onDateClick: (date: Date) => void;
}

export function CalendarGrid({ date, events, onEventClick, onDateClick }: CalendarGridProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day names in Portuguese
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.start_date);
      return isSameDay(eventDate, date);
    });
  };

  return (
    <div className="w-full">
      {/* Week days header */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysInMonth.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, date);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toString()}
              className={`min-h-[120px] bg-white p-2 ${
                !isCurrentMonth ? 'text-gray-400' : ''
              } ${isCurrentDay ? 'bg-blue-50' : ''}`}
              onClick={() => onDateClick(day)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${
                  isCurrentDay ? 'text-blue-600' : ''
                }`}>
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`px-2 py-1 rounded text-xs truncate cursor-pointer ${
                      event.type === 'leader'
                        ? 'bg-purple-100 text-purple-800'
                        : event.type === 'regular'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 pl-2">
                    +{dayEvents.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}