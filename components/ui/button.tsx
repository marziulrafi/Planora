import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-primary-600 text-white shadow-soft border border-transparent hover:bg-primary-500 focus-visible:ring-primary-400",
  secondary:
    "bg-gradient-to-r from-secondary-500 to-accent-500 text-white shadow-soft hover:from-secondary-400 hover:to-accent-400 focus-visible:ring-secondary-300",
  outline:
    "bg-white text-foreground border border-slate-200 shadow-sm hover:bg-slate-50 focus-visible:ring-primary-300",
  ghost:
    "bg-transparent text-foreground hover:bg-slate-100 focus-visible:ring-primary-300",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-12 px-6 text-sm",
  sm: "h-10 px-4 text-sm",
  lg: "h-14 px-8 text-base",
};

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        className={`inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
