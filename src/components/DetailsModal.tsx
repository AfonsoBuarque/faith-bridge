import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, MessageSquare, Briefcase, UserCheck, Church, Users, CreditCard } from 'lucide-react';

interface PersonDetails {
  type: 'member' | 'visitor';
  nome?: string;
  nome_completo?: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  celular?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  data_visita?: string;
  data_nascimento?: string;
  estado_civil?: string;
  profissao?: string;
  como_conheceu?: string;
  observacoes?: string;
  receber_devocional?: string;
  receber_agenda?: string;
  // Member specific fields
  data_conversao?: string;
  data_batismo?: string;
  data_membro?: string;
  cargo_ministerial?: string;
  departamento?: string;
  dizimista?: boolean;
  foto_url?: string;
}

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: PersonDetails;
}

export function DetailsModal({ isOpen, onClose, person }: DetailsModalProps) {
  if (!isOpen || !person) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {person.foto_url ? (
              <img
                src={person.foto_url}
                alt="Foto"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {person.nome_completo || person.nome}
              </h2>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                person.type === 'member' 
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {person.type === 'member' ? 'Membro' : 'Visitante'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações de Contato */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações de Contato</h3>
            <div className="space-y-3">
              {person.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{person.email}</span>
                </div>
              )}

              {person.telefone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{person.telefone}</span>
                </div>
              )}

              {person.celular && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{person.celular} (Celular)</span>
                </div>
              )}

              {person.whatsapp && (
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{person.whatsapp} (WhatsApp)</span>
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          {(person.endereco || person.bairro || person.cidade || person.estado) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Endereço</h3>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div className="text-gray-600">
                  <p>{person.endereco}</p>
                  <p>
                    {[person.bairro, person.cidade, person.estado]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informações Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Pessoais</h3>
            <div className="space-y-3">
              {person.data_nascimento && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    Nascimento: {formatDate(person.data_nascimento)}
                  </span>
                </div>
              )}

              {person.estado_civil && (
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    Estado Civil: {person.estado_civil}
                  </span>
                </div>
              )}

              {person.profissao && (
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    Profissão: {person.profissao}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Informações Eclesiásticas (apenas para membros) */}
          {person.type === 'member' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Eclesiásticas</h3>
              <div className="space-y-3">
                {person.data_conversao && (
                  <div className="flex items-center space-x-3">
                    <UserCheck className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Conversão: {formatDate(person.data_conversao)}
                    </span>
                  </div>
                )}

                {person.data_batismo && (
                  <div className="flex items-center space-x-3">
                    <Church className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Batismo: {formatDate(person.data_batismo)}
                    </span>
                  </div>
                )}

                {person.data_membro && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Membro desde: {formatDate(person.data_membro)}
                    </span>
                  </div>
                )}

                {person.cargo_ministerial && (
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Cargo: {person.cargo_ministerial}
                    </span>
                  </div>
                )}

                {person.departamento && (
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Departamento: {person.departamento}
                    </span>
                  </div>
                )}

                {person.dizimista !== undefined && (
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Dizimista: {person.dizimista ? 'Sim' : 'Não'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Informações Adicionais (para visitantes) */}
          {person.type === 'visitor' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Adicionais</h3>
              <div className="space-y-3">
                {person.data_visita && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Primeira Visita: {formatDate(person.data_visita)}
                    </span>
                  </div>
                )}

                {person.como_conheceu && (
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Como conheceu: {person.como_conheceu}
                    </span>
                  </div>
                )}

                {person.receber_devocional && (
                  <div className="flex items-center space-x-3">
                    <Church className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Receber Devocional: {person.receber_devocional}
                    </span>
                  </div>
                )}

                {person.receber_agenda && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Receber Agenda: {person.receber_agenda}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Observações */}
          {person.observacoes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Observações</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{person.observacoes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}