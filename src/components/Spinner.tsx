type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  centered?: boolean;
};

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export default function Spinner({
  size = "md",
  className = "",
  centered = false,
}: SpinnerProps) {
  const spinner = (
    <span
      className={`inline-block animate-spin rounded-full border-slate-300 border-t-slate-700 ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    />
  );

  if (centered) {
    return (
      <div className="flex min-h-[220px] items-center justify-center" role="status" aria-live="polite">
        {spinner}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center justify-center" role="status" aria-live="polite">
      {spinner}
    </span>
  );
}
