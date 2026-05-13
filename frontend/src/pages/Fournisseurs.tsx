import { useState } from 'react';
import { Plus, Search, Star, Phone, Mail, MapPin, TrendingUp } from 'lucide-react';

const fmtXOF = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' XOF';

interface Fournisseur {
  id: string;
  nom: string;
  categorie: string;
  contact: string;
  email: string;
  ville: string;
  soldeDu: number;
  delaiPaiement: number;
  totalAchats12m: number;
  note: number;
  statut: 'Actif' | 'Inactif' | 'Litige';
}

const fournisseurs: Fournisseur[] = [
  { id: 'F-001', nom: 'Papeterie du Sahel', categorie: 'Fournitures bureau', contact: 'Ibou Diop', email: 'ibou@sahelpapeterie.sn', ville: 'Dakar', soldeDu: 485000, delaiPaiement: 30, totalAchats12m: 2840000, note: 4, statut: 'Actif' },
  { id: 'F-002', nom: 'Daikin Sénégal', categorie: 'Équipements', contact: 'Mariama Fall', email: 'mfall@daikin.sn', ville: 'Dakar', soldeDu: 1260000, delaiPaiement: 45, totalAchats12m: 5200000, note: 5, statut: 'Actif' },
  { id: 'F-003', nom: 'Dell Technologies SN', categorie: 'Informatique', contact: 'Seydou Traoré', email: 'straoré@dell.com', ville: 'Dakar', soldeDu: 2900000, delaiPaiement: 30, totalAchats12m: 12400000, note: 5, statut: 'Actif' },
  { id: 'F-004', nom: 'Total Énergie Sénégal', categorie: 'Énergie', contact: 'Aminata Cissé', email: 'acisse@total.sn', ville: 'Dakar', soldeDu: 0, delaiPaiement: 15, totalAchats12m: 4560000, note: 4, statut: 'Actif' },
  { id: 'F-005', nom: 'Sonatel Business', categorie: 'Télécoms', contact: 'Omar Sarr', email: 'osarr@sonatel.sn', ville: 'Dakar', soldeDu: 780000, delaiPaiement: 30, totalAchats12m: 9360000, note: 3, statut: 'Actif' },
  { id: 'F-006', nom: 'Imprimerie Dakar Press', categorie: 'Impression', contact: 'Rokhaya Ndiaye', email: 'rndiaye@dakarpress.sn', ville: 'Dakar', soldeDu: 0, delaiPaiement: 15, totalAchats12m: 680000, note: 3, statut: 'Inactif' },
  { id: 'F-007', nom: 'DataCenter Solutions', categorie: 'Informatique', contact: 'Malick Bâ', email: 'mba@dcs.sn', ville: 'Thiès', soldeDu: 0, delaiPaiement: 30, totalAchats12m: 1850000, note: 4, statut: 'Actif' },
  { id: 'F-008', nom: 'Construct & Build SA', categorie: 'BTP', contact: 'Alpha Diallo', email: 'adiallo@constructbuild.sn', ville: 'Saint-Louis', soldeDu: 3200000, delaiPaiement: 60, totalAchats12m: 18400000, note: 2, statut: 'Litige' },
];

const categories = [...new Set(fournisseurs.map(f => f.categorie))];

export default function Fournisseurs() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [selected, setSelected] = useState<Fournisseur | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = fournisseurs.filter(f =>
    (f.nom.toLowerCase().includes(search.toLowerCase()) || f.categorie.toLowerCase().includes(search.toLowerCase())) &&
    (!cat || f.categorie === cat)
  );

  const totalDu = fournisseurs.reduce((s, f) => s + f.soldeDu, 0);
  const totalAchats = fournisseurs.reduce((s, f) => s + f.totalAchats12m, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Fournisseurs</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Répertoire et suivi des relations fournisseurs</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Nouveau fournisseur
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Fournisseurs actifs', val: fournisseurs.filter(f => f.statut === 'Actif').length.toString(), color: 'text-blue-600' },
          { label: 'Total dû fournisseurs', val: fmtXOF(totalDu), color: 'text-amber-600' },
          { label: 'Achats 12 mois', val: fmtXOF(totalAchats), color: 'text-green-600' },
          { label: 'En litige', val: fournisseurs.filter(f => f.statut === 'Litige').length.toString(), color: 'text-red-600' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className={`text-xs font-medium mb-1 ${k.color}`}>{k.label}</div>
            <div className={`text-base font-bold ${k.color}`}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Liste */}
        <div className="col-span-2 card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 border border-neutral-200 rounded-lg px-3 py-2 bg-white">
              <Search size={14} className="text-neutral-400" />
              <input className="flex-1 outline-none text-sm bg-transparent" placeholder="Rechercher un fournisseur..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input text-sm py-2" value={cat} onChange={e => setCat(e.target.value)}>
              <option value="">Toutes catégories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                <th className="text-left pb-2">Fournisseur</th>
                <th className="text-left pb-2">Catégorie</th>
                <th className="text-right pb-2">Solde dû</th>
                <th className="text-center pb-2">Délai</th>
                <th className="text-center pb-2">Note</th>
                <th className="text-center pb-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}
                  onClick={() => setSelected(f)}
                  className={`border-t border-neutral-50 hover:bg-neutral-50 cursor-pointer transition-colors ${selected?.id === f.id ? 'bg-blue-50' : ''}`}>
                  <td className="py-2.5">
                    <div className="font-medium text-neutral-800">{f.nom}</div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1"><MapPin size={9} />{f.ville}</div>
                  </td>
                  <td className="py-2.5"><span className="badge badge-blue text-[10px]">{f.categorie}</span></td>
                  <td className={`py-2.5 text-right font-semibold ${f.soldeDu > 0 ? 'text-amber-600' : 'text-neutral-400'}`}>
                    {f.soldeDu > 0 ? fmtXOF(f.soldeDu) : '—'}
                  </td>
                  <td className="py-2.5 text-center text-xs text-neutral-500">{f.delaiPaiement}j</td>
                  <td className="py-2.5 text-center">
                    <div className="flex items-center gap-0.5 justify-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={10} className={i < f.note ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'} />
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`badge ${f.statut === 'Actif' ? 'badge-green' : f.statut === 'Litige' ? 'badge-red' : 'bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full text-[10px] font-medium'}`}>
                      {f.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fiche fournisseur */}
        <div className="card">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800">{selected.nom}</h3>
                  <span className="badge badge-blue text-[10px] mt-1">{selected.categorie}</span>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < selected.note ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'} />
                  ))}
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-600"><Phone size={11} className="text-neutral-400" />{selected.contact}</div>
                <div className="flex items-center gap-2 text-neutral-600"><Mail size={11} className="text-neutral-400" />{selected.email}</div>
                <div className="flex items-center gap-2 text-neutral-600"><MapPin size={11} className="text-neutral-400" />{selected.ville}, Sénégal</div>
              </div>
              <div className="border-t border-neutral-100 pt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Solde dû</span>
                  <span className={`font-bold ${selected.soldeDu > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    {selected.soldeDu > 0 ? fmtXOF(selected.soldeDu) : 'À jour'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Délai de paiement</span>
                  <span className="font-medium text-neutral-700">{selected.delaiPaiement} jours</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Achats 12 mois</span>
                  <span className="font-bold text-primary flex items-center gap-1"><TrendingUp size={10} />{fmtXOF(selected.totalAchats12m)}</span>
                </div>
              </div>
              <div className="border-t border-neutral-100 pt-3">
                <span className={`badge w-full justify-center text-xs py-1.5 ${selected.statut === 'Actif' ? 'badge-green' : selected.statut === 'Litige' ? 'badge-red' : 'bg-neutral-100 text-neutral-500'}`}>
                  {selected.statut}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="btn border border-neutral-200 bg-white text-neutral-600 text-xs flex-1">Modifier</button>
                <button className="btn btn-primary text-xs flex-1">Créer un BC</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400 text-sm text-center py-16">
              Sélectionnez un fournisseur<br />pour voir sa fiche
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl w-[480px] p-6 space-y-4">
            <h2 className="text-base font-bold text-primary">Nouveau fournisseur</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs font-medium text-neutral-600">Raison sociale</label><input className="input w-full mt-1 text-sm" /></div>
              <div><label className="text-xs font-medium text-neutral-600">Catégorie</label><select className="input w-full mt-1 text-sm">{categories.map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label className="text-xs font-medium text-neutral-600">Délai paiement (j)</label><input type="number" className="input w-full mt-1 text-sm" defaultValue={30} /></div>
              <div><label className="text-xs font-medium text-neutral-600">Contact</label><input className="input w-full mt-1 text-sm" /></div>
              <div><label className="text-xs font-medium text-neutral-600">Email</label><input type="email" className="input w-full mt-1 text-sm" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="btn border border-neutral-200 text-neutral-600 bg-white text-sm">Annuler</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary text-sm">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
