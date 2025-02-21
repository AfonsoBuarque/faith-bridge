import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useAuthContext } from '../contexts/AuthContext';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPARTAMENTO_OPTIONS = [
  'Louvor',
  'Infantil',
  'Jovens',
  'Casais',
  'Missões',
  'Outro'
];

export function MessageModal({ isOpen, onClose }: MessageModalProps) {
  const [departamento, setDepartamento] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuthContext();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departamento || !mensagem.trim()) {
      addToast('Por favor, preencha todos os campos', 'error');
      return;
    }

    if (!user) {
      addToast('Usuário não autenticado', 'error');
      return;
    }

    try {
      setSending(true);
      setSuccess(false);
      
      const payload = {
        user_id: user.id,
        departamento,
        mensagem: mensagem.trim()
      };

      const response = await fetch('https://n8n-n8n-onlychurch.ibnltq.easypanel.host/webhook-test/mensagens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Falha ao enviar mensagem');
      }

      setSuccess(true);
      addToast('Mensagem enviada com sucesso!', 'success');
      
      // Clear form after successful submission
      setDepartamento('');
      setMensagem('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);

    } catch (error: any) {
      console.error('Error sending message:', error);
      addToast(error.message || 'Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
      setSuccess(false);
    } finally {
      setSending(false);
    }
  };

  const handleClear = () => {
    setDepartamento('');
    setMensagem('');
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center">
          <div className="mb-4 text-green-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Mensagem Enviada!</h3>
          <p className="text-gray-600 mb-4">Sua mensagem foi enviada com sucesso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Enviar Mensagem</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <select
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
            >
              <option value="">Selecione um departamento</option>
              {DEPARTAMENTO_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem
            </label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              placeholder="Digite sua mensagem..."
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Limpar
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
              {sending ? <LoadingSpinner /> : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}