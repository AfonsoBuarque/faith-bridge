import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin } from "lucide-react";

export default function Events() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Exemplo de eventos (em produção, isso viria de uma API)
  const events = [
    {
      id: 1,
      title: "Reunião Mensal",
      date: "2024-02-15",
      time: "14:00",
      location: "Sala de Conferência",
      type: "Reunião"
    },
    {
      id: 2,
      title: "Workshop de Inovação",
      date: "2024-02-20",
      time: "09:00",
      location: "Auditório Principal",
      type: "Workshop"
    },
    {
      id: 3,
      title: "Treinamento de Equipe",
      date: "2024-02-25",
      time: "10:30",
      location: "Sala de Treinamento",
      type: "Treinamento"
    }
  ];

  return (
    <div className="container mx-auto p-6 fade-in">
      <h1 className="text-3xl font-bold mb-8 text-primary">Eventos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <Badge variant="secondary">{event.type}</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}