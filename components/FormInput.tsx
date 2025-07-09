import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/app/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

export function FormInput({
  id,
  label,
  error,
  registration,
  type = "text",
  className,
  ...rest
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-black dark:text-white font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...registration}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
