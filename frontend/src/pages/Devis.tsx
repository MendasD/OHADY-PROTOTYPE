import { useState } from 'react';
import { Plus, Search, FileText, CheckCircle, XCircle, Clock, Send, Eye, Copy } from 'lucide-react';

const fmtXOF = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' XOF';

type Statut = 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé' | 'Expiré';

interface Devis {
  ref: string;
  client: string;
  objet: string;
  date: string;
  expiration: string;
  montant: number;
  statut: Statut;
  commercial: string;
}

const devisList: Devis[] = [
  { ref: 'DEV-2026-0041', client: 'SONATEL', objet: 'Fourniture équipements réseau', date: '10/05/2026', expiration: '10/06/2026', montant: 4850000, statut: 'Envoyé', commercial: 'Mamadou Sow' },
  { ref: 'DEV-2026-0040', client: 'SONES', objet: 'Prestations audit système', date: '08/05/2026', expiration: '08/06/2026', montant: 1200000, statut: 'Accepté', commercial: 'Fatou Diallo' },
  { ref: 'DEV-2026-0039', client: 'CBAO', objet: 'Maintenance informatique T2', date: '05/05/2026', expiration: '05/06/2026', montant: 780000, statut: 'Accepté', commercial: 'Mamadou Sow' },
  { ref: 'DEV-2026-0038', client: 'Orange Sénégal', objet: 'Consulting transformation digitale', date: '28/04/2026', expiration: '28/05/2026', montant: 3200000, statut: 'Refusé', commercial: 'Aissatou Ba' },
  { ref: 'DEV-2026-0037', client: 'Dakar Dem Dikk', objet: 'Logiciels de gestion flotte', date: '20/04/2026', expiration: '20/05/2026', montant: 2450000, statut: 'Expiré', commercial: 'Cheikh Ndiaye' },
  { ref: 'DEV-2026-0036', client: 'ICTS Global', objet: 'Déploiement infrastructure cloud', date: '15/04/2026', expiration: '15/05/2026', montant: 8900000, statut: 'Accepté', commercial: 'Fatou Diallo' },
  { ref: 'DEV-2026-0035', client: 'SENELEC', objet: 'Mise à jour progiciels comptables', date: '10/04/2026', expiration: '10/05/2026', montant: 1650000, statut: 'Brouillon', commercial: 'Mamadou Sow' },
  { ref: 'DEV-2026-0034', client: 'Ministère Finances', objet: 'Formation équipes DGI', date: '01/04/2026', expiration: '01/05/2026', montant: 960000, statut: 'Envoyé', commercial: 'Aissatou Ba' },
];

const statutConfig: Record<Statut, { label: string; cls: string; icon: React.ReactNode }> = {
  Brouillon: { label: 'Brouillon', cls: 'badge-blue', icon: <FileText size={10} /> },
  Envoyé:    { label: 'Envoyé',    cls: 'badge-orange', icon: <Send size={10} /> },
  Accepté:   { label: 'Accepté',   cls: 'badge-green', icon: <CheckCircle size={10} /> },
  Refusé:    { label: 'Refusé',    cls: 'badge-red', icon: <XCircle size={10} /> },
  Expiré:    { label: 'Expiré',    cls: 'bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full text-[10px] font-medium', icon: <Clock size={10} /> },
};

export default function Devis() {
  const [search, setSearch] = useState('');
  const [filtre, setFiltre] = useState<Statut | ''>('');
  const [showModal, setShowModal] = useState(false);

  const filtered = devisList.filter(d =>
    (d.ref.toLowerCase().includes(search.toLowerCase()) ||
     d.client.toLowerCase().includes(search.toLowerCase()) ||
     d.objet.toLowerCase().includes(search.toLowerCase())) &&
    (!filtre || d.statut === filtre)
  );

  const totaux = {
    montantTotal: devisList.reduce((s, d) => s + d.montant, 0),
    acceptes: devisList.filter(d => d.statut === 'Accepté').reduce((s, d) => s + d.montant, 0),
    enAttente: devisList.filter(d => d.statut === 'Envoyé').reduce((s, d) => s + d.montant, 0),
    tauxConv: Math.round(devisList.filter(d => d.statut === 'Accepté').length / devisList.filter(d => d.statut !== 'Brouillon').length * 100),
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Devis & Contrats</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Gestion des propositions commerciales</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Nouveau devis
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pipeline total', val: fmtXOF(totaux.montantTotal), color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Devis acceptés', val: fmtXOF(totaux.acceptes), color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'En attente réponse', val: fmtXOF(totaux.enAttente), color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Taux de conversion', val: `${totaux.tauxConv}%`, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className={`text-xs font-medium mb-1 ${k.color}`}>{k.label}</div>
            <div className={`text-base font-bold ${k.color}`}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1 border border-neutral-200 rounded-lg px-3 py-2 bg-white">
            <Search size={14} className="text-neutral-400" />
            <input
              className="flex-1 outline-none text-sm bg-transparent"
              placeholder="Rechercher un devis..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            {(['', 'Brouillon', 'Envoyé', 'Accepté', 'Refusé', 'Expiré'] as (Statut | '')[]).map(s => (
              <button
                key={s}
                onClick={() => setFiltre(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filtre === s ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {s || 'Tous'}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
              <th className="text-left pb-2">Référence</th>
              <th className="text-left pb-2">Client</th>
              <th className="text-left pb-2">Objet</th>
              <th className="text-right pb-2">Montant HT</th>
              <th className="text-center pb-2">Date</th>
              <th className="text-center pb-2">Expiration</th>
              <th className="text-center pb-2">Statut</th>
              <th className="text-center pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => {
              const cfg = statutConfig[d.statut];
              return (
                <tr key={d.ref} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="py-2.5 font-mono text-xs text-secondary font-semibold">{d.ref}</td>
                  <td className="py-2.5 font-medium text-neutral-800">{d.client}</td>
                  <td className="py-2.5 text-neutral-600 text-xs max-w-[200px] truncate">{d.objet}</td>
                  <td className="py-2.5 text-right font-semibold text-neutral-800">{fmtXOF(d.montant)}</td>
                  <td className="py-2.5 text-center text-xs text-neutral-500">{d.date}</td>
                  <td className="py-2.5 text-center text-xs text-neutral-500">{d.expiration}</td>
                  <td className="py-2.5 text-center">
                    <span className={`badge flex items-center gap-1 justify-center w-fit mx-auto ${cfg.cls}`}>
                      {cfg.icon}{cfg.label}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center" title="Voir">
                        <Eye size={13} className="text-neutral-500" />
                      </button>
                      <button className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center" title="Dupliquer">
                        <Copy size={13} className="text-neutral-500" />
                      </button>
                      {d.statut === 'Accepté' && (
                        <button className="text-[10px] px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium">
                          → Facture
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

      {/* Modal nouveau devis */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl w-[520px] p-6 space-y-4">
            <h2 className="text-base font-bold text-primary">Nouveau devis</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-neutral-600">Client</label>
                <select className="input w-full mt-1 text-sm">
                  <option>SONATEL</option><option>SONES</option><option>CBAO</option><option>Orange Sénégal</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-neutral-600">Objet</label>
                <input className="input w-full mt-1 text-sm" placeholder="Objet de la proposition..." />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Date d'émission</label>
                <input type="date" className="input w-full mt-1 text-sm" defaultValue="2026-05-13" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Date d'expiration</label>
                <input type="date" className="input w-full mt-1 text-sm" defaultValue="2026-06-13" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Montant HT (XOF)</label>
                <input type="number" className="input w-full mt-1 text-sm" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Commercial</label>
                <select className="input w-full mt-1 text-sm">
                  <option>Mamadou Sow</option><option>Fatou Diallo</option><option>Aissatou Ba</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="btn border border-neutral-200 text-neutral-600 bg-white text-sm">Annuler</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary text-sm">Créer le devis</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
