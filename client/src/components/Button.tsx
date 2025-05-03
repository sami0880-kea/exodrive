import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "default",
      size = "md",
      isLoading = false,
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      default:
        "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 dark:bg-red-700 dark:hover:bg-red-800",
      outline:
        "border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-400 text-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
      ghost:
        "bg-transparent hover:bg-gray-50 focus:ring-gray-400 text-gray-700 dark:text-gray-400 dark:hover:bg-gray-200",
      link: "bg-transparent underline-offset-4 hover:underline text-red-500 hover:text-red-600 focus:ring-red-500",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    };

    const iconSizes = {
      sm: 14,
      md: 16,
      lg: 18,
      icon: 16,
    };

    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-white",
          "disabled:opacity-50 disabled:pointer-events-none",
          "rounded-md",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <Loader2
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin"
            size={iconSizes[size]}
          />
        )}
        <span className={cn(isLoading && "invisible")}>
          {Icon && iconPosition === "left" && !isLoading && (
            <Icon
              size={iconSizes[size]}
              className={cn("mr-2", !children && "mr-0")}
            />
          )}
          {children}
          {Icon && iconPosition === "right" && !isLoading && (
            <Icon
              size={iconSizes[size]}
              className={cn("ml-2", !children && "ml-0")}
            />
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
