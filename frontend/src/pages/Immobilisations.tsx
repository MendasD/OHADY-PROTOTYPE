import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, TrendingDown, Plus, Download } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const fmtXOF = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' XOF';

type Tab = 'registre' | 'amortissements';
const pathToTab: Record<string, Tab> = {
  '/immobilisations': 'registre',
  '/amortissements': 'amortissements',
};
const tabToPath: Record<Tab, string> = {
  registre: '/immobilisations',
  amortissements: '/amortissements',
};

const immobilisations = [
  {
    num: 'IMM-001', designation: 'Immeuble de bureaux — Plateau', categorie: 'Immob. corporelle',
    dateAcq: '15/03/2020', valeur: 45000000, taux: 5, duree: 20,
    cumulAmort: 11250000,
  },
  {
    num: 'IMM-002', designation: 'Véhicule Toyota Land Cruiser', categorie: 'Immob. corporelle',
    dateAcq: '10/07/2022', valeur: 28000000, taux: 25, duree: 4,
    cumulAmort: 14000000,
  },
  {
    num: 'IMM-003', designation: 'Logiciel ERP OHADY', categorie: 'Immob. incorporelle',
    dateAcq: '01/01/2024', valeur: 4500000, taux: 33, duree: 3,
    cumulAmort: 3000000,
  },
  {
    num: 'IMM-004', designation: 'Groupe électrogène 200KVA', categorie: 'Immob. corporelle',
    dateAcq: '05/09/2021', valeur: 18500000, taux: 10, duree: 10,
    cumulAmort: 7400000,
  },
  {
    num: 'IMM-005', designation: 'Mobilier de bureau (lot complet)', categorie: 'Immob. corporelle',
    dateAcq: '01/02/2023', valeur: 6800000, taux: 20, duree: 5,
    cumulAmort: 3400000,
  },
  {
    num: 'IMM-006', designation: 'Serveurs informatiques (rack)', categorie: 'Immob. corporelle',
    dateAcq: '15/11/2022', valeur: 12000000, taux: 33, duree: 3,
    cumulAmort: 8000000,
  },
  {
    num: 'IMM-007', designation: 'Licence Microsoft 365 (pluriannuelle)', categorie: 'Immob. incorporelle',
    dateAcq: '01/06/2024', valeur: 1800000, taux: 33, duree: 3,
    cumulAmort: 600000,
  },
];

const dotationsParAn = [
  { annee: '2022', dotation: 9200000 },
  { annee: '2023', dotation: 10800000 },
  { annee: '2024', dotation: 11500000 },
  { annee: '2025', dotation: 12100000 },
  { annee: '2026 (prev.)', dotation: 12100000 },
];

export default function Immobilisations() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>(pathToTab[pathname] ?? 'registre');

  useEffect(() => {
    const t = pathToTab[pathname];
    if (t && t !== tab) setTab(t);
  }, [pathname, tab]);

  const changeTab = (t: Tab) => {
    setTab(t);
    if (tabToPath[t] !== pathname) navigate(tabToPath[t]);
  };

  const totalValeur = immobilisations.reduce((s, i) => s + i.valeur, 0);
  const totalCumul = immobilisations.reduce((s, i) => s + i.cumulAmort, 0);
  const totalNet = totalValeur - totalCumul;
  const dotationAnnuelle = immobilisations.reduce((s, i) => s + i.valeur * i.taux / 100, 0);

  const tabs = [
    { id: 'registre' as Tab, label: 'Registre des immobilisations', icon: <Building2 size={14} /> },
    { id: 'amortissements' as Tab, label: 'Amortissements', icon: <TrendingDown size={14} /> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Immobilisations</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Registre des actifs et plan d'amortissement SYSCOHADA</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn border border-neutral-200 text-neutral-600 flex items-center gap-1.5 text-sm bg-white">
            <Download size={14} /> Exporter
          </button>
          <button className="btn btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={14} /> Nouvelle immobilisation
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Valeur brute totale', val: fmtXOF(totalValeur), color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Amortissements cumulés', val: fmtXOF(totalCumul), color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Valeur nette comptable', val: fmtXOF(totalNet), color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Dotation annuelle', val: fmtXOF(dotationAnnuelle), color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className={`text-xs font-medium mb-1 ${k.color}`}>{k.label}</div>
            <div className={`text-base font-bold ${k.color}`}>{k.val}</div>
            <div className={`mt-2 h-1 rounded-full ${k.bg}`} />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white rounded-xl shadow-card w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => changeTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-primary text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* REGISTRE */}
      {tab === 'registre' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                <th className="text-left pb-2">N° Immo.</th>
                <th className="text-left pb-2">Désignation</th>
                <th className="text-left pb-2">Catégorie</th>
                <th className="text-right pb-2">Date acq.</th>
                <th className="text-right pb-2">Valeur brute</th>
                <th className="text-right pb-2">Taux</th>
                <th className="text-right pb-2">Cumul amort.</th>
                <th className="text-right pb-2">VNC</th>
                <th className="text-center pb-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {immobilisations.map(imm => {
                const vnc = imm.valeur - imm.cumulAmort;
                const pctAmorti = Math.round(imm.cumulAmort / imm.valeur * 100);
                const isFullyAmorti = vnc <= 0;
                return (
                  <tr key={imm.num} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="py-2.5 font-mono text-xs text-neutral-500">{imm.num}</td>
                    <td className="py-2.5 font-medium text-neutral-800">{imm.designation}</td>
                    <td className="py-2.5">
                      <span className={`badge text-[10px] ${
                        imm.categorie === 'Immob. incorporelle' ? 'badge-blue' : 'badge-orange'
                      }`}>{imm.categorie}</span>
                    </td>
                    <td className="py-2.5 text-right text-xs text-neutral-500">{imm.dateAcq}</td>
                    <td className="py-2.5 text-right text-neutral-700">{fmtXOF(imm.valeur)}</td>
                    <td className="py-2.5 text-right text-neutral-500">{imm.taux}%</td>
                    <td className="py-2.5 text-right text-orange-600">{fmtXOF(imm.cumulAmort)}</td>
                    <td className={`py-2.5 text-right font-bold ${isFullyAmorti ? 'text-neutral-400' : 'text-green-700'}`}>
                      {isFullyAmorti ? '—' : fmtXOF(vnc)}
                    </td>
                    <td className="py-2.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-orange-400"
                            style={{ width: `${Math.min(pctAmorti, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-neutral-400">{pctAmorti}% amorti</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-neutral-200 bg-neutral-50">
              <tr>
                <td colSpan={4} className="py-2 pl-2 font-bold text-neutral-700">TOTAUX</td>
                <td className="py-2 text-right font-bold text-blue-700">{fmtXOF(totalValeur)}</td>
                <td />
                <td className="py-2 text-right font-bold text-orange-600">{fmtXOF(totalCumul)}</td>
                <td className="py-2 text-right font-bold text-green-700">{fmtXOF(totalNet)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* AMORTISSEMENTS */}
      {tab === 'amortissements' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="card">
            <h3 className="text-sm font-bold text-neutral-700 mb-4">Évolution des dotations annuelles</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dotationsParAn} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="annee" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: any) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: any) => fmtXOF(v)} />
                <Bar dataKey="dotation" fill="#F87171" radius={[4, 4, 0, 0]} name="Dotation" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card space-y-3">
            <h3 className="text-sm font-bold text-neutral-700 mb-2">Plan d'amortissement — Exercice 2025</h3>
            {immobilisations.map(imm => {
              const dotation = imm.valeur * imm.taux / 100;
              const vnc = imm.valeur - imm.cumulAmort;
              const pctRes = vnc > 0 ? Math.round(vnc / imm.valeur * 100) : 0;
              return (
                <div key={imm.num} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-neutral-700 truncate">{imm.designation}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-400 transition-all"
                          style={{ width: `${100 - pctRes}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 whitespace-nowrap">{pctRes}% restant</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-orange-600">{fmtXOF(dotation)}/an</div>
                    <div className="text-[10px] text-neutral-400">VNC {fmtXOF(Math.max(vnc, 0))}</div>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-neutral-100 pt-3 flex justify-between items-center">
              <span className="text-sm font-bold text-neutral-700">Dotation totale 2025</span>
              <span className="text-sm font-bold text-primary">{fmtXOF(dotationAnnuelle)}</span>
            </div>
          </div>

          {/* Tableau détaillé par immobilisation */}
          <div className="card col-span-2">
            <h3 className="text-sm font-bold text-neutral-700 mb-3">Tableau d'amortissement détaillé — 2025</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-neutral-400 uppercase tracking-wide border-b border-neutral-100">
                  <th className="text-left pb-2">Immobilisation</th>
                  <th className="text-right pb-2">Valeur origine</th>
                  <th className="text-right pb-2">Cumul N-1</th>
                  <th className="text-right pb-2">Dotation N</th>
                  <th className="text-right pb-2">Cumul N</th>
                  <th className="text-right pb-2">VNC N</th>
                </tr>
              </thead>
              <tbody>
                {immobilisations.map(imm => {
                  const dotN = Math.min(imm.valeur * imm.taux / 100, Math.max(imm.valeur - imm.cumulAmort, 0));
                  const cumulN = imm.cumulAmort + dotN;
                  const vncN = Math.max(imm.valeur - cumulN, 0);
                  const cumulN1 = imm.cumulAmort;
                  return (
                    <tr key={imm.num} className="border-t border-neutral-50 hover:bg-neutral-50">
                      <td className="py-2 text-neutral-700">{imm.designation}</td>
                      <td className="py-2 text-right text-neutral-600">{fmtXOF(imm.valeur)}</td>
                      <td className="py-2 text-right text-neutral-500">{fmtXOF(cumulN1)}</td>
                      <td className="py-2 text-right text-orange-600 font-semibold">{fmtXOF(dotN)}</td>
                      <td className="py-2 text-right text-orange-700">{fmtXOF(cumulN)}</td>
                      <td className={`py-2 text-right font-bold ${vncN > 0 ? 'text-green-700' : 'text-neutral-400'}`}>
                        {vncN > 0 ? fmtXOF(vncN) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-neutral-200 bg-neutral-50">
                <tr>
                  <td className="py-2 font-bold text-neutral-700">TOTAUX</td>
                  <td className="py-2 text-right font-bold text-blue-700">{fmtXOF(totalValeur)}</td>
                  <td className="py-2 text-right font-bold text-neutral-600">{fmtXOF(totalCumul)}</td>
                  <td className="py-2 text-right font-bold text-orange-600">{fmtXOF(dotationAnnuelle)}</td>
                  <td className="py-2 text-right font-bold text-orange-700">{fmtXOF(totalCumul + dotationAnnuelle)}</td>
                  <td className="py-2 text-right font-bold text-green-700">{fmtXOF(Math.max(totalNet - dotationAnnuelle, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
