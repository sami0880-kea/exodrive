import React from "react";

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  className?: string;
  rows?: number;
  style?: React.CSSProperties;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  touched,
  required = false,
  className = "",
  rows = 6,
  style,
}) => {
  const hasError = error && touched;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={style}
        className={`w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 ${
          hasError ? "border-red-500" : "border-gray-300"
        }`}
      />
      {hasError && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default FormTextarea;
