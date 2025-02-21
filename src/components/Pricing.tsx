import React, { useState } from 'react';
import { Check, Zap, Rocket } from 'lucide-react';

interface PlanFeature {
  text: string;
}

interface PricingPlan {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: PlanFeature[];
  monthlyPrice: number;
  yearlyPrice: number;
  highlight?: boolean;
}

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const plans: PricingPlan[] = [
    {
      icon: <Check className="h-8 w-8 text-green-500" />,
      title: "Plano Starter",
      description: "Essencial para pequenas igrejas que estão começando a organizar sua gestão.",
      monthlyPrice: 39.90,
      yearlyPrice: 406.98,
      features: [
        { text: "Cadastro e gerenciamento de membros e visitantes" },
        { text: "Organização de departamentos" },
        { text: "Agendamentos e eventos" },
        { text: "Integração com e-mail" },
        { text: "Relatórios básicos" }
      ]
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Plano Básico",
      description: "Perfeito para igrejas que precisam de mais controle e automação.",
      monthlyPrice: 59.90,
      yearlyPrice: 610.98,
      features: [
        { text: "Tudo do Plano Starter" },
        { text: "Acompanhamento de aconselhamentos" },
        { text: "Ferramentas devocionais e bíblia integrada" },
        { text: "Integração com WhatsApp e Telegram" },
        { text: "Relatórios avançados" }
      ],
      highlight: true
    },
    {
      icon: <Rocket className="h-8 w-8 text-purple-500" />,
      title: "Plano Premium",
      description: "A solução completa para igrejas que querem crescer com tecnologia.",
      monthlyPrice: 89.90,
      yearlyPrice: 916.98,
      features: [
        { text: "Tudo do Plano Básico" },
        { text: "Banco de dados avançado" },
        { text: "Personalização de relatórios e dashboards" },
        { text: "Suporte prioritário e exclusivo" },
        { text: "Acesso a novas funcionalidades em primeira mão" }
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Planos que se Adaptam à sua Igreja
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para sua igreja e comece a transformar a gestão da sua comunidade hoje mesmo.
          </p>
          <div className="flex items-center justify-center mt-8 space-x-4">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-lg transition ${
                !isYearly ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-lg transition ${
                isYearly ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Anual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                plan.highlight ? 'border-2 border-yellow-500' : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Mais Popular
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                      plan.highlight ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}
                  >
                    {plan.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-gray-900">
                    R$ {isYearly ? plan.yearlyPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isYearly ? 'por ano' : 'por mês'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {isYearly 
                      ? `ou R$ ${(plan.yearlyPrice / 12).toFixed(2)} por mês`
                      : `ou R$ ${plan.yearlyPrice.toFixed(2)} por ano`
                    }
                  </p>
                  {isYearly && (
                    <p className="text-sm text-green-600 mt-1">
                      Economia de {((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12) * 100).toFixed(0)}%
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    {index === 0 && "Ideal para igrejas que buscam organização de forma simples e prática."}
                    {index === 1 && "Para igrejas que desejam mais eficiência e automação no dia a dia."}
                    {index === 2 && "Para igrejas que querem crescer com tecnologia de ponta."}
                  </p>
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                      plan.highlight
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    onClick={() => window.location.href = 'https://viewer.faithflowtech.com.br/agendarconversa'}
                  >
                    Começar Agora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}