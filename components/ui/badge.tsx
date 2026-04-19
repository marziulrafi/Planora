import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

const badgeStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary-100 text-primary-700 border border-primary-200",
  secondary: "bg-secondary-100 text-secondary-700 border border-secondary-200",
  outline: "bg-white text-muted border border-slate-200",
};

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeStyles[variant]} ${className}`}
      {...props}
    />
  );
}
