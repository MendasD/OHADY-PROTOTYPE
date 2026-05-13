import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  RefreshCw, CheckCircle, Clock, AlertTriangle, Plus,
  Upload, Eye, CheckCheck, Download,
} from 'lucide-react';
import { bankAccounts, cashForecast, reconciliationItems } from '../data/mockData';
import { fmtXOF } from '../data/mockData';
import type { BankAccount, ReconciliationItem } from '../types';

const syncIcons: Record<string, React.ElementType> = {
  synced: CheckCircle, pending: Clock, error: AlertTriangle,
};
const syncColors: Record<string, string> = {
  synced: 'text-success', pending: 'text-orange-400', error: 'text-danger',
};

const matchColors: Record<string, { badge: string; label: string; bg: string }> = {
  exact:          { badge: 'badge-green',  label: 'Exact',          bg: 'bg-green-50'  },
  ia_proposed:    { badge: 'badge-blue',   label: 'IA proposé',     bg: 'bg-blue-50'   },
  uncertain:      { badge: 'badge-orange', label: 'Incertain',      bg: 'bg-orange-50' },
  manual_required:{ badge: 'badge-red',    label: 'Manuel requis',  bg: 'bg-red-50'    },
};

export default function Tresorerie() {
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const totalBalance = bankAccounts.reduce((s, a) => s + a.balance, 0);
  const bankOnly = bankAccounts.filter(a => a.type === 'bank').reduce((s, a) => s + a.balance, 0);
  const mobileOnly = bankAccounts.filter(a => a.type === 'mobile_money').reduce((s, a) => s + a.balance, 0);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const AccountCard = ({ account }: { account: BankAccount }) => {
    const SyncIcon = syncIcons[account.syncStatus];
    const isSelected = activeAccount === account.id;
    const typeLabel = account.type === 'bank' ? 'Banque' : account.type === 'mobile_money' ? 'Mobile Money' : 'Caisse';
    return (
      <div
        onClick={() => setActiveAccount(isSelected ? null : account.id)}
        className={`card cursor-pointer transition-all duration-200 hover:shadow-card-md ${isSelected ? 'ring-2 ring-secondary shadow-card-md' : ''}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: account.color }}>
              {account.type === 'caisse' ? '₣' : account.bank.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-800 leading-none">{account.name}</div>
              <div className="text-xs text-neutral-400 mt-0.5">{account.bank}</div>
            </div>
          </div>
          <span className="badge badge-gray text-[10px]">{typeLabel}</span>
        </div>

        <div className="text-xl font-bold text-neutral-800 mb-1">
          {fmtXOF(account.balance)}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-xs">
            <SyncIcon size={12} className={syncColors[account.syncStatus]} />
            <span className="text-neutral-400">{account.lastSync}</span>
          </div>
          {account.pendingReconciliation > 0 && (
            <span className="badge badge-orange text-[10px]">
              {account.pendingReconciliation} op. en attente
            </span>
          )}
        </div>
      </div>
    );
  };

  const MatchRow = ({ item }: { item: ReconciliationItem }) => {
    const style = matchColors[item.matchStatus];
    const isChecked = selectedItems.has(item.id);
    return (
      <tr className={isChecked ? 'bg-blue-50/60' : ''}>
        <td>
          <input type="checkbox" checked={isChecked} onChange={() => toggleItem(item.id)} className="rounded" />
        </td>
        <td className="text-neutral-500">{item.date}</td>
        <td>
          <div className="font-medium text-neutral-800 text-xs">{item.libelle}</div>
          {item.bankRef && <div className="text-[10px] text-neutral-400">{item.bankRef}</div>}
        </td>
        <td className={`font-semibold ${item.amount > 0 ? 'text-success' : 'text-danger'}`}>
          {item.amount > 0 ? '+' : ''}{fmtXOF(item.amount)}
        </td>
        <td>
          <span className={`badge ${style.badge} text-[10px]`}>
            {style.label}
            {item.confidence && item.confidence > 0 ? ` · ${item.confidence}%` : ''}
          </span>
        </td>
        <td>
          {item.proposedEntry ? (
            <div className="text-xs text-neutral-600 max-w-[200px] truncate">{item.proposedEntry}</div>
          ) : (
            <span className="text-xs text-neutral-400 italic">À saisir manuellement</span>
          )}
        </td>
        <td>
          <div className="flex items-center gap-1.5">
            {item.matchStatus !== 'manual_required' && (
              <button className="btn-sm btn btn-success py-1 px-2">
                <CheckCheck size={11} /> Valider
              </button>
            )}
            <button className="btn-sm btn btn-ghost py-1 px-2">
              <Eye size={11} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Position de trésorerie</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Vue consolidée de tous vos comptes · mai 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Upload size={13} /> Importer relevé</button>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> Nouveau compte</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Trésorerie totale', value: totalBalance, color: 'text-secondary', bg: 'bg-blue-50', desc: 'Tous comptes confondus' },
          { label: 'Comptes bancaires', value: bankOnly, color: 'text-neutral-800', bg: 'bg-neutral-50', desc: `${bankAccounts.filter(a=>a.type==='bank').length} comptes actifs` },
          { label: 'Mobile Money & Caisse', value: mobileOnly + bankAccounts.find(a=>a.type==='caisse')!.balance, color: 'text-neutral-800', bg: 'bg-neutral-50', desc: 'Wave · Orange · Caisse' },
        ].map(item => (
          <div key={item.label} className={`card text-center ${item.bg}`}>
            <div className={`text-2xl font-bold ${item.color}`}>{fmtXOF(item.value)}</div>
            <div className="text-sm font-semibold text-neutral-700 mt-1">{item.label}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Accounts grid */}
      <div>
        <h2 className="section-title mb-3">Comptes ({bankAccounts.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {bankAccounts.map(acc => <AccountCard key={acc.id} account={acc} />)}
          <div className="card border-dashed border-2 border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-neutral-100 transition-colors min-h-[140px]">
            <Plus size={22} className="text-neutral-400 mb-2" />
            <span className="text-sm font-medium text-neutral-500">Ajouter un compte</span>
            <span className="text-xs text-neutral-400 mt-0.5">Banque, mobile money ou caisse</span>
          </div>
        </div>
      </div>

      {/* Cash forecast */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Prévision trésorerie — 30 jours</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Flux nets projetés sur la base des factures échues et dépenses planifiées</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm"><Download size={13} /></button>
            <select className="select text-xs py-1.5" style={{ width: 'auto', padding: '6px 10px' }}>
              <option>30 jours</option>
              <option>60 jours</option>
              <option>90 jours</option>
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={cashForecast} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="soldeG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2980B9" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#2980B9" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
            <Tooltip formatter={(v: any) => `${(Number(v)/1000000).toFixed(2)}M XOF`} />
            <Area type="monotone" dataKey="solde" name="Solde" stroke="#2980B9" strokeWidth={2} fill="url(#soldeG)" dot={false} />
            <Area type="monotone" dataKey="encaissements" name="Encaissements" stroke="#27AE60" strokeWidth={1.5} fill="none" strokeDasharray="5 3" dot={false} />
            <Area type="monotone" dataKey="decaissements" name="Décaissements" stroke="#E74C3C" strokeWidth={1.5} fill="none" strokeDasharray="5 3" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rapprochement */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Rapprochement bancaire — SGBS (en cours)</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {reconciliationItems.filter(i=>i.matchStatus==='exact').length} correspondances exactes ·{' '}
              {reconciliationItems.filter(i=>i.matchStatus==='ia_proposed').length} propositions IA ·{' '}
              {reconciliationItems.filter(i=>i.matchStatus==='manual_required').length} entrées manuelles requises
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedItems.size > 0 && (
              <button className="btn btn-success btn-sm">
                <CheckCheck size={13} /> Valider sélection ({selectedItems.size})
              </button>
            )}
            <button className="btn btn-outline btn-sm"><RefreshCw size={13} /> Actualiser</button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(matchColors).map(([key, style]) => (
            <span key={key} className={`badge ${style.badge} text-[10px]`}>{style.label}</span>
          ))}
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="w-8"><input type="checkbox" className="rounded" /></th>
                <th>Date</th>
                <th>Libellé bancaire</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Écriture proposée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reconciliationItems.map(item => <MatchRow key={item.id} item={item} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
