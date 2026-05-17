import { useState } from 'react';
import { Truck, Plus, Search, CheckCircle, Clock, AlertCircle, MapPin } from 'lucide-react';
import { fmtXOF } from '../data/mockData';

interface BL {
  id: string; numero: string; date: string; client: string; refBC: string;
  livreur: string; destination: string; montant: number;
  statut: 'prepare' | 'enRoute' | 'livre' | 'partiellement' | 'refuse';
  nbColis: number; signature?: string;
}

const bls: BL[] = [
  { id: 'bl1', numero: 'BL-2026-0042', date: '15/05/2026', client: 'SONES',                refBC: 'BC-2026-0156', livreur: 'Ousmane Sow',  destination: 'Dakar - Plateau',  montant: 4_250_000, statut: 'livre',         nbColis: 12, signature: 'OK le 16/05 10:32' },
  { id: 'bl2', numero: 'BL-2026-0041', date: '14/05/2026', client: 'Orange Sénégal',       refBC: 'BC-2026-0155', livreur: 'Modou Diop',   destination: 'Almadies',         montant: 2_180_000, statut: 'enRoute',       nbColis:  3 },
  { id: 'bl3', numero: 'BL-2026-0040', date: '14/05/2026', client: 'AfricTech Group',     refBC: 'BC-2026-0154', livreur: 'Khady Fall',   destination: 'Ngor',             montant: 1_540_000, statut: 'partiellement', nbColis:  8, signature: 'Manque 2 colis sur 8' },
  { id: 'bl4', numero: 'BL-2026-0039', date: '13/05/2026', client: 'Ministère Finances',  refBC: 'BC-2026-0153', livreur: 'Aliou Ndiaye', destination: 'Building Adm.',    montant: 5_800_000, statut: 'refuse',        nbColis:  4, signature: 'Refusé : produits non conformes' },
  { id: 'bl5', numero: 'BL-2026-0038', date: '13/05/2026', client: 'Tech Solutions SARL', refBC: 'BC-2026-0152', livreur: 'En attente',   destination: 'HLM Grand-Yoff',   montant: 3_100_000, statut: 'prepare',       nbColis:  6 },
];

const statutMeta = {
  prepare:        { label: 'Préparé',          cls: 'badge-gray',   Icon: Clock },
  enRoute:        { label: 'En route',         cls: 'badge-blue',   Icon: Truck },
  livre:          { label: 'Livré + signé',    cls: 'badge-green',  Icon: CheckCircle },
  partiellement:  { label: 'Livré partiel',    cls: 'badge-orange', Icon: AlertCircle },
  refuse:         { label: 'Refusé',           cls: 'badge-red',    Icon: AlertCircle },
};

export default function BonsLivraison() {
  const [filter, setFilter] = useState<'all' | keyof typeof statutMeta>('all');

  const filtered = filter === 'all' ? bls : bls.filter(b => b.statut === filter);
  const counts = (Object.keys(statutMeta) as (keyof typeof statutMeta)[]).reduce((acc, s) => {
    acc[s] = bls.filter(b => b.statut === s).length; return acc;
  }, {} as Record<keyof typeof statutMeta, number>);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2"><Truck size={20} className="text-secondary" /> Bons de livraison</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Suivi des livraisons clients · Signature et traçabilité</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouveau BL</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {(Object.keys(statutMeta) as (keyof typeof statutMeta)[]).map(s => {
          const meta = statutMeta[s];
          const Icon = meta.Icon;
          return (
            <div key={s} className="card !py-3 !px-4">
              <div className="flex items-center gap-2"><Icon size={13} className="text-neutral-400" /><span className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">{meta.label}</span></div>
              <div className="text-xl font-bold text-primary mt-1">{counts[s]}</div>
            </div>
          );
        })}
      </div>

      <div className="card-sm flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-md">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input className="input pl-8 py-1.5 text-xs" placeholder="N° BL, client, livreur..." />
        </div>
        <button onClick={() => setFilter('all')} className={`px-2.5 py-1 rounded-full text-[11px] border ${filter === 'all' ? 'border-secondary bg-secondary/10 text-secondary font-semibold' : 'border-neutral-200 bg-white text-neutral-600'}`}>Tous</button>
        {(Object.keys(statutMeta) as (keyof typeof statutMeta)[]).map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-2.5 py-1 rounded-full text-[11px] border ${filter === s ? 'border-secondary bg-secondary/10 text-secondary font-semibold' : 'border-neutral-200 bg-white text-neutral-600'}`}>
            {statutMeta[s].label} <span className="font-mono text-neutral-500">({counts[s]})</span>
          </button>
        ))}
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2 font-semibold">N° BL</th>
                <th className="text-left px-2 py-2 font-semibold">Date</th>
                <th className="text-left px-2 py-2 font-semibold">Client</th>
                <th className="text-left px-2 py-2 font-semibold">BC référencé</th>
                <th className="text-left px-2 py-2 font-semibold">Destination</th>
                <th className="text-left px-2 py-2 font-semibold">Livreur</th>
                <th className="text-center px-2 py-2 font-semibold">Colis</th>
                <th className="text-right px-2 py-2 font-semibold">Montant</th>
                <th className="text-center px-2 py-2 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const meta = statutMeta[b.statut];
                const Icon = meta.Icon;
                return (
                  <tr key={b.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-secondary">{b.numero}</td>
                    <td className="px-2 py-2.5 text-xs text-neutral-500 font-mono">{b.date}</td>
                    <td className="px-2 py-2.5 text-sm font-semibold text-neutral-800">{b.client}</td>
                    <td className="px-2 py-2.5 font-mono text-[11px] text-neutral-500">{b.refBC}</td>
                    <td className="px-2 py-2.5 text-xs text-neutral-700 flex items-center gap-1"><MapPin size={11} className="text-neutral-400" />{b.destination}</td>
                    <td className="px-2 py-2.5 text-xs text-neutral-600">{b.livreur}</td>
                    <td className="px-2 py-2.5 text-center text-xs font-mono">{b.nbColis}</td>
                    <td className="px-2 py-2.5 text-right font-mono text-xs font-semibold text-neutral-800">{fmtXOF(b.montant)}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`inline-flex items-center gap-1 badge ${meta.cls} text-[10px]`}><Icon size={9} /> {meta.label}</span>
                        {b.signature && <span className="text-[9px] text-neutral-400 italic">{b.signature}</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
