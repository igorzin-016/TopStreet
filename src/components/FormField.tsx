import React from "react";
import type { LucideIcon } from "lucide-react";

const baseInput =
  "w-full rounded-lg bg-[#201F1D] text-[#F3F1EA] placeholder-[#6E6A60] text-[15px] py-3 outline-none " +
  "border transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

const borderClasses = (hasError: boolean) =>
  hasError
    ? "border-[#E42313] focus:border-[#E42313] focus:ring-1 focus:ring-[#E42313]/40"
    : "border-white/10 focus:border-[#FFB627] focus:ring-1 focus:ring-[#FFB627]/30";

interface FieldLabelProps {
  id: string;
  label: string;
  required?: boolean;
}

function FieldLabel({ id, label, required }: FieldLabelProps) {
  return (
    <label
      htmlFor={id}
      className="text-xs font-semibold uppercase tracking-wide text-[#A6A196]"
    >
      {label}
      {required && <span className="text-[#E42313] ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span
      id={`${id}-error`}
      role="alert"
      className="text-xs text-[#E42313] leading-tight"
    >
      {message}
    </span>
  );
}

export interface FormFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
  containerClassName?: string;
}

export function FormField({
  id,
  label,
  icon: Icon,
  error,
  required,
  className,
  containerClassName,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName ?? ""}`}>
      <FieldLabel id={id} label={label} required={required} />
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6A60]"
          />
        )}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${baseInput} ${borderClasses(!!error)} ${
            Icon ? "pl-9 pr-3" : "px-3"
          } ${className ?? ""}`}
          {...inputProps}
        />
      </div>
      <FieldError id={id} message={error} />
    </div>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export function SelectField({
  id,
  label,
  icon: Icon,
  error,
  required,
  options,
  placeholder = "Selecione",
  className,
  containerClassName,
  ...selectProps
}: SelectFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName ?? ""}`}>
      <FieldLabel id={id} label={label} required={required} />
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6A60]"
          />
        )}
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${baseInput} ${borderClasses(!!error)} ${
            Icon ? "pl-9 pr-3" : "px-3"
          } appearance-none ${className ?? ""}`}
          {...selectProps}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <FieldError id={id} message={error} />
    </div>
  );
}


