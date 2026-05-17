import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  hint?: ReactNode;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction, hint }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/10 to-purple-100 grid place-items-center mb-4 text-secondary">
        {icon ?? <Sparkles size={26} />}
      </div>
      <h3 className="text-base font-bold text-neutral-800">{title}</h3>
      {description && <p className="text-sm text-neutral-500 mt-1.5 max-w-sm leading-relaxed">{description}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm mt-4">{actionLabel}</button>
      )}
      {hint && (
        <div className="mt-4 text-[11px] text-neutral-400 flex items-center gap-1.5 max-w-md leading-snug">
          <Sparkles size={11} className="text-purple-500 flex-shrink-0" />
          {hint}
        </div>
      )}
    </div>
  );
}
