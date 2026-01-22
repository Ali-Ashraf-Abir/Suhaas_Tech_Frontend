import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  icon?: React.ComponentType<{ className?: string }>;
  options: SelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  name: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  icon: Icon,
  options,
  value,
  onChange,
  error,
  name,
  placeholder = 'Select an option',
}) => {
  return (
    <div className="space-y-1">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${
            error
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 ml-1">{error}</p>}
    </div>
  );
};