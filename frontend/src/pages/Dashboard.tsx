import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ComposedChart, Bar, Line,
} from 'recharts';
import {
  TrendingUp, Wallet, Clock, BarChart3,
  ArrowUpRight, ArrowDownRight, Plus, Download, RefreshCw,
  AlertTriangle, AlertCircle, Info, CheckCircle, ArrowRight,
} from 'lucide-react';
import { kpiCards, revenueData, budgetLines, cashForecast, alerts } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeKpi, setActiveKpi] = useState<string | null>(null);

  const totalBudget = budgetLines.reduce((s, l) => s + l.budget, 0);
  const totalRealise = budgetLines.reduce((s, l) => s + l.realise, 0);

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Tableau de bord</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Exercice 2025–2026 · Mise à jour : il y a 2 min</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm">
            <RefreshCw size={13} /> Actualiser
          </button>
          <button className="btn btn-outline btn-sm">
            <Download size={13} /> Exporter
          </button>
          <button className="btn btn-primary btn-sm">
            <Plus size={13} /> Nouvelle saisie
          </button>
        </div>
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
