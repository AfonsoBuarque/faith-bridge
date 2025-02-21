import React from 'react';
import { Smartphone, CreditCard, Users } from 'lucide-react';
import { ProjectCard } from './ProjectCard';

export function OtherProjects() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
          Outros Projetos para o seu Negócio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProjectCard
            Icon={Smartphone}
            title="Aplicativo Mobile"
            description="Aplicativo personalizado para sua igreja, permitindo que membros acessem conteúdo e interajam em qualquer lugar."
          />
          <ProjectCard
            Icon={CreditCard}
            title="Sistema de Contribuições"
            description="Plataforma segura para gerenciar dízimos e ofertas, com relatórios detalhados e integração com sistemas financeiros."
          />
          <ProjectCard
            Icon={Users}
            title="Gestão de Células"
            description="Ferramenta completa para organizar e acompanhar grupos pequenos, facilitando o crescimento da sua igreja."
          />
        </div>
      </div>
    </section>
  );
}