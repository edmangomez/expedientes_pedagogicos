import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: string;
  helper?: string;
  className?: string;
};

export function Field({ label, name, defaultValue, required, type = "text", helper, className }: FieldProps) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium text-stone-800", className)}>
      <span>
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-4 focus:ring-stone-200"
      />
      {helper && <span className="text-xs font-normal text-stone-500">{helper}</span>}
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  helper,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  helper?: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-stone-800">
      <span>{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-base leading-7 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-4 focus:ring-stone-200"
      />
      {helper && <span className="text-xs font-normal text-stone-500">{helper}</span>}
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-stone-800">
      <span>{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-base text-stone-900 outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
