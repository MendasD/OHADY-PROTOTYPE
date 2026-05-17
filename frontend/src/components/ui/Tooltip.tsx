import { useState, type ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

interface Props {
  content: ReactNode;
  children?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Inline help icon mode : si pas de children, affiche un ? */
  icon?: boolean;
}

export default function Tooltip({ content, children, position = 'top', icon = false }: Props) {
  const [open, setOpen] = useState(false);

  const placement = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  }[position];

  return (
    <span className="relative inline-flex items-center" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children ?? (icon && <HelpCircle size={11} className="text-neutral-400 hover:text-secondary cursor-help" />)}
      {open && (
        <span
          className={`absolute z-50 ${placement} bg-neutral-800 text-white text-[11px] font-medium rounded-md px-2.5 py-1.5 max-w-xs leading-snug pointer-events-none shadow-lg whitespace-pre-line`}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
}
