import React from 'react';

interface FormSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, children }) => {
  return (
    <section>
      <div className="flex items-center">
        <i className={`fas ${icon} text-orange-500 text-lg w-5 text-center mr-3`}></i>
        <h2 className="text-xl font-semibold text-blue-900 tracking-wide">{title}</h2>
      </div>
      <hr className="mt-2 mb-6 border-t border-orange-200" />
      {children}
    </section>
  );
};

export default FormSection;