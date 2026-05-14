import { useMemo, useState } from 'react';
import {
  UploadCloud, CheckCircle2, Sparkles, AlertCircle, HelpCircle,
  FileText, Building2, Filter, ChevronDown,
} from 'lucide-react';
import { bankAccounts, reconciliationItems, fmtXOF } from '../data/mockData';
import type { ReconciliationItem } from '../types';

type Status = 'exact' | 'ia_proposed' | 'uncertain' | 'manual_required';
type FilterValue = 'all' | Status;

const STATUS_META: Record<Status, { label: string; tone: string; color: string; bg: string; border: string; Icon: typeof CheckCircle2 }> = {
  exact:           { label: 'Rapprochée',        tone: 'text-green-700',  color: '#27AE60', bg: 'bg-green-50',  border: 'border-green-200',  Icon: CheckCircle2 },
  ia_proposed:     { label: 'Proposée par l\'IA', tone: 'text-blue-700',   color: '#2980B9', bg: 'bg-blue-50',   border: 'border-blue-200',   Icon: Sparkles },
  uncertain:       { label: 'Incertain',          tone: 'text-orange-700', color: '#F39C12', bg: 'bg-orange-50', border: 'border-orange-200', Icon: HelpCircle },
  manual_required: { label: 'Saisie manuelle',    tone: 'text-red-700',    color: '#E74C3C', bg: 'bg-red-50',    border: 'border-red-200',    Icon: AlertCircle },
};

export default function Rapprochement() {
  const [account, setAccount] = useState(bankAccounts[0].id);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    const out: Record<Status, number> = { exact: 0, ia_proposed: 0, uncertain: 0, manual_required: 0 };
    reconciliationItems.forEach(r => { out[r.matchStatus]++; });
    return out;
  }, []);

  const filtered = filter === 'all'
    ? reconciliationItems
    : reconciliationItems.filter(r => r.matchStatus === filter);

  const totalCredits = reconciliationItems.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0);
  const totalDebits  = reconciliationItems.filter(r => r.amount < 0).reduce((s, r) => s + Math.abs(r.amount), 0);
  const avgConfidence = Math.round(
    reconciliationItems.reduce((s, r) => s + (r.confidence ?? 0), 0) / reconciliationItems.length,
  );

  const greenIds = reconciliationItems.filter(r => r.matchStatus === 'exact').map(r => r.id);
  const toggle = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const selectedAccount = bankAccounts.find(a => a.id === account)!;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary">Rapprochement bancaire</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Importez vos relevés, l'IA propose les écritures, vous validez.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={account}
            onChange={e => setAccount(e.target.value)}
            className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
          >
            {bankAccounts.map(a => (
              <option key={a.id} value={a.id}>{a.bank} — {a.name}</option>
            ))}
          </select>
          <button className="btn btn-primary btn-sm">
            <UploadCloud size={13} /> Importer un relevé
          </button>
        </div>
      </div>

      {/* Account summary + Import zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: selectedAccount.color }}>
                {selectedAccount.bank.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-800">{selectedAccount.name}</div>
                <div className="text-xs text-neutral-500">{selectedAccount.bank} · {selectedAccount.accountNumber}</div>
              </div>
            </div>
            <span className="badge badge-blue text-[10px]">
              <Sparkles size={9} /> Relevé du 03 au 13 mai 2026
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Solde compte" value={fmtXOF(selectedAccount.balance)} tone="primary" />
            <Stat label="Crédits relevé" value={fmtXOF(totalCredits)} tone="success" />
            <Stat label="Débits relevé" value={`- ${fmtXOF(totalDebits)}`} tone="danger" />
            <Stat label="Confiance IA moy." value={`${avgConfidence} %`} tone="secondary" />
          </div>
        </div>

        <div className="card border-2 border-dashed border-neutral-200 bg-neutral-50/50 flex flex-col items-center justify-center text-center">
          <UploadCloud size={28} className="text-secondary mb-2" />
          <div className="text-sm font-semibold text-neutral-700">Glissez votre relevé</div>
          <div className="text-xs text-neutral-500 mt-1 max-w-xs">
            CSV, Excel ou PDF. Sources reconnues : SGBS, CBAO, Ecobank, Wave, Orange Money…
          </div>
          <button className="btn btn-outline btn-sm mt-3">
            <UploadCloud size={12} /> Choisir un fichier
          </button>
        </div>
      </div>

      {/* Filter chips + actions */}
      <div className="card-sm flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterChip active={filter === 'all'} count={reconciliationItems.length} onClick={() => setFilter('all')} label="Toutes" />
          {(Object.keys(STATUS_META) as Status[]).map(s => (
            <FilterChip
              key={s}
              active={filter === s}
              count={counts[s]}
              color={STATUS_META[s].color}
              onClick={() => setFilter(s)}
              label={STATUS_META[s].label}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm">
            <Filter size={12} /> Période, tiers…
          </button>
          <button
            onClick={() => setSelected(new Set(greenIds))}
            className="btn btn-outline btn-sm"
          >
            <CheckCircle2 size={12} /> Sélectionner les rapprochées ({counts.exact})
          </button>
          <button
            disabled={selected.size === 0}
            className={`btn btn-sm ${selected.size === 0 ? 'btn-outline opacity-50 cursor-not-allowed' : 'btn-primary'}`}
          >
            Valider en lot ({selected.size})
          </button>
        </div>
      </div>

      {/* Lines */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700">Opérations du relevé · {filtered.length}</h3>
          <span className="badge badge-blue text-[10px]"><Sparkles size={9} /> Analyse Textract + Claude</span>
        </div>
        <div className="divide-y divide-neutral-50">
          {filtered.map(line => (
            <ReconRow key={line.id} item={line} selected={selected.has(line.id)} onToggle={() => toggle(line.id)} />
          ))}
        </div>

        {/* Recap */}
        <div className="px-5 py-4 border-t border-neutral-100 bg-neutral-50/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <Recap label="Solde comptable" value={fmtXOF(selectedAccount.balance - 287_500)} />
          <Recap label="Solde relevé" value={fmtXOF(selectedAccount.balance)} />
          <Recap label="Écart" value="287 500 XOF" tone="warning" />
          <Recap label="Écritures à générer" value={`${counts.ia_proposed} propositions IA`} tone="secondary" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: 'primary' | 'success' | 'danger' | 'secondary' }) {
  const tones = { primary: 'text-primary', success: 'text-success', danger: 'text-danger', secondary: 'text-secondary' };
  return (
    <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-3">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium">{label}</div>
      <div className={`mt-1 text-base font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}

function FilterChip({ label, count, color, active, onClick }: { label: string; count: number; color?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
        active
          ? 'border-secondary bg-secondary/10 text-secondary font-semibold'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
      }`}
    >
      {color && <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
      {label}
      <span className="ml-0.5 bg-neutral-100 rounded-full px-1.5 py-0.5 text-[10px] font-mono">{count}</span>
    </button>
  );
}

function ReconRow({ item, selected, onToggle }: { item: ReconciliationItem; selected: boolean; onToggle: () => void }) {
  const meta = STATUS_META[item.matchStatus];
  const positive = item.amount > 0;
  return (
    <label className="group flex cursor-pointer items-center gap-3 px-5 py-3 hover:bg-neutral-50/50 transition-colors relative">
      <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: meta.color }} />
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="ml-2 h-4 w-4 rounded border-neutral-300 accent-secondary cursor-pointer"
      />
      <div className="w-20 text-xs text-neutral-500 font-mono flex-shrink-0">{item.date}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-mono text-neutral-800 truncate">{item.libelle}</div>
        <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px]">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-medium ${meta.bg} ${meta.tone} border ${meta.border}`}>
            <meta.Icon size={10} /> {meta.label}
          </span>
          {item.confidence !== undefined && item.confidence > 0 && (
            <span className="text-neutral-400">
              <span className={`font-mono font-semibold ${
                item.confidence >= 90 ? 'text-success' : item.confidence >= 70 ? 'text-secondary' : 'text-warning'
              }`}>{item.confidence}%</span> confiance
            </span>
          )}
          {item.proposedEntry && (
            <span className="flex items-center gap-1 text-neutral-500 truncate max-w-xs">
              <FileText size={10} className="flex-shrink-0" />
              <span className="truncate">{item.proposedEntry}</span>
            </span>
          )}
          {item.bankRef && (
            <span className="flex items-center gap-1 text-neutral-400">
              <Building2 size={10} /> {item.bankRef}
            </span>
          )}
        </div>
      </div>
      <div className={`text-right flex-shrink-0 ${positive ? 'text-success' : 'text-neutral-700'}`}>
        <div className="font-mono text-sm font-bold">
          {positive ? '+ ' : '- '}{fmtXOF(Math.abs(item.amount))}
        </div>
      </div>
      <ChevronDown size={14} className="text-neutral-300 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
    </label>
  );
}

function Recap({ label, value, tone }: { label: string; value: string; tone?: 'warning' | 'secondary' }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium">{label}</div>
      <div className={`mt-1 font-mono text-sm font-bold ${
        tone === 'warning' ? 'text-warning' : tone === 'secondary' ? 'text-secondary' : 'text-neutral-800'
      }`}>{value}</div>
    </div>
  );
}
