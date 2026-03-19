import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  subLabel?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, subLabel, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-brand-black font-medium mb-1">
        {label}
        {props.required && <span className="text-brand-red ml-1">*</span>}
      </label>
      {subLabel && <p className="text-xs text-gray-500 mb-2">{subLabel}</p>}
      <textarea
        className={`w-full p-4 bg-gray-50 border border-brand-lightGrey rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all min-h-[120px] ${className}`}
        {...props}
      />
    </div>
  );
};