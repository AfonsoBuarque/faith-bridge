import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuthContext } from '../../contexts/AuthContext';

interface Child {
  id: string;
  nome_completo: string;
  turma_id: string | null;
}

interface Class {
  id: string;
  nome: string;
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: Child[];
  classes: Class[];
}

interface AttendanceRecord {
  childId: string;
  present: boolean;
  observations: string;
}

export function AttendanceModal({ isOpen, onClose, children, classes }: AttendanceModalProps) {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuthContext();

  if (!isOpen) return null;

  const handleAttendanceChange = (childId: string, present: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        childId,
        present,
        observations: prev[childId]?.observations || ''
      }
    }));
  };

  const handleObservationsChange = (childId: string, observations: string) => {
    setAttendance(prev => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        childId,
        present: prev[childId]?.present || false,
        observations
      }
    }));
  };

  const handleSubmit = async () => {
    if (!user || !selectedClass || !date) {
      addToast('Selecione uma turma e data', 'error');
      return;
    }

    try {
      setSaving(true);

      const records = Object.values(attendance).map(record => ({
        user_id: user.id,
        crianca_id: record.childId,
        turma_id: selectedClass,
        data_aula: date,
        presente: record.present,
        observacoes: record.observations
      }));

      const { error } = await supabase
        .from('presenca_criancas')
        .insert(records);

      if (error) throw error;

      addToast('Presenças registradas com sucesso!', 'success');
      onClose();
    } catch (error) {
      console.error('Error saving attendance:', error);
      addToast('Erro ao registrar presenças', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredChildren = selectedClass
    ? children.filter(child => child.turma_id === selectedClass)
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Registrar Presença</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turma
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Selecione uma turma</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              />
            </div>
          </div>

          {selectedClass ? (
            filteredChildren.length > 0 ? (
              <div className="space-y-4">
                {filteredChildren.map(child => (
                  <div key={child.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={attendance[child.id]?.present || false}
                            onChange={(e) => handleAttendanceChange(child.id, e.target.checked)}
                            className="rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                          />
                          <span className="text-gray-900 font-medium">{child.nome_completo}</span>
                        </label>
                      </div>
                      {attendance[child.id]?.present && (
                        <span className="text-green-600 flex items-center">
                          <Check className="h-5 w-5 mr-1" />
                          Presente
                        </span>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Observações"
                        value={attendance[child.id]?.observations || ''}
                        onChange={(e) => handleObservationsChange(child.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Nenhuma criança cadastrada nesta turma</p>
            )
          ) : (
            <p className="text-center text-gray-500">Selecione uma turma para registrar presenças</p>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !selectedClass || filteredChildren.length === 0}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {saving ? <LoadingSpinner /> : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}