import { useState } from 'react';
import { Plus, Search, CheckCircle, Clock, Truck, XCircle, Eye } from 'lucide-react';

const fmtXOF = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' XOF';

type StatutBC = 'Brouillon' | 'En attente' | 'Approuvé' | 'Livré' | 'Partiellement livré' | 'Annulé';

interface BonCommande {
  ref: string;
  fournisseur: string;
  objet: string;
  dateEmission: string;
  dateLivraison: string;
  montant: number;
  statut: StatutBC;
  demandeur: string;
  approbateur: string;
}

const bons: BonCommande[] = [
  { ref: 'BC-2026-0342', fournisseur: 'Papeterie du Sahel', objet: 'Fournitures bureau T2 2026', dateEmission: '12/05/2026', dateLivraison: '20/05/2026', montant: 485000, statut: 'Approuvé', demandeur: 'Fatou Diallo', approbateur: 'DG' },
  { ref: 'BC-2026-0341', fournisseur: 'Daikin Sénégal', objet: 'Climatiseurs bureaux annexes', dateEmission: '10/05/2026', dateLivraison: '25/05/2026', montant: 1260000, statut: 'En attente', demandeur: 'Cheikh Ndiaye', approbateur: '—' },
  { ref: 'BC-2026-0340', fournisseur: 'DataCenter Solutions', objet: 'Câbles et accessoires réseau', dateEmission: '09/05/2026', dateLivraison: '14/05/2026', montant: 215000, statut: 'Livré', demandeur: 'Système', approbateur: 'DAF' },
  { ref: 'BC-2026-0339', fournisseur: 'Dell Technologies SN', objet: 'Ordinateurs portables (5u)', dateEmission: '05/05/2026', dateLivraison: '19/05/2026', montant: 2900000, statut: 'Partiellement livré', demandeur: 'DSI', approbateur: 'DG + DAF' },
  { ref: 'BC-2026-0338', fournisseur: 'Total Énergie', objet: 'Carburant générateur — mai', dateEmission: '01/05/2026', dateLivraison: '05/05/2026', montant: 380000, statut: 'Livré', demandeur: 'Logistique', approbateur: 'DAF' },
  { ref: 'BC-2026-0337', fournisseur: 'Sonatel Business', objet: 'Renouvellement fibres optiques', dateEmission: '28/04/2026', dateLivraison: '28/05/2026', montant: 780000, statut: 'Approuvé', demandeur: 'DSI', approbateur: 'DG' },
  { ref: 'BC-2026-0336', fournisseur: 'Imprimerie Dakar Press', objet: 'Impression rapports annuels', dateEmission: '20/04/2026', dateLivraison: '30/04/2026', montant: 145000, statut: 'Annulé', demandeur: 'Communication', approbateur: '—' },
];

const statutCfg: Record<StatutBC, { cls: string; icon: React.ReactNode }> = {
  'Brouillon': { cls: 'badge-blue', icon: <Clock size={10} /> },
  'En attente': { cls: 'badge-orange', icon: <Clock size={10} /> },
  'Approuvé': { cls: 'badge-green', icon: <CheckCircle size={10} /> },
  'Livré': { cls: 'bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-[10px] font-medium', icon: <Truck size={10} /> },
  'Partiellement livré': { cls: 'badge-orange', icon: <Truck size={10} /> },
  'Annulé': { cls: 'badge-red', icon: <XCircle size={10} /> },
};

export default function BonsCommande() {
  const [search, setSearch] = useState('');
  const [filtre, setFiltre] = useState<StatutBC | ''>('');
  const [showModal, setShowModal] = useState(false);

  const filtered = bons.filter(b =>
    (b.ref.toLowerCase().includes(search.toLowerCase()) || b.fournisseur.toLowerCase().includes(search.toLowerCase())) &&
    (!filtre || b.statut === filtre)
  );

  const totalCommandes = bons.reduce((s, b) => s + b.montant, 0);
  const enAttente = bons.filter(b => b.statut === 'En attente').length;
  const livres = bons.filter(b => b.statut === 'Livré').reduce((s, b) => s + b.montant, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Bons de commande</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Suivi des achats fournisseurs et réceptions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Nouveau BC
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total commandé (mai)', val: fmtXOF(totalCommandes), color: 'text-blue-600' },
          { label: 'Livré & réceptionné', val: fmtXOF(livres), color: 'text-green-600' },
          { label: 'En attente approbation', val: enAttente.toString(), color: 'text-amber-600' },
          { label: 'BC ce mois', val: bons.length.toString(), color: 'text-purple-600' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className={`text-xs font-medium mb-1 ${k.color}`}>{k.label}</div>
            <div className={`text-base font-bold ${k.color}`}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Filtres & table */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1 border border-neutral-200 rounded-lg px-3 py-2 bg-white">
            <Search size={14} className="text-neutral-400" />
            <input className="flex-1 outline-none text-sm bg-transparent" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(['', 'En attente', 'Approuvé', 'Partiellement livré', 'Livré', 'Annulé'] as (StatutBC | '')[]).map(s => (
              <button key={s} onClick={() => setFiltre(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filtre === s ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>
                {s || 'Tous'}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
              <th className="text-left pb-2">Référence</th>
              <th className="text-left pb-2">Fournisseur</th>
              <th className="text-left pb-2">Objet</th>
              <th className="text-right pb-2">Montant HT</th>
              <th className="text-center pb-2">Émission</th>
              <th className="text-center pb-2">Livraison</th>
              <th className="text-left pb-2">Demandeur</th>
              <th className="text-center pb-2">Statut</th>
              <th className="text-center pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const cfg = statutCfg[b.statut];
              return (
                <tr key={b.ref} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="py-2.5 font-mono text-xs text-secondary font-semibold">{b.ref}</td>
                  <td className="py-2.5 font-medium text-neutral-800">{b.fournisseur}</td>
                  <td className="py-2.5 text-neutral-600 text-xs max-w-[180px] truncate">{b.objet}</td>
                  <td className="py-2.5 text-right font-semibold text-neutral-800">{fmtXOF(b.montant)}</td>
                  <td className="py-2.5 text-center text-xs text-neutral-500">{b.dateEmission}</td>
                  <td className="py-2.5 text-center text-xs text-neutral-500">{b.dateLivraison}</td>
                  <td className="py-2.5 text-xs text-neutral-600">{b.demandeur}</td>
                  <td className="py-2.5 text-center">
                    <span className={`badge flex items-center gap-1 justify-center w-fit mx-auto ${cfg.cls}`}>
                      {cfg.icon}{b.statut}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center">
                        <Eye size={13} className="text-neutral-500" />
                      </button>
                      {b.statut === 'En attente' && (
                        <button className="text-[10px] px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium">Approuver</button>
                      )}
                      {(b.statut === 'Approuvé' || b.statut === 'Partiellement livré') && (
                        <button className="text-[10px] px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium flex items-center gap-1">
                          <Truck size={9} /> Réceptionner
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl w-[520px] p-6 space-y-4">
            <h2 className="text-base font-bold text-primary">Nouveau bon de commande</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-neutral-600">Fournisseur</label>
                <select className="input w-full mt-1 text-sm">
                  <option>Papeterie du Sahel</option><option>Dell Technologies SN</option><option>Sonatel Business</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-neutral-600">Objet de la commande</label>
                <input className="input w-full mt-1 text-sm" placeholder="Description..." />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Montant HT (XOF)</label>
                <input type="number" className="input w-full mt-1 text-sm" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Date de livraison souhaitée</label>
                <input type="date" className="input w-full mt-1 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="btn border border-neutral-200 text-neutral-600 bg-white text-sm">Annuler</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary text-sm">Créer le BC</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
