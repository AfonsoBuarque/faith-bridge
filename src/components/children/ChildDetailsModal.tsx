import React, { useState } from 'react';
import { X, Baby, Calendar, User, Phone, Mail, Heart, Book, School } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface Class {
  id: string;
  nome: string;
}

interface Child {
  id: string;
  nome_completo: string;
  data_nascimento: string;
  genero: string;
  foto_url: string | null;
  responsavel_1_nome: string;
  responsavel_1_parentesco: string;
  responsavel_1_telefone: string;
  responsavel_1_email: string;
  responsavel_2_nome: string;
  responsavel_2_parentesco: string;
  responsavel_2_telefone: string;
  responsavel_2_email: string;
  alergias: string;
  medicamentos: string;
  condicoes_especiais: string;
  observacoes_medicas: string;
  turma_id: string;
  observacoes: string;
  ativo: boolean;
}

interface ChildDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  classes: Class[];
}

export function ChildDetailsModal({ isOpen, onClose, child, classes }: ChildDetailsModalProps) {
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  if (!isOpen || !child) return null;

  const handleStatusChange = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('criancas')
        .update({ ativo: !child.ativo })
        .eq('id', child.id);

      if (error) throw error;

      addToast(`Criança ${child.ativo ? 'desativada' : 'ativada'} com sucesso!`, ' <boltAction type="file" filePath="src/components/children/ChildDetailsModal.tsx">success');
      onClose();
    } catch (error) {
      console.error('Error updating child status:', error);
      addToast('Erro ao atualizar status', 'error');
    } finally {
      setSaving(false);
    }
  };

  const childClass = classes.find(c => c.id === child.turma_id);
  const age = Math.floor(
    (new Date().getTime() - new Date(child.data_nascimento).getTime()) / 
    (1000 * 60 * 60 * 24 * 365.25)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-4">
            {child.foto_url ? (
              <img
                src={child.foto_url}
                alt={child.nome_completo}
                className="h-16 w-16 rounded-full object-cover flex-shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <Baby className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{child.nome_completo}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                child.ativo
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {child.ativo ? 'Ativo' : 'Inativo'}
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

        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Baby className="h-5 w-5 mr-2" />
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Idade</span>
                <p className="text-gray-900">{age} anos</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Data de Nascimento</span>
                <p className="text-gray-900">
                  {new Date(child.data_nascimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Gênero</span>
                <p className="text-gray-900">{child.genero || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Turma</span>
                <p className="text-gray-900">{childClass?.nome || '-'}</p>
              </div>
            </div>
          </div>

          {/* Primary Guardian */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Responsável Principal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Nome</span>
                <p className="text-gray-900">{child.responsavel_1_nome}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Parentesco</span>
                <p className="text-gray-900">{child.responsavel_1_parentesco}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Telefone</span>
                <p className="text-gray-900">{child.responsavel_1_telefone}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email</span>
                <p className="text-gray-900">{child.responsavel_1_email || '-'}</p>
              </div>
            </div>
          </div>

          {/* Secondary Guardian */}
          {(child.responsavel_2_nome || child.responsavel_2_telefone) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Responsável Secundário
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Nome</span>
                  <p className="text-gray-900">{child.responsavel_2_nome || '-'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Parentesco</span>
                  <p className="text-gray-900">{child.responsavel_2_parentesco || '-'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Telefone</span>
                  <p className="text-gray-900">{child.responsavel_2_telefone || '-'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="text-gray-900">{child.responsavel_2_email || '-'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Informações Médicas
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Alergias</span>
                <p className="text-gray-900">{child.alergias || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Medicamentos</span>
                <p className="text-gray-900">{child.medicamentos || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Condições Especiais</span>
                <p className="text-gray-900">{child.condicoes_especiais || '-'}</p>
              </div>
              {child.observacoes_medicas && (
                <div>
                  <span className="text-sm text-gray-500">Observações Médicas</span>
                  <p className="text-gray-900">{child.observacoes_medicas}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {child.observacoes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Book className="h-5 w-5 mr-2" />
                Observações Gerais
              </h3>
              <p className="text-gray-900">{child.observacoes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Fechar
            </button>
            <button
              onClick={handleStatusChange}
              disabled={saving}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {saving ? (
                <LoadingSpinner />
              ) : child.ativo ? (
                'Desativar'
              ) : (
                'Ativar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}