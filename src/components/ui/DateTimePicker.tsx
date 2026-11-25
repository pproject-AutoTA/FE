import { FormField } from "./FormField";

export function DateTimePicker({ label, value, onChange, error }: { label: string; value: string; onChange: (v: string) => void; error?: string }) {
  return <FormField label={label} type="datetime-local" value={value} onChange={(e) => onChange(e.target.value)} error={error} />;
}
