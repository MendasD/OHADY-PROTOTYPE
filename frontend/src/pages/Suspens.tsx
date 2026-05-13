import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Search, Plus, ArrowRight } from 'lucide-react';

const fmtXOF = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' XOF';

type NatureSuspens = 'Rapprochement' | 'Erreur saisie' | 'En attente pièce' | 'Litige';

interface EcritureSuspens {
  id: string;
  date: string;
  compte: string;
  libelle: string;
  debit: number;
  credit: number;
  anciennete: number;
  nature: NatureSuspens;
  note: string;
}

const suspens: EcritureSuspens[] = [
  { id: 'SUS-001', date: '30/04/2026', compte: '47100', libelle: 'Virement reçu — origine inconnue', debit: 0, credit: 2500000, anciennete: 13, nature: 'Rapprochement', note: 'Virement SGBS non identifié — en attente justificatif client' },
  { id: 'SUS-002', date: '25/04/2026', compte: '47200', libelle: 'Chèque émis — non présenté CBAO', debit: 850000, credit: 0, anciennete: 18, nature: 'Rapprochement', note: 'Chèque n°1204-B — fournisseur contacté' },
  { id: 'SUS-003', date: '15/04/2026', compte: '47800', libelle: 'Erreur imputation charge personnel', debit: 320000, credit: 0, anciennete: 28, nature: 'Erreur saisie', note: 'À reclasser en compte 6411 — à corriger' },
  { id: 'SUS-004', date: '10/04/2026', compte: '47100', libelle: 'Prélèvement Wave non justifié', debit: 0, credit: 145000, anciennete: 33, nature: 'En attente pièce', note: 'Prélèvement automatique — reçu non reçu' },
  { id: 'SUS-005', date: '31/03/2026', compte: '47500', libelle: 'Avoir fournisseur — litige qualité', debit: 480000, credit: 0, anciennete: 43, nature: 'Litige', note: 'Litige en cours avec Construct & Build — dossier DG' },
  { id: 'SUS-006', date: '20/03/2026', compte: '47200', libelle: 'Double saisie facture SENELEC', debit: 0, credit: 610000, anciennete: 54, nature: 'Erreur saisie', note: 'Doublon détecté automatiquement par OHADY — à extourner' },
  { id: 'SUS-007', date: '10/03/2026', compte: '47800', libelle: 'Frais bancaires non ventilés', debit: 28500, credit: 0, anciennete: 64, nature: 'En attente pièce', note: 'Frais T1 2026 — relevé SGBS attendu' },
];

const natureCfg: Record<NatureSuspens, { cls: string; icon: React.ReactNode }> = {
  'Rapprochement': { cls: 'badge-blue', icon: <ArrowRight size={10} /> },
  'Erreur saisie': { cls: 'badge-orange', icon: <AlertTriangle size={10} /> },
  'En attente pièce': { cls: 'badge-orange', icon: <Clock size={10} /> },
  'Litige': { cls: 'badge-red', icon: <AlertTriangle size={10} /> },
};

export default function Suspens() {
  const [search, setSearch] = useState('');
  const [filtreNature, setFiltreNature] = useState<NatureSuspens | ''>('');
  const [selected, setSelected] = useState<EcritureSuspens | null>(null);

  const filtered = suspens.filter(s =>
    (s.libelle.toLowerCase().includes(search.toLowerCase()) || s.compte.includes(search)) &&
    (!filtreNature || s.nature === filtreNature)
  );

  const totalDebit = suspens.reduce((s, e) => s + e.debit, 0);
  const totalCredit = suspens.reduce((s, e) => s + e.credit, 0);
  const alertes30j = suspens.filter(e => e.anciennete > 30).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Comptes de suspens</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Écritures en attente de régularisation — Comptes 471 à 478</p>
        </div>
        <button className="btn btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Nouvelle écriture suspens
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Écritures en suspens', val: suspens.length.toString(), color: 'text-blue-600' },
          { label: 'Total débit suspens', val: fmtXOF(totalDebit), color: 'text-amber-600' },
          { label: 'Total crédit suspens', val: fmtXOF(totalCredit), color: 'text-purple-600' },
          { label: 'Solde net suspens', val: fmtXOF(totalDebit - totalCredit), color: totalDebit - totalCredit > 0 ? 'text-amber-600' : 'text-green-600' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className={`text-xs font-medium mb-1 ${k.color}`}>{k.label}</div>
            <div className={`text-base font-bold ${k.color}`}>{k.val}</div>
          </div>
        ))}
      </div>

      {alertes30j > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
          <span className="text-sm text-amber-800 font-medium">
            {alertes30j} écriture{alertes30j > 1 ? 's' : ''} en suspens depuis plus de 30 jours — régularisation urgente recommandée
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-5">
        {/* Table */}
        <div className="col-span-2 card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 border border-neutral-200 rounded-lg px-3 py-2 bg-white">
              <Search size={14} className="text-neutral-400" />
              <input className="flex-1 outline-none text-sm bg-transparent" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['', 'Rapprochement', 'Erreur saisie', 'En attente pièce', 'Litige'] as (NatureSuspens | '')[]).map(n => (
                <button key={n} onClick={() => setFiltreNature(n)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${filtreNature === n ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>
                  {n || 'Tous'}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                <th className="text-left pb-2">Date</th>
                <th className="text-left pb-2">Compte</th>
                <th className="text-left pb-2">Libellé</th>
                <th className="text-right pb-2">Débit</th>
                <th className="text-right pb-2">Crédit</th>
                <th className="text-center pb-2">Ancienneté</th>
                <th className="text-center pb-2">Nature</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const cfg = natureCfg[e.nature];
                return (
                  <tr key={e.id} onClick={() => setSelected(e)}
                    className={`border-t border-neutral-50 hover:bg-neutral-50 cursor-pointer transition-colors ${selected?.id === e.id ? 'bg-blue-50' : ''}`}>
                    <td className="py-2.5 text-xs text-neutral-500">{e.date}</td>
                    <td className="py-2.5 font-mono text-xs font-semibold text-neutral-600">{e.compte}</td>
                    <td className="py-2.5 text-neutral-700 text-xs max-w-[200px] truncate">{e.libelle}</td>
                    <td className="py-2.5 text-right font-semibold text-amber-600">{e.debit > 0 ? fmtXOF(e.debit) : '—'}</td>
                    <td className="py-2.5 text-right font-semibold text-blue-600">{e.credit > 0 ? fmtXOF(e.credit) : '—'}</td>
                    <td className="py-2.5 text-center">
                      <span className={`text-xs font-bold ${e.anciennete > 60 ? 'text-red-600' : e.anciennete > 30 ? 'text-amber-600' : 'text-neutral-500'}`}>
                        {e.anciennete}j
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`badge flex items-center gap-1 justify-center w-fit mx-auto ${cfg.cls}`}>
                        {cfg.icon}{e.nature}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Détail */}
        <div className="card">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`badge ${natureCfg[selected.nature].cls}`}>{selected.nature}</span>
                <span className="font-mono text-xs text-neutral-500">{selected.id}</span>
              </div>
              <div>
                <div className="text-xs text-neutral-400 mb-1">Compte</div>
                <div className="font-mono font-bold text-neutral-800">{selected.compte}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-400 mb-1">Libellé</div>
                <div className="text-sm text-neutral-700">{selected.libelle}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-neutral-400 mb-1">Débit</div>
                  <div className={`font-semibold text-sm ${selected.debit > 0 ? 'text-amber-600' : 'text-neutral-300'}`}>
                    {selected.debit > 0 ? fmtXOF(selected.debit) : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400 mb-1">Crédit</div>
                  <div className={`font-semibold text-sm ${selected.credit > 0 ? 'text-blue-600' : 'text-neutral-300'}`}>
                    {selected.credit > 0 ? fmtXOF(selected.credit) : '—'}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-400 mb-1">Note / Action</div>
                <div className="text-xs text-neutral-600 bg-neutral-50 rounded-lg p-3 leading-relaxed">{selected.note}</div>
              </div>
              <div className={`flex items-center gap-2 text-xs font-medium p-2 rounded-lg ${selected.anciennete > 60 ? 'bg-red-50 text-red-600' : selected.anciennete > 30 ? 'bg-amber-50 text-amber-600' : 'bg-neutral-50 text-neutral-500'}`}>
                <Clock size={12} />Ancienneté : {selected.anciennete} jours
              </div>
              <div className="flex gap-2">
                <button className="btn border border-neutral-200 bg-white text-neutral-600 text-xs flex-1">Modifier</button>
                <button className="btn btn-primary text-xs flex-1 flex items-center gap-1 justify-center">
                  <CheckCircle size={11} /> Régulariser
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400 text-sm text-center py-16">
              Sélectionnez une écriture<br />pour voir le détail
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
