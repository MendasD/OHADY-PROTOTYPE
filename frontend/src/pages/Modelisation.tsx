import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area, Legend,
} from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';

const fmtXOF = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' XOF';
const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(n));

type Secteur = 'commerce' | 'btp' | 'banque' | 'assurance' | 'industrie';

interface SecteurConfig {
  id: Secteur;
  label: string;
  description: string;
  color: string;
  ratios: { label: string; val: string; benchmark: string; statut: 'ok' | 'warn' | 'bad' }[];
  projections: { annee: string; ca: number; resultat: number; ebitda: number }[];
  indicateurs: { label: string; val: string; unite: string }[];
}

const secteurs: SecteurConfig[] = [
  {
    id: 'commerce',
    label: 'Commerce & Distribution',
    description: 'Modèle adapté aux entreprises de négoce, import-export et distribution en zone OHADA',
    color: '#3B82F6',
    ratios: [
      { label: 'Marge commerciale', val: '38,5%', benchmark: '35–45%', statut: 'ok' },
      { label: 'Rotation des stocks', val: '4,2x', benchmark: '3–6x', statut: 'ok' },
      { label: 'Délai moyen règlement clients', val: '52j', benchmark: '<45j', statut: 'warn' },
      { label: 'Délai moyen règlement fournisseurs', val: '38j', benchmark: '30–60j', statut: 'ok' },
      { label: 'BFR / CA', val: '18,2%', benchmark: '<20%', statut: 'ok' },
      { label: 'Ratio de liquidité', val: '1,45', benchmark: '>1,2', statut: 'ok' },
    ],
    projections: [
      { annee: '2024', ca: 186400000, resultat: 12650000, ebitda: 24100000 },
      { annee: '2025', ca: 204000000, resultat: 14200000, ebitda: 27000000 },
      { annee: '2026', ca: 224400000, resultat: 16100000, ebitda: 30200000 },
      { annee: '2027', ca: 246800000, resultat: 18500000, ebitda: 34100000 },
      { annee: '2028', ca: 271500000, resultat: 21200000, ebitda: 38400000 },
    ],
    indicateurs: [
      { label: 'CA annuel N', val: '186 400 000', unite: 'XOF' },
      { label: 'Effectif', val: '48', unite: 'personnes' },
      { label: 'CA/employé', val: '3 883 333', unite: 'XOF' },
      { label: 'Taux de croissance', val: '9,4', unite: '%/an' },
    ],
  },
  {
    id: 'btp',
    label: 'BTP & Travaux',
    description: 'Modèle pour entreprises du bâtiment, travaux publics et génie civil — OHADA',
    color: '#F59E0B',
    ratios: [
      { label: 'Marge sur travaux', val: '22,1%', benchmark: '18–30%', statut: 'ok' },
      { label: 'Taux d\'avancement moyen', val: '67%', benchmark: '—', statut: 'ok' },
      { label: 'Retenues de garantie / CA', val: '5,8%', benchmark: '<10%', statut: 'ok' },
      { label: 'Délai d\'encaissement marchés publics', val: '84j', benchmark: '<90j', statut: 'ok' },
      { label: 'Charges de personnel / CA', val: '31,4%', benchmark: '<35%', statut: 'ok' },
      { label: 'Dette financière nette / EBITDA', val: '2,8x', benchmark: '<3x', statut: 'warn' },
    ],
    projections: [
      { annee: '2024', ca: 320000000, resultat: 18500000, ebitda: 42000000 },
      { annee: '2025', ca: 368000000, resultat: 22100000, ebitda: 49000000 },
      { annee: '2026', ca: 423200000, resultat: 26500000, ebitda: 57000000 },
      { annee: '2027', ca: 486700000, resultat: 31800000, ebitda: 66400000 },
      { annee: '2028', ca: 559700000, resultat: 38200000, ebitda: 77300000 },
    ],
    indicateurs: [
      { label: 'Carnet de commandes', val: '890 000 000', unite: 'XOF' },
      { label: 'Projets en cours', val: '7', unite: 'chantiers' },
      { label: 'Effectif (dont intérimaires)', val: '124', unite: 'personnes' },
      { label: 'Durée moy. chantier', val: '14', unite: 'mois' },
    ],
  },
  {
    id: 'banque',
    label: 'Banque & Microfinance',
    description: 'Indicateurs prudentiels et ratios BCEAO adaptés aux établissements financiers UEMOA',
    color: '#6366F1',
    ratios: [
      { label: 'Ratio de solvabilité (Tier 1)', val: '12,4%', benchmark: '>8% BCEAO', statut: 'ok' },
      { label: 'Coefficient de liquidité', val: '88,2%', benchmark: '>75%', statut: 'ok' },
      { label: 'Taux de créances douteuses', val: '6,8%', benchmark: '<5%', statut: 'bad' },
      { label: 'Coût du risque / Encours', val: '2,1%', benchmark: '<3%', statut: 'ok' },
      { label: 'PNB Growth', val: '+14,2%', benchmark: '>10%', statut: 'ok' },
      { label: 'Coefficient d\'exploitation', val: '62%', benchmark: '<65%', statut: 'ok' },
    ],
    projections: [
      { annee: '2024', ca: 98000000, resultat: 14200000, ebitda: 22000000 },
      { annee: '2025', ca: 112000000, resultat: 17000000, ebitda: 26500000 },
      { annee: '2026', ca: 128000000, resultat: 20400000, ebitda: 31800000 },
      { annee: '2027', ca: 147000000, resultat: 24500000, ebitda: 38100000 },
      { annee: '2028', ca: 169000000, resultat: 29400000, ebitda: 45700000 },
    ],
    indicateurs: [
      { label: 'Encours de crédits', val: '2 400 000 000', unite: 'XOF' },
      { label: 'Encours de dépôts', val: '3 100 000 000', unite: 'XOF' },
      { label: 'Agences', val: '12', unite: 'points de vente' },
      { label: 'Clients actifs', val: '8 400', unite: 'comptes' },
    ],
  },
  {
    id: 'assurance',
    label: 'Assurance & Prévoyance',
    description: 'Ratios CIMA et indicateurs techniques pour compagnies d\'assurance OHADA',
    color: '#10B981',
    ratios: [
      { label: 'Ratio de sinistralité', val: '58,4%', benchmark: '<70%', statut: 'ok' },
      { label: 'Ratio combiné', val: '91,2%', benchmark: '<100%', statut: 'ok' },
      { label: 'Marge de solvabilité', val: '180%', benchmark: '>100% CIMA', statut: 'ok' },
      { label: 'Taux de réassurance', val: '28%', benchmark: '20–35%', statut: 'ok' },
      { label: 'Frais généraux / Primes', val: '24,8%', benchmark: '<30%', statut: 'ok' },
      { label: 'Résultat technique / Primes', val: '8,8%', benchmark: '>5%', statut: 'ok' },
    ],
    projections: [
      { annee: '2024', ca: 74000000, resultat: 8200000, ebitda: 12400000 },
      { annee: '2025', ca: 85100000, resultat: 9800000, ebitda: 14600000 },
      { annee: '2026', ca: 97800000, resultat: 11700000, ebitda: 17400000 },
      { annee: '2027', ca: 112500000, resultat: 14000000, ebitda: 20900000 },
      { annee: '2028', ca: 129400000, resultat: 16800000, ebitda: 25100000 },
    ],
    indicateurs: [
      { label: 'Primes émises nettes', val: '74 000 000', unite: 'XOF' },
      { label: 'Provisions techniques', val: '185 000 000', unite: 'XOF' },
      { label: 'Sinistres réglés (12 mois)', val: '43 200 000', unite: 'XOF' },
      { label: 'Portefeuille contrats', val: '2 840', unite: 'polices' },
    ],
  },
  {
    id: 'industrie',
    label: 'Industrie & Production',
    description: 'Modèle adapté aux unités de production et industries manufacturières OHADA',
    color: '#EF4444',
    ratios: [
      { label: 'Taux de valeur ajoutée', val: '44,2%', benchmark: '40–55%', statut: 'ok' },
      { label: 'Intensité capitalistique', val: '3,2x', benchmark: '—', statut: 'ok' },
      { label: 'Taux d\'utilisation capacité', val: '72%', benchmark: '>65%', statut: 'ok' },
      { label: 'Coût de revient / CA', val: '61,8%', benchmark: '<68%', statut: 'ok' },
      { label: 'ROCE', val: '14,2%', benchmark: '>12%', statut: 'ok' },
      { label: 'Stocks / CA (jours)', val: '42j', benchmark: '<50j', statut: 'ok' },
    ],
    projections: [
      { annee: '2024', ca: 280000000, resultat: 22400000, ebitda: 50400000 },
      { annee: '2025', ca: 308000000, resultat: 25800000, ebitda: 58000000 },
      { annee: '2026', ca: 338800000, resultat: 29700000, ebitda: 66800000 },
      { annee: '2027', ca: 372700000, resultat: 34200000, ebitda: 76900000 },
      { annee: '2028', ca: 410000000, resultat: 39300000, ebitda: 88400000 },
    ],
    indicateurs: [
      { label: 'CA industriel', val: '280 000 000', unite: 'XOF' },
      { label: 'Effectif production', val: '86', unite: 'personnes' },
      { label: 'Capacité installée', val: '5 000', unite: 'unités/mois' },
      { label: 'Production réelle', val: '3 600', unite: 'unités/mois' },
    ],
  },
];

export default function Modelisation() {
  const [secteur, setSecteur] = useState<Secteur>('commerce');

  const cfg = secteurs.find(s => s.id === secteur)!;

  const statutIcon = {
    ok: <CheckCircle size={14} className="text-green-500 flex-shrink-0" />,
    warn: <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />,
    bad: <AlertCircle size={14} className="text-red-500 flex-shrink-0" />,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Modélisation Financière Multisectorielle</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Benchmarks et projections adaptés au contexte OHADA / UEMOA</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-white rounded-lg px-3 py-2 shadow-card">
          <Info size={13} className="text-secondary" />
          Données de référence — exercice 2024
        </div>
      </div>

      {/* Sélecteur de secteur */}
      <div className="flex gap-2 flex-wrap">
        {secteurs.map(s => (
          <button
            key={s.id}
            onClick={() => setSecteur(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              secteur === s.id
                ? 'text-white shadow-md border-transparent'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
            }`}
            style={secteur === s.id ? { background: s.color, borderColor: s.color } : {}}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="p-4 rounded-xl border-l-4 bg-white shadow-card" style={{ borderLeftColor: cfg.color }}>
        <p className="text-sm text-neutral-600">{cfg.description}</p>
      </div>

      {/* KPIs sectoriels */}
      <div className="grid grid-cols-4 gap-4">
        {cfg.indicateurs.map(ind => (
          <div key={ind.label} className="card">
            <div className="text-xs text-neutral-400 mb-1">{ind.label}</div>
            <div className="text-base font-bold" style={{ color: cfg.color }}>{ind.val}</div>
            <div className="text-xs text-neutral-400">{ind.unite}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Ratios */}
        <div className="card">
          <h3 className="text-sm font-bold text-neutral-700 mb-4 flex items-center gap-2">
            <TrendingUp size={15} style={{ color: cfg.color }} />
            Ratios sectoriels — Benchmarks OHADA
          </h3>
          <div className="space-y-3">
            {cfg.ratios.map(r => (
              <div key={r.label} className="flex items-center gap-3">
                {statutIcon[r.statut]}
                <div className="flex-1">
                  <div className="text-xs text-neutral-600">{r.label}</div>
                  <div className="text-[10px] text-neutral-400">Benchmark : {r.benchmark}</div>
                </div>
                <span className={`text-sm font-bold ${
                  r.statut === 'ok' ? 'text-green-600' :
                  r.statut === 'warn' ? 'text-amber-600' : 'text-red-600'
                }`}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projections */}
        <div className="card">
          <h3 className="text-sm font-bold text-neutral-700 mb-4">Projections 5 ans — CA & Résultat</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cfg.projections}>
              <defs>
                <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={cfg.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="annee" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: any) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: any) => fmtXOF(v)} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="ca" stroke={cfg.color} fill="url(#caGrad)" strokeWidth={2} name="Chiffre d'affaires" />
              <Area type="monotone" dataKey="ebitda" stroke="#6366F1" fill="none" strokeWidth={2} strokeDasharray="4 2" name="EBITDA" />
              <Area type="monotone" dataKey="resultat" stroke="#10B981" fill="url(#resGrad)" strokeWidth={2} name="Résultat net" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table de projections */}
      <div className="card">
        <h3 className="text-sm font-bold text-neutral-700 mb-3">Tableau de projections détaillé</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
              <th className="text-left pb-2">Exercice</th>
              <th className="text-right pb-2">Chiffre d'affaires</th>
              <th className="text-right pb-2">EBITDA</th>
              <th className="text-right pb-2">Marge EBITDA</th>
              <th className="text-right pb-2">Résultat net</th>
              <th className="text-right pb-2">Marge nette</th>
              <th className="text-right pb-2">Croissance CA</th>
            </tr>
          </thead>
          <tbody>
            {cfg.projections.map((p, i) => {
              const prev = cfg.projections[i - 1];
              const growthCA = prev ? ((p.ca - prev.ca) / prev.ca * 100) : null;
              return (
                <tr key={p.annee} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="py-2.5 font-semibold" style={{ color: cfg.color }}>{p.annee}</td>
                  <td className="py-2.5 text-right font-medium text-neutral-800">{fmtXOF(p.ca)}</td>
                  <td className="py-2.5 text-right text-indigo-600">{fmtXOF(p.ebitda)}</td>
                  <td className="py-2.5 text-right text-neutral-500">{(p.ebitda / p.ca * 100).toFixed(1)}%</td>
                  <td className="py-2.5 text-right text-green-600 font-semibold">{fmtXOF(p.resultat)}</td>
                  <td className="py-2.5 text-right text-neutral-500">{(p.resultat / p.ca * 100).toFixed(1)}%</td>
                  <td className="py-2.5 text-right">
                    {growthCA !== null
                      ? <span className="text-green-600 font-medium">+{growthCA.toFixed(1)}%</span>
                      : <span className="text-neutral-400">—</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
