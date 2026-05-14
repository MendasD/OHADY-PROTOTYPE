import { useMemo, useState } from 'react';
import {
  Search, Download, Filter, FileText, Calendar,
  ArrowDownToLine, ArrowUpFromLine, TrendingUp, TrendingDown,
} from 'lucide-react';
import { fmtXOF, fmt, journalEntries } from '../data/mockData';

interface Compte { num: string; lib: string; classe: number }
const comptesPrincipaux: Compte[] = [
  { num: '40100', lib: 'Fournisseurs — dettes en cours',    classe: 4 },
  { num: '41100', lib: 'Clients — créances en cours',       classe: 4 },
  { num: '44310', lib: 'TVA collectée 18%',                  classe: 4 },
  { num: '44510', lib: 'TVA déductible sur achats',         classe: 4 },
  { num: '52110', lib: 'Banque SGBS — compte courant',      classe: 5 },
  { num: '57100', lib: 'Caisse principale',                  classe: 5 },
  { num: '60100', lib: 'Achats de marchandises',            classe: 6 },
  { num: '70600', lib: 'Prestations de services',           classe: 7 },
];

const classeColors: Record<number, string> = {
  1: '#1A3C5E', 2: '#2980B9', 3: '#27AE60', 4: '#E67E22', 5: '#1ABC9C', 6: '#E74C3C', 7: '#9B59B6',
};

interface Mouvement {
  date: string; ref: string; journal: string; libelle: string;
  debit: number; credit: number; lettre?: string;
}

// Mouvements simulés pour un compte
const mouvementsParCompte: Record<string, { soldeOuverture: number; mvts: Mouvement[] }> = {
  '41100': {
    soldeOuverture: 12_400_000,
    mvts: [
      { date: '02/05/2026', ref: 'VT-2026-0608', journal: 'VT', libelle: 'Facture F2026-0148 — Dakar Dem Dikk', debit: 4_956_000, credit: 0 },
      { date: '05/05/2026', ref: 'VT-2026-0610', journal: 'VT', libelle: 'Facture F2026-0151 — SONES', debit: 9_912_000, credit: 0 },
      { date: '08/05/2026', ref: 'BQ-2026-0815', journal: 'BQ', libelle: 'Encaissement partiel CIE-Holding', debit: 0, credit: 2_500_000, lettre: 'A' },
      { date: '10/05/2026', ref: 'VT-2026-0612', journal: 'VT', libelle: 'Facture F2026-0151 — SONES (avoir)', debit: 0, credit: 1_512_000 },
      { date: '12/05/2026', ref: 'BQ-2026-0820', journal: 'BQ', libelle: 'Virement Tech Solutions SARL', debit: 0, credit: 3_500_000, lettre: 'B' },
      { date: '13/05/2026', ref: 'BQ-2026-0821', journal: 'BQ', libelle: 'Encaissement F2026-0142', debit: 0, credit: 3_500_000, lettre: 'B' },
    ],
  },
  '52110': {
    soldeOuverture: 17_240_000,
    mvts: [
      { date: '02/05/2026', ref: 'BQ-2026-0801', journal: 'BQ', libelle: 'Frais bancaires mensuels', debit: 0, credit: 15_000 },
      { date: '05/05/2026', ref: 'BQ-2026-0805', journal: 'BQ', libelle: 'Virement salaires mai 2026', debit: 0, credit: 4_550_000 },
      { date: '08/05/2026', ref: 'BQ-2026-0815', journal: 'BQ', libelle: 'Encaissement CIE-Holding', debit: 2_500_000, credit: 0 },
      { date: '11/05/2026', ref: 'BQ-2026-0818', journal: 'BQ', libelle: 'Prélèvement SGBS — crédit', debit: 0, credit: 850_000 },
      { date: '13/05/2026', ref: 'BQ-2026-0821', journal: 'BQ', libelle: 'Encaissement F2026-0142', debit: 3_500_000, credit: 0 },
    ],
  },
  '60100': {
    soldeOuverture: 16_280_000,
    mvts: [
      { date: '03/05/2026', ref: 'HA-2026-0410', journal: 'HA', libelle: 'Facture fournisseur SETUMA', debit: 920_000, credit: 0 },
      { date: '08/05/2026', ref: 'HA-2026-0415', journal: 'HA', libelle: 'Facture fournisseur INDUSTRIE', debit: 1_250_000, credit: 0 },
      { date: '12/05/2026', ref: 'HA-2026-0419', journal: 'HA', libelle: 'Facture COGEMATEC', debit: 1_800_000, credit: 0 },
    ],
  },
};

const fallbackData = {
  soldeOuverture: 0,
  mvts: [] as Mouvement[],
};

const journalColors: Record<string, string> = {
  HA: '#E67E22', VT: '#27AE60', BQ: '#2980B9', CA: '#1ABC9C', OD: '#9B59B6',
};

export default function GrandLivre() {
  const [selectedCompte, setSelectedCompte] = useState('41100');
  const [search, setSearch] = useState('');
  const [periode, setPeriode] = useState<'all' | '30j' | '7j'>('all');

  const compte = comptesPrincipaux.find(c => c.num === selectedCompte)!;
  const data = mouvementsParCompte[selectedCompte] ?? fallbackData;

  const { soldeOuverture, mvts } = data;
  const lignesAvecSolde = useMemo(() => {
    let solde = soldeOuverture;
    return mvts.map(m => {
      solde += (m.debit - m.credit);
      return { ...m, soldeProgressif: solde };
    });
  }, [mvts, soldeOuverture]);

  const totalDebit = mvts.reduce((s, m) => s + m.debit, 0);
  const totalCredit = mvts.reduce((s, m) => s + m.credit, 0);
  const soldeFinal = soldeOuverture + totalDebit - totalCredit;

  const filteredComptes = comptesPrincipaux.filter(c =>
    !search || c.num.includes(search) || c.lib.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Grand livre</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Mouvements par compte avec solde progressif — Exercice 2025-2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5">
            {(['all', '30j', '7j'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriode(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  periode === p ? 'bg-secondary text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {p === 'all' ? 'Tout' : p === '30j' ? '30 jours' : '7 jours'}
              </button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm"><Filter size={12} /> Filtres</button>
          <button className="btn btn-primary btn-sm"><Download size={12} /> Exporter</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-5">
        {/* Liste comptes */}
        <div className="card !p-0 overflow-hidden h-fit xl:sticky xl:top-20">
          <div className="px-4 py-3 border-b border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide mb-2">Comptes</h3>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                className="input pl-8 py-1.5 text-xs" placeholder="Numéro ou libellé..."
              />
            </div>
          </div>
          <div className="divide-y divide-neutral-50 max-h-[520px] overflow-y-auto">
            {filteredComptes.map(c => (
              <button
                key={c.num}
                onClick={() => setSelectedCompte(c.num)}
                className={`w-full px-4 py-2.5 text-left transition-colors ${
                  c.num === selectedCompte ? 'bg-secondary/5 border-l-2 border-secondary' : 'hover:bg-neutral-50/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold" style={{ color: classeColors[c.classe] }}>{c.num}</span>
                  <span className="text-[10px] text-neutral-400">Classe {c.classe}</span>
                </div>
                <div className="text-xs text-neutral-700 mt-0.5 truncate">{c.lib}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Détail compte */}
        <div className="space-y-4">
          {/* En-tête compte */}
          <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl grid place-items-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: classeColors[compte.classe] }}
                >
                  {compte.num.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-neutral-800">{compte.num}</span>
                    <span className="badge badge-gray text-[10px]">Classe {compte.classe}</span>
                  </div>
                  <div className="text-sm text-neutral-600 mt-0.5">{compte.lib}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Calendar size={12} className="text-neutral-400" />
                <span className="text-neutral-500">Période :</span>
                <span className="font-semibold text-neutral-700">Mai 2026</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-semibold flex items-center gap-1">
                  <FileText size={10} /> Solde ouverture
                </div>
                <div className="mt-1 text-base font-bold text-neutral-800 font-mono">{fmtXOF(soldeOuverture)}</div>
              </div>
              <div className="rounded-lg border border-green-100 bg-green-50/50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-green-700 font-semibold flex items-center gap-1">
                  <ArrowDownToLine size={10} /> Total débit
                </div>
                <div className="mt-1 text-base font-bold text-success font-mono">{fmtXOF(totalDebit)}</div>
              </div>
              <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-red-700 font-semibold flex items-center gap-1">
                  <ArrowUpFromLine size={10} /> Total crédit
                </div>
                <div className="mt-1 text-base font-bold text-danger font-mono">{fmtXOF(totalCredit)}</div>
              </div>
              <div className="rounded-lg border-2 border-secondary/30 bg-blue-50/50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-secondary font-bold flex items-center gap-1">
                  {soldeFinal >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />} Solde final
                </div>
                <div className="mt-1 text-base font-bold text-secondary font-mono">{fmtXOF(soldeFinal)}</div>
              </div>
            </div>
          </div>

          {/* Mouvements */}
          <div className="card !p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-700">Mouvements détaillés · {mvts.length}</h3>
              <span className="text-[11px] text-neutral-400">Solde progressif inclus</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                    <th className="text-left px-4 py-2 font-semibold w-24">Date</th>
                    <th className="text-left px-2 py-2 font-semibold w-14">Jrnl</th>
                    <th className="text-left px-2 py-2 font-semibold w-36">Référence</th>
                    <th className="text-left px-2 py-2 font-semibold">Libellé</th>
                    <th className="text-right px-2 py-2 font-semibold w-28">Débit</th>
                    <th className="text-right px-2 py-2 font-semibold w-28">Crédit</th>
                    <th className="text-right px-2 py-2 font-semibold w-32">Solde</th>
                    <th className="text-center px-2 py-2 font-semibold w-14">Lettrage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-neutral-100 bg-neutral-50/40">
                    <td colSpan={6} className="px-4 py-2 text-xs italic text-neutral-500">À nouveau au 01/05/2026</td>
                    <td className="px-2 py-2 text-right font-mono text-xs font-bold text-neutral-700">{fmt(soldeOuverture)}</td>
                    <td />
                  </tr>
                  {lignesAvecSolde.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-xs text-neutral-400">Aucun mouvement sur la période sélectionnée.</td></tr>
                  )}
                  {lignesAvecSolde.map((m, i) => (
                    <tr key={i} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-neutral-500 font-mono">{m.date}</td>
                      <td className="px-2 py-2.5">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded text-white" style={{ background: journalColors[m.journal] }}>{m.journal}</span>
                      </td>
                      <td className="px-2 py-2.5 text-xs font-mono text-neutral-500">{m.ref}</td>
                      <td className="px-2 py-2.5 text-xs text-neutral-700">{m.libelle}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-xs">
                        {m.debit ? <span className="text-success font-semibold">{fmt(m.debit)}</span> : <span className="text-neutral-300">—</span>}
                      </td>
                      <td className="px-2 py-2.5 text-right font-mono text-xs">
                        {m.credit ? <span className="text-danger font-semibold">{fmt(m.credit)}</span> : <span className="text-neutral-300">—</span>}
                      </td>
                      <td className="px-2 py-2.5 text-right font-mono text-xs font-bold text-neutral-700">{fmt(m.soldeProgressif)}</td>
                      <td className="px-2 py-2.5 text-center">
                        {m.lettre ? (
                          <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold leading-5">{m.lettre}</span>
                        ) : (
                          <span className="text-neutral-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-neutral-50/80 border-t-2 border-neutral-200">
                    <td colSpan={4} className="px-4 py-2.5 text-xs font-semibold text-neutral-700">Totaux période</td>
                    <td className="px-2 py-2.5 text-right font-mono text-sm font-bold text-success">{fmt(totalDebit)}</td>
                    <td className="px-2 py-2.5 text-right font-mono text-sm font-bold text-danger">{fmt(totalCredit)}</td>
                    <td className="px-2 py-2.5 text-right font-mono text-sm font-bold text-secondary">{fmt(soldeFinal)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      <span className="hidden">{journalEntries.length}</span>
    </div>
  );
}
