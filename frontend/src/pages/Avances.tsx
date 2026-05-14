import { useState } from 'react';
import { Plus, CheckCircle, Clock, XCircle, Receipt, Briefcase } from 'lucide-react';

const fmtXOF = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' XOF';

type TypeDemande = 'Avance' | 'Note de frais';
type StatutDemande = 'En attente' | 'Approuvé' | 'Remboursé' | 'Refusé';

interface Demande {
  id: string;
  type: TypeDemande;
  demandeur: string;
  objet: string;
  date: string;
  montant: number;
  justificatifs: number;
  statut: StatutDemande;
  approbateur: string;
}

const demandes: Demande[] = [
  { id: 'AV-2026-031', type: 'Avance', demandeur: 'Cheikh Ndiaye', objet: 'Mission Thiès — 3 jours', date: '12/05/2026', montant: 180000, justificatifs: 0, statut: 'En attente', approbateur: '—' },
  { id: 'NF-2026-089', type: 'Note de frais', demandeur: 'Fatou Diallo', objet: 'Transport + restauration séminaire', date: '11/05/2026', montant: 47500, justificatifs: 4, statut: 'Approuvé', approbateur: 'DAF' },
  { id: 'AV-2026-030', type: 'Avance', demandeur: 'Aissatou Ba', objet: 'Mission Ziguinchor — 5 jours', date: '08/05/2026', montant: 350000, justificatifs: 0, statut: 'Approuvé', approbateur: 'DG' },
  { id: 'NF-2026-088', type: 'Note de frais', demandeur: 'Moussa Kouyaté', objet: 'Carburant véhicule service (avril)', date: '05/05/2026', montant: 85000, justificatifs: 3, statut: 'Remboursé', approbateur: 'DAF' },
  { id: 'NF-2026-087', type: 'Note de frais', demandeur: 'Ibrahima Dieng', objet: 'Hébergement formation Saly', date: '30/04/2026', montant: 210000, justificatifs: 2, statut: 'Remboursé', approbateur: 'DG' },
  { id: 'AV-2026-029', type: 'Avance', demandeur: 'Omar Fall', objet: 'Mission Dakar → Abidjan', date: '25/04/2026', montant: 650000, justificatifs: 0, statut: 'Refusé', approbateur: 'DG' },
  { id: 'NF-2026-086', type: 'Note de frais', demandeur: 'Rokhaya Ndiaye', objet: 'Achat fournitures urgentes', date: '22/04/2026', montant: 32500, justificatifs: 5, statut: 'Remboursé', approbateur: 'DAF' },
];

const statutCfg: Record<StatutDemande, { cls: string; icon: React.ReactNode }> = {
  'En attente': { cls: 'badge-orange', icon: <Clock size={10} /> },
  'Approuvé':   { cls: 'badge-blue', icon: <CheckCircle size={10} /> },
  'Remboursé':  { cls: 'badge-green', icon: <CheckCircle size={10} /> },
  'Refusé':     { cls: 'badge-red', icon: <XCircle size={10} /> },
};

export default function Avances() {
  const [tab, setTab] = useState<'liste' | 'new'>('liste');
  const [typeForm, setTypeForm] = useState<TypeDemande>('Avance');

  const enAttente = demandes.filter(d => d.statut === 'En attente');
  const totalEnAttente = enAttente.reduce((s, d) => s + d.montant, 0);
  const totalMois = demandes.filter(d => d.statut !== 'Refusé').reduce((s, d) => s + d.montant, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Avances & Frais de mission</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Demandes d'avances et notes de frais du personnel</p>
        </div>
        <button onClick={() => setTab('new')} className="btn btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Nouvelle demande
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'En attente validation', val: enAttente.length.toString(), sub: fmtXOF(totalEnAttente), color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total déboursé (mai)', val: fmtXOF(totalMois), sub: `${demandes.length} demandes`, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Notes de frais', val: demandes.filter(d => d.type === 'Note de frais').length.toString(), sub: 'ce mois', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avances accordées', val: demandes.filter(d => d.type === 'Avance' && d.statut !== 'Refusé').length.toString(), sub: 'ce mois', color: 'text-green-600', bg: 'bg-green-50' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className={`text-xs font-medium mb-1 ${k.color}`}>{k.label}</div>
            <div className={`text-base font-bold ${k.color}`}>{k.val}</div>
            <div className="text-xs text-neutral-400 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {tab === 'liste' ? (
        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                <th className="text-left pb-2">Référence</th>
                <th className="text-left pb-2">Type</th>
                <th className="text-left pb-2">Demandeur</th>
                <th className="text-left pb-2">Objet</th>
                <th className="text-right pb-2">Montant</th>
                <th className="text-center pb-2">Justificatifs</th>
                <th className="text-center pb-2">Date</th>
                <th className="text-center pb-2">Statut</th>
                <th className="text-center pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map(d => {
                const cfg = statutCfg[d.statut];
                return (
                  <tr key={d.id} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="py-2.5 font-mono text-xs text-neutral-500">{d.id}</td>
                    <td className="py-2.5">
                      <span className={`badge flex items-center gap-1 w-fit ${d.type === 'Avance' ? 'badge-blue' : 'badge-orange'}`}>
                        {d.type === 'Avance' ? <Briefcase size={9} /> : <Receipt size={9} />}
                        {d.type}
                      </span>
                    </td>
                    <td className="py-2.5 font-medium text-neutral-800">{d.demandeur}</td>
                    <td className="py-2.5 text-neutral-600 text-xs max-w-[180px] truncate">{d.objet}</td>
                    <td className="py-2.5 text-right font-semibold text-neutral-800">{fmtXOF(d.montant)}</td>
                    <td className="py-2.5 text-center">
                      {d.justificatifs > 0
                        ? <span className="text-xs text-green-600 font-medium">{d.justificatifs} PJ</span>
                        : <span className="text-xs text-neutral-300">—</span>
                      }
                    </td>
                    <td className="py-2.5 text-center text-xs text-neutral-500">{d.date}</td>
                    <td className="py-2.5 text-center">
                      <span className={`badge flex items-center gap-1 justify-center w-fit mx-auto ${cfg.cls}`}>
                        {cfg.icon}{d.statut}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      {d.statut === 'En attente' && (
                        <div className="flex gap-1 justify-center">
                          <button className="text-[10px] px-2 py-1 rounded-lg bg-green-50 text-green-700 font-medium">Approuver</button>
                          <button className="text-[10px] px-2 py-1 rounded-lg bg-red-50 text-red-600 font-medium">Refuser</button>
                        </div>
                      )}
                      {d.statut === 'Approuvé' && (
                        <button className="text-[10px] px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium">Rembourser</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-neutral-700">Nouvelle demande</h2>
            <button onClick={() => setTab('liste')} className="text-xs text-neutral-400 hover:text-neutral-600">← Retour</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-600">Type de demande</label>
              <div className="flex gap-3 mt-2">
                {(['Avance', 'Note de frais'] as TypeDemande[]).map(t => (
                  <button key={t} onClick={() => setTypeForm(t)}
                    className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium flex items-center justify-center gap-2 transition-all ${typeForm === t ? 'border-secondary bg-secondary/5 text-secondary' : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'}`}>
                    {t === 'Avance' ? <Briefcase size={15} /> : <Receipt size={15} />}{t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-neutral-600">Demandeur</label>
                <select className="input w-full mt-1 text-sm">
                  {['Cheikh Ndiaye', 'Fatou Diallo', 'Aissatou Ba', 'Moussa Kouyaté'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Montant demandé (XOF)</label>
                <input type="number" className="input w-full mt-1 text-sm" placeholder="0" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-neutral-600">Objet / Motif</label>
                <input className="input w-full mt-1 text-sm" placeholder="Décrivez l'objet de la demande..." />
              </div>
              {typeForm === 'Note de frais' && (
                <div className="col-span-2">
                  <label className="text-xs font-medium text-neutral-600">Pièces justificatives</label>
                  <div className="mt-1 border-2 border-dashed border-neutral-200 rounded-xl p-4 text-center text-xs text-neutral-400 hover:border-neutral-300 cursor-pointer">
                    Glisser-déposer vos justificatifs ici ou cliquer pour sélectionner
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setTab('liste')} className="btn border border-neutral-200 text-neutral-600 bg-white text-sm">Annuler</button>
              <button onClick={() => setTab('liste')} className="btn btn-primary text-sm">Soumettre la demande</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
