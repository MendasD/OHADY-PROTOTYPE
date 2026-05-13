import { useState } from 'react';
import {
  Plus, ArrowUpCircle, ArrowDownCircle, CheckCircle, Clock,
  Printer, Download, AlertTriangle, Banknote, RefreshCw,
} from 'lucide-react';
import { fmtXOF } from '../data/mockData';

interface CaisseEntry {
  id: string; date: string; heure: string; libelle: string;
  type: 'encaissement' | 'decaissement'; montant: number;
  mode: string; user: string; piece?: string; solde: number;
}

const entries: CaisseEntry[] = [
  { id: 'c1', date: '13/05/2026', heure: '09:14', libelle: 'Solde d\'ouverture',             type: 'encaissement', montant: 0,      mode: '—',          user: 'Système',    solde: 225000  },
  { id: 'c2', date: '13/05/2026', heure: '10:22', libelle: 'Remise client — Paiement espèces',type: 'encaissement', montant: 85000,  mode: 'Espèces',    user: 'A. Diallo',  piece: 'RC-0214', solde: 310000 },
  { id: 'c3', date: '13/05/2026', heure: '11:05', libelle: 'Achat fournitures bureau',        type: 'decaissement', montant: 48500,  mode: 'Espèces',    user: 'M. Camara',  piece: 'BD-0204', solde: 261500 },
  { id: 'c4', date: '13/05/2026', heure: '14:30', libelle: 'Avance mission — Aminata D.',     type: 'decaissement', montant: 150000, mode: 'Espèces',    user: 'I. Touré',   piece: 'AV-0089', solde: 111500 },
  { id: 'c5', date: '13/05/2026', heure: '15:45', libelle: 'Encaissement client — divers',    type: 'encaissement', montant: 45000,  mode: 'Espèces',    user: 'A. Diallo',  piece: 'RC-0215', solde: 156500 },
  { id: 'c6', date: '12/05/2026', heure: '16:10', libelle: 'Remboursement frais transport',   type: 'decaissement', montant: 25000,  mode: 'Espèces',    user: 'F. Ndiaye',  piece: 'RF-0042', solde: 131500 },
  { id: 'c7', date: '12/05/2026', heure: '17:00', libelle: 'Dépôt en banque SGBS',            type: 'decaissement', montant: 200000, mode: 'Virement int.', user: 'I. Touré', piece: 'VB-0031', solde: 225000 },
];

const denominations = [
  { valeur: 10000, nb: 8,  total: 80000  },
  { valeur: 5000,  nb: 12, total: 60000  },
  { valeur: 2000,  nb: 15, total: 30000  },
  { valeur: 1000,  nb: 25, total: 25000  },
  { valeur: 500,   nb: 14, total: 7000   },
  { valeur: 200,   nb: 10, total: 2000   },
  { valeur: 100,   nb: 10, total: 1000   },
];

export default function Caisse() {
  const [activeTab, setActiveTab] = useState<'mouvements' | 'arrete'>('mouvements');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'encaissement' | 'decaissement'>('encaissement');

  const soldeActuel = entries[entries.length - 1].solde;
  const totalEncaissements = entries.filter(e => e.type === 'encaissement').reduce((s, e) => s + e.montant, 0);
  const totalDecaissements = entries.filter(e => e.type === 'decaissement').reduce((s, e) => s + e.montant, 0);
  const totalBillets = denominations.reduce((s, d) => s + d.total, 0);
  const ecart = soldeActuel - totalBillets;

  return (
    <div className="space-y-5 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Caisse principale</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Mouvements du 13/05/2026 · Exercice 2025–2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Printer size={13} /> Imprimer</button>
          <button className="btn btn-outline btn-sm" onClick={() => { setFormType('encaissement'); setShowForm(true); }}>
            <ArrowUpCircle size={13} className="text-success" /> Encaissement
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => { setFormType('decaissement'); setShowForm(true); }}>
            <ArrowDownCircle size={13} /> Décaissement
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Solde caisse actuel', value: fmtXOF(soldeActuel), color: 'text-neutral-800', sub: 'Mis à jour 15:45', icon: Banknote, bg: 'bg-green-50' },
          { label: 'Encaissements du jour', value: fmtXOF(totalEncaissements), color: 'text-success', sub: `${entries.filter(e=>e.type==='encaissement').length} opérations`, icon: ArrowUpCircle, bg: 'bg-green-50' },
          { label: 'Décaissements du jour', value: fmtXOF(totalDecaissements), color: 'text-danger', sub: `${entries.filter(e=>e.type==='decaissement').length} opérations`, icon: ArrowDownCircle, bg: 'bg-red-50' },
          { label: 'Solde physique compté', value: fmtXOF(totalBillets), color: ecart === 0 ? 'text-success' : 'text-danger', sub: ecart === 0 ? 'Aucun écart' : `Écart : ${fmtXOF(Math.abs(ecart))}`, icon: ecart === 0 ? CheckCircle : AlertTriangle, bg: ecart === 0 ? 'bg-green-50' : 'bg-red-50' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`card ${item.bg}`}>
              <div className="flex items-start justify-between mb-2">
                <Icon size={18} className={item.color} />
                <span className="text-[10px] text-neutral-400">{item.sub}</span>
              </div>
              <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-neutral-500 mt-1">{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        {[
          { id: 'mouvements', label: 'Mouvements du jour' },
          { id: 'arrete',     label: 'Arrêté de caisse'   },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-0 ${activeTab === tab.id ? 'bg-white text-neutral-800 shadow-card' : 'text-neutral-500 hover:text-neutral-700 bg-transparent'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mouvements */}
      {activeTab === 'mouvements' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Livre de caisse — 13 mai 2026</h2>
            <button className="btn btn-outline btn-sm"><Download size={13} /> Exporter</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Heure</th>
                  <th>Libellé</th>
                  <th>Pièce</th>
                  <th className="text-right text-success">Entrées</th>
                  <th className="text-right text-danger">Sorties</th>
                  <th className="text-right">Solde</th>
                  <th>Saisie par</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.id} className={entry.id === 'c1' ? 'bg-neutral-50' : ''}>
                    <td className="text-neutral-500 whitespace-nowrap text-xs">{entry.heure}</td>
                    <td className="font-medium text-neutral-800">{entry.libelle}</td>
                    <td className="font-mono text-xs text-neutral-400">{entry.piece || '—'}</td>
                    <td className="text-right font-semibold text-success">
                      {entry.type === 'encaissement' && entry.montant > 0 ? fmtXOF(entry.montant) : <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="text-right font-semibold text-danger">
                      {entry.type === 'decaissement' ? fmtXOF(entry.montant) : <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="text-right font-bold text-neutral-800">{fmtXOF(entry.solde)}</td>
                    <td className="text-xs text-neutral-500">{entry.user}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-primary text-white font-bold">
                  <td colSpan={3} className="px-4 py-3 text-sm">Totaux du jour</td>
                  <td className="text-right px-4 py-3 text-success-light">{fmtXOF(totalEncaissements)}</td>
                  <td className="text-right px-4 py-3 text-red-300">{fmtXOF(totalDecaissements)}</td>
                  <td className="text-right px-4 py-3">{fmtXOF(soldeActuel)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Arrêté de caisse */}
      {activeTab === 'arrete' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="section-title mb-4">Comptage physique des espèces</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-2 px-3 text-xs text-neutral-500">Coupure (XOF)</th>
                  <th className="text-center py-2 px-3 text-xs text-neutral-500">Nbre de billets</th>
                  <th className="text-right py-2 px-3 text-xs text-neutral-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {denominations.map(d => (
                  <tr key={d.valeur} className="border-b border-neutral-50">
                    <td className="py-2.5 px-3 font-medium">{fmtXOF(d.valeur)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <input type="number" defaultValue={d.nb} className="input text-center py-1 w-20 text-xs" />
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-neutral-800">{fmtXOF(d.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-50 font-bold border-t-2 border-neutral-200">
                  <td colSpan={2} className="px-3 py-3 text-sm">Total physique compté</td>
                  <td className="px-3 py-3 text-right text-base text-secondary">{fmtXOF(totalBillets)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="space-y-4">
            <div className="card">
              <h3 className="section-title mb-4">Résumé de l'arrêté</h3>
              <div className="space-y-3">
                {[
                  { label: 'Solde d\'ouverture', value: fmtXOF(225000), color: 'text-neutral-700' },
                  { label: '+ Encaissements du jour', value: `+${fmtXOF(totalEncaissements)}`, color: 'text-success' },
                  { label: '- Décaissements du jour', value: `-${fmtXOF(totalDecaissements)}`, color: 'text-danger' },
                  { label: '= Solde théorique', value: fmtXOF(soldeActuel), color: 'text-secondary font-bold' },
                  { label: 'Solde physique compté', value: fmtXOF(totalBillets), color: 'text-neutral-800 font-bold' },
                  { label: 'Écart de caisse', value: ecart === 0 ? 'Aucun écart ✓' : fmtXOF(ecart), color: ecart === 0 ? 'text-success font-bold' : 'text-danger font-bold' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between border-b border-neutral-100 pb-2 last:border-0">
                    <span className="text-sm text-neutral-500">{item.label}</span>
                    <span className={`text-sm ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`card ${ecart === 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {ecart === 0
                  ? <CheckCircle size={16} className="text-success" />
                  : <AlertTriangle size={16} className="text-danger" />
                }
                <span className={`text-sm font-semibold ${ecart === 0 ? 'text-success' : 'text-danger'}`}>
                  {ecart === 0 ? 'Caisse équilibrée' : 'Écart de caisse détecté'}
                </span>
              </div>
              <p className="text-xs text-neutral-600">
                {ecart === 0
                  ? 'Le solde théorique correspond au solde physique. La caisse peut être clôturée.'
                  : `Un écart de ${fmtXOF(Math.abs(ecart))} a été détecté. Vérifiez les pièces justificatives avant de valider.`
                }
              </p>
              <div className="mt-3 flex gap-2">
                <button className={`btn ${ecart === 0 ? 'btn-success' : 'btn-danger'} btn-sm flex-1`}>
                  <CheckCircle size={12} /> {ecart === 0 ? 'Valider l\'arrêté' : 'Signaler l\'écart'}
                </button>
                <button className="btn btn-outline btn-sm"><Printer size={12} /> Imprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="section-title mb-4">{formType === 'encaissement' ? 'Nouvel encaissement' : 'Nouveau décaissement'}</h3>
            <div className="space-y-3">
              <div><label>Libellé</label><input className="input" placeholder="Description de l'opération" /></div>
              <div><label>Montant (XOF)</label><input className="input" type="number" placeholder="0" /></div>
              <div><label>N° Pièce justificative</label><input className="input" placeholder="RC-XXXX ou BD-XXXX" /></div>
              <div><label>Mode de règlement</label>
                <select className="select"><option>Espèces</option><option>Chèque</option></select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="btn btn-outline flex-1">Annuler</button>
              <button onClick={() => setShowForm(false)} className={`btn flex-1 ${formType === 'encaissement' ? 'btn-success' : 'btn-primary'}`}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
