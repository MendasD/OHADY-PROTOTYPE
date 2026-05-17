import { Building2, TrendingUp, TrendingDown, Sparkles, Plus, Download } from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

interface Cession {
  id: string; numImmo: string; designation: string; dateCession: string;
  acquereur: string; prixCession: number; vncCession: number;
  plusValue: number; motif: 'vente' | 'rebut' | 'sinistre' | 'echange';
  statut: 'planifiee' | 'realisee' | 'comptabilisee';
}

const cessions: Cession[] = [
  { id: 'c1', numImmo: 'IMM-007', designation: 'Véhicule Toyota Hilux 2018',  dateCession: '12/05/2026', acquereur: 'M. Diop (employé)',  prixCession: 4_500_000, vncCession: 3_200_000, plusValue: +1_300_000, motif: 'vente',  statut: 'comptabilisee' },
  { id: 'c2', numImmo: 'IMM-012', designation: 'Photocopieur Ricoh MP 305',    dateCession: '08/05/2026', acquereur: 'IT Recycle SARL',    prixCession:   150_000, vncCession:   480_000, plusValue:   -330_000, motif: 'vente',  statut: 'realisee' },
  { id: 'c3', numImmo: 'IMM-018', designation: 'Serveur Dell PowerEdge R720',  dateCession: '02/05/2026', acquereur: '—',                  prixCession:         0, vncCession:   180_000, plusValue:   -180_000, motif: 'rebut',  statut: 'comptabilisee' },
  { id: 'c4', numImmo: 'IMM-024', designation: 'Mobilier bureau Plateau',      dateCession: '20/05/2026', acquereur: 'Brocante Sandaga',   prixCession:   320_000, vncCession:   280_000, plusValue:    +40_000, motif: 'vente',  statut: 'planifiee' },
  { id: 'c5', numImmo: 'IMM-031', designation: 'Climatiseur LG Inverter 18000', dateCession: '15/05/2026', acquereur: 'Compagnie assurance', prixCession:    85_000, vncCession:   220_000, plusValue:   -135_000, motif: 'sinistre', statut: 'realisee' },
];

const motifMeta = {
  vente:    { label: 'Vente',        cls: 'badge-green' },
  rebut:    { label: 'Mise au rebut',cls: 'badge-gray' },
  sinistre: { label: 'Sinistre',     cls: 'badge-red' },
  echange:  { label: 'Échange',      cls: 'badge-blue' },
};
const statutMeta = {
  planifiee:      { label: 'Planifiée',         cls: 'badge-orange' },
  realisee:       { label: 'Réalisée',          cls: 'badge-blue' },
  comptabilisee:  { label: 'Comptabilisée',     cls: 'badge-green' },
};

export default function CessionsActif() {
  const totalPlusValue = cessions.reduce((s, c) => s + Math.max(c.plusValue, 0), 0);
  const totalMoinsValue = cessions.reduce((s, c) => s + Math.min(c.plusValue, 0), 0);
  const totalCessions = cessions.length;
  const totalPrix = cessions.reduce((s, c) => s + c.prixCession, 0);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2"><Building2 size={20} className="text-secondary" /> Cessions d'actif</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Ventes, mises au rebut, sinistres d'immobilisations · Calcul auto plus/moins-value</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Download size={12} /> Export</button>
          <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouvelle cession</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Cessions enregistrées</div><div className="mt-1 text-lg font-bold text-primary">{totalCessions}</div></div>
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Total encaissé</div><div className="mt-1 text-lg font-bold text-secondary">{fmtXOF(totalPrix)}</div></div>
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Plus-values cumulées</div><div className="mt-1 text-lg font-bold text-success flex items-center gap-1"><TrendingUp size={14} />{fmtXOF(totalPlusValue)}</div></div>
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Moins-values cumulées</div><div className="mt-1 text-lg font-bold text-danger flex items-center gap-1"><TrendingDown size={14} />{fmtXOF(Math.abs(totalMoinsValue))}</div></div>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2 font-semibold">N° Immo</th>
                <th className="text-left px-2 py-2 font-semibold">Désignation</th>
                <th className="text-left px-2 py-2 font-semibold">Date cession</th>
                <th className="text-left px-2 py-2 font-semibold">Acquéreur</th>
                <th className="text-right px-2 py-2 font-semibold">Prix cession</th>
                <th className="text-right px-2 py-2 font-semibold">VNC</th>
                <th className="text-right px-2 py-2 font-semibold">Plus/Moins-value</th>
                <th className="text-center px-2 py-2 font-semibold">Motif</th>
                <th className="text-center px-2 py-2 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {cessions.map(c => (
                <tr key={c.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs font-bold text-secondary">{c.numImmo}</td>
                  <td className="px-2 py-2.5 text-sm font-medium text-neutral-800">{c.designation}</td>
                  <td className="px-2 py-2.5 text-xs text-neutral-500 font-mono">{c.dateCession}</td>
                  <td className="px-2 py-2.5 text-xs text-neutral-600">{c.acquereur}</td>
                  <td className="px-2 py-2.5 text-right font-mono text-xs">{fmt(c.prixCession)}</td>
                  <td className="px-2 py-2.5 text-right font-mono text-xs text-neutral-500">{fmt(c.vncCession)}</td>
                  <td className={`px-2 py-2.5 text-right font-mono text-sm font-bold ${c.plusValue >= 0 ? 'text-success' : 'text-danger'}`}>{c.plusValue >= 0 ? '+' : ''}{fmt(c.plusValue)}</td>
                  <td className="px-2 py-2.5 text-center"><span className={`badge ${motifMeta[c.motif].cls} text-[10px]`}>{motifMeta[c.motif].label}</span></td>
                  <td className="px-2 py-2.5 text-center"><span className={`badge ${statutMeta[c.statut].cls} text-[10px]`}>{statutMeta[c.statut].label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <Sparkles size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-neutral-700 leading-relaxed">
          <strong>Écritures auto SYSCOHADA</strong> : sortie du bilan (D 28x Amort. cumulés / D 675 VNC actif cédé / C 2xx Immo brute) + constatation du prix (D 521 Banque / C 775 Produits cession actif). Plus/moins-value figure au CR.
        </div>
      </div>
    </div>
  );
}
