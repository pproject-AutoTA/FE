import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { ErrorMessage } from "./ErrorMessage";
import { fieldHelp, fieldLabel, inputWrap } from "./classes";

/* ============ Select ============
   브라우저 기본 <select> 대신 직접 만든 드롭다운(listbox).
   키보드: ↑ ↓ 이동 · Enter/Space 선택 · Esc 닫기 · Home/End 처음/끝 */
export interface SelectProps<V extends string> {
  label: string;
  value: V;
  onChange: (v: V) => void;
  options: { value: V; label: string }[];
  help?: string;
  error?: string;
}
export function Select<V extends string>({
  label,
  value,
  onChange,
  options,
  help,
  error,
}: SelectProps<V>) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const [active, setActive] = useState(selectedIndex);

  // 바깥을 누르면 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const openMenu = () => {
    setActive(selectedIndex);
    setOpen(true);
  };
  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!open) return openMenu();
        const step = e.key === "ArrowDown" ? 1 : -1;
        setActive((a) => (a + step + options.length) % options.length);
        break;
      }
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openMenu();
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div className="flex flex-col" ref={rootRef}>
      <label className={fieldLabel} htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <button
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
          aria-invalid={!!error}
          className={`${inputWrap(!!error)} w-full cursor-pointer text-left ${open && !error ? "border-blue-600 shadow-ring" : ""}`}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
        >
          <span className="min-w-0 flex-1 truncate text-base leading-6 text-fg">
            {options[selectedIndex]?.label}
          </span>
          <ChevronDown
            size={20}
            strokeWidth={1.75}
            aria-hidden
            className={`flex-none transition-transform duration-150 ${open ? "rotate-180 text-blue-600" : ""}`}
          />
        </button>

        {open && (
          <ul
            id={`${id}-list`}
            role="listbox"
            aria-labelledby={id}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute top-[calc(100%+8px)] right-0 left-0 z-20 m-0 box-border grid list-none gap-0.5 rounded-[14px] border border-border bg-surface p-1.5 shadow-lg"
          >
            {options.map((o, i) => {
              const selected = i === selectedIndex;
              return (
                <li
                  key={o.value}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={[
                    "flex h-11 cursor-pointer items-center justify-between rounded-[10px] px-3.5 text-[15px] leading-5 transition-colors duration-100",
                    selected
                      ? "bg-blue-50 font-bold text-blue-600"
                      : i === active
                        ? "bg-bg text-fg"
                        : "text-fg-body",
                  ].join(" ")}
                >
                  {o.label}
                  {selected && <Check size={18} strokeWidth={2} aria-hidden />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        help && <div className={fieldHelp}>{help}</div>
      )}
    </div>
  );
}
