import { useState } from 'react';
import { Bell, Send, CheckCircle, Clock, AlertTriangle, Plus, Mail, Phone, Settings } from 'lucide-react';

const fmtXOF = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' XOF';

type Canal = 'Email' | 'SMS' | 'Courrier';
type NiveauRelance = 1 | 2 | 3;

interface Relance {
  id: string;
  client: string;
  facture: string;
  montant: number;
  retardJours: number;
  niveau: NiveauRelance;
  derniereRelance: string;
  prochaineRelance: string;
  canal: Canal;
  statut: 'Planifiée' | 'Envoyée' | 'Répondue' | 'Contentieux';
}

const relances: Relance[] = [
  { id: 'REL-001', client: 'SENELEC', facture: 'FAC-2026-0312', montant: 4200000, retardJours: 63, niveau: 3, derniereRelance: '01/05/2026', prochaineRelance: '15/05/2026', canal: 'Email', statut: 'Planifiée' },
  { id: 'REL-002', client: 'ICTS Global', facture: 'FAC-2026-0298', montant: 8700000, retardJours: 72, niveau: 3, derniereRelance: '28/04/2026', prochaineRelance: '12/05/2026', canal: 'Courrier', statut: 'Contentieux' },
  { id: 'REL-003', client: 'Dakar Dem Dikk', facture: 'FAC-2026-0335', montant: 1850000, retardJours: 12, niveau: 1, derniereRelance: '—', prochaineRelance: '14/05/2026', canal: 'Email', statut: 'Planifiée' },
  { id: 'REL-004', client: 'Ministère Finances', facture: 'FAC-2026-0301', montant: 13150000, retardJours: 33, niveau: 2, derniereRelance: '13/04/2026', prochaineRelance: '20/05/2026', canal: 'Email', statut: 'Envoyée' },
  { id: 'REL-005', client: 'CBAO', facture: 'FAC-2026-0289', montant: 620000, retardJours: 8, niveau: 1, derniereRelance: '—', prochaineRelance: '13/05/2026', canal: 'SMS', statut: 'Planifiée' },
  { id: 'REL-006', client: 'Orange Sénégal', facture: 'FAC-2026-0321', montant: 3400000, retardJours: 28, niveau: 2, derniereRelance: '25/04/2026', prochaineRelance: 'Répondu', canal: 'Email', statut: 'Répondue' },
];

const scenarios = [
  { niveau: 1 as NiveauRelance, label: 'Rappel amical', delai: 'J+7', canal: 'Email', message: 'Nous attirons votre attention sur la facture arrivée à échéance il y a 7 jours.' },
  { niveau: 2 as NiveauRelance, label: '2ème relance', delai: 'J+30', canal: 'Email + SMS', message: 'Malgré notre premier rappel, votre facture reste impayée. Merci de régulariser sous 8 jours.' },
  { niveau: 3 as NiveauRelance, label: 'Mise en demeure', delai: 'J+60', canal: 'Courrier AR', message: 'Sans paiement sous 15 jours, nous serons contraints d\'engager une procédure de recouvrement judiciaire.' },
];

const niveauConfig: Record<NiveauRelance, { cls: string; label: string }> = {
  1: { cls: 'badge-blue', label: 'Niveau 1' },
  2: { cls: 'badge-orange', label: 'Niveau 2' },
  3: { cls: 'badge-red', label: 'Niveau 3' },
};

const statutConfig = {
  Planifiée: { cls: 'badge-blue', icon: <Clock size={10} /> },
  Envoyée: { cls: 'badge-orange', icon: <Send size={10} /> },
  Répondue: { cls: 'badge-green', icon: <CheckCircle size={10} /> },
  Contentieux: { cls: 'badge-red', icon: <AlertTriangle size={10} /> },
};

const canalIcon: Record<Canal, React.ReactNode> = {
  Email: <Mail size={12} />,
  SMS: <Phone size={12} />,
  Courrier: <Bell size={12} />,
};

export default function Relances() {
  const [tab, setTab] = useState<'relances' | 'scenarios'>('relances');

  const montantTotal = relances.filter(r => r.statut !== 'Répondue').reduce((s, r) => s + r.montant, 0);
  const enContentieux = relances.filter(r => r.statut === 'Contentieux').reduce((s, r) => s + r.montant, 0);
  const planifiees = relances.filter(r => r.statut === 'Planifiée').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Relances automatiques</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Suivi et automatisation du recouvrement client</p>
        </div>
        <div className="flex gap-2">
          <button className="btn border border-neutral-200 text-neutral-600 bg-white flex items-center gap-1.5 text-sm">
            <Settings size={14} /> Configurer les scénarios
          </button>
          <button className="btn btn-primary flex items-center gap-1.5 text-sm">
            <Send size={14} /> Envoyer les relances planifiées ({planifiees})
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'En cours de recouvrement', val: fmtXOF(montantTotal), color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'En contentieux', val: fmtXOF(enContentieux), color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Relances planifiées', val: planifiees.toString(), color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Taux de réponse', val: `${Math.round(relances.filter(r => r.statut === 'Répondue').length / relances.length * 100)}%`, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className={`text-xs font-medium mb-1 ${k.color}`}>{k.label}</div>
            <div className={`text-base font-bold ${k.color}`}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white rounded-xl shadow-card w-fit">
        {[{ id: 'relances', label: 'Relances en cours' }, { id: 'scenarios', label: 'Scénarios de relance' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-primary text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'relances' && (
        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                <th className="text-left pb-2">Client</th>
                <th className="text-left pb-2">Facture</th>
                <th className="text-right pb-2">Montant</th>
                <th className="text-center pb-2">Retard</th>
                <th className="text-center pb-2">Niveau</th>
                <th className="text-center pb-2">Canal</th>
                <th className="text-center pb-2">Prochaine relance</th>
                <th className="text-center pb-2">Statut</th>
                <th className="text-center pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {relances.map(r => {
                const niv = niveauConfig[r.niveau];
                const stat = statutConfig[r.statut];
                return (
                  <tr key={r.id} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="py-2.5 font-medium text-neutral-800">{r.client}</td>
                    <td className="py-2.5 font-mono text-xs text-neutral-500">{r.facture}</td>
                    <td className="py-2.5 text-right font-semibold text-neutral-800">{fmtXOF(r.montant)}</td>
                    <td className="py-2.5 text-center">
                      <span className={`text-xs font-bold ${r.retardJours > 60 ? 'text-red-600' : r.retardJours > 30 ? 'text-amber-600' : 'text-neutral-600'}`}>
                        {r.retardJours}j
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`badge ${niv.cls}`}>{niv.label}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className="flex items-center gap-1 justify-center text-xs text-neutral-600">
                        {canalIcon[r.canal]}{r.canal}
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-xs text-neutral-500">{r.prochaineRelance}</td>
                    <td className="py-2.5 text-center">
                      <span className={`badge flex items-center gap-1 justify-center w-fit mx-auto ${stat.cls}`}>
                        {stat.icon}{r.statut}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      {r.statut === 'Planifiée' && (
                        <button className="text-[10px] px-2 py-1 rounded-lg bg-secondary text-white hover:bg-secondary/90 font-medium flex items-center gap-1 mx-auto">
                          <Send size={9} /> Envoyer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'scenarios' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
            Les relances sont envoyées automatiquement selon les scénarios configurés. Vous pouvez personnaliser les délais, canaux et messages pour chaque niveau.
          </div>
          {scenarios.map(s => (
            <div key={s.niveau} className="card flex gap-5 items-start">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ${s.niveau === 1 ? 'bg-blue-500' : s.niveau === 2 ? 'bg-amber-500' : 'bg-red-500'}`}>
                {s.niveau}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-bold text-neutral-800">{s.label}</span>
                  <span className="badge badge-blue">{s.delai}</span>
                  <span className="text-xs text-neutral-500">via {s.canal}</span>
                </div>
                <p className="text-xs text-neutral-500 italic">"{s.message}"</p>
              </div>
              <button className="btn border border-neutral-200 bg-white text-neutral-600 text-xs px-3 py-1.5">Modifier</button>
            </div>
          ))}
          <button className="btn border border-dashed border-neutral-300 bg-white text-neutral-500 w-full flex items-center justify-center gap-2 text-sm py-3">
            <Plus size={14} /> Ajouter un niveau de relance
          </button>
        </div>
      )}
    </div>
  );
}
