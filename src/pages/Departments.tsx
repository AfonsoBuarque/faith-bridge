import { Card } from "@/components/ui/card";
import { Grid, Users, BookOpen, Music, Heart, Baby, School } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Departments = () => {
  const isMobile = useIsMobile();

  const departments = [
    {
      title: "Ministério Infantil",
      description: "Educação e cuidado das crianças",
      icon: Baby,
      members: 12,
      bgColor: "bg-pink-50 hover:bg-pink-100",
    },
    {
      title: "Louvor",
      description: "Ministério de música e adoração",
      icon: Music,
      members: 15,
      bgColor: "bg-purple-50 hover:bg-purple-100",
    },
    {
      title: "Ensino",
      description: "Escola bíblica e discipulado",
      icon: BookOpen,
      members: 8,
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      title: "Jovens",
      description: "Ministério com adolescentes e jovens",
      icon: Heart,
      members: 20,
      bgColor: "bg-red-50 hover:bg-red-100",
    },
    {
      title: "Educação",
      description: "Treinamento e capacitação",
      icon: School,
      members: 10,
      bgColor: "bg-green-50 hover:bg-green-100",
    },
    {
      title: "Integração",
      description: "Recepção e acolhimento",
      icon: Users,
      members: 14,
      bgColor: "bg-yellow-50 hover:bg-yellow-100",
    },
  ];

  return (
    <div className={`p-4 md:p-8 ${isMobile ? 'mt-16' : ''} fade-in`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Departamentos</h1>
              <p className="mt-1 text-sm md:text-base text-gray-500">
                Gerencie os departamentos da sua igreja
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {departments.map((department, index) => {
            const Icon = department.icon;
            return (
              <Card 
                key={index} 
                className={`p-6 glass-card transition-all duration-300 hover:scale-105 hover:shadow-xl ${department.bgColor}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white rounded-full">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {department.members} membros
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {department.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {department.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Departments;