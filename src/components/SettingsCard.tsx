import React from 'react';
import {
  Settings,
  Users,
  Building2,
  MessageSquare,
  CreditCard,
  Palette,
  Shield,
  Share2,
  ChevronRight
} from 'lucide-react';

interface SettingOption {
  title: string;
  description: string;
  icon: React.ElementType;
  items: string[];
}

export function SettingsCard() {
  const settingOptions: SettingOption[] = [
    {
      title: 'Configurações Gerais',
      description: 'Informações básicas da igreja',
      icon: Settings,
      items: ['Informações da Igreja', 'Horários de Culto', 'Personalização do Dashboard']
    },
    {
      title: 'Gestão de Usuários',
      description: 'Controle de acesso e permissões',
      icon: Users,
      items: ['Gerenciar Permissões', 'Adicionar/Remover Administradores', 'Níveis de Acesso']
    },
    {
      title: 'Departamentos',
      description: 'Gestão de departamentos e células',
      icon: Building2,
      items: ['Criar/Editar Departamentos', 'Gerenciar Líderes', 'Configurar Grupos e Células']
    },
    {
      title: 'Comunicação',
      description: 'Configurações de mensagens',
      icon: MessageSquare,
      items: ['Configurações de WhatsApp', 'Templates de Mensagens', 'Notificações Automáticas']
    },
    {
      title: 'Financeiro',
      description: 'Gestão financeira',
      icon: CreditCard,
      items: ['Configurar Métodos de Contribuição', 'Categorias de Entrada/Saída', 'Relatórios Automáticos']
    },
    {
      title: 'Personalização',
      description: 'Aparência e campos personalizados',
      icon: Palette,
      items: ['Temas e Cores', 'Logo da Igreja', 'Campos Personalizados']
    },
    {
      title: 'Backup e Segurança',
      description: 'Proteção e backup de dados',
      icon: Shield,
      items: ['Configurações de Backup', 'Logs de Atividades', 'Política de Privacidade']
    },
    {
      title: 'Integrações',
      description: 'Conexão com outros serviços',
      icon: Share2,
      items: ['WhatsApp Business', 'Sistema de Pagamentos', 'Redes Sociais']
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingOptions.map((option, index) => (
          <div
            key={index}
            className="group border rounded-lg p-4 hover:border-gray-300 transition-all cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100">
                <option.icon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1 flex items-center justify-between">
                  {option.title}
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </h3>
                <p className="text-sm text-gray-500 mb-2">{option.description}</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {option.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}