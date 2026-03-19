import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  subLabel?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, subLabel, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-brand-black font-medium mb-1">
        {label}
        {props.required && <span className="text-brand-red ml-1">*</span>}
      </label>
      {subLabel && <p className="text-xs text-gray-500 mb-2">{subLabel}</p>}
      <input
        className={`w-full p-4 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all ${error ? 'border-brand-red' : 'border-brand-lightGrey'} ${className}`}
        {...props}
      />
      {error && <p className="text-brand-red text-xs mt-1">{error}</p>}
    </div>
  );
};