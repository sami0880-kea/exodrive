import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const CustomSelect = ({
  value,
  onValueChange,
  options,
  placeholder = "Vælg",
  disabled = false,
  label,
  className,
}: CustomSelectProps) => {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <Select.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <Select.Trigger
          className={cn(
            "inline-flex items-center justify-between px-4 py-2 text-base w-full",
            "bg-white hover:bg-gray-50 focus:outline-none",
            "border border-gray-200 rounded-md",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "data-[state=open]:ring-1 data-[state=open]:ring-red-500 data-[state=open]:border-red-500"
          )}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="overflow-hidden bg-white/95 backdrop-blur-sm rounded-md shadow-lg border border-gray-200 z-50"
            position="popper"
            sideOffset={5}
            style={{
              minWidth: "var(--radix-select-trigger-width)",
            }}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white cursor-default">
              <ChevronDown className="w-4 h-4 rotate-180" />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-1 max-h-[300px] overflow-y-auto">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex items-center px-4 py-2 text-base rounded-md cursor-pointer select-none outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white cursor-default">
              <ChevronDown className="w-4 h-4" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default CustomSelect;
