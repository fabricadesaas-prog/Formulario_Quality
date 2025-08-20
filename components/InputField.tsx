import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  isLoading?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, isLoading = false, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-blue-900/90 mb-2">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          {...props}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <i className="fas fa-spinner fa-spin text-orange-500"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;