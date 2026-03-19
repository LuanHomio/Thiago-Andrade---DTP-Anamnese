import React from 'react';

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, description, children, icon }) => {
  return (
    <section className="mb-12 border-b border-brand-lightGrey pb-8 last:border-0">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-brand-black mb-2 flex items-center gap-2">
          {icon && <span className="text-brand-red">{icon}</span>}
          {title}
        </h2>
        {description && (
          <p className="text-brand-darkGrey text-sm md:text-base opacity-80 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
};