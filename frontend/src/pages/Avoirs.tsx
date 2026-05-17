import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Receipt, Plus, RotateCcw, FileText, CheckCircle, Sparkles } from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

type AvoirSens = 'client' | 'fournisseur';

interface Avoir {
  id: string; numero: string; date: string; partenaire: string; refFacture: string;
  motif: string; montant: number; statut: 'brouillon' | 'envoye' | 'impute' | 'rembourse';
  sens: AvoirSens;
}

const avoirs: Avoir[] = [
  // Avoirs clients (notes de crédit émises au client)
  { id: 'a1', numero: 'AV-2026-0008', date: '14/05/2026', partenaire: 'SONES',                refFacture: 'F2026-0151', motif: 'Erreur quantité facturée (sur 12, 2 manquants)', montant:   720_000, statut: 'envoye',    sens: 'client' },
  { id: 'a2', numero: 'AV-2026-0007', date: '12/05/2026', partenaire: 'Orange Sénégal',       refFacture: 'F2026-0145', motif: 'Geste commercial (retard livraison)',           montant:   180_000, statut: 'impute',    sens: 'client' },
  { id: 'a3', numero: 'AV-2026-0006', date: '08/05/2026', partenaire: 'AfricTech Group',     refFacture: 'F2026-0140', motif: 'Annulation partielle (1 service non rendu)',    montant: 1_250_000, statut: 'rembourse', sens: 'client' },
  // Avoirs fournisseurs (notes de crédit reçues du fournisseur)
  { id: 'af1', numero: 'AV-COGE-088', date: '13/05/2026', partenaire: 'COGEMATEC SARL',      refFacture: 'COGE-1247',  motif: 'Retour produit défectueux',                     montant:   320_000, statut: 'impute',    sens: 'fournisseur' },
  { id: 'af2', numero: 'AV-SET-022',  date: '10/05/2026', partenaire: 'SETUMA',               refFacture: 'SET-0034',   motif: 'Ristourne de fin de mois',                     montant:    85_000, statut: 'rembourse', sens: 'fournisseur' },
  { id: 'af3', numero: 'AV-IND-141',  date: '09/05/2026', partenaire: 'INDUSTRIE 2000',      refFacture: 'IND-0089',   motif: 'Erreur tarif unitaire',                         montant:   142_500, statut: 'envoye',    sens: 'fournisseur' },
];

const statutMeta = {
  brouillon:  { label: 'Brouillon', cls: 'badge-gray',   Icon: FileText },
  envoye:     { label: 'Envoyé',    cls: 'badge-blue',   Icon: Receipt },
  impute:     { label: 'Imputé',    cls: 'badge-orange', Icon: RotateCcw },
  rembourse:  { label: 'Remboursé', cls: 'badge-green',  Icon: CheckCircle },
};

const pathToSens: Record<string, AvoirSens> = {
  '/avoirs-clients': 'client',
  '/avoirs-fournisseurs': 'fournisseur',
};

export default function Avoirs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const initialSens = pathToSens[pathname] ?? 'client';
  const [sens, setSens] = useState<AvoirSens>(initialSens);

  const filtered = avoirs.filter(a => a.sens === sens);
  const total = filtered.reduce((s, a) => s + a.montant, 0);

  const change = (s: AvoirSens) => {
    setSens(s);
    const target = s === 'client' ? '/avoirs-clients' : '/avoirs-fournisseurs';
    if (target !== pathname) navigate(target);
  };

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2"><RotateCcw size={20} className="text-secondary" /> Avoirs & Notes de crédit</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Annulations partielles, retours, gestes commerciaux · Génération écriture automatique</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouvel avoir</button>
      </div>

      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        <button onClick={() => change('client')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${sens === 'client' ? 'bg-white text-neutral-800 shadow-card' : 'text-neutral-500'}`}>
          Avoirs clients <span className="badge badge-green text-[10px]">{avoirs.filter(a => a.sens === 'client').length}</span>
        </button>
        <button onClick={() => change('fournisseur')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${sens === 'fournisseur' ? 'bg-white text-neutral-800 shadow-card' : 'text-neutral-500'}`}>
          Avoirs fournisseurs <span className="badge badge-orange text-[10px]">{avoirs.filter(a => a.sens === 'fournisseur').length}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Total avoirs {sens === 'client' ? 'émis' : 'reçus'}</div><div className="mt-1 text-lg font-bold text-secondary">{fmtXOF(total)}</div></div>
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">En attente d'imputation</div><div className="mt-1 text-lg font-bold text-warning">{fmtXOF(filtered.filter(a => a.statut === 'envoye').reduce((s, a) => s + a.montant, 0))}</div></div>
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Remboursés</div><div className="mt-1 text-lg font-bold text-success">{fmtXOF(filtered.filter(a => a.statut === 'rembourse').reduce((s, a) => s + a.montant, 0))}</div></div>
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Imputés sur factures</div><div className="mt-1 text-lg font-bold text-primary">{fmtXOF(filtered.filter(a => a.statut === 'impute').reduce((s, a) => s + a.montant, 0))}</div></div>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2 font-semibold">N° Avoir</th>
                <th className="text-left px-2 py-2 font-semibold">Date</th>
                <th className="text-left px-2 py-2 font-semibold">{sens === 'client' ? 'Client' : 'Fournisseur'}</th>
                <th className="text-left px-2 py-2 font-semibold">Facture initiale</th>
                <th className="text-left px-2 py-2 font-semibold">Motif</th>
                <th className="text-right px-2 py-2 font-semibold">Montant</th>
                <th className="text-center px-2 py-2 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const meta = statutMeta[a.statut];
                const Icon = meta.Icon;
                return (
                  <tr key={a.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-secondary">{a.numero}</td>
                    <td className="px-2 py-2.5 text-xs text-neutral-500 font-mono">{a.date}</td>
                    <td className="px-2 py-2.5 text-sm font-semibold text-neutral-800">{a.partenaire}</td>
                    <td className="px-2 py-2.5 font-mono text-[11px] text-neutral-500">{a.refFacture}</td>
                    <td className="px-2 py-2.5 text-xs text-neutral-600 max-w-xs truncate" title={a.motif}>{a.motif}</td>
                    <td className="px-2 py-2.5 text-right font-mono text-sm font-bold text-secondary">{fmt(a.montant)}</td>
                    <td className="px-2 py-2.5 text-center"><span className={`inline-flex items-center gap-1 badge ${meta.cls} text-[10px]`}><Icon size={9} /> {meta.label}</span></td>
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
          <strong>Écritures automatiques :</strong>
          {sens === 'client'
            ? ' Avoir client = Débit 706 Prestations + Débit 4431 TVA / Crédit 411 Client. Imputation possible sur facture existante ou remboursement direct.'
            : ' Avoir fournisseur = Débit 401 Fournisseur / Crédit 60x Achats + Crédit 4451 TVA déductible. Imputation sur facture existante ou demande de remboursement.'}
        </div>
      </div>
    </div>
  );
}
