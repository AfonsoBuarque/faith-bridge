import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Users, Mail, Phone, MapPin } from "lucide-react";

const Members = () => {
  const members = [
    {
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123",
      status: "Ativo",
      role: "Membro",
    },
    {
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      address: "Av. Principal, 456",
      status: "Ativo",
      role: "Líder",
    },
    {
      name: "Pedro Oliveira",
      email: "pedro@email.com",
      phone: "(11) 77777-7777",
      address: "Rua do Comércio, 789",
      status: "Inativo",
      role: "Membro",
    },
  ];

  return (
    <div className="p-8 ml-64 fade-in">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Membros</h1>
              <p className="mt-1 text-gray-500">
                Gerencie os membros da sua igreja
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Adicionar Membro
            </Button>
          </div>
        </header>

        <Card className="p-6 glass-card mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Buscar membros..."
                className="w-full pl-10"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </Card>

        <div className="grid gap-6">
          {members.map((member, index) => (
            <Card key={index} className="p-6 glass-card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{member.address}</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    member.status === "Ativo"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Members;