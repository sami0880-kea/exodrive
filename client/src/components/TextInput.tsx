import React from "react";
import { cn } from "@/lib/utils";
import { Callout } from "@radix-ui/themes";
import { AlertCircle, LucideIcon } from "lucide-react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  containerClassName?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    { className, label, error, icon: Icon, containerClassName, ...props },
    ref
  ) => {
    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <Icon size={16} />
            </div>
          )}
          <input
            className={cn(
              "w-full rounded-md border border-gray-300 px-4 py-2 text-sm",
              "focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500",
              "placeholder:text-gray-400",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              Icon && "pl-10",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <Callout.Root
            color="red"
            role="alert"
            className="p-2 rounded-md border flex items-center gap-2 text-sm"
          >
            <Callout.Icon>
              <AlertCircle size={16} />
            </Callout.Icon>
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
