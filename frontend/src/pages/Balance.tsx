import React, { useMemo, useState } from 'react';
import {
  Search, Download, Filter, ChevronDown, ChevronRight, TrendingUp, TrendingDown,
} from 'lucide-react';
import { fmt } from '../data/mockData';

interface CompteBalance {
  num: string;
  lib: string;
  classe: number;
  ouvertureD: number;
  ouvertureC: number;
  mvtD: number;
  mvtC: number;
}

const balance: CompteBalance[] = [
  // Classe 1 — Comptes de ressources
  { num: '10100', lib: 'Capital social',                    classe: 1, ouvertureD: 0,         ouvertureC: 50_000_000, mvtD: 0,         mvtC: 0 },
  { num: '11100', lib: 'Réserve légale',                    classe: 1, ouvertureD: 0,         ouvertureC:  2_500_000, mvtD: 0,         mvtC: 0 },
  { num: '12000', lib: 'Report à nouveau',                  classe: 1, ouvertureD: 0,         ouvertureC:  3_800_000, mvtD: 0,         mvtC: 0 },
  { num: '13100', lib: 'Résultat net de l\'exercice',       classe: 1, ouvertureD: 0,         ouvertureC:  4_280_000, mvtD: 0,         mvtC: 1_640_000 },
  { num: '16100', lib: 'Emprunt bancaire SGBS',             classe: 1, ouvertureD: 0,         ouvertureC:  9_200_000, mvtD: 850_000,   mvtC: 150_000 },
  // Classe 2 — Immobilisations
  { num: '23100', lib: 'Matériel & outillage industriel',   classe: 2, ouvertureD: 4_500_000, ouvertureC: 0,          mvtD: 0,         mvtC: 0 },
  { num: '24400', lib: 'Matériel informatique',             classe: 2, ouvertureD: 3_200_000, ouvertureC: 0,          mvtD: 1_200_000, mvtC: 0 },
  { num: '24600', lib: 'Matériel de transport',             classe: 2, ouvertureD: 6_500_000, ouvertureC: 0,          mvtD: 0,         mvtC: 0 },
  { num: '28400', lib: 'Amort. — Mat. informatique',        classe: 2, ouvertureD: 0,         ouvertureC:    855_000, mvtD: 0,         mvtC: 285_000 },
  // Classe 4 — Tiers
  { num: '40100', lib: 'Fournisseurs — dettes en cours',    classe: 4, ouvertureD: 0,         ouvertureC:  3_800_000, mvtD: 4_120_000, mvtC: 5_170_000 },
  { num: '41100', lib: 'Clients — créances en cours',       classe: 4, ouvertureD: 12_400_000,ouvertureC: 0,          mvtD: 14_868_000,mvtC: 12_038_000 },
  { num: '41900', lib: 'Clients douteux',                   classe: 4, ouvertureD: 3_800_000, ouvertureC: 0,          mvtD: 0,         mvtC: 0 },
  { num: '44310', lib: 'TVA collectée 18%',                 classe: 4, ouvertureD: 0,         ouvertureC:  1_240_000, mvtD: 0,         mvtC: 608_000 },
  { num: '44510', lib: 'TVA déductible sur achats',         classe: 4, ouvertureD:   240_000, ouvertureC: 0,          mvtD:   84_000,  mvtC: 0 },
  // Classe 5 — Trésorerie
  { num: '52110', lib: 'Banque SGBS — compte courant',      classe: 5, ouvertureD: 17_240_000,ouvertureC: 0,          mvtD: 6_000_000, mvtC: 8_000_000 },
  { num: '52120', lib: 'Banque CBAO — épargne',             classe: 5, ouvertureD: 5_820_000, ouvertureC: 0,          mvtD: 0,         mvtC: 0 },
  { num: '53100', lib: 'Wave Business',                     classe: 5, ouvertureD: 1_280_000, ouvertureC: 0,          mvtD: 480_000,   mvtC: 310_000 },
  { num: '57100', lib: 'Caisse principale',                 classe: 5, ouvertureD:    225_000,ouvertureC: 0,          mvtD: 130_000,   mvtC: 220_000 },
  // Classe 6 — Charges
  { num: '60100', lib: 'Achats de marchandises',            classe: 6, ouvertureD: 16_280_000,ouvertureC: 0,          mvtD: 2_120_000, mvtC: 0 },
  { num: '60220', lib: 'Fournitures de bureau',             classe: 6, ouvertureD:    432_000,ouvertureC: 0,          mvtD: 48_000,    mvtC: 0 },
  { num: '62100', lib: 'Locations & charges locatives',     classe: 6, ouvertureD:  3_600_000,ouvertureC: 0,          mvtD: 400_000,   mvtC: 0 },
  { num: '64100', lib: 'Charges de personnel — salaires',   classe: 6, ouvertureD: 13_530_000,ouvertureC: 0,          mvtD: 1_670_000, mvtC: 0 },
  { num: '68100', lib: 'Dotations aux amortissements',      classe: 6, ouvertureD:      0,    ouvertureC: 0,          mvtD: 285_000,   mvtC: 0 },
  // Classe 7 — Produits
  { num: '70100', lib: 'Ventes de marchandises',            classe: 7, ouvertureD: 0,         ouvertureC: 21_400_000, mvtD: 0,         mvtC: 1_000_000 },
  { num: '70600', lib: 'Prestations de services',           classe: 7, ouvertureD: 0,         ouvertureC: 21_140_000, mvtD: 0,         mvtC: 4_310_000 },
];

const classeColors: Record<number, { color: string; label: string }> = {
  1: { color: '#1A3C5E', label: 'Ressources durables' },
  2: { color: '#2980B9', label: 'Actif immobilisé' },
  3: { color: '#27AE60', label: 'Stocks' },
  4: { color: '#E67E22', label: 'Tiers' },
  5: { color: '#1ABC9C', label: 'Trésorerie' },
  6: { color: '#E74C3C', label: 'Charges' },
  7: { color: '#9B59B6', label: 'Produits' },
};

export default function Balance() {
  const [search, setSearch] = useState('');
  const [showClasses, setShowClasses] = useState<Record<number, boolean>>({ 1: true, 2: true, 4: true, 5: true, 6: true, 7: true });
  const [view, setView] = useState<'generale' | 'auxiliaire'>('generale');

  // Compute solde for each line
  const computed = useMemo(() => {
    return balance.map(c => {
      const totalD = c.ouvertureD + c.mvtD;
      const totalC = c.ouvertureC + c.mvtC;
      const soldeD = Math.max(0, totalD - totalC);
      const soldeC = Math.max(0, totalC - totalD);
      return { ...c, totalD, totalC, soldeD, soldeC };
    });
  }, []);

  const filtered = computed.filter(c =>
    !search || c.num.includes(search) || c.lib.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = useMemo(() => {
    const map = new Map<number, typeof computed>();
    filtered.forEach(c => {
      if (!map.has(c.classe)) map.set(c.classe, []);
      map.get(c.classe)!.push(c);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [filtered]);

  const totalGen = useMemo(() => ({
    ouvertureD: computed.reduce((s, c) => s + c.ouvertureD, 0),
    ouvertureC: computed.reduce((s, c) => s + c.ouvertureC, 0),
    mvtD: computed.reduce((s, c) => s + c.mvtD, 0),
    mvtC: computed.reduce((s, c) => s + c.mvtC, 0),
    soldeD: computed.reduce((s, c) => s + c.soldeD, 0),
    soldeC: computed.reduce((s, c) => s + c.soldeC, 0),
  }), [computed]);

  const equilibre = Math.abs(totalGen.soldeD - totalGen.soldeC) < 1;

  const toggleClass = (n: number) => setShowClasses(p => ({ ...p, [n]: !p[n] }));

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Balance générale</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Synthèse des soldes par compte — Exercice 2025-2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5">
            <button onClick={() => setView('generale')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === 'generale' ? 'bg-secondary text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'}`}>Générale</button>
            <button onClick={() => setView('auxiliaire')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === 'auxiliaire' ? 'bg-secondary text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'}`}>Auxiliaire</button>
          </div>
          <button className="btn btn-outline btn-sm"><Filter size={12} /> Filtres</button>
          <button className="btn btn-primary btn-sm"><Download size={12} /> Exporter</button>
        </div>
      </div>

      {/* Totaux + équilibre */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiTile label="Total débits période" value={fmt(totalGen.mvtD)} unit="XOF" icon={TrendingUp} tone="success" />
        <KpiTile label="Total crédits période" value={fmt(totalGen.mvtC)} unit="XOF" icon={TrendingDown} tone="danger" />
        <KpiTile label="Soldes débiteurs" value={fmt(totalGen.soldeD)} unit="XOF" tone="info" />
        <KpiTile label="Soldes créditeurs" value={fmt(totalGen.soldeC)} unit="XOF" tone="info" />
      </div>

      {/* Équilibre */}
      <div className={`card flex items-center gap-3 border-l-4 ${equilibre ? 'border-l-green-400 bg-green-50/30' : 'border-l-orange-400 bg-orange-50/30'}`}>
        <div className={`w-9 h-9 rounded-lg grid place-items-center ${equilibre ? 'bg-green-100 text-success' : 'bg-orange-100 text-warning'}`}>
          {equilibre ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-neutral-800">
            {equilibre ? 'Balance équilibrée' : 'Balance non équilibrée'}
          </div>
          <div className="text-[11px] text-neutral-500">
            Soldes D = {fmt(totalGen.soldeD)} XOF · Soldes C = {fmt(totalGen.soldeC)} XOF
            {!equilibre && <span className="ml-1 text-warning font-semibold">· Écart {fmt(Math.abs(totalGen.soldeD - totalGen.soldeC))} XOF</span>}
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="card-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-8 py-1.5 text-xs"
            placeholder="Rechercher par numéro ou libellé de compte..."
          />
        </div>
        <span className="text-[11px] text-neutral-500">{filtered.length} comptes affichés sur {balance.length}</span>
      </div>

      {/* Balance */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2 font-semibold">Compte</th>
                <th className="text-left px-2 py-2 font-semibold">Libellé</th>
                <th className="text-right px-2 py-2 font-semibold border-l border-neutral-200">Ouverture D</th>
                <th className="text-right px-2 py-2 font-semibold">Ouverture C</th>
                <th className="text-right px-2 py-2 font-semibold border-l border-neutral-200 text-success">Mvts D</th>
                <th className="text-right px-2 py-2 font-semibold text-danger">Mvts C</th>
                <th className="text-right px-2 py-2 font-semibold border-l border-neutral-200">Solde D</th>
                <th className="text-right px-2 py-2 font-semibold">Solde C</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map(([classe, comptes]) => {
                const isOpen = showClasses[classe];
                const meta = classeColors[classe];
                const subTotal = comptes.reduce((acc, c) => ({
                  ouvertureD: acc.ouvertureD + c.ouvertureD,
                  ouvertureC: acc.ouvertureC + c.ouvertureC,
                  mvtD: acc.mvtD + c.mvtD,
                  mvtC: acc.mvtC + c.mvtC,
                  soldeD: acc.soldeD + c.soldeD,
                  soldeC: acc.soldeC + c.soldeC,
                }), { ouvertureD: 0, ouvertureC: 0, mvtD: 0, mvtC: 0, soldeD: 0, soldeC: 0 });
                return (
                  <React.Fragment key={classe}>
                    <tr className="cursor-pointer hover:bg-neutral-50" onClick={() => toggleClass(classe)} style={{ background: `${meta.color}08` }}>
                      <td className="px-4 py-2.5 font-bold" style={{ color: meta.color }}>
                        <div className="flex items-center gap-2">
                          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          Classe {classe}
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-xs font-semibold" style={{ color: meta.color }}>{meta.label} <span className="text-neutral-400 font-normal">· {comptes.length} comptes</span></td>
                      <td className="px-2 py-2.5 text-right font-mono text-xs text-neutral-600">{fmt(subTotal.ouvertureD)}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-xs text-neutral-600">{fmt(subTotal.ouvertureC)}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-xs text-success">{fmt(subTotal.mvtD)}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-xs text-danger">{fmt(subTotal.mvtC)}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-xs font-bold text-neutral-800">{fmt(subTotal.soldeD)}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-xs font-bold text-neutral-800">{fmt(subTotal.soldeC)}</td>
                    </tr>
                    {isOpen && comptes.map(c => (
                      <tr key={c.num} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                        <td className="pl-10 pr-4 py-2 font-mono text-xs font-semibold" style={{ color: meta.color }}>{c.num}</td>
                        <td className="px-2 py-2 text-xs text-neutral-700">{c.lib}</td>
                        <td className="px-2 py-2 text-right font-mono text-xs text-neutral-500">{c.ouvertureD ? fmt(c.ouvertureD) : <span className="text-neutral-300">—</span>}</td>
                        <td className="px-2 py-2 text-right font-mono text-xs text-neutral-500">{c.ouvertureC ? fmt(c.ouvertureC) : <span className="text-neutral-300">—</span>}</td>
                        <td className="px-2 py-2 text-right font-mono text-xs text-success">{c.mvtD ? fmt(c.mvtD) : <span className="text-neutral-300">—</span>}</td>
                        <td className="px-2 py-2 text-right font-mono text-xs text-danger">{c.mvtC ? fmt(c.mvtC) : <span className="text-neutral-300">—</span>}</td>
                        <td className="px-2 py-2 text-right font-mono text-xs font-bold text-neutral-800">{c.soldeD ? fmt(c.soldeD) : <span className="text-neutral-300">—</span>}</td>
                        <td className="px-2 py-2 text-right font-mono text-xs font-bold text-neutral-800">{c.soldeC ? fmt(c.soldeC) : <span className="text-neutral-300">—</span>}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-100 border-t-2 border-neutral-300">
                <td colSpan={2} className="px-4 py-3 text-sm font-bold text-neutral-800">TOTAL GÉNÉRAL</td>
                <td className="px-2 py-3 text-right font-mono text-xs font-bold text-neutral-700">{fmt(totalGen.ouvertureD)}</td>
                <td className="px-2 py-3 text-right font-mono text-xs font-bold text-neutral-700">{fmt(totalGen.ouvertureC)}</td>
                <td className="px-2 py-3 text-right font-mono text-xs font-bold text-success">{fmt(totalGen.mvtD)}</td>
                <td className="px-2 py-3 text-right font-mono text-xs font-bold text-danger">{fmt(totalGen.mvtC)}</td>
                <td className="px-2 py-3 text-right font-mono text-sm font-bold text-secondary">{fmt(totalGen.soldeD)}</td>
                <td className="px-2 py-3 text-right font-mono text-sm font-bold text-secondary">{fmt(totalGen.soldeC)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiTile({ label, value, unit, icon: Icon, tone }: { label: string; value: string; unit: string; icon?: React.ElementType; tone: 'success' | 'danger' | 'info' }) {
  const tones = {
    success: 'text-success',
    danger:  'text-danger',
    info:    'text-secondary',
  };
  return (
    <div className="card">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">
        {Icon && <Icon size={10} className={tones[tone]} />}
        {label}
      </div>
      <div className={`mt-1.5 text-lg font-bold font-mono ${tones[tone]}`}>{value}</div>
      <div className="text-[10px] text-neutral-400">{unit}</div>
    </div>
  );
}

