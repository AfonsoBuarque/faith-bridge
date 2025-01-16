import { Card } from "@/components/ui/card";
import { Activity, Users, Calendar, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  const stats = [
    {
      title: "Total de Membros",
      value: "256",
      icon: Users,
      trend: "+12% este mês",
      bgColor: "bg-green-50 hover:bg-green-100",
    },
    {
      title: "Eventos Ativos",
      value: "8",
      icon: Calendar,
      trend: "3 esta semana",
      bgColor: "bg-emerald-50 hover:bg-emerald-100",
    },
    {
      title: "Células Ativas",
      value: "24",
      icon: Activity,
      trend: "+2 este mês",
      bgColor: "bg-lime-50 hover:bg-lime-100",
    },
    {
      title: "Crescimento",
      value: "15%",
      icon: TrendingUp,
      trend: "vs. mês anterior",
      bgColor: "bg-teal-50 hover:bg-teal-100",
    },
  ];

  return (
    <div className={`p-4 md:p-8 ${isMobile ? 'mt-16' : ''} fade-in`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm md:text-base text-gray-500">
                Bem-vindo ao painel de controle da sua igreja
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`p-4 md:p-6 glass-card transition-all duration-300 hover:scale-105 hover:shadow-xl ${stat.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-xl md:text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs md:text-sm text-gray-500">{stat.trend}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-6 glass-card transition-all duration-300 hover:scale-105 hover:shadow-xl bg-green-50 hover:bg-green-100">
            <h2 className="text-lg font-semibold mb-4">Próximos Eventos</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 md:p-4 bg-white/80 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm md:text-base">Culto de Celebração</p>
                    <p className="text-xs md:text-sm text-gray-500">Domingo, 10:00</p>
                  </div>
                  <span className="px-2 md:px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                    Em breve
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 md:p-6 glass-card transition-all duration-300 hover:scale-105 hover:shadow-xl bg-emerald-50 hover:bg-emerald-100">
            <h2 className="text-lg font-semibold mb-4">Aniversariantes</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 bg-white/80 rounded-lg"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">João Silva</p>
                    <p className="text-xs md:text-sm text-gray-500">25 de Março</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;