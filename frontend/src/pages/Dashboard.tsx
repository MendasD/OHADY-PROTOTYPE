import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ComposedChart, Bar, Line,
} from 'recharts';
import {
  TrendingUp, Wallet, Clock, BarChart3,
  ArrowUpRight, ArrowDownRight, Download,
  AlertTriangle, AlertCircle, Info, CheckCircle, ArrowRight,
  Receipt, ShuffleIcon, Sparkles, FileCheck, Calculator, FileText,
} from 'lucide-react';
import { kpiCards, revenueData, budgetLines, cashForecast, alerts } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { usePersona, type PersonaId } from '../context/PersonaContext';

const iconMap: Record<string, React.ElementType> = { TrendingUp, Wallet, Clock, BarChart3 };

const alertIcons: Record<string, React.ElementType> = {
  error: AlertTriangle, warning: AlertCircle, info: Info, success: CheckCircle,
};
const alertStyles: Record<string, { bg: string; icon: string; border: string }> = {
  error:   { bg: 'bg-red-50',    icon: 'text-red-500',    border: 'border-red-200' },
  warning: { bg: 'bg-orange-50', icon: 'text-orange-500', border: 'border-orange-200' },
  info:    { bg: 'bg-blue-50',   icon: 'text-blue-500',   border: 'border-blue-200' },
  success: { bg: 'bg-green-50',  icon: 'text-green-500',  border: 'border-green-200' },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-neutral-100 rounded-xl shadow-card-md p-3 text-xs">
      <div className="font-semibold text-neutral-700 mb-2">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-neutral-500">{p.name} :</span>
          <span className="font-semibold text-neutral-800">{(p.value / 1000000).toFixed(1)}M XOF</span>
        </div>
      ))}
    </div>
  );
};

interface QuickAction { label: string; icon: React.ElementType; path: string; primary?: boolean }

const personaActions: Record<PersonaId, QuickAction[]> = {
  hermann: [
    { label: 'Plan de trésorerie', icon: Wallet, path: '/prevision', primary: true },
    { label: 'Scénarios',          icon: Sparkles, path: '/modelisation' },
    { label: 'États financiers',   icon: FileCheck, path: '/etats-financiers' },
  ],
  elis: [
    { label: 'Nouveau scénario',   icon: Sparkles, path: '/modelisation', primary: true },
    { label: 'Budget',             icon: Calculator, path: '/budget' },
    { label: 'Analytique',         icon: BarChart3, path: '/analytique' },
  ],
  doudou: [
    { label: 'Valider en lot',     icon: CheckCircle, path: '/comptabilite', primary: true },
    { label: 'Clôture mensuelle',  icon: FileCheck, path: '/cloture-m' },
    { label: 'Anomalies',          icon: AlertTriangle, path: '/anomalies' },
  ],
  awa: [
    { label: "Saisir une écriture", icon: Receipt, path: '/saisie', primary: true },
    { label: 'Rapprochement',       icon: ShuffleIcon, path: '/rapprochement' },
    { label: 'Pile factures',       icon: FileText, path: '/achats-inbox' },
  ],
  issa: [
    { label: 'Réviser le dossier', icon: FileCheck, path: '/comptabilite', primary: true },
    { label: 'Liasses',             icon: FileText, path: '/liasses' },
    { label: 'Anomalies',           icon: AlertTriangle, path: '/anomalies' },
  ],
};

const personaIntro: Record<PersonaId, { greeting: string; subtitle: string; highlight: string }> = {
  hermann: {
    greeting: 'Vision pilotage du jour',
    subtitle: '5 dossiers à analyser, trésorerie sur seuil bas le 22 mai',
    highlight: 'EBITDA mensuel +12,4% vs avril',
  },
  elis: {
    greeting: 'Vos modèles & scénarios',
    subtitle: 'Scénario base à comparer au réalisé Q2 — écart -3,1%',
    highlight: '3 scénarios actifs',
  },
  doudou: {
    greeting: 'À valider aujourd\'hui',
    subtitle: '18 écritures soumises par Awa, 3 anomalies détectées par l\'IA',
    highlight: '8 jours avant clôture mensuelle',
  },
  awa: {
    greeting: 'Vos tâches du jour',
    subtitle: '12 factures fournisseurs à traiter, rapprochement SGBS en attente',
    highlight: '5 écritures en brouillon',
  },
  issa: {
    greeting: 'Dossier Tech Solutions SARL',
    subtitle: 'Revue de cohérence — 2 points à clarifier avec le client',
    highlight: 'Liasse DSF en préparation',
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { persona } = usePersona();
  const [activeKpi, setActiveKpi] = useState<string | null>(null);

  const totalBudget = budgetLines.reduce((s, l) => s + l.budget, 0);
  const totalRealise = budgetLines.reduce((s, l) => s + l.realise, 0);

  const actions = personaActions[persona.id];
  const intro = personaIntro[persona.id];

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Persona hero banner */}
      <div
        className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-card"
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ background: `radial-gradient(circle at 0% 0%, ${persona.color}, transparent 60%), radial-gradient(circle at 100% 100%, ${persona.accent}, transparent 60%)` }}
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: `linear-gradient(180deg, ${persona.color}, ${persona.accent})` }}
        />
        <div className="relative flex flex-wrap items-center gap-4 px-5 py-4">
          <div
            className="w-14 h-14 rounded-2xl grid place-items-center text-white font-bold text-lg flex-shrink-0 shadow-md"
            style={{ background: `linear-gradient(135deg, ${persona.color}, ${persona.accent})` }}
          >
            {persona.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: persona.color }}>
                {persona.shortRole}
              </span>
              {persona.scope === 'externe' && (
                <span className="badge badge-blue text-[10px]">Cabinet externe</span>
              )}
            </div>
            <h1 className="text-lg font-bold text-neutral-800 mt-0.5">Bonjour {persona.name.split(' ')[0]} — {intro.greeting}</h1>
            <p className="text-xs text-neutral-500 mt-0.5">{intro.subtitle}</p>
          </div>
          <div className="hidden md:flex items-center gap-3 pl-4 pr-2 py-2 rounded-xl bg-neutral-50 border border-neutral-100">
            <Sparkles size={14} className="text-secondary" />
            <div>
              <div className="text-[10px] uppercase tracking-wide text-neutral-400">Insight IA</div>
              <div className="text-xs font-semibold text-neutral-700">{intro.highlight}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="page-title">Tableau de bord</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Exercice 2025–2026 · Mise à jour : il y a 2 min</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions.map(a => {
            const Icon = a.icon;
            return (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className={`btn btn-sm ${a.primary ? 'btn-primary' : 'btn-outline'}`}
              >
                <Icon size={13} /> {a.label}
              </button>
            );
          })}
          <button className="btn btn-outline btn-sm">
            <Download size={13} /> Exporter
          </button>
        </div>
      </div>

      {/* KPI financiers — DSO / DPO / BFR / Cash conversion */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <FinKpi label="DSO" value="47 j" sub="Délai encaissement clients" trend={-3} target="Cible 40 j" tone={47 > 40 ? 'warning' : 'success'} />
        <FinKpi label="DPO" value="38 j" sub="Délai paiement fournisseurs" trend={+2} target="Optimum 30-45 j" tone="success" />
        <FinKpi label="BFR / CA" value="18,2 %" sub="Besoin en fonds de roulement" trend={-0.4} target="< 20 %" tone="success" />
        <FinKpi label="Taux recouvrement" value="92,4 %" sub="Factures payées à échéance" trend={+1.8} target="Cible > 90 %" tone="success" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(kpi => {
          const Icon = iconMap[kpi.icon] || TrendingUp;
          const isUp = kpi.change > 0;
          const isGood = isUp === kpi.goodWhenUp;
          return (
            <div
              key={kpi.id}
              onClick={() => setActiveKpi(activeKpi === kpi.id ? null : kpi.id)}
              className="card cursor-pointer hover:shadow-card-md transition-all duration-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(41,128,185,0.02), rgba(41,128,185,0.05))' }} />
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                  <Icon size={20} className={kpi.iconColor} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  isGood ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              <div className="text-2xl font-bold text-neutral-800 leading-none mb-1">
                {kpi.value}
                <span className="text-sm font-medium text-neutral-400 ml-1.5">XOF</span>
              </div>
              <div className="text-xs font-medium text-neutral-500 mt-2">{kpi.label}</div>
              <div className="text-xs text-neutral-400 mt-0.5">{kpi.changeLabel}</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Revenue chart */}
        <div className="card xl:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Chiffre d'affaires vs Charges</h2>
              <p className="text-xs text-neutral-400 mt-0.5">8 derniers mois · en millions XOF</p>
            </div>
            <select className="select text-xs w-auto py-1.5" style={{ width: 'auto', padding: '6px 12px' }}>
              <option>8 derniers mois</option>
              <option>12 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Bar dataKey="ca" name="CA" fill="#2980B9" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="charges" name="Charges" fill="#E2E8F0" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Line dataKey="ca" stroke="#1A3C5E" dot={false} strokeWidth={0} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Budget consumption */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Budget vs Réalisé</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Mai 2026 · consommation</p>
            </div>
            <button onClick={() => navigate('/budget')} className="btn-ghost btn-sm btn text-xs">
              Détail <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-3.5">
            {budgetLines.slice(0, 5).map(line => {
              const pct = Math.round((line.realise + line.engagement) / line.budget * 100);
              const realPct = Math.round(line.realise / line.budget * 100);
              const isOver = pct > 100;
              return (
                <div key={line.rubric}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-600 truncate pr-2">{line.rubric}</span>
                    <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-neutral-600'}`}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full flex">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${Math.min(realPct, 100)}%`, transition: 'width 0.6s ease' }} />
                      <div className="h-full bg-secondary/30" style={{ width: `${Math.min(pct - realPct, 100 - realPct)}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                    <span>{(line.realise / 1000000).toFixed(1)}M réalisé</span>
                    <span>/{(line.budget / 1000000).toFixed(1)}M budget</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between text-xs">
            <span className="text-neutral-500">Total budget</span>
            <span className="font-bold text-neutral-800">{(totalRealise / 1000000).toFixed(1)}M / {(totalBudget / 1000000).toFixed(1)}M XOF</span>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Cash forecast */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Prévision de trésorerie — J+30</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Solde projeté · encaissements / décaissements</p>
            </div>
            <button onClick={() => navigate('/prevision')} className="btn-ghost btn-sm btn text-xs">
              Voir tout <ArrowRight size={11} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={cashForecast} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="soldeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2980B9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2980B9" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="solde" name="Solde prévu" stroke="#2980B9" strokeWidth={2} fill="url(#soldeGradient)" dot={false} />
              <Area type="monotone" dataKey="encaissements" name="Encaissements" stroke="#27AE60" strokeWidth={1.5} fill="none" strokeDasharray="4 2" dot={false} />
              <Area type="monotone" dataKey="decaissements" name="Décaissements" stroke="#E74C3C" strokeWidth={1.5} fill="none" strokeDasharray="4 2" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-3 gap-3 pt-3 border-t border-neutral-100">
            {[
              { label: 'Solde actuel', value: '23,4M', color: 'text-secondary' },
              { label: 'Min prévu', value: '20,2M', color: 'text-orange-500' },
              { label: 'Max prévu', value: '28,1M', color: 'text-success' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className={`text-base font-bold ${item.color}`}>{item.value}</div>
                <div className="text-[10px] text-neutral-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Alertes actives</h2>
            <span className="badge badge-red">{alerts.filter(a => a.type === 'error' || a.type === 'warning').length}</span>
          </div>
          <div className="space-y-2.5">
            {alerts.slice(0, 5).map(alert => {
              const Icon = alertIcons[alert.type];
              const style = alertStyles[alert.type];
              return (
                <div key={alert.id} className={`flex gap-3 p-3 rounded-lg border ${style.bg} ${style.border}`}>
                  <Icon size={15} className={`${style.icon} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-neutral-800 leading-snug">{alert.title}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5 leading-snug">{alert.description}</div>
                    {alert.action && (
                      <button className={`text-[10px] font-semibold mt-1.5 ${style.icon} hover:underline`}>
                        {alert.action} →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-3 py-2 text-xs text-secondary font-medium hover:bg-blue-50 rounded-lg transition-colors">
            Voir toutes les alertes →
          </button>
        </div>
      </div>
    </div>
  );
}

function FinKpi({ label, value, sub, trend, target, tone }: { label: string; value: string; sub: string; trend: number; target: string; tone: 'success' | 'warning' | 'danger' }) {
  const tones = { success: 'text-success border-green-200 bg-green-50/40', warning: 'text-warning border-orange-200 bg-orange-50/40', danger: 'text-danger border-red-200 bg-red-50/40' };
  const dotColor = { success: '#27AE60', warning: '#F39C12', danger: '#E74C3C' }[tone];
  return (
    <div className={`rounded-xl border p-3 ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">{label}</span>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className={`text-xl font-bold font-mono ${tones[tone].split(' ')[0]}`}>{value}</span>
        <span className={`text-[10px] font-bold ${trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-neutral-400'}`}>
          {trend > 0 ? '+' : ''}{trend}
        </span>
      </div>
      <div className="text-[11px] text-neutral-500 mt-0.5">{sub}</div>
      <div className="text-[10px] text-neutral-400 mt-0.5">{target}</div>
    </div>
  );
}
