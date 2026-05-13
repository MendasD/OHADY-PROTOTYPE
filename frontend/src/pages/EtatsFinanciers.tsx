import { useState } from 'react';
import { FileText, TrendingUp, TrendingDown, Activity, Download, ChevronRight } from 'lucide-react';

const fmtXOF = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(n) + ' XOF';

// ─── Bilan data ───────────────────────────────────────────────────────────────
const actifImmo = [
  { label: 'Immobilisations incorporelles', brut: 4500000, amort: 1800000 },
  { label: 'Immobilisations corporelles', brut: 87600000, amort: 31200000 },
  { label: 'Immobilisations financières', brut: 12000000, amort: 0 },
];
const actifCirc = [
  { label: 'Stocks et en-cours', brut: 18450000, amort: 0 },
  { label: 'Créances clients', brut: 43200000, amort: 2100000 },
  { label: 'Autres créances', brut: 8700000, amort: 0 },
  { label: 'Valeurs mobilières de placement', brut: 5000000, amort: 0 },
  { label: 'Disponibilités', brut: 23415000, amort: 0 },
];
const passifCP = [
  { label: 'Capital social', montant: 50000000 },
  { label: 'Réserves', montant: 22800000 },
  { label: 'Report à nouveau', montant: 4350000 },
  { label: 'Résultat de l\'exercice', montant: 12650000 },
];
const passifDettes = [
  { label: 'Emprunts et dettes financières', montant: 35000000 },
  { label: 'Dettes fournisseurs', montant: 28600000 },
  { label: 'Dettes fiscales et sociales', montant: 14800000 },
  { label: 'Autres dettes', montant: 11165000 },
];

// ─── CPC data ─────────────────────────────────────────────────────────────────
const produits = [
  { label: "Chiffre d'affaires", n: 186400000, n1: 165200000 },
  { label: 'Production immobilisée', n: 2100000, n1: 1800000 },
  { label: 'Subventions d\'exploitation', n: 0, n1: 500000 },
  { label: 'Reprises sur provisions', n: 1200000, n1: 900000 },
  { label: 'Autres produits d\'exploitation', n: 3800000, n1: 3200000 },
  { label: 'Produits financiers', n: 850000, n1: 720000 },
];
const charges = [
  { label: 'Achats de marchandises', n: 72300000, n1: 63800000 },
  { label: 'Services extérieurs', n: 24600000, n1: 22100000 },
  { label: 'Charges de personnel', n: 48200000, n1: 43500000 },
  { label: 'Impôts et taxes', n: 8400000, n1: 7600000 },
  { label: 'Dotations aux amortissements', n: 12100000, n1: 11200000 },
  { label: 'Charges financières', n: 3600000, n1: 4100000 },
  { label: 'Charges exceptionnelles', n: 1500000, n1: 800000 },
  { label: 'Impôts sur les bénéfices', n: 5500000, n1: 4800000 },
];

// ─── TFT data ─────────────────────────────────────────────────────────────────
const tftExploitation = [
  { label: 'Résultat net', val: 12650000, sign: 1 },
  { label: 'Dotations aux amortissements', val: 12100000, sign: 1 },
  { label: 'Variation des stocks', val: -2300000, sign: 1 },
  { label: 'Variation des créances clients', val: -5800000, sign: 1 },
  { label: 'Variation des dettes fournisseurs', val: 3200000, sign: 1 },
  { label: 'Variation des autres dettes', val: 1100000, sign: 1 },
];
const tftInvest = [
  { label: 'Acquisitions d\'immobilisations', val: -18500000, sign: 1 },
  { label: 'Cessions d\'immobilisations', val: 2200000, sign: 1 },
];
const tftFinancement = [
  { label: 'Remboursements d\'emprunts', val: -6000000, sign: 1 },
  { label: 'Nouveaux emprunts', val: 8000000, sign: 1 },
  { label: 'Distribution de dividendes', val: -4000000, sign: 1 },
];

type Tab = 'bilan' | 'cpc' | 'tft';

export default function EtatsFinanciers() {
  const [tab, setTab] = useState<Tab>('bilan');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'bilan', label: 'Bilan', icon: <FileText size={14} /> },
    { id: 'cpc', label: 'Compte de résultat', icon: <TrendingUp size={14} /> },
    { id: 'tft', label: 'Flux de trésorerie', icon: <Activity size={14} /> },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">États Financiers</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Exercice 2025 — Normes SYSCOHADA Révisé</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-blue">Brouillon</span>
          <button className="btn btn-primary flex items-center gap-1.5 text-sm">
            <Download size={14} /> Exporter PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white rounded-xl shadow-card w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* BILAN */}
      {tab === 'bilan' && (
        <div className="grid grid-cols-2 gap-5">
          {/* ACTIF */}
          <div className="card space-y-4">
            <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wide">Actif</h2>

            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Actif Immobilisé
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-neutral-400">
                    <th className="text-left pb-1">Désignation</th>
                    <th className="text-right pb-1">Brut</th>
                    <th className="text-right pb-1">Amort.</th>
                    <th className="text-right pb-1 text-primary font-semibold">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {actifImmo.map(r => (
                    <tr key={r.label} className="border-t border-neutral-50 hover:bg-neutral-50">
                      <td className="py-1.5 text-neutral-700">{r.label}</td>
                      <td className="py-1.5 text-right text-neutral-500">{fmtXOF(r.brut)}</td>
                      <td className="py-1.5 text-right text-red-400">({fmtXOF(r.amort)})</td>
                      <td className="py-1.5 text-right font-semibold text-neutral-800">{fmtXOF(r.brut - r.amort)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-neutral-200 bg-neutral-50">
                    <td className="py-2 font-bold text-neutral-700">Total Actif Immobilisé</td>
                    <td className="py-2 text-right font-bold">{fmtXOF(actifImmo.reduce((a, r) => a + r.brut, 0))}</td>
                    <td className="py-2 text-right text-red-400 font-bold">({fmtXOF(actifImmo.reduce((a, r) => a + r.amort, 0))})</td>
                    <td className="py-2 text-right font-bold text-primary">{fmtXOF(actifImmo.reduce((a, r) => a + r.brut - r.amort, 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t border-neutral-100 pt-4">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Actif Circulant
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {actifCirc.map(r => (
                    <tr key={r.label} className="border-t border-neutral-50 hover:bg-neutral-50">
                      <td className="py-1.5 text-neutral-700">{r.label}</td>
                      <td className="py-1.5 text-right text-neutral-500">{fmtXOF(r.brut)}</td>
                      <td className="py-1.5 text-right text-red-400">{r.amort ? `(${fmtXOF(r.amort)})` : '—'}</td>
                      <td className="py-1.5 text-right font-semibold text-neutral-800">{fmtXOF(r.brut - r.amort)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-neutral-200 bg-neutral-50">
                    <td className="py-2 font-bold text-neutral-700">Total Actif Circulant</td>
                    <td className="py-2 text-right font-bold">{fmtXOF(actifCirc.reduce((a, r) => a + r.brut, 0))}</td>
                    <td className="py-2 text-right text-red-400 font-bold">({fmtXOF(actifCirc.reduce((a, r) => a + r.amort, 0))})</td>
                    <td className="py-2 text-right font-bold text-primary">{fmtXOF(actifCirc.reduce((a, r) => a + r.brut - r.amort, 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t-2 border-primary/20 pt-3 bg-primary/5 rounded-lg px-3 py-2 flex justify-between items-center">
              <span className="text-sm font-bold text-primary">TOTAL ACTIF</span>
              <span className="text-lg font-bold text-primary">
                {fmtXOF(
                  actifImmo.reduce((a, r) => a + r.brut - r.amort, 0) +
                  actifCirc.reduce((a, r) => a + r.brut - r.amort, 0)
                )}
              </span>
            </div>
          </div>

          {/* PASSIF */}
          <div className="card space-y-4">
            <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wide">Passif</h2>

            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Capitaux Propres
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {passifCP.map(r => (
                    <tr key={r.label} className="border-t border-neutral-50 hover:bg-neutral-50">
                      <td className="py-1.5 text-neutral-700">{r.label}</td>
                      <td className="py-1.5 text-right font-semibold text-neutral-800">{fmtXOF(r.montant)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-neutral-200 bg-green-50">
                    <td className="py-2 font-bold text-green-700">Total Capitaux Propres</td>
                    <td className="py-2 text-right font-bold text-green-700">{fmtXOF(passifCP.reduce((a, r) => a + r.montant, 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t border-neutral-100 pt-4">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Dettes
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {passifDettes.map(r => (
                    <tr key={r.label} className="border-t border-neutral-50 hover:bg-neutral-50">
                      <td className="py-1.5 text-neutral-700">{r.label}</td>
                      <td className="py-1.5 text-right font-semibold text-neutral-800">{fmtXOF(r.montant)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-neutral-200 bg-neutral-50">
                    <td className="py-2 font-bold text-neutral-700">Total Dettes</td>
                    <td className="py-2 text-right font-bold">{fmtXOF(passifDettes.reduce((a, r) => a + r.montant, 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t-2 border-primary/20 pt-3 bg-primary/5 rounded-lg px-3 py-2 flex justify-between items-center">
              <span className="text-sm font-bold text-primary">TOTAL PASSIF</span>
              <span className="text-lg font-bold text-primary">
                {fmtXOF(
                  passifCP.reduce((a, r) => a + r.montant, 0) +
                  passifDettes.reduce((a, r) => a + r.montant, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* COMPTE DE RÉSULTAT */}
      {tab === 'cpc' && (
        <div className="grid grid-cols-2 gap-5">
          {/* Produits */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-green-500" />
              <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wide">Produits</h2>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-neutral-400">
                  <th className="text-left pb-2">Libellé</th>
                  <th className="text-right pb-2">N</th>
                  <th className="text-right pb-2">N-1</th>
                  <th className="text-right pb-2">Var.</th>
                </tr>
              </thead>
              <tbody>
                {produits.map(r => {
                  const varPct = r.n1 ? ((r.n - r.n1) / r.n1) * 100 : 0;
                  return (
                    <tr key={r.label} className="border-t border-neutral-50 hover:bg-neutral-50">
                      <td className="py-1.5 text-neutral-700">{r.label}</td>
                      <td className="py-1.5 text-right font-semibold text-neutral-800">{fmtXOF(r.n)}</td>
                      <td className="py-1.5 text-right text-neutral-400">{fmtXOF(r.n1)}</td>
                      <td className={`py-1.5 text-right text-xs font-medium ${varPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {varPct >= 0 ? '+' : ''}{varPct.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-neutral-200 bg-green-50">
                  <td className="py-2 font-bold text-green-700">Total Produits</td>
                  <td className="py-2 text-right font-bold text-green-700">{fmtXOF(produits.reduce((a, r) => a + r.n, 0))}</td>
                  <td className="py-2 text-right text-neutral-400">{fmtXOF(produits.reduce((a, r) => a + r.n1, 0))}</td>
                  <td className="py-2 text-right text-green-600 font-medium">
                    +{(((produits.reduce((a, r) => a + r.n, 0) - produits.reduce((a, r) => a + r.n1, 0)) / produits.reduce((a, r) => a + r.n1, 0)) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Charges */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={16} className="text-red-500" />
              <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wide">Charges</h2>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-neutral-400">
                  <th className="text-left pb-2">Libellé</th>
                  <th className="text-right pb-2">N</th>
                  <th className="text-right pb-2">N-1</th>
                  <th className="text-right pb-2">Var.</th>
                </tr>
              </thead>
              <tbody>
                {charges.map(r => {
                  const varPct = r.n1 ? ((r.n - r.n1) / r.n1) * 100 : 0;
                  return (
                    <tr key={r.label} className="border-t border-neutral-50 hover:bg-neutral-50">
                      <td className="py-1.5 text-neutral-700">{r.label}</td>
                      <td className="py-1.5 text-right font-semibold text-neutral-800">{fmtXOF(r.n)}</td>
                      <td className="py-1.5 text-right text-neutral-400">{fmtXOF(r.n1)}</td>
                      <td className={`py-1.5 text-right text-xs font-medium ${varPct <= 0 ? 'text-green-500' : 'text-orange-500'}`}>
                        {varPct >= 0 ? '+' : ''}{varPct.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-neutral-200 bg-red-50">
                  <td className="py-2 font-bold text-red-700">Total Charges</td>
                  <td className="py-2 text-right font-bold text-red-700">{fmtXOF(charges.reduce((a, r) => a + r.n, 0))}</td>
                  <td className="py-2 text-right text-neutral-400">{fmtXOF(charges.reduce((a, r) => a + r.n1, 0))}</td>
                  <td className="py-2 text-right text-orange-500 font-medium">
                    +{(((charges.reduce((a, r) => a + r.n, 0) - charges.reduce((a, r) => a + r.n1, 0)) / charges.reduce((a, r) => a + r.n1, 0)) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 border-t-2 border-primary/20 pt-3 bg-primary/5 rounded-lg px-3 py-2 flex justify-between items-center">
              <span className="text-sm font-bold text-primary">RÉSULTAT NET</span>
              <span className="text-lg font-bold text-green-600">
                {fmtXOF(produits.reduce((a, r) => a + r.n, 0) - charges.reduce((a, r) => a + r.n, 0))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TABLEAU DES FLUX DE TRÉSORERIE */}
      {tab === 'tft' && (
        <div className="space-y-4">
          {[
            { title: 'Flux liés à l\'activité', data: tftExploitation, colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
            { title: 'Flux liés aux investissements', data: tftInvest, colorClass: 'text-orange-600', bgClass: 'bg-orange-50' },
            { title: 'Flux liés au financement', data: tftFinancement, colorClass: 'text-purple-600', bgClass: 'bg-purple-50' },
          ].map(section => {
            const total = section.data.reduce((a, r) => a + r.val, 0);
            return (
              <div key={section.title} className="card">
                <div className="flex items-center gap-2 mb-3">
                  <ChevronRight size={16} className={section.colorClass} />
                  <h3 className="text-sm font-bold text-neutral-700">{section.title}</h3>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {section.data.map(r => (
                      <tr key={r.label} className="border-t border-neutral-50 hover:bg-neutral-50">
                        <td className="py-2 text-neutral-600 pl-4">{r.label}</td>
                        <td className={`py-2 text-right font-medium ${r.val >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {r.val >= 0 ? '+' : ''}{fmtXOF(r.val)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={`mt-3 rounded-lg px-3 py-2 flex justify-between items-center ${section.bgClass}`}>
                  <span className={`text-sm font-bold ${section.colorClass}`}>Flux net</span>
                  <span className={`text-sm font-bold ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {total >= 0 ? '+' : ''}{fmtXOF(total)}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="card bg-primary text-white flex justify-between items-center">
            <div>
              <div className="text-xs text-white/70 mb-1">Variation nette de trésorerie</div>
              <div className="text-2xl font-bold">
                {fmtXOF(
                  [...tftExploitation, ...tftInvest, ...tftFinancement].reduce((a, r) => a + r.val, 0)
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/70 mb-1">Trésorerie de clôture</div>
              <div className="text-2xl font-bold">23 415 000 XOF</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
