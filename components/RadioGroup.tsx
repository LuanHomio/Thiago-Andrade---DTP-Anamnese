import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, value, onChange, required }) => {
  return (
    <div className="w-full">
      <label className="block text-brand-black font-medium mb-3">
        {label}
        {required && <span className="text-brand-red ml-1">*</span>}
      </label>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
              value === option.value ? 'border-brand-red bg-red-50/10 ring-1 ring-brand-red' : 'border-brand-lightGrey'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="w-5 h-5 text-brand-red focus:ring-brand-red border-gray-300"
              required={required}
            />
            <span className="ml-3 text-brand-darkGrey">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};