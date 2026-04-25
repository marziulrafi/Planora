import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "free" | "paid" | "pending" | "approved";
}

const badgeStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary-100 text-primary-700 border border-primary-200",
  secondary: "bg-secondary-100 text-secondary-700 border border-secondary-200",
  outline: "bg-white text-muted border border-slate-200",
  free: "bg-green-100 text-green-700 border border-green-200",
  paid: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  pending: "bg-gray-100 text-gray-700 border border-gray-200",
  approved: "bg-blue-100 text-blue-700 border border-blue-200",
};

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${badgeStyles[variant]} ${className}`}
      {...props}
    />
  );
}
