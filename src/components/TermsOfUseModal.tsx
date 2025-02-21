import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function TermsOfUseModal({ isOpen, onClose, onAccept }: TermsOfUseModalProps) {
  const [hasRead, setHasRead] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Termos de Utilização</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Ao criar uma conta e utilizar os serviços fornecidos pela Faith Flow Tech, você declara que leu, 
              compreendeu e concorda com os seguintes termos e condições de uso:
            </p>

            <h3 className="text-lg font-semibold text-gray-800">1. Aceitação dos Termos</h3>
            <p>1.1. Este Termo de Utilização regula o acesso e a utilização do sistema de automação e gerenciamento de membros para igrejas da Faith Flow Tech.</p>
            <p>1.2. O cadastro e o uso dos serviços implicam na aceitação integral deste Termo.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6">2. Objeto do Termo</h3>
            <p>2.1. A Faith Flow Tech disponibiliza ferramentas de automação, gerenciamento de membros e relatórios, com módulos como:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Visitantes</li>
              <li>Área de membros</li>
              <li>Departamentos</li>
              <li>Aconselhamentos</li>
              <li>Bíblia</li>
              <li>Devocional</li>
              <li>Agendamentos</li>
              <li>Integração com e-mails, WhatsApp e Telegram</li>
              <li>Bancos de dados</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6">3. Responsabilidades do Usuário</h3>
            <p>3.1. Fornecer informações verdadeiras, completas e atualizadas no momento do cadastro.</p>
            <p>3.2. Utilizar o sistema exclusivamente para os fins a que se destina, de forma lícita e respeitando os direitos de terceiros.</p>
            <p>3.3. Manter a confidencialidade dos dados de acesso e não compartilhá-los com terceiros.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6">4. Responsabilidades da Faith Flow Tech</h3>
            <p>4.1. Garantir o funcionamento do sistema, exceto em casos de manutenções programadas, falhas externas ou de força maior.</p>
            <p>4.2. Proteger as informações fornecidas pelo Usuário de acordo com a legislação vigente de proteção de dados.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6">5. Política de Privacidade</h3>
            <p>5.1. Os dados fornecidos pelo Usuário serão utilizados exclusivamente para a prestação dos serviços contratados.</p>
            <p>5.2. A Faith Flow Tech não compartilhará informações pessoais com terceiros sem o consentimento expresso do Usuário, salvo quando exigido por lei.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6">6. Limitação de Responsabilidade</h3>
            <p>6.1. A Faith Flow Tech não se responsabiliza por prejuízos decorrentes de:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Uso inadequado do sistema pelo Usuário</li>
              <li>Interrupções causadas por terceiros, como provedores de internet</li>
              <li>Eventos de força maior</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6">7. Rescisão</h3>
            <p>7.1. O descumprimento de qualquer disposição deste Termo poderá resultar na suspensão ou exclusão da conta do Usuário.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6">8. Alterações nos Termos</h3>
            <p>8.1. A Faith Flow Tech reserva-se o direito de alterar este Termo a qualquer momento. As alterações entrarão em vigor assim que publicadas no sistema.</p>
            <p>8.2. O uso continuado do sistema após a publicação de alterações implica na aceitação dos novos termos.</p>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasRead}
                onChange={(e) => setHasRead(e.target.checked)}
                className="rounded border-gray-300 text-gray-800 focus:ring-gray-800"
              />
              <span className="text-gray-700">Eu li e aceito os termos de utilização</span>
            </label>
            <button
              onClick={onAccept}
              disabled={!hasRead}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Check className="h-5 w-5" />
              <span>Aceitar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}