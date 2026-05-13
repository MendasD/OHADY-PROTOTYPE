import { useState } from 'react';
import {
  Plus, Search, CheckCircle, XCircle, Clock,
  ChevronRight, User, FileText, DollarSign,
  ArrowRight, Download,
} from 'lucide-react';
import { expenseRequests, budgetLines } from '../data/mockData';
import { fmtXOF } from '../data/mockData';
import type { ExpenseRequest, ExpenseStatus } from '../types';

const statusConfig: Record<ExpenseStatus, { label: string; badge: string; icon: React.ElementType }> = {
  pending:          { label: 'En attente',     badge: 'badge-yellow',  icon: Clock         },
  approved:         { label: 'Approuvé',       badge: 'badge-blue',    icon: CheckCircle   },
  bon_depense:      { label: 'Bon de dépense', badge: 'badge-purple',  icon: FileText      },
  disbursed:        { label: 'Décaissé',       badge: 'badge-orange',  icon: DollarSign    },
  receipt_returned: { label: 'Justificatif',   badge: 'badge-orange',  icon: FileText      },
  validated:        { label: 'Validé',         badge: 'badge-green',   icon: CheckCircle   },
  rejected:         { label: 'Rejeté',         badge: 'badge-red',     icon: XCircle       },
};

const workflowSteps = [
  { step: 1, label: 'Demande employé',      desc: 'Type, montant, rubrique' },
  { step: 2, label: 'Vérif. budget',        desc: 'Enveloppe disponible ?' },
  { step: 3, label: 'Validation N+1/N+2',   desc: 'Selon seuils paramétrés' },
  { step: 4, label: 'Bon de dépense',       desc: 'Trésorier prépare BD' },
  { step: 5, label: 'Décaissement',         desc: 'Espèces / Virement / Mobile' },
  { step: 6, label: 'Justificatif',         desc: 'Retour reçu + note frais' },
  { step: 7, label: 'Saisie comptable',     desc: 'Comptable valide écriture' },
];


export default function AchatsDepenses() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ExpenseStatus | 'all'>('all');
  const [selected, setSelected] = useState<ExpenseRequest | null>(null);

  const filtered = expenseRequests.filter(e => {
    const matchSearch = e.employee.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pending = expenseRequests.filter(e => e.status === 'pending').length;
  const totalPending = expenseRequests.filter(e => ['pending','approved','bon_depense','disbursed'].includes(e.status))
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Achats & Dépenses</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Approbations · Bons de dépense · Avances</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Download size={13} /> Exporter</button>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> Nouvelle demande</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'En attente d\'approbation',  value: pending,               unit: 'demandes', color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Montant en cours',           value: fmtXOF(totalPending),  unit: '',          color: 'text-secondary',   bg: 'bg-blue-50'   },
          { label: 'Validées ce mois',           value: 6,                     unit: 'dépenses',  color: 'text-success',     bg: 'bg-green-50'  },
          { label: 'Avances non justifiées',     value: 1,                     unit: '— 9j',      color: 'text-danger',      bg: 'bg-red-50'    },
        ].map(item => (
          <div key={item.label} className={`card text-center ${item.bg}`}>
            <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-neutral-500 mt-1">{item.unit}</div>
            <div className="text-xs font-semibold text-neutral-700 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Workflow visualization */}
      <div className="card">
        <h2 className="section-title mb-4">Flux d'approbation (7 étapes)</h2>
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {workflowSteps.map((step, i) => (
            <div key={step.step} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center w-28 text-center">
                <div className="w-8 h-8 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center mb-2">
                  {step.step}
                </div>
                <div className="text-xs font-semibold text-neutral-800 leading-tight">{step.label}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{step.desc}</div>
              </div>
              {i < workflowSteps.length - 1 && (
                <ChevronRight size={16} className="text-neutral-300 flex-shrink-0 mx-0.5 mt-[-12px]" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Expense requests list */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Demandes de dépenses</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  className="input pl-8 py-1.5 text-xs w-44" placeholder="Employé, type..." />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
                className="select text-xs py-1.5" style={{ width: 'auto', padding: '6px 8px' }}>
                <option value="all">Tous</option>
                {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2.5">
            {filtered.map(req => {
              const conf = statusConfig[req.status];
              const Icon = conf.icon;
              const pct = Math.round(req.budgetUsed / req.budgetTotal * 100);

              return (
                <div
                  key={req.id}
                  onClick={() => setSelected(selected?.id === req.id ? null : req)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-card ${
                    selected?.id === req.id ? 'border-secondary bg-blue-50/50 shadow-card' : 'border-neutral-100 bg-white hover:border-neutral-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-neutral-800">{req.employee}</span>
                        <span className={`badge ${conf.badge} text-[10px]`}>
                          <Icon size={10} /> {conf.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-neutral-500">{req.type}</span>
                        <span className="text-[10px] text-neutral-400">·</span>
                        <span className="text-xs font-bold text-neutral-800">{fmtXOF(req.amount)}</span>
                        <span className="text-[10px] text-neutral-400">·</span>
                        <span className="text-[10px] text-neutral-400">{req.requestDate}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1 truncate">{req.justification}</div>
                      {/* Budget bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct > 90 ? 'bg-danger' : pct > 70 ? 'bg-orange-400' : 'bg-success'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className={`text-[10px] font-semibold ${pct > 90 ? 'text-danger' : 'text-neutral-500'}`}>{pct}%</span>
                        <span className="text-[10px] text-neutral-400">du budget {req.rubric.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {selected?.id === req.id && req.status === 'pending' && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 flex gap-2">
                      <button className="btn btn-success btn-sm flex-1"><CheckCircle size={12} /> Approuver</button>
                      <button className="btn btn-danger btn-sm"><XCircle size={12} /> Rejeter</button>
                      <button className="btn btn-outline btn-sm"><FileText size={12} /> Détail</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget envelopes */}
        <div className="card">
          <h2 className="section-title mb-4">Enveloppes budgétaires</h2>
          <div className="space-y-4">
            {budgetLines.map(line => {
              const pct = Math.round((line.realise + line.engagement) / line.budget * 100);
              const isOver = pct > 100;
              const dispColor = isOver ? 'text-danger' : line.disponible < line.budget * 0.1 ? 'text-orange-500' : 'text-success';
              return (
                <div key={line.rubric}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-neutral-700 truncate pr-2">{line.rubric}</span>
                    <span className={`text-xs font-bold ${isOver ? 'text-danger' : 'text-neutral-600'}`}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-secondary rounded-l-full" style={{ width: `${Math.min(Math.round(line.realise/line.budget*100),100)}%` }} />
                    <div className="h-full bg-secondary/30" style={{ width: `${Math.min(Math.round(line.engagement/line.budget*100),100-Math.round(line.realise/line.budget*100))}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-neutral-400">{(line.realise/1000000).toFixed(1)}M réalisé + {(line.engagement/1000000).toFixed(1)}M engagé</span>
                    <span className={`text-[10px] font-semibold ${dispColor}`}>
                      {line.disponible < 0 ? '-' : ''}{(Math.abs(line.disponible)/1000000).toFixed(1)}M {line.disponible < 0 ? 'dépassé' : 'dispo'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 btn btn-outline btn-sm">
            Modifier les enveloppes <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
