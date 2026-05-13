import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Plus, Search, Download, Eye, Send, Mail,
  AlertTriangle, MoreVertical, Filter,
} from 'lucide-react';
import { invoices } from '../data/mockData';
import { fmtXOF } from '../data/mockData';
import type { Invoice, InvoiceStatus } from '../types';

const statusConfig: Record<InvoiceStatus, { label: string; badge: string; step: number }> = {
  devis_envoye: { label: 'Devis envoyé',     badge: 'badge-gray',   step: 1 },
  bc_recu:      { label: 'BC reçu',           badge: 'badge-blue',   step: 2 },
  en_cours:     { label: 'En cours',          badge: 'badge-purple', step: 3 },
  livraison:    { label: 'Livraison',         badge: 'badge-yellow', step: 4 },
  facture:      { label: 'Facturé',           badge: 'badge-blue',   step: 5 },
  a_recouvrer:  { label: 'À recouvrer',       badge: 'badge-orange', step: 6 },
  retard_30:    { label: 'Retard 30j+',       badge: 'badge-red',    step: 7 },
  retard_60:    { label: 'Retard 60j+',       badge: 'badge-red',    step: 8 },
  litige:       { label: 'Litige',            badge: 'badge-red',    step: 9 },
};

const ageData = [
  { tranche: '0–30j',  montant: 12800000, nb: 3, color: '#27AE60' },
  { tranche: '30–60j', montant: 5600000,  nb: 2, color: '#F39C12' },
  { tranche: '60–90j', montant: 5800000,  nb: 1, color: '#E67E22' },
  { tranche: '90j+',   montant: 3800000,  nb: 1, color: '#E74C3C' },
];

export default function VentesClients() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalCA = invoices.filter(i => ['facture','a_recouvrer','retard_30','retard_60'].includes(i.status)).reduce((s,i) => s+i.amount,0);
  const totalOverdue = invoices.filter(i => ['retard_30','retard_60','litige'].includes(i.status)).reduce((s,i) => s+i.amount,0);
  const totalPipeline = invoices.filter(i => ['devis_envoye','bc_recu','en_cours','livraison'].includes(i.status)).reduce((s,i) => s+i.amount,0);

  const pipelineGroups: Record<string, Invoice[]> = {
    devis_envoye: [], bc_recu: [], en_cours: [], livraison: [], facture: [],
  };
  invoices.filter(i => Object.keys(pipelineGroups).includes(i.status)).forEach(i => {
    pipelineGroups[i.status as keyof typeof pipelineGroups].push(i);
  });

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Ventes & Clients</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Facturation · Recouvrement · Pipeline commercial</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Download size={13} /> Exporter</button>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> Nouvelle facture</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Encours total',      value: totalCA,       sub: `${invoices.filter(i=>['facture','a_recouvrer','retard_30','retard_60'].includes(i.status)).length} factures`, color: 'text-secondary' },
          { label: 'Créances échues',    value: totalOverdue,  sub: 'DSO : 47 jours', color: 'text-danger' },
          { label: 'Pipeline (devis)',   value: totalPipeline, sub: `${invoices.filter(i=>['devis_envoye','bc_recu','en_cours','livraison'].includes(i.status)).length} opportunités`, color: 'text-accent' },
        ].map(item => (
          <div key={item.label} className="card text-center">
            <div className={`text-2xl font-bold ${item.color}`}>{fmtXOF(item.value)}</div>
            <div className="text-sm font-semibold text-neutral-700 mt-1">{item.label}</div>
            <div className="text-xs text-neutral-400 mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Age + Pipeline charts */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Aged receivables */}
        <div className="card xl:col-span-2">
          <h2 className="section-title mb-1">Balance âgée créances</h2>
          <p className="text-xs text-neutral-400 mb-4">Répartition par ancienneté</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ageData} layout="vertical" margin={{ left: -10, right: 8, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="tranche" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip formatter={(v: any) => fmtXOF(Number(v))} />
              {ageData.map((entry, i) => (
                <Bar key={i} dataKey="montant" name="Montant" fill={entry.color} radius={[0, 4, 4, 0]} maxBarSize={22} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {ageData.map(d => (
              <div key={d.tranche} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-neutral-600">{d.tranche}</span>
                </div>
                <span className="font-semibold text-neutral-800">{fmtXOF(d.montant)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline kanban preview */}
        <div className="card xl:col-span-3">
          <h2 className="section-title mb-4">Pipeline commercial</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Object.entries(pipelineGroups).map(([status, items]) => {
              const conf = statusConfig[status as InvoiceStatus];
              return (
                <div key={status} className="flex-shrink-0 w-40">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`badge ${conf.badge} text-[10px]`}>{conf.label}</span>
                    <span className="text-xs text-neutral-400 font-medium">{items.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {items.slice(0, 3).map(inv => (
                      <div key={inv.id} className="bg-neutral-50 rounded-lg p-2.5 border border-neutral-100 cursor-pointer hover:shadow-card-md transition-all">
                        <div className="text-xs font-semibold text-neutral-800 truncate">{inv.client}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{inv.number}</div>
                        <div className="text-xs font-bold text-secondary mt-1">{(inv.amount/1000000).toFixed(1)}M</div>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="text-[10px] text-center text-neutral-400 py-1">+{items.length - 3} autres</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Invoices table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Toutes les factures ({invoices.length})</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-8 py-1.5 text-xs w-52"
                placeholder="Client, numéro..."
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as InvoiceStatus | 'all')}
              className="select text-xs py-1.5"
              style={{ width: 'auto', padding: '6px 10px' }}
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(statusConfig).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <button className="btn btn-ghost btn-sm"><Filter size={13} /></button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>N° Facture</th>
                <th>Client</th>
                <th>Date</th>
                <th>Échéance</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Retard</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const conf = statusConfig[inv.status];
                return (
                  <tr key={inv.id}>
                    <td className="font-mono text-xs text-secondary font-semibold">{inv.number}</td>
                    <td className="font-medium text-neutral-800">{inv.client}</td>
                    <td className="text-neutral-500">{inv.date}</td>
                    <td className="text-neutral-500">{inv.dueDate}</td>
                    <td className="font-semibold text-neutral-800">{fmtXOF(inv.amount)}</td>
                    <td><span className={`badge ${conf.badge} text-[10px]`}>{conf.label}</span></td>
                    <td>
                      {inv.daysOverdue ? (
                        <span className="flex items-center gap-1 text-xs text-danger font-semibold">
                          <AlertTriangle size={11} /> {inv.daysOverdue}j
                        </span>
                      ) : <span className="text-neutral-300">—</span>}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="btn btn-ghost btn-sm py-1 px-2" title="Voir"><Eye size={12} /></button>
                        <button className="btn btn-ghost btn-sm py-1 px-2" title="Email"><Mail size={12} /></button>
                        {inv.daysOverdue && (
                          <button className="btn btn-outline btn-sm py-1 px-2 text-danger border-red-200" title="Relancer">
                            <Send size={11} /> Relancer
                          </button>
                        )}
                        <button className="btn btn-ghost btn-sm py-1 px-2"><MoreVertical size={12} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
