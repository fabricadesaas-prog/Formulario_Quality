import React from 'react';

interface CheckboxGroupProps {
  label: string;
  options: { id: string; value: string; label: string }[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  required?: boolean;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, selectedValues, onChange, required = false }) => {
  const handleChange = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelection);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-blue-900/90 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              id={option.id}
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor={option.id} className="ml-2 block text-sm font-medium text-blue-900/90">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;