import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Users, Mail, Phone, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Members = () => {
  const members = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123",
      status: "Ativo",
      role: "Membro",
      joinDate: "01/01/2024",
      smallGroup: "Célula Central",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      address: "Av. Principal, 456",
      status: "Ativo",
      role: "Líder",
      joinDate: "15/12/2023",
      smallGroup: "Célula Jovem",
    },
    {
      id: 3,
      name: "Pedro Oliveira",
      email: "pedro@email.com",
      phone: "(11) 77777-7777",
      address: "Rua do Comércio, 789",
      status: "Inativo",
      role: "Membro",
      joinDate: "05/01/2024",
      smallGroup: "Célula Norte",
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

        <Card className="glass-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Entrada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.smallGroup}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Members;