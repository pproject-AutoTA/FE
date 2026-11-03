import { Check } from "lucide-react";

export interface StepperProps { steps: string[]; current: number }
export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="cl-stepper">
      {steps.map((s, i) => (
        <div key={s} className={`cl-step${i < current ? " is-done" : i === current ? " is-current" : ""}`}>
          {i < current && <Check size={14} strokeWidth={1.75} aria-hidden />}
          {s}
        </div>
      ))}
    </div>
  );
}
