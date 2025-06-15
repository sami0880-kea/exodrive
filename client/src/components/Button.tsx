import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading,
      children,
      disabled,
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const sizeStyles = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
    };
    const variantStyles = {
      default:
        "bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-500",
      outline:
        "border-2 border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-gray-400 focus-visible:ring-gray-500",
      ghost: "text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {Icon && iconPosition === "left" && !isLoading && (
          <Icon size={16} className={cn("mr-2", !children && "mr-0")} />
        )}
        {children}
        {Icon && iconPosition === "right" && !isLoading && (
          <Icon size={16} className={cn("ml-2", !children && "ml-0")} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
