import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-slate-700">
      {label ? <span className="font-medium text-slate-900">{label}</span> : null}
      <input
        className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-card transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${className}`}
        {...props}
      />
    </label>
  );
}
