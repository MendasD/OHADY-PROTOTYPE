import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import {
  TrendingUp, Briefcase, Users, Clock, BarChart3, Calculator,
  ChevronDown, ChevronRight, ChevronUp, Info, Sparkles, Plus, Copy, RotateCcw,
  ArrowRight, Building2, Calendar, Settings2,
} from 'lucide-react';

const fmtXOF = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' XOF';
const fmtM = (n: number) => `${(n / 1_000_000).toFixed(1)} M`;
const fmtPct = (n: number) => `${n.toFixed(1).replace('.', ',')} %`;

// ─── Entreprise ──────────────────────────────────────────────────────────────
const ENTREPRISE = {
  nom: 'Tech Solutions SARL',
  secteur: 'Services aux entreprises — Conseil & ingénierie B2B',
  sousSecteur: 'Conseil opérationnel + IT services',
  zone: 'Sénégal · UEMOA · SYSCOHADA',
};

// ─── Scénarios ───────────────────────────────────────────────────────────────
type ScenarioId = 'pessimiste' | 'base' | 'optimiste';
type Horizon = 3 | 5 | 10;

interface Hypotheses {
  // Macro & fiscalité
  inflation: number;          // %
  croissanceUEMOA: number;    // %
  is: number;                  // %
  // Pyramide & RH
  etpJunior: number; etpConsultant: number; etpSenior: number; etpManager: number; etpPartner: number;
  croissanceEtp: number;       // %/an
  turnover: number;            // %
  // Capacité & utilization
  joursOuvrables: number;      // /an
  joursFormation: number;
  joursCommercial: number;
  utilizationJunior: number;    // %
  utilizationConsultant: number;
  utilizationSenior: number;
  utilizationManager: number;
  utilizationPartner: number;
  // TJM par grade (FCFA/jour)
  tjmJunior: number;
  tjmConsultant: number;
  tjmSenior: number;
  tjmManager: number;
  tjmPartner: number;
  evolTJM: number;             // %/an
  // Pipeline commercial
  hitRate: number;              // %
  valeurMoyMission: number;    // FCFA
  cycleVente: number;          // jours
  // Charges de structure
  loyer: number;                // /an
  itMarketing: number;          // /an
  sousTraitance: number;        // /an
  evolCharges: number;          // %/an
  // Salaires chargés moyens par grade (FCFA/an)
  coutJunior: number;
  coutConsultant: number;
  coutSenior: number;
  coutManager: number;
  coutPartner: number;
}

const baseHypo: Hypotheses = {
  inflation: 3.2,    croissanceUEMOA: 6.1,   is: 30,
  etpJunior: 8, etpConsultant: 6, etpSenior: 4, etpManager: 2, etpPartner: 1,
  croissanceEtp: 12, turnover: 18,
  joursOuvrables: 220, joursFormation: 10, joursCommercial: 15,
  utilizationJunior: 65, utilizationConsultant: 70, utilizationSenior: 75, utilizationManager: 60, utilizationPartner: 35,
  tjmJunior: 120_000, tjmConsultant: 180_000, tjmSenior: 250_000, tjmManager: 380_000, tjmPartner: 550_000,
  evolTJM: 5,
  hitRate: 32, valeurMoyMission: 18_500_000, cycleVente: 65,
  loyer: 18_000_000, itMarketing: 22_000_000, sousTraitance: 35_000_000, evolCharges: 4,
  coutJunior: 6_200_000, coutConsultant: 9_800_000, coutSenior: 16_500_000, coutManager: 28_000_000, coutPartner: 52_000_000,
};

const scenarios: Record<ScenarioId, { id: ScenarioId; label: string; description: string; color: string; bg: string; border: string; hypo: Hypotheses }> = {
  pessimiste: {
    id: 'pessimiste', label: 'Pessimiste',
    description: 'Ralentissement régional, perte de 2 clients majeurs, gel embauches',
    color: '#E67E22', bg: 'bg-orange-50', border: 'border-orange-200',
    hypo: {
      ...baseHypo,
      croissanceUEMOA: 3.4, croissanceEtp: 2, turnover: 26,
      utilizationJunior: 55, utilizationConsultant: 58, utilizationSenior: 62, utilizationManager: 48, utilizationPartner: 28,
      tjmJunior: 110_000, tjmConsultant: 165_000, tjmSenior: 230_000, tjmManager: 350_000, tjmPartner: 500_000,
      evolTJM: -2, hitRate: 22, valeurMoyMission: 14_500_000, cycleVente: 85,
      evolCharges: 6,
    },
  },
  base: {
    id: 'base', label: 'Base',
    description: 'Croissance régulière, fidélisation portefeuille, recrutement maîtrisé',
    color: '#2980B9', bg: 'bg-blue-50', border: 'border-blue-200',
    hypo: baseHypo,
  },
  optimiste: {
    id: 'optimiste', label: 'Optimiste',
    description: 'Gain de 3 grands comptes, pyramide musclée, TJM repositionnés',
    color: '#27AE60', bg: 'bg-green-50', border: 'border-green-200',
    hypo: {
      ...baseHypo,
      croissanceUEMOA: 7.5, croissanceEtp: 22, turnover: 12,
      utilizationJunior: 72, utilizationConsultant: 78, utilizationSenior: 82, utilizationManager: 68, utilizationPartner: 42,
      tjmJunior: 135_000, tjmConsultant: 200_000, tjmSenior: 280_000, tjmManager: 420_000, tjmPartner: 620_000,
      evolTJM: 8, hitRate: 42, valeurMoyMission: 23_500_000, cycleVente: 50,
      evolCharges: 3,
    },
  },
};

// ─── Moteur de calcul ────────────────────────────────────────────────────────
interface YearOutput {
  annee: string;
  ca: number;
  margeDirecte: number;
  ebitda: number;
  resultatNet: number;
  utilizationMoy: number;
  etpTotal: number;
  joursFacturables: number;
}

function computeProjection(h: Hypotheses, horizon: Horizon): YearOutput[] {
  const startYear = 2026;
  const out: YearOutput[] = [];
  let etpJ = h.etpJunior, etpC = h.etpConsultant, etpS = h.etpSenior, etpM = h.etpManager, etpP = h.etpPartner;
  let tjmJ = h.tjmJunior, tjmC = h.tjmConsultant, tjmS = h.tjmSenior, tjmM = h.tjmManager, tjmP = h.tjmPartner;
  let coutJ = h.coutJunior, coutC = h.coutConsultant, coutS = h.coutSenior, coutM = h.coutManager, coutP = h.coutPartner;
  let loyer = h.loyer, itm = h.itMarketing, sousT = h.sousTraitance;

  const joursFact = h.joursOuvrables - h.joursFormation - h.joursCommercial;

  for (let i = 0; i < horizon; i++) {
    const etpTotal = etpJ + etpC + etpS + etpM + etpP;
    const cap = (etpJ * h.utilizationJunior + etpC * h.utilizationConsultant + etpS * h.utilizationSenior
              + etpM * h.utilizationManager + etpP * h.utilizationPartner) / 100 * joursFact;
    const ca =
      etpJ * joursFact * h.utilizationJunior / 100 * tjmJ
      + etpC * joursFact * h.utilizationConsultant / 100 * tjmC
      + etpS * joursFact * h.utilizationSenior / 100 * tjmS
      + etpM * joursFact * h.utilizationManager / 100 * tjmM
      + etpP * joursFact * h.utilizationPartner / 100 * tjmP;
    const masseSalariale = etpJ * coutJ + etpC * coutC + etpS * coutS + etpM * coutM + etpP * coutP;
    const sousTraitanceAnnee = sousT;
    const margeDirecte = ca - masseSalariale - sousTraitanceAnnee;
    const chargesStructure = loyer + itm;
    const ebitda = margeDirecte - chargesStructure;
    const amortissements = ca * 0.02;
    const resultatAvantIS = ebitda - amortissements;
    const impot = Math.max(0, resultatAvantIS) * h.is / 100;
    const resultatNet = resultatAvantIS - impot;
    const utilizationMoy = etpTotal > 0
      ? ((etpJ * h.utilizationJunior + etpC * h.utilizationConsultant + etpS * h.utilizationSenior
        + etpM * h.utilizationManager + etpP * h.utilizationPartner) / etpTotal)
      : 0;

    out.push({
      annee: `${startYear + i}`,
      ca, margeDirecte, ebitda, resultatNet,
      utilizationMoy, etpTotal, joursFacturables: Math.round(cap),
    });

    // Évolution annuelle
    const gEtp = 1 + h.croissanceEtp / 100;
    etpJ *= gEtp; etpC *= gEtp; etpS *= gEtp; etpM *= gEtp; etpP *= gEtp;
    const gTJM = 1 + h.evolTJM / 100;
    tjmJ *= gTJM; tjmC *= gTJM; tjmS *= gTJM; tjmM *= gTJM; tjmP *= gTJM;
    const gCout = 1 + (h.inflation + 1) / 100;
    coutJ *= gCout; coutC *= gCout; coutS *= gCout; coutM *= gCout; coutP *= gCout;
    const gCharges = 1 + h.evolCharges / 100;
    loyer *= gCharges; itm *= gCharges; sousT *= gCharges;
  }
  return out;
}

// ─── UI helpers ──────────────────────────────────────────────────────────────
interface HypoGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  fields: { label: string; key: keyof Hypotheses; unit: string; format?: 'pct' | 'm' | 'k' | 'j' | 'num' }[];
}

const hypoGroups: HypoGroup[] = [
  {
    id: 'macro', title: 'Macro & fiscalité', icon: TrendingUp,
    fields: [
      { label: 'Inflation Sénégal', key: 'inflation', unit: '%', format: 'pct' },
      { label: 'Croissance UEMOA', key: 'croissanceUEMOA', unit: '%', format: 'pct' },
      { label: 'Impôt sur les sociétés', key: 'is', unit: '%', format: 'pct' },
    ],
  },
  {
    id: 'pyramide', title: 'Pyramide effectifs (année 1)', icon: Users,
    fields: [
      { label: 'Junior', key: 'etpJunior', unit: 'ETP', format: 'num' },
      { label: 'Consultant', key: 'etpConsultant', unit: 'ETP', format: 'num' },
      { label: 'Sénior', key: 'etpSenior', unit: 'ETP', format: 'num' },
      { label: 'Manager', key: 'etpManager', unit: 'ETP', format: 'num' },
      { label: 'Partner', key: 'etpPartner', unit: 'ETP', format: 'num' },
      { label: 'Croissance effectifs', key: 'croissanceEtp', unit: '%/an', format: 'pct' },
      { label: 'Turnover', key: 'turnover', unit: '%/an', format: 'pct' },
    ],
  },
  {
    id: 'capacite', title: 'Capacité & utilization', icon: Clock,
    fields: [
      { label: 'Jours ouvrables', key: 'joursOuvrables', unit: 'j/an', format: 'j' },
      { label: 'Jours de formation', key: 'joursFormation', unit: 'j/an', format: 'j' },
      { label: 'Jours commerciaux', key: 'joursCommercial', unit: 'j/an', format: 'j' },
      { label: 'Utilization Junior', key: 'utilizationJunior', unit: '%', format: 'pct' },
      { label: 'Utilization Consultant', key: 'utilizationConsultant', unit: '%', format: 'pct' },
      { label: 'Utilization Sénior', key: 'utilizationSenior', unit: '%', format: 'pct' },
      { label: 'Utilization Manager', key: 'utilizationManager', unit: '%', format: 'pct' },
      { label: 'Utilization Partner', key: 'utilizationPartner', unit: '%', format: 'pct' },
    ],
  },
  {
    id: 'tjm', title: 'TJM par grade', icon: Calculator,
    fields: [
      { label: 'TJM Junior', key: 'tjmJunior', unit: 'XOF/j', format: 'k' },
      { label: 'TJM Consultant', key: 'tjmConsultant', unit: 'XOF/j', format: 'k' },
      { label: 'TJM Sénior', key: 'tjmSenior', unit: 'XOF/j', format: 'k' },
      { label: 'TJM Manager', key: 'tjmManager', unit: 'XOF/j', format: 'k' },
      { label: 'TJM Partner', key: 'tjmPartner', unit: 'XOF/j', format: 'k' },
      { label: 'Évolution TJM', key: 'evolTJM', unit: '%/an', format: 'pct' },
    ],
  },
  {
    id: 'pipeline', title: 'Pipeline commercial', icon: Briefcase,
    fields: [
      { label: 'Hit-rate', key: 'hitRate', unit: '%', format: 'pct' },
      { label: 'Valeur moyenne mission', key: 'valeurMoyMission', unit: 'XOF', format: 'm' },
      { label: 'Cycle de vente', key: 'cycleVente', unit: 'jours', format: 'j' },
    ],
  },
  {
    id: 'structure', title: 'Charges de structure', icon: Building2,
    fields: [
      { label: 'Loyer & immobilier', key: 'loyer', unit: 'XOF/an', format: 'm' },
      { label: 'IT & marketing', key: 'itMarketing', unit: 'XOF/an', format: 'm' },
      { label: 'Sous-traitance', key: 'sousTraitance', unit: 'XOF/an', format: 'm' },
      { label: 'Évolution charges', key: 'evolCharges', unit: '%/an', format: 'pct' },
    ],
  },
];

function formatValue(v: number, fmt?: HypoGroup['fields'][number]['format']) {
  switch (fmt) {
    case 'pct': return fmtPct(v);
    case 'm': return `${fmtM(v)} XOF`;
    case 'k': return `${(v / 1000).toFixed(0)} k XOF`;
    case 'j': return `${v} j`;
    case 'num': return v.toString();
    default: return v.toString();
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Modelisation() {
  const [scenario, setScenario] = useState<ScenarioId>('base');
  const [horizon, setHorizon] = useState<Horizon>(5);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showHypotheses, setShowHypotheses] = useState(false);

  const activeScenario = scenarios[scenario];
  const projection = computeProjection(activeScenario.hypo, horizon);

  // Comparison data across scenarios on same horizon
  const comparison = (['pessimiste', 'base', 'optimiste'] as ScenarioId[]).map(id => {
    const p = computeProjection(scenarios[id].hypo, horizon);
    const last = p[p.length - 1];
    const first = p[0];
    const cagr = first.ca > 0 ? (Math.pow(last.ca / first.ca, 1 / Math.max(1, horizon - 1)) - 1) * 100 : 0;
    return { id, label: scenarios[id].label, color: scenarios[id].color, last, first, cagr };
  });

  const toggleGroup = (id: string) => setCollapsed(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-5">
      {/* Header — entreprise fixée */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary">Modélisation financière</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Construction de scénarios pluri-annuels à partir d'hypothèses paramétrables.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5">
            {([3, 5, 10] as Horizon[]).map(h => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  horizon === h ? 'bg-secondary text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {h} ans
              </button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm"><Copy size={12} /> Dupliquer</button>
          <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouveau scénario</button>
        </div>
      </div>

      {/* Bandeau entreprise (secteur figé) */}
      <div className="card flex items-center gap-4 border-l-4 border-primary">
        <div className="w-11 h-11 rounded-xl bg-primary text-white grid place-items-center text-base font-bold flex-shrink-0">
          TS
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-neutral-800">{ENTREPRISE.nom}</span>
            <span className="badge badge-blue text-[10px]">{ENTREPRISE.zone}</span>
          </div>
          <div className="text-xs text-neutral-600 mt-0.5">
            <strong>Secteur :</strong> {ENTREPRISE.secteur} <span className="text-neutral-400">·</span> <span className="text-neutral-500">{ENTREPRISE.sousSecteur}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] text-neutral-500">
          <Calendar size={12} /> Démarrage exercice 2026
        </div>
      </div>

      {/* Bandeau scénarios */}
      <div>
        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 flex items-center gap-2">
          <BarChart3 size={12} /> Scénarios actifs
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {comparison.map(sc => {
            const scDef = scenarios[sc.id];
            const isActive = scenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setScenario(sc.id)}
                className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                  isActive ? `${scDef.bg} ${scDef.border} shadow-md` : 'bg-white border-neutral-100 hover:border-neutral-200'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-2 left-4 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: scDef.color }}>
                    ACTIF
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: scDef.color }}>{sc.label}</span>
                  <span className="text-[10px] text-neutral-500">CAGR {sc.cagr.toFixed(1)}%</span>
                </div>
                <div className="mt-2 text-lg font-bold text-neutral-800">{fmtM(sc.last.ca)} XOF</div>
                <div className="text-[11px] text-neutral-500">CA année {sc.last.annee}</div>
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className="text-neutral-500">EBITDA</span>
                  <span className="font-semibold" style={{ color: scDef.color }}>{fmtM(sc.last.ebitda)} XOF</span>
                </div>
                <p className="mt-2 text-[11px] text-neutral-500 leading-snug">{scDef.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Encart pédagogique */}
      <div className="card border-l-4 border-l-blue-300 bg-blue-50/40 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Info size={14} className="text-blue-600" />
        </div>
        <div className="flex-1 text-xs text-neutral-700 leading-relaxed">
          Les hypothèses ci-dessous nourrissent le moteur de calcul (pyramide × jours facturables × utilization × TJM).
          Le scénario actif alimente directement <strong>Budget & Prévisions</strong> et le <strong>Plan de trésorerie</strong>.
          Modifiez une hypothèse pour voir les projections se recalculer.
          <span className="inline-flex items-center gap-1 ml-1 text-blue-600 font-semibold">
            <Sparkles size={11} /> L'IA peut proposer un set d'hypothèses à partir de votre historique.
          </span>
        </div>
      </div>

      {/* CTA Gérer les hypothèses (visible seulement si fermé) */}
      {!showHypotheses && (
        <button
          onClick={() => setShowHypotheses(true)}
          className="w-full card hover:shadow-card-md transition-all flex items-center gap-3 text-left border-2 border-dashed border-secondary/30 hover:border-secondary bg-secondary/5"
        >
          <div className="w-11 h-11 rounded-xl bg-secondary text-white grid place-items-center flex-shrink-0">
            <Settings2 size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-neutral-800">Gérer les hypothèses</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              Affiner pyramide effectifs, TJM, capacité, pipeline et charges pour recalculer les projections en temps réel.
            </div>
          </div>
          <span className="text-xs font-semibold text-secondary flex items-center gap-1 flex-shrink-0">
            Ouvrir <ChevronDown size={12} />
          </span>
        </button>
      )}

      {/* Projections — graphique */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-700">Projection {horizon} ans — {activeScenario.label}</h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">CA · EBITDA · Résultat net (calculs en temps réel selon les hypothèses)</p>
          </div>
          <div className="text-xs text-neutral-500 flex items-center gap-4">
            <Legend2 color={activeScenario.color} label="CA" />
            <Legend2 color="#6366F1" label="EBITDA" />
            <Legend2 color="#10B981" label="Résultat net" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={projection} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeScenario.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={activeScenario.color} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="annee" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
            <Tooltip formatter={(v: any) => fmtXOF(Number(v))} contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="ca" name="CA" stroke={activeScenario.color} strokeWidth={2.5} fill="url(#caGrad)" />
            <Area type="monotone" dataKey="ebitda" name="EBITDA" stroke="#6366F1" strokeWidth={2} strokeDasharray="4 2" fill="none" />
            <Area type="monotone" dataKey="resultatNet" name="Résultat net" stroke="#10B981" strokeWidth={2} fill="url(#rnGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* P&L synthétique */}
      <div className="card">
        <h3 className="text-sm font-bold text-neutral-700 mb-3">Compte de résultat prévisionnel synthétique</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                <th className="text-left pb-2 font-medium">Exercice</th>
                <th className="text-right pb-2 font-medium">CA</th>
                <th className="text-right pb-2 font-medium">Marge directe</th>
                <th className="text-right pb-2 font-medium">EBITDA</th>
                <th className="text-right pb-2 font-medium">Marge EBITDA</th>
                <th className="text-right pb-2 font-medium">Résultat net</th>
                <th className="text-right pb-2 font-medium">Marge nette</th>
                <th className="text-right pb-2 font-medium">Croissance</th>
              </tr>
            </thead>
            <tbody>
              {projection.map((p, i) => {
                const prev = projection[i - 1];
                const growth = prev ? ((p.ca - prev.ca) / prev.ca * 100) : null;
                return (
                  <tr key={p.annee} className="border-t border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-2.5 font-semibold" style={{ color: activeScenario.color }}>{p.annee}</td>
                    <td className="py-2.5 text-right font-mono font-medium text-neutral-800">{fmtM(p.ca)} M</td>
                    <td className="py-2.5 text-right font-mono text-secondary">{fmtM(p.margeDirecte)} M</td>
                    <td className="py-2.5 text-right font-mono text-indigo-600">{fmtM(p.ebitda)} M</td>
                    <td className="py-2.5 text-right text-neutral-500">{p.ca > 0 ? `${(p.ebitda / p.ca * 100).toFixed(1)} %` : '—'}</td>
                    <td className="py-2.5 text-right font-mono text-success font-semibold">{fmtM(p.resultatNet)} M</td>
                    <td className="py-2.5 text-right text-neutral-500">{p.ca > 0 ? `${(p.resultatNet / p.ca * 100).toFixed(1)} %` : '—'}</td>
                    <td className="py-2.5 text-right">
                      {growth !== null
                        ? <span className={`font-medium ${growth >= 0 ? 'text-success' : 'text-danger'}`}>{growth >= 0 ? '+' : ''}{growth.toFixed(1)}%</span>
                        : <span className="text-neutral-300">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparaison scénarios */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-neutral-700">Comparaison des scénarios — horizon {horizon} ans</h3>
          <span className="badge badge-blue text-[10px]"><BarChart3 size={9} /> CA terminal</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={comparison.map(c => ({ name: c.label, ca: c.last.ca, ebitda: c.last.ebitda, color: c.color }))} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
            <Tooltip formatter={(v: any) => fmtXOF(Number(v))} contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="ca" name="CA" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {comparison.map((c, i) => <Cell key={i} fill={c.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {comparison.map(c => (
            <div key={c.id} className="rounded-xl border border-neutral-100 p-3 bg-neutral-50/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                <span className="text-xs font-bold text-neutral-700">{c.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <Metric label="CA Y1" value={`${fmtM(c.first.ca)} M`} />
                <Metric label={`CA Y${horizon}`} value={`${fmtM(c.last.ca)} M`} highlight />
                <Metric label="CAGR" value={`${c.cagr.toFixed(1)} %`} />
                <Metric label="Util. moy. Y1" value={`${c.first.utilizationMoy.toFixed(0)} %`} />
                <Metric label={`ETP Y${horizon}`} value={`${c.last.etpTotal.toFixed(0)}`} />
                <Metric label={`Marge nette Y${horizon}`} value={`${(c.last.resultatNet / c.last.ca * 100).toFixed(1)} %`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Hypothèses — visible seulement si toggle ON */}
      {showHypotheses && (
        <div className="card !p-0 overflow-hidden border-2 border-secondary/30">
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 bg-secondary/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary text-white grid place-items-center flex-shrink-0">
                <Settings2 size={15} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-800">
                  Hypothèses du scénario · <span style={{ color: activeScenario.color }}>{activeScenario.label}</span>
                </h2>
                <p className="text-[11px] text-neutral-500">Modifiez une valeur pour recalculer les projections en temps réel</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-outline btn-sm"><RotateCcw size={12} /> Réinitialiser</button>
              <button onClick={() => setShowHypotheses(false)} className="btn btn-outline btn-sm">
                <ChevronUp size={12} /> Masquer
              </button>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {hypoGroups.map(group => {
              const Icon = group.icon;
              const isCollapsed = collapsed.has(group.id);
              return (
                <div key={group.id} className="rounded-xl border border-neutral-100 overflow-hidden bg-white">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50/50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-neutral-800">{group.title}</div>
                      <div className="text-[10px] text-neutral-500">{group.fields.length} hypothèses</div>
                    </div>
                    {isCollapsed ? <ChevronRight size={14} className="text-neutral-400" /> : <ChevronDown size={14} className="text-neutral-400" />}
                  </button>
                  {!isCollapsed && (
                    <div className="border-t border-neutral-100 px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {group.fields.map(f => {
                        const value = activeScenario.hypo[f.key];
                        return (
                          <div key={f.key} className="rounded-lg border border-neutral-100 bg-neutral-50/50 px-3 py-2">
                            <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-medium">{f.label}</div>
                            <div className="mt-1 flex items-baseline justify-between gap-2">
                              <span className="text-sm font-bold text-neutral-800 font-mono">{formatValue(value, f.format)}</span>
                              <span className="text-[10px] text-neutral-400">{f.unit}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer — lien vers Budget */}
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-white border border-blue-100 px-4 py-3">
        <div className="text-xs text-neutral-700 flex items-center gap-2">
          <Sparkles size={13} className="text-secondary" />
          Ce scénario alimente <strong>Budget & Prévisions</strong> et le module <strong>Trésorerie / Prévision</strong>.
        </div>
        <button className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
          Voir l'impact budgétaire <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

function Legend2({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-neutral-600">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-neutral-400 text-[10px] uppercase tracking-wide">{label}</div>
      <div className={`font-mono font-semibold ${highlight ? 'text-neutral-900' : 'text-neutral-600'}`}>{value}</div>
    </div>
  );
}
