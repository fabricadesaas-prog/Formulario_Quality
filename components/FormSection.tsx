import React from 'react';

interface FormSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, children }) => {
  return (
    <fieldset className="space-y-4 border-t border-slate-700 pt-5">
      <legend className="text-xl font-semibold text-gray-200 mb-4">
        <i className={`fas ${icon} text-cyan-400 mr-3`}></i>
        {title}
      </legend>
      <div className="space-y-4">
        {children}
      </div>
    </fieldset>
  );
};

export default FormSection;