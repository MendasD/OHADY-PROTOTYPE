import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  Layout as LayoutIcon, Plus, Settings, Sparkles, GripVertical, Edit2,
  TrendingUp, TrendingDown, ArrowRight, Eye, EyeOff,
} from 'lucide-react';
import { fmtXOF, fmt } from '../data/mockData';
import { usePersona } from '../context/PersonaContext';

interface Widget {
  id: string;
  title: string;
  type: 'kpi' | 'chart-area' | 'chart-bar' | 'chart-line' | 'chart-radial' | 'list';
  size: 'sm' | 'md' | 'lg';
  visible: boolean;
}

const widgetsBase: Widget[] = [
  { id: 'w1', title: 'Trésorerie globale',          type: 'kpi',         size: 'sm', visible: true },
  { id: 'w2', title: 'CA cumulé YTD',                type: 'kpi',         size: 'sm', visible: true },
  { id: 'w3', title: 'Marge nette',                  type: 'kpi',         size: 'sm', visible: true },
  { id: 'w4', title: 'Évolution mensuelle CA',       type: 'chart-area',  size: 'lg', visible: true },
  { id: 'w5', title: 'Mix activité par produit',    type: 'chart-bar',   size: 'md', visible: true },
  { id: 'w6', title: 'Encours clients (top 5)',     type: 'list',        size: 'md', visible: true },
  { id: 'w7', title: 'KPI réseau social interne',   type: 'chart-line',  size: 'md', visible: false },
  { id: 'w8', title: 'Atteinte budget par poste',    type: 'chart-radial',size: 'md', visible: true },
];

const caData = [
  { mois: 'Sep', ca: 38_200_000 }, { mois: 'Oct', ca: 42_100_000 }, { mois: 'Nov', ca: 39_800_000 },
  { mois: 'Déc', ca: 45_300_000 }, { mois: 'Jan', ca: 41_400_000 }, { mois: 'Fév', ca: 43_700_000 },
  { mois: 'Mar', ca: 47_200_000 }, { mois: 'Avr', ca: 44_900_000 }, { mois: 'Mai', ca: 47_850_000 },
];

const mixActivite = [
  { name: 'Audit',   v: 22_400_000 }, { name: 'Outsourcing', v: 12_800_000 },
  { name: 'Software', v: 5_400_000 }, { name: 'Formation',    v: 4_800_000 },
  { name: 'Support',  v: 2_450_000 },
];

const topClients = [
  { name: 'SONES',                montant: 8_400_000,  trend: +12 },
  { name: 'Ministère Finances',   montant: 12_600_000, trend: -8 },
  { name: 'Orange Sénégal',       montant: 7_500_000,  trend: +5 },
  { name: 'SENELEC',              montant: 5_800_000,  trend: 0 },
  { name: 'Tech Solutions SARL',  montant: 3_500_000,  trend: +18 },
];

const budgetRadial = [
  { name: 'Salaires',     value: 87, fill: '#27AE60' },
  { name: 'Loyer',         value: 100, fill: '#E67E22' },
  { name: 'Marketing',    value: 95, fill: '#F39C12' },
  { name: 'IT',           value: 67, fill: '#2980B9' },
];

const tdbPresets = [
  { id: 'p1', label: 'Vue DAF',            description: 'Tableau d\'ensemble : trésorerie, marge, budget, alertes' },
  { id: 'p2', label: 'Vue dirigeant',      description: 'CA, résultat, projections, événements clés' },
  { id: 'p3', label: 'Vue contrôle',       description: 'Suivi écarts budgétaires, anomalies, échéances' },
  { id: 'p4', label: 'Vue commerciale',    description: 'Pipeline, conversion, top clients, backlog' },
];

export default function PilotageTDB() {
  const { persona } = usePersona();
  const [widgets, setWidgets] = useState(widgetsBase);
  const [editMode, setEditMode] = useState(false);

  const toggleWidget = (id: string) => setWidgets(prev =>
    prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w)
  );

  const visibleWidgets = widgets.filter(w => w.visible);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <LayoutIcon size={20} className="text-secondary" /> Cockpit personnalisé
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Widgets configurables · Profil actif : <span className="font-semibold text-neutral-700">{persona.name}</span> · Différent du <span className="font-medium">Tableau de bord</span> qui propose une vue prête à l'emploi</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditMode(!editMode)} className={`btn btn-sm ${editMode ? 'btn-primary' : 'btn-outline'}`}>
            <Edit2 size={12} /> {editMode ? 'Terminer' : 'Personnaliser'}
          </button>
          <button className="btn btn-outline btn-sm"><Plus size={12} /> Nouveau widget</button>
          <button className="btn btn-outline btn-sm"><Settings size={12} /></button>
        </div>
      </div>

      {/* Presets */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={13} className="text-purple-500" />
          <h3 className="text-sm font-bold text-neutral-700">Tableaux pré-configurés</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {tdbPresets.map(p => (
            <button key={p.id} className="card-sm text-left transition-all hover:shadow-card-md hover:border-secondary border-2 border-transparent">
              <div className="text-xs font-bold text-neutral-800">{p.label}</div>
              <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{p.description}</p>
              <div className="mt-2 text-[11px] text-secondary font-semibold inline-flex items-center gap-1">
                Charger <ArrowRight size={11} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mode édition : sélection widgets */}
      {editMode && (
        <div className="card bg-blue-50/30 border-l-4 border-secondary">
          <div className="flex items-center gap-2 mb-3">
            <GripVertical size={14} className="text-secondary" />
            <h3 className="text-sm font-bold text-neutral-700">Widgets disponibles ({widgets.length})</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
            {widgets.map(w => (
              <button
                key={w.id}
                onClick={() => toggleWidget(w.id)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                  w.visible
                    ? 'border-secondary bg-white shadow-sm'
                    : 'border-neutral-200 bg-neutral-50 opacity-60'
                }`}
              >
                {w.visible ? <Eye size={11} className="text-secondary" /> : <EyeOff size={11} className="text-neutral-400" />}
                <span className="truncate">{w.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {visibleWidgets.filter(w => w.type === 'kpi').map(w => {
          let value = '', trend = 0, sub = '';
          if (w.id === 'w1') { value = fmtXOF(23_415_000); trend = +5.2; sub = 'vs avril'; }
          if (w.id === 'w2') { value = fmtXOF(380_400_000); trend = +12.4; sub = 'YTD 2026'; }
          if (w.id === 'w3') { value = '12,4 %'; trend = +1.8; sub = '+1,8 pt vs N-1'; }
          return (
            <div key={w.id} className="card relative">
              {editMode && <DragHandle />}
              <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">{w.title}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary">{value}</span>
                <span className={`text-[10px] font-bold inline-flex items-center gap-0.5 ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
                  {trend >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">{sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Évolution CA */}
        {visibleWidgets.find(w => w.id === 'w4') && (
          <div className="card xl:col-span-2 relative">
            {editMode && <DragHandle />}
            <h3 className="text-sm font-bold text-neutral-700 mb-3">Évolution mensuelle CA</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={caData} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="caTDB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2980B9" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2980B9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
                <Tooltip formatter={(v: any) => fmtXOF(Number(v))} contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="ca" stroke="#2980B9" strokeWidth={2.5} fill="url(#caTDB)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Mix activité */}
        {visibleWidgets.find(w => w.id === 'w5') && (
          <div className="card relative">
            {editMode && <DragHandle />}
            <h3 className="text-sm font-bold text-neutral-700 mb-3">Mix activité — Familles</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mixActivite} layout="vertical" margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip formatter={(v: any) => fmtXOF(Number(v))} contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="v" radius={[0, 3, 3, 0]} fill="#9B59B6" maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top clients */}
        {visibleWidgets.find(w => w.id === 'w6') && (
          <div className="card xl:col-span-2 relative">
            {editMode && <DragHandle />}
            <h3 className="text-sm font-bold text-neutral-700 mb-3">Encours clients — Top 5</h3>
            <div className="space-y-2">
              {topClients.map(c => (
                <div key={c.name} className="flex items-center gap-3 py-1.5">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 grid place-items-center text-secondary text-xs font-bold flex-shrink-0">
                    {c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-neutral-800 truncate">{c.name}</div>
                    <div className="h-1 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${Math.min(100, c.montant / 12_600_000 * 100)}%` }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-mono font-bold text-neutral-800">{fmt(c.montant)}</div>
                    <div className={`text-[10px] font-bold ${c.trend > 0 ? 'text-success' : c.trend < 0 ? 'text-danger' : 'text-neutral-400'}`}>
                      {c.trend > 0 ? '+' : ''}{c.trend} %
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Atteinte budget radial */}
        {visibleWidgets.find(w => w.id === 'w8') && (
          <div className="card relative">
            {editMode && <DragHandle />}
            <h3 className="text-sm font-bold text-neutral-700 mb-3">Atteinte budget — Top postes</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart innerRadius="30%" outerRadius="100%" data={budgetRadial} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={6} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => `${v} %`} />
              </RadialBarChart>
            </ResponsiveContainer>
            <ul className="mt-2 space-y-1 text-[11px]">
              {budgetRadial.map(b => (
                <li key={b.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: b.fill }} />
                  <span className="text-neutral-600 flex-1">{b.name}</span>
                  <span className="font-bold font-mono" style={{ color: b.fill }}>{b.value} %</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-700">Recommandation IA</div>
          <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
            Pour le profil <strong>{persona.shortRole}</strong>, l'IA recommande d'ajouter le widget
            <strong> Pipeline commercial</strong> et <strong>Cash gap projeté J+90</strong>.
            <button className="ml-1 text-purple-600 font-semibold hover:underline inline-flex items-center gap-0.5">
              Activer ces widgets <ArrowRight size={11} />
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}

function DragHandle() {
  return (
    <button className="absolute top-2 right-2 w-6 h-6 grid place-items-center rounded-md bg-neutral-100 text-neutral-400 hover:bg-neutral-200 cursor-grab transition-colors">
      <GripVertical size={12} />
    </button>
  );
}
