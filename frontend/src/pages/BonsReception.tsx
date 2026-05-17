import { useState } from 'react';
import { PackageCheck, Plus, CheckCircle, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { fmt } from '../data/mockData';

interface BR {
  id: string; numero: string; date: string; fournisseur: string; refBC: string;
  receveur: string; nbArticles: number; nbColis: number; montant: number;
  statut: 'attendu' | 'recu' | 'partiellement' | 'litige' | 'rapproche';
  ecartConstate?: string;
}

const brs: BR[] = [
  { id: 'br1', numero: 'BR-2026-0067', date: '15/05/2026', fournisseur: 'COGEMATEC SARL',   refBC: 'BC-2026-0102', receveur: 'Aliou Ndiaye', nbArticles: 5,  nbColis: 12, montant: 2_124_000, statut: 'rapproche' },
  { id: 'br2', numero: 'BR-2026-0066', date: '14/05/2026', fournisseur: 'SETUMA',             refBC: 'BC-2026-0101', receveur: 'Khady Fall',   nbArticles: 8,  nbColis:  4, montant: 1_085_600, statut: 'recu' },
  { id: 'br3', numero: 'BR-2026-0065', date: '13/05/2026', fournisseur: 'INDUSTRIE 2000',   refBC: 'BC-2026-0100', receveur: 'Ousmane Sow',  nbArticles: 3,  nbColis:  8, montant: 1_475_000, statut: 'partiellement', ecartConstate: '2 articles sur 5 manquants — backorder fournisseur' },
  { id: 'br4', numero: 'BR-2026-0064', date: '11/05/2026', fournisseur: 'BURO IMPORT',       refBC: 'BC-2026-0099', receveur: 'Modou Diop',   nbArticles: 12, nbColis: 18, montant:   745_000, statut: 'litige', ecartConstate: '3 articles endommagés à la réception — retour demandé' },
  { id: 'br5', numero: 'BR-2026-0063', date: '17/05/2026', fournisseur: 'TECH SOLUTIONS',   refBC: 'BC-2026-0098', receveur: 'En attente',   nbArticles: 6,  nbColis:  3, montant: 4_500_000, statut: 'attendu' },
];

const statutMeta = {
  attendu:        { label: 'Attendu',         cls: 'badge-gray',   Icon: AlertCircle },
  recu:           { label: 'Reçu complet',    cls: 'badge-blue',   Icon: CheckCircle },
  partiellement:  { label: 'Reçu partiel',    cls: 'badge-orange', Icon: AlertCircle },
  litige:         { label: 'Litige',          cls: 'badge-red',    Icon: AlertCircle },
  rapproche:      { label: 'Rapproché avec facture', cls: 'badge-green', Icon: CheckCircle },
};

export default function BonsReception() {
  const [filter, setFilter] = useState<'all' | keyof typeof statutMeta>('all');
  const filtered = filter === 'all' ? brs : brs.filter(b => b.statut === filter);
  const counts = (Object.keys(statutMeta) as (keyof typeof statutMeta)[]).reduce((acc, s) => { acc[s] = brs.filter(b => b.statut === s).length; return acc; }, {} as Record<keyof typeof statutMeta, number>);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2"><PackageCheck size={20} className="text-secondary" /> Bons de réception</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Réception des livraisons fournisseurs · Rapprochement 3-way matching (BC → BR → Facture)</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouveau BR</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {(Object.keys(statutMeta) as (keyof typeof statutMeta)[]).map(s => {
          const meta = statutMeta[s]; const Icon = meta.Icon;
          return (
            <div key={s} className="card !py-3 !px-4">
              <div className="flex items-center gap-2"><Icon size={13} className="text-neutral-400" /><span className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">{meta.label}</span></div>
              <div className="text-xl font-bold text-primary mt-1">{counts[s]}</div>
            </div>
          );
        })}
      </div>

      <div className="card-sm flex flex-wrap items-center gap-2">
        <button onClick={() => setFilter('all')} className={`px-2.5 py-1 rounded-full text-[11px] border ${filter === 'all' ? 'border-secondary bg-secondary/10 text-secondary font-semibold' : 'border-neutral-200 bg-white text-neutral-600'}`}>Tous ({brs.length})</button>
        {(Object.keys(statutMeta) as (keyof typeof statutMeta)[]).map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-2.5 py-1 rounded-full text-[11px] border ${filter === s ? 'border-secondary bg-secondary/10 text-secondary font-semibold' : 'border-neutral-200 bg-white text-neutral-600'}`}>
            {statutMeta[s].label} <span className="font-mono text-neutral-500">({counts[s]})</span>
          </button>
        ))}
        <button className="btn btn-outline btn-sm ml-auto"><Filter size={11} /> Période</button>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2 font-semibold">N° BR</th>
                <th className="text-left px-2 py-2 font-semibold">Date</th>
                <th className="text-left px-2 py-2 font-semibold">Fournisseur</th>
                <th className="text-left px-2 py-2 font-semibold">BC référencé</th>
                <th className="text-center px-2 py-2 font-semibold">Art.</th>
                <th className="text-center px-2 py-2 font-semibold">Colis</th>
                <th className="text-left px-2 py-2 font-semibold">Receveur</th>
                <th className="text-right px-2 py-2 font-semibold">Montant</th>
                <th className="text-center px-2 py-2 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const meta = statutMeta[b.statut]; const Icon = meta.Icon;
                return (
                  <tr key={b.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-secondary">{b.numero}</td>
                    <td className="px-2 py-2.5 text-xs text-neutral-500 font-mono">{b.date}</td>
                    <td className="px-2 py-2.5 text-sm font-semibold text-neutral-800">{b.fournisseur}</td>
                    <td className="px-2 py-2.5 font-mono text-[11px] text-neutral-500">{b.refBC}</td>
                    <td className="px-2 py-2.5 text-center text-xs font-mono">{b.nbArticles}</td>
                    <td className="px-2 py-2.5 text-center text-xs font-mono">{b.nbColis}</td>
                    <td className="px-2 py-2.5 text-xs text-neutral-600">{b.receveur}</td>
                    <td className="px-2 py-2.5 text-right font-mono text-xs font-semibold text-neutral-800">{fmt(b.montant)}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`inline-flex items-center gap-1 badge ${meta.cls} text-[10px]`}><Icon size={9} /> {meta.label}</span>
                        {b.ecartConstate && <span className="text-[9px] text-warning italic max-w-[150px] truncate" title={b.ecartConstate}>{b.ecartConstate}</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <Sparkles size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-neutral-700 leading-relaxed">
          <strong>3-way matching automatique</strong> : OHADY rapproche BC (quantité commandée) ↔ BR (quantité reçue) ↔ Facture fournisseur (quantité facturée). Toute divergence est signalée avant validation comptable.
        </div>
      </div>
    </div>
  );
}
