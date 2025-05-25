import React from "react";

interface FormInputProps {
  label: string;
  type?: "text" | "tel" | "email" | "number";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  className?: string;
  suffix?: string;
  min?: string | number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  touched,
  required = false,
  className = "",
  suffix,
  min,
}) => {
  const hasError = error && touched;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 ${
            hasError ? "border-red-500" : "border-gray-300"
          }`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </div>
        )}
      </div>
      {hasError && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default FormInput;
