import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormCheckboxProps {
  label: string;
  registration: UseFormRegisterReturn;
}

export function FormCheckbox({ label, registration }: FormCheckboxProps) {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        className="rounded border-gray-300 text-gray-800 focus:ring-gray-800"
        {...registration}
      />
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  );
}