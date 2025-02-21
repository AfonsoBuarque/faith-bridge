import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (logoUrl: string) => void;
}

export function LogoUploadModal({ isOpen, onClose, onSuccess }: LogoUploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(`logo-${Date.now()}`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(data.path);

      onSuccess(publicUrl);
      addToast('Logo atualizado com sucesso!', 'success');
      onClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      addToast(error.message || 'Erro ao fazer upload do logo', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Upload do Logo da Igreja</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {preview ? (
            <div className="mb-4">
              <img src={preview} alt="Preview" className="max-h-48 mx-auto" />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Clique para selecionar ou arraste o logo</p>
              <p className="text-sm text-gray-500">PNG, JPG até 2MB</p>
            </div>
          )}

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="hidden"
            id="logo-upload"
          />
          
          <label
            htmlFor="logo-upload"
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Enviando...
              </>
            ) : (
              'Selecionar Logo'
            )}
          </label>
        </div>
      </div>
    </div>
  );
}