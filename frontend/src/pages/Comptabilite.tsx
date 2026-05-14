import { useState } from 'react';
import {
  Plus, Search, Download, CheckCircle, Circle,
  Clock, Eye, Edit, CheckCheck, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { journalEntries } from '../data/mockData';
import { fmtXOF } from '../data/mockData';

const journalColors: Record<string, { bg: string; text: string; label: string }> = {
  HA: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Achats' },
  VT: { bg: 'bg-blue-50',   text: 'text-blue-700',   label: 'Ventes' },
  BQ: { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Banque' },
  CA: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Caisse' },
  OD: { bg: 'bg-gray-50',   text: 'text-gray-600',   label: 'Opérations div.' },
};

const statusConfig = {
  validated: { icon: CheckCircle, color: 'text-success', label: 'Validé' },
  submitted: { icon: Clock,        color: 'text-orange-400', label: 'À valider' },
  draft:     { icon: Circle,       color: 'text-neutral-400', label: 'Brouillon' },
};

const checklistItems = [
  { label: 'Toutes les écritures validées',              done: false, critical: true  },
  { label: 'Rapprochement bancaire SGBS ok',             done: false, critical: true  },
  { label: 'Rapprochement CBAO ok',                      done: true,  critical: true  },
  { label: 'Dotations aux amortissements passées',        done: true,  critical: true  },
  { label: 'TVA mai calculée et déclarée',               done: false, critical: true  },
  { label: 'Pas d\'écritures en suspens anciennes',      done: false, critical: false },
  { label: 'Balance équilibrée (débit = crédit)',        done: true,  critical: true  },
  { label: 'Provisions et charges à payer saisies',      done: false, critical: false },
  { label: 'Stocks inventoriés et valorisés',            done: true,  critical: false },
  { label: 'Intercos réconciliées',                      done: true,  critical: false },
];

export default function Comptabilite() {
  const [search, setSearch] = useState('');
  const [filterJournal, setFilterJournal] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'journal' | 'cloture'>('journal');

  const filtered = journalEntries.filter(e => {
    const matchSearch = e.libelle.toLowerCase().includes(search.toLowerCase()) ||
      e.account.includes(search) || e.reference.toLowerCase().includes(search.toLowerCase());
    const matchJournal = filterJournal === 'all' || e.journal === filterJournal;
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchJournal && matchStatus;
  });

  const totalDebit = filtered.reduce((s, e) => s + e.debit, 0);
  const totalCredit = filtered.reduce((s, e) => s + e.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 1;

  const checkDone = checklistItems.filter(c => c.done).length;
  const checkPct = Math.round(checkDone / checklistItems.length * 100);

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Comptabilité générale</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Journal · Plan comptable SYSCOHADA · Clôture</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Download size={13} /> Exporter</button>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> Nouvelle écriture</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        {[
          { id: 'journal', label: 'Journal de saisie' },
          { id: 'cloture', label: 'Clôture mensuelle' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-neutral-800 shadow-card'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'journal' && (
        <>
          {/* Stats strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Écritures validées',   value: journalEntries.filter(e=>e.status==='validated').length, color: 'text-success' },
              { label: 'À valider',            value: journalEntries.filter(e=>e.status==='submitted').length, color: 'text-orange-500' },
              { label: 'Brouillons',           value: journalEntries.filter(e=>e.status==='draft').length,     color: 'text-neutral-500' },
              { label: 'Total débit (filtré)',  value: `${(totalDebit/1000000).toFixed(2)}M`, color: isBalanced ? 'text-success' : 'text-danger' },
            ].map(item => (
              <div key={item.label} className="card text-center">
                <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-neutral-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Journal table */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h2 className="section-title">Écritures comptables</h2>
                {!isBalanced && (
                  <span className="badge badge-red text-[10px]">
                    <AlertTriangle size={10} /> Déséquilibre : {fmtXOF(Math.abs(totalDebit - totalCredit))}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    className="input pl-8 py-1.5 text-xs w-52" placeholder="Libellé, compte, référence..." />
                </div>
                <select value={filterJournal} onChange={e => setFilterJournal(e.target.value)}
                  className="select text-xs py-1.5" style={{ width: 'auto', padding: '6px 8px' }}>
                  <option value="all">Tous journaux</option>
                  {Object.entries(journalColors).map(([k, v]) => <option key={k} value={k}>{k} — {v.label}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  className="select text-xs py-1.5" style={{ width: 'auto', padding: '6px 8px' }}>
                  <option value="all">Tous statuts</option>
                  <option value="validated">Validé</option>
                  <option value="submitted">À valider</option>
                  <option value="draft">Brouillon</option>
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Journal</th>
                    <th>Référence</th>
                    <th>Compte</th>
                    <th>Libellé</th>
                    <th className="text-right">Débit</th>
                    <th className="text-right">Crédit</th>
                    <th>Statut</th>
                    <th>Saisie par</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(entry => {
                    const jConf = journalColors[entry.journal];
                    const sConf = statusConfig[entry.status];
                    const StatusIcon = sConf.icon;
                    return (
                      <tr key={entry.id}>
                        <td className="text-neutral-500 whitespace-nowrap">{entry.date}</td>
                        <td>
                          <span className={`badge text-[10px] ${jConf.bg} ${jConf.text} ring-0`}>
                            {entry.journal}
                          </span>
                        </td>
                        <td className="font-mono text-xs text-neutral-500">{entry.reference}</td>
                        <td>
                          <div className="font-mono text-xs font-semibold text-secondary">{entry.account}</div>
                          <div className="text-[10px] text-neutral-400">{entry.accountLabel}</div>
                        </td>
                        <td className="max-w-[200px]">
                          <div className="text-xs text-neutral-700 leading-snug">{entry.libelle}</div>
                        </td>
                        <td className="text-right font-semibold text-neutral-800">
                          {entry.debit > 0 ? fmtXOF(entry.debit) : <span className="text-neutral-300">—</span>}
                        </td>
                        <td className="text-right font-semibold text-neutral-800">
                          {entry.credit > 0 ? fmtXOF(entry.credit) : <span className="text-neutral-300">—</span>}
                        </td>
                        <td>
                          <span className={`flex items-center gap-1 text-xs font-medium ${sConf.color}`}>
                            <StatusIcon size={11} /> {sConf.label}
                          </span>
                        </td>
                        <td className="text-xs text-neutral-500">{entry.user}</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button className="btn btn-ghost btn-sm py-1 px-2"><Eye size={11} /></button>
                            {entry.status !== 'validated' && (
                              <button className="btn btn-ghost btn-sm py-1 px-2"><Edit size={11} /></button>
                            )}
                            {entry.status === 'submitted' && (
                              <button className="btn btn-success btn-sm py-1 px-2">
                                <CheckCheck size={11} /> Valider
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-neutral-50 font-semibold border-t-2 border-neutral-200">
                    <td colSpan={5} className="text-xs text-neutral-600 py-3 px-4">Total ({filtered.length} lignes)</td>
                    <td className="text-right text-sm text-neutral-800 py-3 px-4">{fmtXOF(totalDebit)}</td>
                    <td className="text-right text-sm text-neutral-800 py-3 px-4">{fmtXOF(totalCredit)}</td>
                    <td colSpan={3}>
                      {isBalanced ? (
                        <span className="badge badge-green text-[10px]"><CheckCircle size={10} /> Équilibré</span>
                      ) : (
                        <span className="badge badge-red text-[10px]"><AlertTriangle size={10} /> Déséquilibré</span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'cloture' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Checklist */}
          <div className="card xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">Checklist de clôture — Mai 2026</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Fin du mois dans 18 jours</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-secondary">{checkPct}%</div>
                  <div className="text-xs text-neutral-400">complété</div>
                </div>
                <div className="w-12 h-12 rounded-full" style={{
                  background: `conic-gradient(#2980B9 ${checkPct * 3.6}deg, #E2E8F0 0deg)`,
                }} />
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${checkPct}%` }} />
            </div>

            <div className="space-y-2.5">
              {checklistItems.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border ${
                  item.done
                    ? 'bg-green-50 border-green-100'
                    : item.critical
                      ? 'bg-red-50/50 border-red-100'
                      : 'bg-neutral-50 border-neutral-100'
                }`}>
                  {item.done ? (
                    <CheckCircle size={18} className="text-success flex-shrink-0" />
                  ) : (
                    <Circle size={18} className={`flex-shrink-0 ${item.critical ? 'text-danger' : 'text-neutral-300'}`} />
                  )}
                  <span className={`text-sm flex-1 ${item.done ? 'text-success line-through' : item.critical ? 'text-neutral-800 font-medium' : 'text-neutral-600'}`}>
                    {item.label}
                  </span>
                  {item.critical && !item.done && (
                    <span className="badge badge-red text-[9px]">Critique</span>
                  )}
                  {!item.done && (
                    <button className="btn btn-ghost btn-sm py-1 px-2 text-xs text-secondary">
                      Traiter <ChevronRight size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                {checkDone}/{checklistItems.length} points complétés · {checklistItems.filter(c=>c.critical && !c.done).length} points critiques restants
              </div>
              <button
                disabled={checklistItems.some(c => c.critical && !c.done)}
                className="btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCheck size={13} /> Valider la clôture
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-sm font-semibold text-neutral-800 mb-4">Résumé mai 2026</h3>
              <div className="space-y-3">
                {[
                  { label: "Chiffre d'affaires",    value: '47 850 000', color: 'text-secondary' },
                  { label: 'Charges totales',        value: '34 200 000', color: 'text-danger' },
                  { label: 'Résultat brut',          value: '13 650 000', color: 'text-neutral-800' },
                  { label: 'Amortissements',         value: '285 000',    color: 'text-neutral-500' },
                  { label: 'Résultat net (estimé)',  value: '5 920 000',  color: 'text-success' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value} XOF</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-orange-50 border-orange-100">
              <div className="flex gap-2 items-start">
                <AlertTriangle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-orange-800">Points d'attention</div>
                  <ul className="mt-2 space-y-1 text-xs text-orange-700 list-disc list-inside">
                    <li>5 écritures non validées</li>
                    <li>Rapprochement SGBS incomplet</li>
                    <li>TVA non déclarée</li>
                    <li>1 écriture en suspens &gt; 15j</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
