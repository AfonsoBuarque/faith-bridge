import React from "react";
import { Calendar } from "@/components/ui/calendar";

export default function Events() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto p-6 fade-in">
      <h1 className="text-3xl font-bold mb-8 text-primary">Eventos</h1>
      
      <div className="glass-card p-6 rounded-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
    </div>
  );
}