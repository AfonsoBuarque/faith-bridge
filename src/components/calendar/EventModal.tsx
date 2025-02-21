import React, { useState, useEffect } from 'react';
import { X, Users, MapPin, Video, Clock, FileText, Upload, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { FormInput } from '../ui/FormInput';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuthContext } from '../../contexts/AuthContext';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
  onSuccess: () => void;
}

interface EventFormData {
  title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  description?: string;
  type: 'leader' | 'regular' | 'other';
  participants: string[];
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export function EventModal({ isOpen, onClose, event, onSuccess }: EventModalProps) {
  const [saving, setSaving] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { addToast } = useToast();
  const { user } = useAuthContext();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EventFormData>();

  useEffect(() => {
    if (event) {
      Object.entries(event).forEach(([key, value]) => {
        if (key in event) {
          setValue(key as keyof EventFormData, value);
        }
      });
    }
  }, [event, setValue]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EventFormData) => {
    if (!user) return;

    try {
      setSaving(true);

      // Upload attachments if any
      const attachmentUrls = [];
      if (attachments.length > 0) {
        for (const file of attachments) {
          const fileName = `${user.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('calendar-attachments')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('calendar-attachments')
            .getPublicUrl(fileName);

          attachmentUrls.push(publicUrl);
        }
      }

      const eventData = {
        ...data,
        user_id: user.id,
        attachments: attachmentUrls,
        updated_at: new Date().toISOString()
      };

      if (event?.id) {
        const { error } = await supabase
          .from('calendar_events')
          .update(eventData)
          .eq('id', event.id);

        if (error) throw error;
        addToast('Evento atualizado com sucesso!', 'success');
      } else {
        const { error } = await supabase
          .from('calendar_events')
          .insert({
            ...eventData,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        addToast('Evento criado com sucesso!', 'success');
      }

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      addToast('Erro ao salvar evento', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {event ? 'Editar Evento' : 'Novo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <FormInput
            label="Título"
            type="text"
            registration={register('title', { required: 'Título é obrigatório' })}
            error={errors.title?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Data Início"
              type="date"
              registration={register('start_date', { required: 'Data início é obrigatória' })}
              error={errors.start_date?.message}
            />

            <FormInput
              label="Data Fim"
              type="date"
              registration={register('end_date', { required: 'Data fim é obrigatória' })}
              error={errors.end_date?.message}
            />

            <FormInput
              label="Hora Início"
              type="time"
              registration={register('start_time', { required: 'Hora início é obrigatória' })}
              error={errors.start_time?.message}
            />

            <FormInput
              label="Hora Fim"
              type="time"
              registration={register('end_time', { required: 'Hora fim é obrigatória' })}
              error={errors.end_time?.message}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Evento
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                {...register('type', { required: 'Tipo é obrigatório' })}
              >
                <option value="regular">Reunião Regular</option>
                <option value="leader">Reunião com Líderes</option>
                <option value="other">Outro Compromisso</option>
              </select>
            </div>

            <FormInput
              label="Local ou Link"
              type="text"
              registration={register('location', { required: 'Local é obrigatório' })}
              error={errors.location?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                rows={3}
                {...register('description')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participantes
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Adicionar participante"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <Users className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anexos
              </label>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    <span>Adicionar Anexo</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionais
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                rows={3}
                {...register('notes')}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {saving ? <LoadingSpinner /> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}