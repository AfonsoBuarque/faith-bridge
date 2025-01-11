import { Card } from "@/components/ui/card";
import { Activity, Users, Calendar, TrendingUp } from "lucide-react";

const Index = () => {
  const stats = [
    {
      title: "Total de Membros",
      value: "256",
      icon: Users,
      trend: "+12% este mês",
    },
    {
      title: "Eventos Ativos",
      value: "8",
      icon: Calendar,
      trend: "3 esta semana",
    },
    {
      title: "Células Ativas",
      value: "24",
      icon: Activity,
      trend: "+2 este mês",
    },
    {
      title: "Crescimento",
      value: "15%",
      icon: TrendingUp,
      trend: "vs. mês anterior",
    },
  ];

  return (
    <div className="p-8 ml-64 fade-in">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-500">
                Bem-vindo ao painel de controle da sua igreja
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 glass-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">{stat.trend}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 glass-card">
            <h2 className="text-lg font-semibold mb-4">Próximos Eventos</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">Culto de Celebração</p>
                    <p className="text-sm text-gray-500">Domingo, 10:00</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                    Em breve
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 glass-card">
            <h2 className="text-lg font-semibold mb-4">Aniversariantes</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-gray-500">25 de Março</p>
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