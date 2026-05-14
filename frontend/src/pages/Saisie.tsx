import { useMemo, useState } from 'react';
import {
  Plus, Trash2, Save, Send, X, Sparkles, AlertCircle, CheckCircle,
  Calendar, FileText, User as UserIcon, ChevronDown, Search, Paperclip, Info,
} from 'lucide-react';
import { fmtXOF, fmt } from '../data/mockData';
import { usePersona } from '../context/PersonaContext';

interface Journal { code: 'VT' | 'HA' | 'BQ' | 'CA' | 'OD'; libelle: string; color: string; }
const journaux: Journal[] = [
  { code: 'VT', libelle: 'Ventes',          color: '#27AE60' },
  { code: 'HA', libelle: 'Achats',          color: '#E67E22' },
  { code: 'BQ', libelle: 'Banque',          color: '#2980B9' },
  { code: 'CA', libelle: 'Caisse',          color: '#1ABC9C' },
  { code: 'OD', libelle: 'Opérations div.', color: '#9B59B6' },
];

interface LigneEcriture {
  id: string;
  compte: string;
  intitule: string;
  tiers?: string;
  libelle: string;
  debit: number;
  credit: number;
}

const comptesSuggestions = [
  { code: '60100', label: 'Achats de marchandises' },
  { code: '60220', label: 'Fournitures de bureau' },
  { code: '40100', label: 'Fournisseurs — dettes en cours' },
  { code: '41100', label: 'Clients — créances en cours' },
  { code: '44310', label: 'TVA collectée 18%' },
  { code: '44510', label: 'TVA déductible sur achats' },
  { code: '52110', label: 'Banque SGBS C/C' },
  { code: '70600', label: 'Prestations de services' },
];

const ecrituresRecentes = [
  { ref: 'HA-2026-0419', date: '12/05/2026', journal: 'HA', libelle: 'Facture COGEMATEC', debit: 2_124_000, credit: 2_124_000, statut: 'validated' as const },
  { ref: 'VT-2026-0612', date: '10/05/2026', journal: 'VT', libelle: 'Facture SONES F2026-0151', debit: 9_912_000, credit: 9_912_000, statut: 'validated' as const },
  { ref: 'BQ-2026-0821', date: '13/05/2026', journal: 'BQ', libelle: 'Encaissement F2026-0142', debit: 3_500_000, credit: 3_500_000, statut: 'validated' as const },
  { ref: 'OD-2026-0118', date: '11/05/2026', journal: 'OD', libelle: 'Dotation amortissement mai', debit: 285_000, credit: 285_000, statut: 'submitted' as const },
  { ref: 'CA-2026-0204', date: '09/05/2026', journal: 'CA', libelle: 'Petite caisse — fournitures', debit: 48_500, credit: 48_500, statut: 'draft' as const },
];

const statusBadge: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Brouillon', cls: 'badge-orange' },
  submitted: { label: 'Soumis',    cls: 'badge-blue' },
  validated: { label: 'Validé',    cls: 'badge-green' },
};

export default function Saisie() {
  const { persona } = usePersona();
  const [activeJ, setActiveJ] = useState<Journal['code']>('HA');
  const [lignes, setLignes] = useState<LigneEcriture[]>([
    { id: 'l1', compte: '60100', intitule: 'Achats de marchandises',           tiers: 'COGEMATEC', libelle: 'Facture COGE-2026-1247', debit: 1_800_000, credit: 0 },
    { id: 'l2', compte: '44510', intitule: 'TVA déductible sur achats',                            libelle: 'TVA 18% sur achat COGE', debit:   324_000, credit: 0 },
    { id: 'l3', compte: '40100', intitule: 'Fournisseurs — dettes en cours',   tiers: 'COGEMATEC', libelle: 'Facture COGE-2026-1247', debit: 0,          credit: 2_124_000 },
  ]);

  const totalDebit  = useMemo(() => lignes.reduce((s, l) => s + (l.debit  || 0), 0), [lignes]);
  const totalCredit = useMemo(() => lignes.reduce((s, l) => s + (l.credit || 0), 0), [lignes]);
  const ecart       = totalDebit - totalCredit;
  const equilibre   = ecart === 0 && totalDebit > 0;

  const isJunior = persona.id === 'awa';

  const addLigne = () => setLignes(prev => [
    ...prev,
    { id: `l${Date.now()}`, compte: '', intitule: '', libelle: '', debit: 0, credit: 0 },
  ]);
  const removeLigne = (id: string) => setLignes(prev => prev.filter(l => l.id !== id));

  const currentJournal = journaux.find(j => j.code === activeJ)!;

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Saisie d'écritures</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Journal <span className="font-semibold" style={{ color: currentJournal.color }}>{activeJ} · {currentJournal.libelle}</span> · Pièce <span className="font-mono">HA-2026-0420</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><X size={13} /> Annuler</button>
          <button className="btn btn-outline btn-sm"><Save size={13} /> Brouillon</button>
          <button disabled={!equilibre} className={`btn btn-sm ${equilibre ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'}`}>
            {isJunior ? <><Send size={13} /> Soumettre à validation</> : <><CheckCircle size={13} /> Valider l'écriture</>}
          </button>
        </div>
      </div>

      {/* Journal tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-xl shadow-card border border-neutral-100 w-fit">
        {journaux.map(j => (
          <button
            key={j.code}
            onClick={() => setActiveJ(j.code)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
              activeJ === j.code ? 'text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'
            }`}
            style={activeJ === j.code ? { background: j.color } : {}}
          >
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${activeJ === j.code ? 'bg-white/20' : 'bg-neutral-100 text-neutral-500'}`}>{j.code}</span>
            <span className="font-medium">{j.libelle}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        {/* Form principal */}
        <div className="space-y-4">
          {/* Métadonnées */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={15} className="text-secondary" />
              <h3 className="text-sm font-bold text-neutral-700">Pièce comptable</h3>
              <span className="badge badge-orange text-[10px] ml-auto">Brouillon</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Date d'écriture" icon={Calendar}>
                <input type="text" className="input" defaultValue="13/05/2026" />
              </Field>
              <Field label="N° pièce">
                <input type="text" className="input bg-neutral-50" defaultValue="HA-2026-0420" readOnly />
              </Field>
              <Field label="Référence externe">
                <input type="text" className="input" defaultValue="COGE-2026-1247" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Libellé général">
                <input type="text" className="input" defaultValue="Facture COGEMATEC SARL — Achat marchandises mai 2026" />
              </Field>
            </div>
          </div>

          {/* Tableau de lignes */}
          <div className="card !p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-700">Lignes d'écriture</h3>
              <button onClick={addLigne} className="btn btn-outline btn-sm">
                <Plus size={12} /> Ajouter une ligne
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[760px]">
                <thead>
                  <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                    <th className="text-left px-4 py-2 font-semibold">Compte</th>
                    <th className="text-left px-2 py-2 font-semibold">Libellé ligne</th>
                    <th className="text-left px-2 py-2 font-semibold">Tiers</th>
                    <th className="text-right px-2 py-2 font-semibold">Débit</th>
                    <th className="text-right px-2 py-2 font-semibold">Crédit</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map(l => (
                    <tr key={l.id} className="border-t border-neutral-50 hover:bg-neutral-50/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-semibold text-neutral-800">{l.compte || '—'}</span>
                          <span className="text-[11px] text-neutral-500 truncate max-w-[180px]">{l.intitule || 'Compte à sélectionner'}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5">
                        <input className="input !py-1.5 !text-xs" defaultValue={l.libelle} placeholder="Libellé..." />
                      </td>
                      <td className="px-2 py-2.5">
                        {l.tiers ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-100">
                            <UserIcon size={10} /> {l.tiers}
                          </span>
                        ) : (
                          <span className="text-neutral-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <input
                          className={`input !py-1.5 !text-xs text-right font-mono ${l.debit ? 'text-success font-semibold' : 'text-neutral-400'}`}
                          defaultValue={l.debit || ''} placeholder="0"
                        />
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <input
                          className={`input !py-1.5 !text-xs text-right font-mono ${l.credit ? 'text-danger font-semibold' : 'text-neutral-400'}`}
                          defaultValue={l.credit || ''} placeholder="0"
                        />
                      </td>
                      <td className="px-2 py-2.5">
                        <button onClick={() => removeLigne(l.id)} className="w-7 h-7 rounded-md hover:bg-red-50 hover:text-danger text-neutral-300 grid place-items-center transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Totaux */}
                <tfoot>
                  <tr className="bg-neutral-50/80 border-t-2 border-neutral-200">
                    <td colSpan={3} className="px-4 py-3 text-xs font-semibold text-neutral-700">Totaux</td>
                    <td className="px-2 py-3 text-right font-mono font-bold text-success">{fmt(totalDebit)}</td>
                    <td className="px-2 py-3 text-right font-mono font-bold text-danger">{fmt(totalCredit)}</td>
                    <td />
                  </tr>
                  {!equilibre && (
                    <tr className="bg-orange-50 border-t border-orange-200">
                      <td colSpan={3} className="px-4 py-2 text-xs font-semibold text-orange-700 flex items-center gap-1.5">
                        <AlertCircle size={12} /> Écart à équilibrer
                      </td>
                      <td colSpan={2} className="px-2 py-2 text-right font-mono font-bold text-orange-700">
                        {ecart > 0 ? `+${fmt(ecart)}` : fmt(ecart)} XOF
                      </td>
                      <td />
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
            {equilibre && (
              <div className="px-5 py-3 border-t border-neutral-100 bg-green-50/40 flex items-center gap-2 text-xs text-success font-medium">
                <CheckCircle size={14} /> Pièce équilibrée — prête à {isJunior ? 'soumission' : 'validation'}
              </div>
            )}
          </div>

          {/* Pièces jointes */}
          <div className="card flex flex-wrap items-center gap-3">
            <Paperclip size={14} className="text-neutral-400" />
            <span className="text-xs text-neutral-600">Pièce justificative :</span>
            <span className="badge badge-blue text-[11px]">
              <FileText size={10} /> facture_COGEMATEC_1247.pdf
            </span>
            <button className="btn btn-outline btn-sm ml-auto"><Plus size={11} /> Ajouter</button>
          </div>
        </div>

        {/* Sidebar droite */}
        <div className="space-y-4">
          {/* Suggestion IA */}
          <div className="card border-l-4 border-purple-300 bg-purple-50/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-purple-500" />
              <span className="text-xs font-bold text-purple-700">Suggestion IA</span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed">
              D'après le justificatif joint, j'ai pré-rempli 3 lignes en respectant la TVA déductible à 18%.
              Le compte fournisseur <span className="font-mono font-semibold">40100</span> a été matché par similitude (97%).
            </p>
            <button className="mt-2 text-xs font-semibold text-purple-700 hover:underline">
              Apprendre cette correspondance →
            </button>
          </div>

          {/* Comptes fréquents */}
          <div className="card">
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide mb-3">Comptes fréquents</h4>
            <div className="relative mb-3">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input className="input pl-8 py-1.5 text-xs" placeholder="Rechercher un compte..." />
            </div>
            <div className="space-y-1">
              {comptesSuggestions.map(c => (
                <button key={c.code} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 text-left transition-colors">
                  <span className="font-mono text-[11px] font-semibold text-secondary">{c.code}</span>
                  <span className="text-[11px] text-neutral-600 truncate flex-1">{c.label}</span>
                  <ChevronDown size={11} className="text-neutral-300 -rotate-90" />
                </button>
              ))}
            </div>
          </div>

          {/* Aide saisie */}
          <div className="card bg-neutral-50/50">
            <div className="flex items-start gap-2">
              <Info size={13} className="text-secondary mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-neutral-600 leading-snug">
                Tab pour passer à la ligne suivante. Tapez le code compte ou son intitulé,
                l'auto-complétion fait le reste.
                {isJunior && <span className="block mt-1 text-purple-600 font-medium">Votre écriture sera revue par le chef comptable avant validation.</span>}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Écritures récentes */}
      <div className="card !p-0">
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-700">Écritures récentes</h3>
          <span className="text-[11px] text-neutral-400">{ecrituresRecentes.length} sur les 7 derniers jours</span>
        </div>
        <div className="divide-y divide-neutral-50">
          {ecrituresRecentes.map(e => {
            const j = journaux.find(jj => jj.code === e.journal)!;
            const s = statusBadge[e.statut];
            return (
              <div key={e.ref} className="px-5 py-3 hover:bg-neutral-50/40 transition-colors flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded text-white" style={{ background: j.color }}>{e.journal}</span>
                <div className="font-mono text-xs text-neutral-500 w-32 truncate">{e.ref}</div>
                <div className="text-xs text-neutral-500 w-20">{e.date}</div>
                <div className="flex-1 text-sm text-neutral-800 truncate">{e.libelle}</div>
                <div className="text-xs font-mono text-neutral-600">{fmtXOF(e.debit)}</div>
                <span className={`badge ${s.cls} text-[10px]`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] uppercase tracking-wide text-neutral-500 font-semibold flex items-center gap-1.5">
        {Icon && <Icon size={11} className="text-neutral-400" />}
        {label}
      </label>
      {children}
    </div>
  );
}
