
import React from 'react';

interface CheckboxGroupProps {
  label: string;
  options: { id: string; value: string; label: string }[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, selectedValues, onChange }) => {
  const handleChange = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelection);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              id={option.id}
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={option.id} className="ml-2 block text-sm text-gray-900">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
