import React, { useState } from 'react';
import { RegistrationModal } from './RegistrationModal';

export function CTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="contact" className="py-12 md:py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">
          Comece sua transformação digital hoje
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto">
          Experimente gratuitamente por 30 dias e descubra como podemos ajudar sua igreja a crescer.
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
        >
          Solicitar Demonstração Gratuita
        </button>
      </div>

      <RegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}