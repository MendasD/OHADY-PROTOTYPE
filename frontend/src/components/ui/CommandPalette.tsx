import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, FileText, Receipt, Users, Wallet, BookOpen, Lock, Settings, Sparkles,
  ArrowRight, Hash, Plus, Calculator, Bot, ShoppingCart, Package,
} from 'lucide-react';
import { navModules } from '../../nav/navConfig';

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: React.ElementType;
  group: 'Navigation' | 'Actions' | 'IA';
  action: () => void;
  shortcut?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Génère la liste de commandes
  const items: CommandItem[] = useMemo(() => {
    const navItems: CommandItem[] = navModules.flatMap(mod =>
      mod.children.map(c => ({
        id: `nav-${c.id}`,
        label: c.label,
        hint: `${mod.label}`,
        icon: getIconForModule(mod.icon),
        group: 'Navigation' as const,
        action: () => { navigate(c.path); onClose(); },
      })),
    );

    const actions: CommandItem[] = [
      { id: 'a-saisie', label: "Nouvelle saisie d'écriture", icon: Plus, group: 'Actions',
        action: () => { navigate('/saisie'); onClose(); }, shortcut: '⌘N' },
      { id: 'a-facture', label: 'Nouvelle facture client', icon: Receipt, group: 'Actions',
        action: () => { navigate('/ventes'); onClose(); }, shortcut: '⌘F' },
      { id: 'a-devis', label: 'Nouveau devis', icon: FileText, group: 'Actions',
        action: () => { navigate('/devis'); onClose(); } },
      { id: 'a-rappro', label: 'Importer un relevé bancaire', icon: Wallet, group: 'Actions',
        action: () => { navigate('/rapprochement'); onClose(); } },
      { id: 'a-ocr', label: 'Téléverser une facture fournisseur (OCR)', icon: ShoppingCart, group: 'Actions',
        action: () => { navigate('/achats-inbox'); onClose(); } },
      { id: 'a-cloture', label: 'Lancer la clôture mensuelle', icon: Lock, group: 'Actions',
        action: () => { navigate('/cloture-m'); onClose(); } },
      { id: 'a-tva', label: 'Préparer la déclaration TVA', icon: Calculator, group: 'Actions',
        action: () => { navigate('/tva'); onClose(); } },
    ];

    const ia: CommandItem[] = [
      { id: 'ia-chat', label: 'Demander à l\'Assistant IA', icon: Bot, group: 'IA',
        action: () => { navigate('/intelligence'); onClose(); }, shortcut: '⌘I' },
      { id: 'ia-ano', label: 'Voir les anomalies détectées', icon: Sparkles, group: 'IA',
        action: () => { navigate('/anomalies'); onClose(); } },
      { id: 'ia-ocr', label: 'Lancer une analyse OCR', icon: Sparkles, group: 'IA',
        action: () => { navigate('/ocr'); onClose(); } },
    ];

    return [...actions, ...navItems, ...ia];
  }, [navigate, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(it =>
      it.label.toLowerCase().includes(q) || (it.hint?.toLowerCase().includes(q) ?? false),
    );
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const it of filtered) {
      if (!map.has(it.group)) map.set(it.group, []);
      map.get(it.group)!.push(it);
    }
    return Array.from(map.entries());
  }, [filtered]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
          <Search size={18} className="text-neutral-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher une page, une action, une commande..."
            className="flex-1 bg-transparent outline-none text-sm text-neutral-800 placeholder:text-neutral-400"
          />
          <kbd className="text-[10px] text-neutral-400 font-mono bg-neutral-100 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-neutral-500">
              Aucun résultat pour <span className="font-semibold">« {query} »</span>
            </div>
          )}
          {groups.map(([group, items]) => (
            <div key={group} className="py-2">
              <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
                {group === 'Navigation' && <Hash size={11} />}
                {group === 'Actions' && <Plus size={11} />}
                {group === 'IA' && <Sparkles size={11} className="text-purple-500" />}
                {group}
              </div>
              {items.slice(0, 10).map(it => {
                const Icon = it.icon;
                return (
                  <button
                    key={it.id}
                    onClick={it.action}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-secondary/5 transition-colors text-left group"
                  >
                    <Icon size={15} className="text-neutral-500 group-hover:text-secondary flex-shrink-0" />
                    <span className="text-sm text-neutral-800 flex-1 truncate">{it.label}</span>
                    {it.hint && <span className="text-[11px] text-neutral-400">{it.hint}</span>}
                    {it.shortcut && (
                      <kbd className="text-[10px] text-neutral-400 font-mono bg-neutral-100 px-1.5 py-0.5 rounded">{it.shortcut}</kbd>
                    )}
                    <ArrowRight size={11} className="text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-[10px] text-neutral-500">
          <span>{filtered.length} résultats</span>
          <span className="flex items-center gap-2">
            <kbd className="font-mono bg-white border border-neutral-200 px-1.5 py-0.5 rounded">↑↓</kbd> naviguer
            <kbd className="font-mono bg-white border border-neutral-200 px-1.5 py-0.5 rounded">↵</kbd> ouvrir
          </span>
        </div>
      </div>
    </div>
  );
}

function getIconForModule(iconName: string): React.ElementType {
  const map: Record<string, React.ElementType> = {
    LayoutDashboard: BookOpen, BookOpen, Wallet, ShoppingCart, Package,
    Users, Archive: Package, Bot, Settings, Percent: Calculator, Lock,
  };
  return map[iconName] || BookOpen;
}
