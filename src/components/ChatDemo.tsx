import React from 'react';
import { MessageSquare } from 'lucide-react';
import { TestimonialBadge } from './TestimonialBadge';
import { ChatMessage } from './ChatMessage';
import { Logo } from './Logo';

export function ChatDemo() {
  return (
    <section id="demo" className="bg-[#D3D3D3] py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 md:pr-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <Logo className="h-6 w-auto" />
              <span className="text-lg font-semibold text-gray-700">Novo Produto</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              ChatBot para Igrejas
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
              Atendimento 24/7 para sua comunidade. Responda dúvidas, agende visitas e mantenha todos informados automaticamente.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <TestimonialBadge text="Resposta instantânea" />
              <TestimonialBadge text="IA Avançada" />
              <TestimonialBadge text="Personalizado" />
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="h-6 w-6 text-gray-700" />
                <span className="font-semibold">Chat Demonstração</span>
              </div>
              <div className="space-y-4">
                <ChatMessage sender="user" message="Olá, gostaria de saber os horários dos cultos." />
                <ChatMessage sender="bot" message="Claro! Temos cultos nos seguintes horários: Domingo às 9h e 18h, Quarta às 19h30. Posso te ajudar a agendar uma visita?" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}