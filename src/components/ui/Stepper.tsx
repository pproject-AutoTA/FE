import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface StepperProps {
  steps: string[];
  current: number;
}
export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex gap-2.5">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`flex h-[50px] flex-1 items-center justify-center gap-1.5 rounded-lg text-[15px] leading-none font-bold ${
            i < current
              ? "bg-success-bg text-success-fg"
              : i === current
                ? "bg-blue-600 text-white"
                : "bg-neutral-bg text-neutral-fg"
          }`}
        >
          {i < current && <Check size={14} strokeWidth={1.75} aria-hidden />}
          {s}
        </div>
      ))}
    </div>
  );
}

interface ProgressStepperProps {
  steps: { title: string; description: string; icon: LucideIcon }[];
  current: number;
  label: string;
  onChange: (step: number) => void;
  disabled?: boolean;
}

export function ProgressStepper({
  steps,
  current,
  label,
  onChange,
  disabled,
}: ProgressStepperProps) {
  return (
    <ol
      aria-label={label}
      className="m-0 grid list-none gap-4 p-5 min-[1000px]:grid-flow-col min-[1000px]:auto-cols-fr min-[1000px]:gap-5"
    >
      {steps.map(({ title, description, icon: Icon }, index) => {
        const active = index === current;
        const complete = index < current;
        const iconTone = active
          ? "border-blue-600 bg-blue-600 text-white ring-4 ring-info-bg"
          : complete
            ? "border-info-border bg-info-bg text-info-text"
            : "border-border bg-neutral-bg text-fg-secondary";

        return (
          <li key={title} className="flex min-w-0 items-center gap-3 min-[1000px]:gap-4">
            <button
              type="button"
              aria-current={active ? "step" : undefined}
              disabled={disabled}
              className="flex min-w-0 cursor-pointer items-center gap-3 rounded-lg border-0 bg-transparent p-1 text-left hover:bg-info-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-default min-[1000px]:gap-4"
              onClick={() => onChange(index)}
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-full border min-[1000px]:size-14 ${iconTone}`}
              >
                {complete ? <Check size={23} aria-hidden /> : <Icon size={23} aria-hidden />}
              </span>
              <span className={active ? "text-blue-600" : "text-fg-secondary"}>
                <span className="block text-[13px] font-bold tracking-wide">STEP {index + 1}</span>
                <b className="block text-sm min-[1000px]:text-base">{title}</b>
                <span className="block text-[13px]">{description}</span>
              </span>
            </button>
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={`hidden h-0.5 min-w-4 flex-1 min-[1000px]:block ${complete ? "bg-blue-600" : "bg-slate-400"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
