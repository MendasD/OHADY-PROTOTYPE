import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Download, ArrowDownToLine, Wallet, Sparkles,
  ChevronDown, ChevronRight, TrendingUp, TrendingDown,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

interface FluxLine {
  code: string;
  label: string;
  montantN: number;
  montantN1: number;
  type: 'rubrique' | 'sous-total' | 'total' | 'sous-rubrique';
}

// Tableau de flux de trésorerie SYSCOHADA — méthode indirecte
const fluxData: { categorie: string; color: string; lines: FluxLine[] }[] = [
  {
    categorie: 'A. Flux de trésorerie liés à l\'activité',
    color: '#27AE60',
    lines: [
      { code: 'ZA', label: 'Résultat net comptable de l\'exercice', montantN: 58_000_000, montantN1: 46_500_000, type: 'rubrique' },
      { code: 'ZB', label: '+ Dotations aux amortissements et provisions', montantN: 12_100_000, montantN1: 10_800_000, type: 'rubrique' },
      { code: 'ZC', label: '+/− Plus ou moins-values de cession', montantN: -850_000, montantN1: 0, type: 'rubrique' },
      { code: 'ZD', label: 'Capacité d\'autofinancement (CAF)', montantN: 69_250_000, montantN1: 57_300_000, type: 'sous-total' },
      { code: 'ZE', label: '− Variation du BFR (besoin en fonds de roulement)', montantN: -8_400_000, montantN1: -3_200_000, type: 'rubrique' },
      { code: 'ZE1', label: '· Variation des stocks', montantN: -1_800_000, montantN1: -900_000, type: 'sous-rubrique' },
      { code: 'ZE2', label: '· Variation des créances clients', montantN: -6_200_000, montantN1: -4_100_000, type: 'sous-rubrique' },
      { code: 'ZE3', label: '· Variation des dettes fournisseurs', montantN: -400_000, montantN1: 1_800_000, type: 'sous-rubrique' },
      { code: 'ZF', label: 'Flux net de trésorerie liés à l\'activité (A)', montantN: 60_850_000, montantN1: 54_100_000, type: 'total' },
    ],
  },
  {
    categorie: 'B. Flux de trésorerie liés aux investissements',
    color: '#E67E22',
    lines: [
      { code: 'ZG', label: '− Acquisitions d\'immobilisations corporelles', montantN: -8_500_000, montantN1: -6_200_000, type: 'rubrique' },
      { code: 'ZH', label: '− Acquisitions d\'immobilisations incorporelles', montantN: -1_200_000, montantN1: -800_000, type: 'rubrique' },
      { code: 'ZI', label: '+ Cessions d\'immobilisations', montantN: 2_400_000, montantN1: 0, type: 'rubrique' },
      { code: 'ZJ', label: 'Flux net de trésorerie liés aux investissements (B)', montantN: -7_300_000, montantN1: -7_000_000, type: 'total' },
    ],
  },
  {
    categorie: 'C. Flux de trésorerie liés au financement',
    color: '#2980B9',
    lines: [
      { code: 'ZK', label: '+ Augmentation de capital', montantN: 0, montantN1: 0, type: 'rubrique' },
      { code: 'ZL', label: '+ Emprunts nouveaux contractés', montantN: 0, montantN1: 5_000_000, type: 'rubrique' },
      { code: 'ZM', label: '− Remboursements d\'emprunts', montantN: -2_500_000, montantN1: -2_500_000, type: 'rubrique' },
      { code: 'ZN', label: '− Dividendes versés aux actionnaires', montantN: -8_000_000, montantN1: -6_000_000, type: 'rubrique' },
      { code: 'ZO', label: 'Flux net de trésorerie liés au financement (C)', montantN: -10_500_000, montantN1: -3_500_000, type: 'total' },
    ],
  },
];

const variationTresorerie = 60_850_000 + (-7_300_000) + (-10_500_000); // = 43_050_000
const tresoOuverture = 21_240_000;
const tresoCloture = tresoOuverture + variationTresorerie; // 64_290_000

const evolutionMensuelle = [
  { mois: 'Juil 25', flux: 18_400_000 }, { mois: 'Août 25', flux: 12_200_000 },
  { mois: 'Sep 25',  flux: 15_800_000 }, { mois: 'Oct 25',  flux: 20_100_000 },
  { mois: 'Nov 25',  flux: 14_500_000 }, { mois: 'Déc 25',  flux: 28_900_000 },
  { mois: 'Jan 26',  flux:  9_200_000 }, { mois: 'Fév 26',  flux: 16_400_000 },
  { mois: 'Mar 26',  flux: 22_800_000 }, { mois: 'Avr 26',  flux: 11_400_000 },
  { mois: 'Mai 26',  flux: 13_400_000 }, { mois: 'Juin 26', flux: 16_400_000 },
];

const decomposition = [
  { name: 'Activité (A)',         v: 60_850_000, fill: '#27AE60' },
  { name: 'Investissements (B)', v: -7_300_000,  fill: '#E67E22' },
  { name: 'Financement (C)',     v: -10_500_000, fill: '#2980B9' },
];

export default function FluxTresorerie() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (cat: string) => setCollapsed(p => ({ ...p, [cat]: !p[cat] }));

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Wallet size={20} className="text-secondary" /> Tableau de flux de trésorerie
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Méthode indirecte SYSCOHADA — Exercice 2025-2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Download size={12} /> PDF officiel</button>
          <button className="btn btn-primary btn-sm"><Download size={12} /> Excel</button>
        </div>
      </div>

      {/* KPI strip — recap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Trésorerie ouverture"
          value={fmtXOF(tresoOuverture)}
          sub="Au 01/07/2025"
          tone="info"
          icon={Wallet}
        />
        <KpiCard
          label="Flux nets (A+B+C)"
          value={fmtXOF(variationTresorerie)}
          sub="Variation période"
          tone={variationTresorerie >= 0 ? 'success' : 'danger'}
          icon={variationTresorerie >= 0 ? TrendingUp : TrendingDown}
        />
        <KpiCard
          label="Trésorerie clôture"
          value={fmtXOF(tresoCloture)}
          sub="Au 30/06/2026"
          tone="primary"
          icon={Wallet}
        />
        <KpiCard
          label="CAF"
          value={fmtXOF(69_250_000)}
          sub="Capacité d'autofinancement"
          tone="success"
          icon={ArrowDownToLine}
        />
      </div>

      {/* Décomposition + évolution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-bold text-neutral-700 mb-3">Décomposition des flux nets</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={decomposition} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
              <Tooltip formatter={(v: any) => fmtXOF(Number(v))} contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="v" radius={[6, 6, 0, 0]} maxBarSize={56}>
                {decomposition.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Total variation</div>
            <div className="text-2xl font-bold text-success font-mono">+ {fmt(variationTresorerie)}</div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-bold text-neutral-700 mb-3">Évolution mensuelle des flux nets</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={evolutionMensuelle} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="flux" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2980B9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2980B9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
              <Tooltip formatter={(v: any) => fmtXOF(Number(v))} contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="flux" stroke="#2980B9" strokeWidth={2.5} fill="url(#flux)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="space-y-3">
        {fluxData.map(cat => {
          const isCollapsed = collapsed[cat.categorie];
          return (
            <div key={cat.categorie} className="card !p-0 overflow-hidden">
              <button
                onClick={() => toggle(cat.categorie)}
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-neutral-50/50 transition-colors text-left"
                style={{ borderLeft: `4px solid ${cat.color}` }}
              >
                <span className="text-sm font-bold text-neutral-800 flex-1">{cat.categorie}</span>
                <span className="text-sm font-bold font-mono" style={{ color: cat.color }}>
                  {fmt(cat.lines.find(l => l.type === 'total')!.montantN)} XOF
                </span>
                {isCollapsed ? <ChevronRight size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
              </button>
              {!isCollapsed && (
                <div className="overflow-x-auto border-t border-neutral-100">
                  <table className="w-full text-sm min-w-[680px]">
                    <thead>
                      <tr className="text-neutral-400 text-[10px] uppercase tracking-wide bg-neutral-50/60">
                        <th className="text-left px-4 py-2 font-semibold w-16">Code</th>
                        <th className="text-left px-2 py-2 font-semibold">Libellé</th>
                        <th className="text-right px-2 py-2 font-semibold w-32">Exercice N</th>
                        <th className="text-right px-2 py-2 font-semibold w-32">Exercice N-1</th>
                        <th className="text-right px-2 py-2 font-semibold w-24">Variation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.lines.map((line, i) => {
                        const delta = line.montantN - line.montantN1;
                        const isTotal = line.type === 'total';
                        const isSousTotal = line.type === 'sous-total';
                        const isSous = line.type === 'sous-rubrique';
                        return (
                          <tr
                            key={i}
                            className={`border-t border-neutral-50 hover:bg-neutral-50/30 transition-colors ${
                              isTotal ? 'bg-neutral-100 border-t-2 border-neutral-200' :
                              isSousTotal ? 'bg-neutral-50/60 font-semibold' : ''
                            }`}
                          >
                            <td className={`px-4 py-2 font-mono text-xs ${isTotal ? 'font-bold' : ''}`} style={{ color: isTotal || isSousTotal ? cat.color : '#64748B' }}>
                              {line.code}
                            </td>
                            <td className={`px-2 py-2 text-xs ${isSous ? 'pl-8 text-neutral-500' : isTotal ? 'font-bold text-neutral-800' : isSousTotal ? 'font-semibold text-neutral-700' : 'text-neutral-700'}`}>
                              {line.label}
                            </td>
                            <td className={`px-2 py-2 text-right font-mono text-xs ${
                              isTotal ? 'font-bold' : ''
                            }`} style={{ color: isTotal || isSousTotal ? cat.color : '' }}>
                              {fmt(line.montantN)}
                            </td>
                            <td className="px-2 py-2 text-right font-mono text-xs text-neutral-500">
                              {fmt(line.montantN1)}
                            </td>
                            <td className="px-2 py-2 text-right">
                              {!isSous && line.montantN1 !== 0 && (
                                <span className={`text-[11px] font-bold ${delta >= 0 ? 'text-success' : 'text-danger'}`}>
                                  {delta >= 0 ? '+' : ''}{Math.round((delta / Math.abs(line.montantN1)) * 100)} %
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recap trésorerie */}
      <div className="card bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary">
        <h3 className="text-sm font-bold text-neutral-700 mb-3">Réconciliation trésorerie</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
          <ReconRow label="Trésorerie à l'ouverture (D)" value={tresoOuverture} mono />
          <ReconRow label="+ Flux activité (A)" value={60_850_000} color="text-success" mono />
          <ReconRow label="+ Flux investissements (B)" value={-7_300_000} color="text-warning" mono />
          <ReconRow label="+ Flux financement (C)" value={-10_500_000} color="text-secondary" mono />
        </div>
        <div className="mt-4 pt-3 border-t border-primary/20 flex items-center justify-between">
          <span className="text-sm font-bold text-neutral-800">Trésorerie à la clôture (E = D+A+B+C)</span>
          <span className="text-xl font-bold font-mono text-primary">{fmt(tresoCloture)} XOF</span>
        </div>
      </div>

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-700">Analyse des flux</div>
          <ul className="mt-1.5 space-y-1 text-xs text-neutral-700">
            <li><strong>CAF en hausse</strong> de <strong className="text-success">+20,8 %</strong> vs N-1 — meilleure capacité à financer la croissance en interne.</li>
            <li><strong>BFR en augmentation</strong> ({fmt(8_400_000)} XOF) — surveiller le DSO clients (47j vs 35-40j cible secteur).</li>
            <li><strong>Versement de dividendes</strong> ({fmt(8_000_000)} XOF) — décision saine au regard de la CAF générée.</li>
            <li><strong>Trésorerie nette positive</strong> de <strong className="text-success">+{fmt(variationTresorerie)} XOF</strong> sur l'exercice — situation saine.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, tone, icon: Icon }: { label: string; value: string; sub: string; tone: 'success' | 'danger' | 'warning' | 'info' | 'primary'; icon: React.ElementType }) {
  const tones = { success: 'text-success', danger: 'text-danger', warning: 'text-warning', info: 'text-secondary', primary: 'text-primary' };
  return (
    <div className="card">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">
        <Icon size={11} className={tones[tone]} /> {label}
      </div>
      <div className={`mt-1.5 text-lg font-bold font-mono ${tones[tone]}`}>{value}</div>
      <div className="text-[11px] text-neutral-500 mt-0.5">{sub}</div>
    </div>
  );
}

function ReconRow({ label, value, color = 'text-neutral-800', mono }: { label: string; value: number; color?: string; mono?: boolean }) {
  return (
    <div className="rounded-lg bg-white border border-neutral-100 p-3">
      <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-semibold">{label}</div>
      <div className={`mt-1 text-sm font-bold ${color} ${mono ? 'font-mono' : ''}`}>{fmt(value)} XOF</div>
    </div>
  );
}

