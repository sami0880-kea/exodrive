import React from "react";
import { Text } from "@radix-ui/themes";

interface ContactInfoProps {
  icon: React.ElementType;
  value: string;
  helperText?: string;
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  icon: Icon,
  value,
  helperText,
  className = "",
}) => {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <div className="flex-shrink-0 mt-1">
        <Icon size={18} className="text-gray-600" />
      </div>
      <div className="flex flex-col space-y-1 flex-1">
        {helperText && (
          <Text size="1" className="text-gray-500 font-bold block">
            {helperText}
          </Text>
        )}
        <Text className="font-medium text-gray-900">{value}</Text>
      </div>
    </div>
  );
};

export default ContactInfo;
