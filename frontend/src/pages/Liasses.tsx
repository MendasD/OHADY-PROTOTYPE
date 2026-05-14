import { useState } from 'react';
import {
  FileText, Download, Send, CheckCircle, AlertCircle, Lock, Sparkles, Eye,
  Building2, ArrowRight, ChevronRight,
} from 'lucide-react';
import { fmt } from '../data/mockData';

interface LiasseRow {
  code: string;
  label: string;
  montantN: number;
  montantN1: number;
}

const bilanActif: LiasseRow[] = [
  { code: 'BA', label: 'Frais de développement',              montantN:      0,    montantN1:      0    },
  { code: 'BB', label: 'Brevets, licences, logiciels',         montantN:  4_500_000, montantN1:  3_200_000 },
  { code: 'BG', label: 'Bâtiments, installations',             montantN:      0,    montantN1:      0    },
  { code: 'BH', label: 'Matériel & équipements',               montantN:  4_500_000, montantN1:  5_180_000 },
  { code: 'BI', label: 'Matériel de transport',                montantN:  6_500_000, montantN1:  7_200_000 },
  { code: 'BJ', label: 'Matériel informatique',                montantN:  3_200_000, montantN1:  2_400_000 },
  { code: 'BQ', label: 'Stocks de marchandises',               montantN:  3_250_000, montantN1:  2_800_000 },
  { code: 'BX', label: 'Clients & comptes rattachés',          montantN: 19_030_000, montantN1: 12_400_000 },
  { code: 'BS', label: 'TVA déductible & autres créances',     montantN:    774_000, montantN1:    240_000 },
  { code: 'BJ', label: 'Banques, mobile money',                montantN: 23_190_000, montantN1: 20_750_000 },
  { code: 'BU', label: 'Caisse',                               montantN:    225_000, montantN1:    180_000 },
];

const bilanPassif: LiasseRow[] = [
  { code: 'CA', label: 'Capital social',                       montantN: 50_000_000, montantN1: 50_000_000 },
  { code: 'CD', label: 'Réserves',                             montantN:  3_700_000, montantN1:  3_700_000 },
  { code: 'CG', label: 'Report à nouveau',                     montantN:  3_800_000, montantN1:  2_400_000 },
  { code: 'CJ', label: 'Résultat net de l\'exercice',          montantN:  5_920_000, montantN1:  4_280_000 },
  { code: 'DA', label: 'Emprunts & dettes financières',        montantN:  8_500_000, montantN1: 11_000_000 },
  { code: 'DH', label: 'Fournisseurs & comptes rattachés',     montantN:  4_850_000, montantN1:  3_800_000 },
  { code: 'DI', label: 'TVA collectée & autres dettes',        montantN:  1_848_000, montantN1:  1_240_000 },
];

const compteResultat: LiasseRow[] = [
  { code: 'TA', label: 'Ventes de marchandises',               montantN: 22_400_000, montantN1: 18_500_000 },
  { code: 'TB', label: 'Prestations de services',              montantN: 25_450_000, montantN1: 21_100_000 },
  { code: 'TC', label: 'Autres produits d\'exploitation',      montantN:    185_000, montantN1:    140_000 },
  { code: 'RA', label: 'Achats de marchandises',               montantN: 18_400_000, montantN1: 15_200_000 },
  { code: 'RB', label: 'Autres achats & charges externes',     montantN:  3_980_000, montantN1:  3_450_000 },
  { code: 'RH', label: 'Charges de personnel',                 montantN: 15_200_000, montantN1: 12_800_000 },
  { code: 'RJ', label: 'Dotations aux amortissements',         montantN:    285_000, montantN1:    240_000 },
  { code: 'RM', label: 'Charges financières',                  montantN:    420_000, montantN1:    580_000 },
];

type Section = 'bilan-actif' | 'bilan-passif' | 'cr' | 'tafire' | 'annexe' | 'dsf';

const sections: { id: Section; label: string; description: string }[] = [
  { id: 'bilan-actif',  label: 'Bilan — Actif',           description: 'Immobilisations + actifs circulants + trésorerie' },
  { id: 'bilan-passif', label: 'Bilan — Passif',          description: 'Capitaux propres + dettes financières + passifs courants' },
  { id: 'cr',           label: 'Compte de résultat',      description: 'Produits, charges et formation du résultat' },
  { id: 'tafire',       label: 'TAFIRE',                  description: 'Tableau financier ressources & emplois' },
  { id: 'annexe',       label: 'État annexé',             description: '20+ tableaux complémentaires obligatoires' },
  { id: 'dsf',          label: 'DSF — Liasse fiscale',    description: 'Déclaration statistique et fiscale Sénégal' },
];

export default function Liasses() {
  const [section, setSection] = useState<Section>('bilan-actif');

  const totalActif = bilanActif.reduce((s, r) => s + r.montantN, 0);
  const totalPassif = bilanPassif.reduce((s, r) => s + r.montantN, 0);
  const totalProduits = compteResultat.filter(r => r.code.startsWith('T')).reduce((s, r) => s + r.montantN, 0);
  const totalCharges = compteResultat.filter(r => r.code.startsWith('R')).reduce((s, r) => s + r.montantN, 0);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText size={20} className="text-primary" /> Liasses fiscales
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Format SYSCOHADA Révisé + DSF Sénégal · Exercice 2025-2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Eye size={12} /> Aperçu PDF</button>
          <button className="btn btn-outline btn-sm"><Download size={12} /> Export Excel</button>
          <button className="btn btn-primary btn-sm"><Send size={12} /> Soumettre à la DGID</button>
        </div>
      </div>

      {/* Status banner */}
      <div className="card flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-orange-100 grid place-items-center flex-shrink-0">
          <AlertCircle size={16} className="text-warning" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-neutral-800">Liasse en préparation — 6 sections sur 6 partiellement complétées</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            Cible de dépôt : <strong>30 septembre 2026</strong> (75 jours après clôture annuelle).
            Statut : <strong className="text-warning">Brouillon — données provisoires</strong>
          </div>
        </div>
        <span className="badge badge-orange text-[10px]">Brouillon</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-5">
        {/* Sections nav */}
        <div className="card !p-0 overflow-hidden h-fit xl:sticky xl:top-20">
          <div className="px-4 py-3 border-b border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">Sections de la liasse</h3>
          </div>
          <div className="divide-y divide-neutral-50">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                  s.id === section ? 'bg-secondary/5 border-l-2 border-secondary' : 'hover:bg-neutral-50/50'
                }`}
              >
                <FileText size={13} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-neutral-800">{s.label}</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5 leading-snug">{s.description}</div>
                </div>
                <ChevronRight size={13} className="text-neutral-300 mt-0.5 flex-shrink-0" />
              </button>
            ))}
          </div>
          <div className="border-t border-neutral-100 bg-purple-50/30 px-4 py-3">
            <div className="flex items-center gap-1.5 text-[10px] text-purple-600 font-semibold uppercase tracking-wide mb-1">
              <Sparkles size={11} /> Génération IA
            </div>
            <p className="text-[11px] text-neutral-700 leading-snug">
              L'IA pré-remplit chaque section depuis les écritures validées. Vous validez ligne à ligne.
            </p>
          </div>
        </div>

        {/* Contenu liasse */}
        <div className="space-y-4">
          {section === 'bilan-actif' && (
            <LiasseTable
              title="Bilan — Actif (SYSCOHADA Révisé)"
              rows={bilanActif}
              total={totalActif}
              note={`Total actif : ${fmt(totalActif)} XOF — Doit équilibrer avec le passif (${fmt(totalPassif)} XOF, écart : ${fmt(totalActif - totalPassif)} XOF)`}
            />
          )}
          {section === 'bilan-passif' && (
            <LiasseTable
              title="Bilan — Passif (SYSCOHADA Révisé)"
              rows={bilanPassif}
              total={totalPassif}
              note={`Total passif : ${fmt(totalPassif)} XOF — Vérifier équilibre avec l'actif`}
            />
          )}
          {section === 'cr' && (
            <LiasseTable
              title="Compte de résultat (SYSCOHADA Révisé)"
              rows={compteResultat}
              total={totalProduits - totalCharges}
              note={`Produits ${fmt(totalProduits)} − Charges ${fmt(totalCharges)} = Résultat avant impôt ${fmt(totalProduits - totalCharges)} XOF`}
            />
          )}
          {(section === 'tafire' || section === 'annexe' || section === 'dsf') && (
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 grid place-items-center flex-shrink-0">
                  <Sparkles size={18} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-neutral-800">
                    {sections.find(s => s.id === section)!.label} — Génération automatique
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {section === 'tafire' && 'Le TAFIRE est généré à partir des variations du bilan. 12 lignes calculées automatiquement.'}
                    {section === 'annexe' && '23 tableaux annexes obligatoires (immobilisations, créances, dettes, capitaux propres, etc.). Pré-remplis par l\'IA.'}
                    {section === 'dsf' && 'La liasse DSF Sénégal regroupe Bilan + CR + TAFIRE + Annexes + déclarations fiscales sur 18 pages réglementaires.'}
                  </p>
                  <button className="mt-3 btn btn-primary btn-sm">
                    <Sparkles size={12} /> Générer cette section <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Validation IA */}
          <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
            <Sparkles size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-neutral-700 leading-relaxed">
              <strong>Contrôles automatiques :</strong> les soldes sont issus de la balance après clôture annuelle.
              L'IA vérifie l'équilibre Actif=Passif, la cohérence Charges-Produits-Résultat, et signale tout écart suspect.
              <button className="ml-1 text-purple-600 font-semibold hover:underline inline-flex items-center gap-0.5">
                Voir les contrôles <ArrowRight size={11} />
              </button>
            </div>
          </div>

          {/* Action finale */}
          {section === 'dsf' && (
            <div className="card bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary">
              <div className="flex items-center gap-4 flex-wrap">
                <Lock size={24} className="text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-neutral-800">Soumission DSF à la DGID</div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">
                    Une fois validée par le DAF + Expert-comptable + DG, la liasse sera transmise via l'API e-Tax DGID
                    et l'exercice 2025-2026 sera définitivement verrouillé.
                  </div>
                </div>
                <button className="btn btn-primary"><Send size={13} /> Soumettre à la DGID</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LiasseTable({ title, rows, total, note }: { title: string; rows: LiasseRow[]; total: number; note: string }) {
  return (
    <div className="card !p-0 overflow-hidden">
      <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-bold text-neutral-700">{title}</h3>
        <div className="flex items-center gap-2">
          <Building2 size={12} className="text-neutral-400" />
          <span className="text-[11px] text-neutral-500">Exercice 2025-2026</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
              <th className="text-left px-4 py-2 font-semibold w-20">Code</th>
              <th className="text-left px-2 py-2 font-semibold">Libellé</th>
              <th className="text-right px-2 py-2 font-semibold">Exercice N</th>
              <th className="text-right px-2 py-2 font-semibold">Exercice N-1</th>
              <th className="text-right px-2 py-2 font-semibold">Variation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const delta = r.montantN - r.montantN1;
              const deltaPct = r.montantN1 !== 0 ? (delta / r.montantN1) * 100 : 0;
              return (
                <tr key={i} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                  <td className="px-4 py-2 font-mono text-xs font-bold text-secondary">{r.code}</td>
                  <td className="px-2 py-2 text-xs text-neutral-700">{r.label}</td>
                  <td className="px-2 py-2 text-right font-mono text-xs font-semibold text-neutral-800">
                    {r.montantN > 0 ? fmt(r.montantN) : <span className="text-neutral-300">—</span>}
                  </td>
                  <td className="px-2 py-2 text-right font-mono text-xs text-neutral-500">
                    {r.montantN1 > 0 ? fmt(r.montantN1) : <span className="text-neutral-300">—</span>}
                  </td>
                  <td className="px-2 py-2 text-right">
                    {r.montantN1 !== 0 && (
                      <span className={`text-[11px] font-bold ${delta >= 0 ? 'text-success' : 'text-danger'}`}>
                        {delta >= 0 ? '+' : ''}{deltaPct.toFixed(1)} %
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-neutral-100 border-t-2 border-neutral-300">
              <td colSpan={2} className="px-4 py-3 text-sm font-bold text-neutral-800">Total</td>
              <td colSpan={3} className="px-2 py-3 text-right font-mono text-sm font-bold text-primary">{fmt(total)} XOF</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-neutral-100 bg-blue-50/30 text-[11px] text-neutral-600 flex items-start gap-2">
        <CheckCircle size={12} className="text-success mt-0.5 flex-shrink-0" />
        <span>{note}</span>
      </div>
    </div>
  );
}
