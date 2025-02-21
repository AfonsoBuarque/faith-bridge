import React from 'react';

interface FormInputProps {
  label: string;
  type: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  registration?: any;
}

export function FormInput({ 
  label, 
  type, 
  value, 
  onChange, 
  error, 
  registration 
}: FormInputProps) {
  // If registration is provided, use it, otherwise use value/onChange
  const inputProps = registration || { value, onChange };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
        {...inputProps}
      />
      {error && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
    </div>
  );
}