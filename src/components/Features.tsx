import React from 'react';
import { Users, Building2, Calendar } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { Pricing } from './Pricing';

export function Features() {
  return (
    <>
      <section id="features" className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-16">
          Soluções Inteligentes para seu Crescimento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-gray-700" />}
            title="Gestão de Membros"
            description="Organize e acompanhe seus membros de forma eficiente com nossa plataforma intuitiva."
          />
          <FeatureCard 
            icon={<Building2 className="h-8 w-8 text-gray-700" />}
            title="Análise de Dados"
            description="Insights valiosos sobre crescimento e engajamento da sua comunidade."
          />
          <FeatureCard 
            icon={<Calendar className="h-8 w-8 text-gray-700" />}
            title="Automação"
            description="Automatize tarefas repetitivas e foque no que realmente importa."
          />
        </div>
      </div>
      </section>
      <Pricing />
    </>
  );
}