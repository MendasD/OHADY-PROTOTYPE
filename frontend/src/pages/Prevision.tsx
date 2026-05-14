import { useState } from 'react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle, Sparkles, Calendar, Download,
  ArrowUpRight, ArrowDownLeft, Info,
} from 'lucide-react';
import { cashForecast, fmtXOF, fmt } from '../data/mockData';

type Horizon = '30j' | '13s' | '6m';

const horizons: { id: Horizon; label: string }[] = [
  { id: '30j', label: 'J + 30' },
  { id: '13s', label: '13 semaines' },
  { id: '6m',  label: '6 mois' },
];

const upcomingInflows = [
  { id: 'i1', date: '14 mai', client: 'Tech Solutions SARL',   amount: 2800000, mode: 'Virement',     status: 'attendu' },
  { id: 'i2', date: '16 mai', client: 'AfricTech Group',       amount: 4200000, mode: 'Virement',     status: 'confirme' },
  { id: 'i3', date: '20 mai', client: 'SONES',                 amount: 6500000, mode: 'Virement',     status: 'attendu' },
  { id: 'i4', date: '25 mai', client: 'Orange Sénégal',        amount: 2100000, mode: 'Wave',         status: 'attendu' },
  { id: 'i5', date: '27 mai', client: 'Total Energies SN',     amount: 8200000, mode: 'Virement',     status: 'confirme' },
  { id: 'i6', date: '02 jun', client: 'Banque de Dakar',       amount: 5400000, mode: 'Chèque',       status: 'attendu' },
];

const upcomingOutflows = [
  { id: 'o1', date: '15 mai', tiers: 'Salaires mai 2026',        amount: 3500000, kind: 'Paie',         critical: true },
  { id: 'o2', date: '17 mai', tiers: 'COGEMATEC (F-2026-411)',   amount: 2100000, kind: 'Fournisseur',  critical: false },
  { id: 'o3', date: '21 mai', tiers: 'SENELEC (électricité)',    amount: 420000,  kind: 'Charges',      critical: false },
  { id: 'o4', date: '23 mai', tiers: 'Loyer Plateau',            amount: 1500000, kind: 'Loyer',        critical: false },
  { id: 'o5', date: '25 mai', tiers: 'TVA déclaration mai',      amount: 1850000, kind: 'Fiscal',       critical: true },
  { id: 'o6', date: '30 mai', tiers: 'Échéance emprunt SGBS',    amount: 850000,  kind: 'Financier',    critical: false },
  { id: 'o7', date: '30 mai', tiers: 'Acompte BIC trimestriel',  amount: 640000,  kind: 'Fiscal',       critical: true },
];

export default function Prevision() {
  const [horizon, setHorizon] = useState<Horizon>('30j');

  const seuil = 18000000;
  const dataWithSeuil = cashForecast.map(d => ({ ...d, seuil }));
  const minSolde = Math.min(...cashForecast.map(d => d.solde));
  const dateMin = cashForecast.find(d => d.solde === minSolde)?.date;
  const totalIn  = upcomingInflows.reduce((s, i) => s + i.amount, 0);
  const totalOut = upcomingOutflows.reduce((s, o) => s + o.amount, 0);
  const netFlow = totalIn - totalOut;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary">Prévision de trésorerie</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Solde projeté jour par jour à partir des encaissements et décaissements prévus.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5">
            {horizons.map(h => (
              <button
                key={h.id}
                onClick={() => setHorizon(h.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  horizon === h.id ? 'bg-secondary text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm">
            <Download size={12} /> Exporter
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Solde aujourd'hui"
          value={fmtXOF(23_415_000)}
          tone="primary"
          hint="13 mai 2026 · 13h32"
        />
        <KpiCard
          label="Encaissements prévus"
          value={`+ ${fmtXOF(totalIn)}`}
          tone="success"
          hint={`${upcomingInflows.length} mouvements sur ${horizon === '30j' ? '30 jours' : horizon === '13s' ? '13 semaines' : '6 mois'}`}
        />
        <KpiCard
          label="Décaissements prévus"
          value={`− ${fmtXOF(totalOut)}`}
          tone="danger"
          hint={`${upcomingOutflows.length} échéances`}
        />
        <KpiCard
          label="Solde projeté fin horizon"
          value={fmtXOF(cashForecast[cashForecast.length - 1].solde)}
          tone={netFlow >= 0 ? 'success' : 'warning'}
          hint={netFlow >= 0 ? 'Excédent net' : 'Déficit net'}
        />
      </div>

      {/* IA insight */}
      <div className="card border-l-4 border-warning bg-orange-50/40 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-warning/15 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={16} className="text-warning" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-800">Alerte de l'IA — Trésorerie sous seuil prévue</span>
            <span className="badge badge-orange text-[10px]"><Sparkles size={9} /> Claude</span>
          </div>
          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
            Avec les échéances du <strong>15 mai</strong> (salaires 3,5 M XOF) et du <strong>25 mai</strong> (TVA 1,85 M XOF),
            le solde global passera sous le seuil de prudence de <strong>{fmtXOF(seuil)}</strong> autour du <strong>{dateMin}</strong>.
            Le minimum projeté est de <strong className="text-warning">{fmtXOF(minSolde)}</strong>.
            <br />
            <span className="text-neutral-500 italic">Suggestion : anticiper la relance des factures CIE-Holding et Bolloré pour combler l'écart.</span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-neutral-700">Solde projeté jour par jour</h3>
          <div className="flex items-center gap-3 text-xs">
            <Legend color="#2980B9" label="Solde" />
            <Legend color="#E67E22" label="Seuil de prudence" dashed />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={dataWithSeuil} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="solde" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2980B9" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#2980B9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
            <Tooltip
              contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
              formatter={(v: any) => fmtXOF(Number(v))}
            />
            <ReferenceLine y={seuil} stroke="#E67E22" strokeDasharray="4 2"
              label={{ value: 'Seuil', fill: '#E67E22', fontSize: 10, position: 'insideTopRight' }} />
            <Area type="monotone" dataKey="solde" stroke="#2980B9" strokeWidth={2.5} fill="url(#solde)" name="Solde" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Inflows + Outflows */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-neutral-700 flex items-center gap-2">
              <ArrowDownLeft size={14} className="text-success" /> Encaissements prévus
            </h3>
            <span className="text-sm font-bold text-success">+ {fmtXOF(totalIn)}</span>
          </div>
          <div className="divide-y divide-neutral-50">
            {upcomingInflows.map(i => (
              <div key={i.id} className="flex items-center gap-3 py-2.5">
                <div className="w-12 text-xs font-mono text-neutral-500 flex-shrink-0">{i.date}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-neutral-800 truncate">{i.client}</div>
                  <div className="text-[11px] text-neutral-500">{i.mode}
                    {i.status === 'confirme' && (
                      <span className="ml-2 inline-flex items-center gap-1 text-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" /> Confirmé
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm font-mono font-bold text-success flex-shrink-0">+ {fmt(i.amount)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-neutral-700 flex items-center gap-2">
              <ArrowUpRight size={14} className="text-danger" /> Décaissements prévus
            </h3>
            <span className="text-sm font-bold text-danger">− {fmtXOF(totalOut)}</span>
          </div>
          <div className="divide-y divide-neutral-50">
            {upcomingOutflows.map(o => (
              <div key={o.id} className="flex items-center gap-3 py-2.5">
                <div className="w-12 text-xs font-mono text-neutral-500 flex-shrink-0">{o.date}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-neutral-800 truncate flex items-center gap-2">
                    {o.tiers}
                    {o.critical && <span className="badge badge-red text-[9px]">Critique</span>}
                  </div>
                  <div className="text-[11px] text-neutral-500">{o.kind}</div>
                </div>
                <div className="text-sm font-mono font-bold text-neutral-700 flex-shrink-0">− {fmt(o.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
        <Info size={11} />
        Les encaissements sont calculés à partir du pipeline client et des plans d'encaissement contractuels.
        Les décaissements incluent les échéances fiscales, salariales, fournisseurs et financières.
      </div>
    </div>
  );
}

function KpiCard({ label, value, tone, hint }: { label: string; value: string; tone: 'primary' | 'success' | 'danger' | 'warning'; hint: string }) {
  const tones = { primary: 'text-primary', success: 'text-success', danger: 'text-danger', warning: 'text-warning' };
  const icons = {
    primary: <Calendar size={14} className="text-primary" />,
    success: <TrendingUp size={14} className="text-success" />,
    danger:  <TrendingDown size={14} className="text-danger" />,
    warning: <AlertTriangle size={14} className="text-warning" />,
  };
  return (
    <div className="card">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-neutral-400 font-medium">
        {icons[tone]} {label}
      </div>
      <div className={`mt-2 text-xl font-bold ${tones[tone]}`}>{value}</div>
      <div className="text-[11px] text-neutral-500 mt-0.5">{hint}</div>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-neutral-600">
      <span className={`w-3 h-${dashed ? '0' : '0.5'} ${dashed ? 'border-t-2 border-dashed' : ''}`}
        style={{ background: dashed ? 'transparent' : color, borderColor: color }} />
      {label}
    </span>
  );
}
