import { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div className={`rounded-3xl border border-white/70 bg-white/85 p-6 shadow-card backdrop-blur-xl ${className}`} {...props} />
  );
}
