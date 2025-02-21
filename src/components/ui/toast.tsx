import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white break-words`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-75">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}