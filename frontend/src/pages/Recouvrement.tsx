import { useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell,
} from 'recharts';
import {
  Send, Phone, MessageCircle, Mail, AlertTriangle, Filter, Clock,
  CheckCheck, Sparkles,
} from 'lucide-react';
import { invoices, fmtXOF } from '../data/mockData';
import type { Invoice } from '../types';

interface Bucket {
  id: 'b30' | 'b3060' | 'b6090' | 'b90';
  label: string;
  color: string;
  test: (days: number) => boolean;
}

const buckets: Bucket[] = [
  { id: 'b30',   label: '0–30 j',   color: '#27AE60', test: d => d <= 30 },
  { id: 'b3060', label: '30–60 j',  color: '#2980B9', test: d => d > 30 && d <= 60 },
  { id: 'b6090', label: '60–90 j',  color: '#F39C12', test: d => d > 60 && d <= 90 },
  { id: 'b90',   label: '90+ j',    color: '#E74C3C', test: d => d > 90 },
];

interface RelanceStep {
  level: 1 | 2 | 3 | 4;
  label: string;
  delay: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'phone';
  tone: 'info' | 'warn' | 'danger';
  description: string;
}

const relanceScenario: RelanceStep[] = [
  { level: 1, label: 'Relance amiable',     delay: 'J+7',  channel: 'email',    tone: 'info',   description: 'Rappel courtois avec récap de la facture. Pas de menace.' },
  { level: 2, label: 'Relance ferme',       delay: 'J+15', channel: 'whatsapp', tone: 'info',   description: 'Ton plus pressant, mention des CGV et pénalités prévues.' },
  { level: 3, label: 'Mise en demeure',     delay: 'J+30', channel: 'email',    tone: 'warn',   description: 'Courrier formel avec accusé. Délai de 8 jours avant action.' },
  { level: 4, label: 'Appel direct + escalade', delay: 'J+45', channel: 'phone',    tone: 'danger', description: 'Appel direct du DAF, transmission au service contentieux.' },
];

const channelIcon = { email: Mail, whatsapp: MessageCircle, sms: MessageCircle, phone: Phone };

// Filter only invoices that are overdue or in recovery
const overdueOnly = invoices.filter(
  inv => inv.status === 'a_recouvrer' || inv.status === 'retard_30' || inv.status === 'retard_60' || inv.status === 'litige',
);

export default function Recouvrement() {
  const [activeBucket, setActiveBucket] = useState<Bucket['id'] | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const groupedByBucket = useMemo(() => {
    return buckets.map(b => ({
      ...b,
      invoices: overdueOnly.filter(inv => b.test(inv.daysOverdue ?? 0)),
      total: overdueOnly.filter(inv => b.test(inv.daysOverdue ?? 0)).reduce((s, inv) => s + inv.amount, 0),
    }));
  }, []);

  const totalRecouvrement = overdueOnly.reduce((s, inv) => s + inv.amount, 0);
  const chartData = groupedByBucket.map(g => ({ range: g.label, amount: g.total, color: g.color, count: g.invoices.length }));

  const filteredInvoices = activeBucket === 'all'
    ? overdueOnly
    : groupedByBucket.find(b => b.id === activeBucket)!.invoices;

  const toggle = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary">Recouvrement</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Balance âgée, scénarios de relance et historique par client.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Filter size={12} /> Filtres</button>
          <button className="btn btn-primary btn-sm">
            <Send size={12} /> Lancer une campagne
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Encours à recouvrer" value={fmtXOF(totalRecouvrement)} tone="primary" hint={`${overdueOnly.length} factures`} />
        <KpiCard label="DSO actuel" value="47 j" tone="warning" hint="Médiane secteur 35–40 j" />
        <KpiCard label="Taux de relances ouvertes" value="62 %" tone="secondary" hint="Email + WhatsApp" />
        <KpiCard label="Litige actif" value={fmtXOF(3_800_000)} tone="danger" hint="1 client · ICTS Global" />
      </div>

      {/* Aged balance + Scenarios */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-700">Balance âgée clients</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Répartition par ancienneté du retard</p>
            </div>
            <span className="badge badge-orange text-[10px]"><AlertTriangle size={9} /> 90+ j critique</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
                formatter={(v: any, _name: any, item: any) => [fmtXOF(Number(v)) + ` · ${item.payload.count} fact.`, 'Montant']}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={64}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-3">
            <BucketChip active={activeBucket === 'all'} count={overdueOnly.length} label="Toutes" onClick={() => setActiveBucket('all')} />
            {groupedByBucket.map(b => (
              <BucketChip
                key={b.id}
                active={activeBucket === b.id}
                count={b.invoices.length}
                color={b.color}
                label={b.label}
                onClick={() => setActiveBucket(b.id)}
              />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-neutral-700">Scénario de relance</h3>
            <span className="badge badge-blue text-[10px]"><Sparkles size={9} /> Auto + IA</span>
          </div>
          <div className="space-y-2">
            {relanceScenario.map(step => {
              const Icon = channelIcon[step.channel];
              const toneCls = {
                info:   'border-l-secondary bg-blue-50/40 text-secondary',
                warn:   'border-l-warning  bg-orange-50/40 text-warning',
                danger: 'border-l-danger   bg-red-50/40    text-danger',
              }[step.tone];
              return (
                <div key={step.level} className={`relative pl-3 pr-3 py-2.5 rounded-r-lg border-l-4 ${toneCls.split(' ').slice(0,2).join(' ')}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold ${toneCls.split(' ')[2]} bg-white shadow-sm`}>
                        {step.level}
                      </span>
                      <span className="text-xs font-semibold text-neutral-800">{step.label}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">{step.delay}</span>
                  </div>
                  <div className="mt-1 ml-7 flex items-start gap-2">
                    <Icon size={12} className={`mt-0.5 ${toneCls.split(' ')[2]}`} />
                    <p className="text-[11px] text-neutral-600 leading-snug">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn btn-outline btn-sm w-full mt-4 justify-center">
            Personnaliser le scénario
          </button>
        </div>
      </div>

      {/* Invoice list */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-neutral-700">
            Factures à recouvrer · {filteredInvoices.length}
          </h3>
          <div className="flex items-center gap-2">
            <button
              disabled={selected.size === 0}
              className={`btn btn-sm ${selected.size === 0 ? 'btn-outline opacity-50 cursor-not-allowed' : 'btn-primary'}`}
            >
              <Send size={12} /> Relancer ({selected.size})
            </button>
          </div>
        </div>
        <div className="divide-y divide-neutral-50">
          {filteredInvoices.map(inv => <InvoiceRow key={inv.id} inv={inv} selected={selected.has(inv.id)} onToggle={() => toggle(inv.id)} />)}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, tone, hint }: { label: string; value: string; tone: 'primary' | 'success' | 'danger' | 'warning' | 'secondary'; hint: string }) {
  const tones = { primary: 'text-primary', success: 'text-success', danger: 'text-danger', warning: 'text-warning', secondary: 'text-secondary' };
  return (
    <div className="card">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium">{label}</div>
      <div className={`mt-2 text-xl font-bold ${tones[tone]}`}>{value}</div>
      <div className="text-[11px] text-neutral-500 mt-0.5">{hint}</div>
    </div>
  );
}

function BucketChip({ label, count, color, active, onClick }: { label: string; count: number; color?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-all ${
        active
          ? 'border-secondary bg-secondary/10 text-secondary font-semibold'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
      }`}
    >
      {color && <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
      {label} <span className="font-mono text-neutral-500">({count})</span>
    </button>
  );
}

function InvoiceRow({ inv, selected, onToggle }: { inv: Invoice; selected: boolean; onToggle: () => void }) {
  const days = inv.daysOverdue ?? 0;
  const bucket = buckets.find(b => b.test(days))!;
  const isLitige = inv.status === 'litige';
  return (
    <label className="group flex items-center gap-3 px-5 py-3 hover:bg-neutral-50/50 transition-colors cursor-pointer relative">
      <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: bucket.color }} />
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="ml-2 h-4 w-4 rounded border-neutral-300 accent-secondary"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-neutral-500">{inv.number}</span>
          {isLitige && <span className="badge badge-red text-[10px]"><AlertTriangle size={9} /> Litige</span>}
          {inv.hasRelance && <span className="badge badge-orange text-[10px]"><Clock size={9} /> Relance N+1</span>}
        </div>
        <div className="text-sm font-semibold text-neutral-800 mt-0.5">{inv.client}</div>
        <div className="text-[11px] text-neutral-500 mt-0.5">
          Émise {inv.date} · Échéance {inv.dueDate} ·
          <span className={`ml-1 font-semibold ${days > 60 ? 'text-danger' : days > 30 ? 'text-warning' : 'text-secondary'}`}>
            {days} j de retard
          </span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-mono text-sm font-bold text-neutral-800">{fmtXOF(inv.amount)}</div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button title="Relancer par email" className="w-7 h-7 rounded-md hover:bg-blue-50 hover:text-secondary text-neutral-400 grid place-items-center transition-colors">
          <Mail size={13} />
        </button>
        <button title="Relancer par WhatsApp" className="w-7 h-7 rounded-md hover:bg-green-50 hover:text-success text-neutral-400 grid place-items-center transition-colors">
          <MessageCircle size={13} />
        </button>
        <button title="Marquer payée" className="w-7 h-7 rounded-md hover:bg-green-50 hover:text-success text-neutral-400 grid place-items-center transition-colors">
          <CheckCheck size={13} />
        </button>
      </div>
    </label>
  );
}
