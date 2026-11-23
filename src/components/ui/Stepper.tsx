import { Check } from "lucide-react";

export interface StepperProps { steps: string[]; current: number }
export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex gap-2.5">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`flex h-[50px] flex-1 items-center justify-center gap-1.5 rounded-lg text-[15px] leading-none font-bold ${
            i < current ? "bg-success-bg text-success-fg" : i === current ? "bg-blue-600 text-white" : "bg-neutral-bg text-neutral-fg"
          }`}
        >
          {i < current && <Check size={14} strokeWidth={1.75} aria-hidden />}
          {s}
        </div>
      ))}
    </div>
  );
}
