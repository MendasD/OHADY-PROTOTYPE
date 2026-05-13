import { useState } from 'react';
import { Search, ChevronRight, ChevronDown, Plus, Download, Filter } from 'lucide-react';

interface Account { code: string; label: string; type: string; sens: 'D' | 'C'; nature: string; solde?: number; }
interface AccountClass { id: string; code: string; label: string; color: string; accounts: Account[]; }

const planComptable: AccountClass[] = [
  {
    id: 'c1', code: '1', label: 'Classe 1 — Comptes de ressources durables', color: '#1A3C5E',
    accounts: [
      { code: '10100', label: 'Capital social',                    type: 'Passif', sens: 'C', nature: 'Bilan',  solde: 50000000 },
      { code: '10400', label: 'Primes liées au capital',           type: 'Passif', sens: 'C', nature: 'Bilan',  solde: 5000000 },
      { code: '11100', label: 'Réserve légale',                    type: 'Passif', sens: 'C', nature: 'Bilan',  solde: 2500000 },
      { code: '11800', label: 'Autres réserves',                   type: 'Passif', sens: 'C', nature: 'Bilan',  solde: 1200000 },
      { code: '12000', label: 'Report à nouveau',                  type: 'Passif', sens: 'C', nature: 'Bilan',  solde: 3800000 },
      { code: '13100', label: 'Résultat net de l\'exercice',       type: 'Passif', sens: 'C', nature: 'Bilan',  solde: 5920000 },
      { code: '16100', label: 'Emprunt bancaire SGBS',             type: 'Passif', sens: 'C', nature: 'Bilan',  solde: 8500000 },
      { code: '17100', label: 'Dettes de crédit-bail',             type: 'Passif', sens: 'C', nature: 'Bilan',  solde: 0 },
    ],
  },
  {
    id: 'c2', code: '2', label: 'Classe 2 — Comptes d\'actif immobilisé', color: '#2980B9',
    accounts: [
      { code: '21100', label: 'Terrains',                          type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 0 },
      { code: '22100', label: 'Bâtiments',                         type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 0 },
      { code: '23100', label: 'Matériel & outillage industriel',   type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 4500000 },
      { code: '24400', label: 'Matériel informatique',             type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 3200000 },
      { code: '24500', label: 'Mobilier & agencements',            type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 1800000 },
      { code: '24600', label: 'Matériel de transport',             type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 6500000 },
      { code: '28100', label: 'Amort. — Bâtiments',               type: 'Actif',  sens: 'C', nature: 'Bilan',  solde: 0 },
      { code: '28400', label: 'Amort. — Mat. informatique',        type: 'Actif',  sens: 'C', nature: 'Bilan',  solde: -1140000 },
      { code: '28600', label: 'Amort. — Mat. transport',           type: 'Actif',  sens: 'C', nature: 'Bilan',  solde: -2100000 },
    ],
  },
  {
    id: 'c3', code: '3', label: 'Classe 3 — Comptes de stocks', color: '#27AE60',
    accounts: [
      { code: '31100', label: 'Marchandises — stock A',            type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 3250000 },
      { code: '32100', label: 'Matières premières',                type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 1800000 },
      { code: '35100', label: 'Produits finis',                    type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 980000 },
      { code: '38100', label: 'Stocks en transit',                 type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 0 },
    ],
  },
  {
    id: 'c4', code: '4', label: 'Classe 4 — Comptes de tiers', color: '#E67E22',
    accounts: [
      { code: '40100', label: 'Fournisseurs — dettes en cours',    type: 'Passif', sens: 'C', nature: 'Bilan',  solde: -4850000 },
      { code: '40800', label: 'Fournisseurs — effets à payer',     type: 'Passif', sens: 'C', nature: 'Bilan',  solde: 0 },
      { code: '41100', label: 'Clients — créances en cours',       type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 15230000 },
      { code: '41800', label: 'Clients — effets à recevoir',       type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 0 },
      { code: '41900', label: 'Clients douteux',                   type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 3800000 },
      { code: '44310', label: 'TVA collectée (18%)',               type: 'Passif', sens: 'C', nature: 'Bilan',  solde: -1848000 },
      { code: '44510', label: 'TVA déductible sur achats',         type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 324000 },
      { code: '46200', label: 'Débiteurs divers',                  type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 450000 },
      { code: '47100', label: 'Comptes de suspens',                type: 'Bilan',  sens: 'D', nature: 'Bilan',  solde: 185000 },
    ],
  },
  {
    id: 'c5', code: '5', label: 'Classe 5 — Comptes de trésorerie', color: '#1ABC9C',
    accounts: [
      { code: '52110', label: 'Banque SGBS — compte courant',      type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 15240000 },
      { code: '52120', label: 'Banque CBAO — épargne',             type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 5820000 },
      { code: '53100', label: 'Compte Wave Business',              type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 1450000 },
      { code: '53200', label: 'Compte Orange Money Pro',           type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 680000 },
      { code: '57100', label: 'Caisse principale',                 type: 'Actif',  sens: 'D', nature: 'Bilan',  solde: 225000 },
    ],
  },
  {
    id: 'c6', code: '6', label: 'Classe 6 — Comptes de charges', color: '#E74C3C',
    accounts: [
      { code: '60100', label: 'Achats de marchandises',            type: 'Charge', sens: 'D', nature: 'Gestion', solde: 18400000 },
      { code: '60220', label: 'Fournitures de bureau',             type: 'Charge', sens: 'D', nature: 'Gestion', solde: 480000 },
      { code: '61100', label: 'Transports sur achats',             type: 'Charge', sens: 'D', nature: 'Gestion', solde: 380000 },
      { code: '62100', label: 'Locations & charges locatives',     type: 'Charge', sens: 'D', nature: 'Gestion', solde: 4000000 },
      { code: '64100', label: 'Charges de personnel — salaires',   type: 'Charge', sens: 'D', nature: 'Gestion', solde: 15200000 },
      { code: '65100', label: 'Charges financières — intérêts',    type: 'Charge', sens: 'D', nature: 'Gestion', solde: 420000 },
      { code: '68100', label: 'Dotations aux amortissements',      type: 'Charge', sens: 'D', nature: 'Gestion', solde: 285000 },
    ],
  },
  {
    id: 'c7', code: '7', label: 'Classe 7 — Comptes de produits', color: '#9B59B6',
    accounts: [
      { code: '70100', label: 'Ventes de marchandises',            type: 'Produit', sens: 'C', nature: 'Gestion', solde: -22400000 },
      { code: '70600', label: 'Prestations de services',           type: 'Produit', sens: 'C', nature: 'Gestion', solde: -25450000 },
      { code: '75100', label: 'Produits financiers',               type: 'Produit', sens: 'C', nature: 'Gestion', solde: -185000 },
    ],
  },
];

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.abs(n));

export default function PlanComptable() {
  const [search, setSearch] = useState('');
  const [openClasses, setOpenClasses] = useState<Record<string, boolean>>({ c1: true, c4: true, c5: true });
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const toggleClass = (id: string) => setOpenClasses(p => ({ ...p, [id]: !p[id] }));

  const filtered = planComptable.map(cls => ({
    ...cls,
    accounts: cls.accounts.filter(acc => {
      const matchSearch = !search || acc.code.includes(search) || acc.label.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || acc.type === typeFilter;
      return matchSearch && matchType;
    }),
  })).filter(cls => cls.accounts.length > 0 || !search);

  const totalAccounts = planComptable.reduce((s, c) => s + c.accounts.length, 0);

  return (
    <div className="space-y-5 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Plan comptable SYSCOHADA</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Système Normal · {totalAccounts} comptes · Exercice 2025–2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Download size={13} /> Exporter</button>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> Nouveau compte</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card py-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-1.5 text-xs" placeholder="Numéro ou libellé de compte..." />
        </div>
        <div className="flex gap-1.5">
          {['all', 'Actif', 'Passif', 'Charge', 'Produit'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border-0 ${typeFilter === t ? 'bg-secondary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
              {t === 'all' ? 'Tous' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Classes */}
      <div className="space-y-2">
        {filtered.map(cls => {
          const isOpen = openClasses[cls.id] ?? false;
          const totalSolde = cls.accounts.reduce((s, a) => s + (a.solde ?? 0), 0);

          return (
            <div key={cls.id} className="card p-0 overflow-hidden">
              {/* Class header */}
              <button
                onClick={() => toggleClass(cls.id)}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-neutral-50 transition-colors border-0 bg-transparent"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: cls.color }}>
                  {cls.code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-neutral-800 text-sm">{cls.label}</div>
                  <div className="text-xs text-neutral-400">{cls.accounts.length} compte(s)</div>
                </div>
                <div className="text-sm font-bold text-neutral-700 hidden lg:block">
                  {totalSolde !== 0 && <>{fmt(totalSolde)} XOF</>}
                </div>
                {isOpen
                  ? <ChevronDown size={15} className="text-neutral-400 flex-shrink-0" />
                  : <ChevronRight size={15} className="text-neutral-400 flex-shrink-0" />
                }
              </button>

              {/* Accounts table */}
              {isOpen && (
                <div className="border-t border-neutral-100">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wider py-2 px-5">N° Compte</th>
                        <th className="text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wider py-2 px-3">Libellé</th>
                        <th className="text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wider py-2 px-3 hidden md:table-cell">Type</th>
                        <th className="text-center text-[10px] font-semibold text-neutral-500 uppercase tracking-wider py-2 px-3 hidden lg:table-cell">Sens</th>
                        <th className="text-right text-[10px] font-semibold text-neutral-500 uppercase tracking-wider py-2 px-5">Solde (XOF)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cls.accounts.map(acc => (
                        <tr key={acc.code} className="border-t border-neutral-50 hover:bg-neutral-50/70 transition-colors cursor-pointer">
                          <td className="py-2.5 px-5">
                            <span className="font-mono text-xs font-bold" style={{ color: cls.color }}>{acc.code}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs text-neutral-700">{acc.label}</span>
                          </td>
                          <td className="py-2.5 px-3 hidden md:table-cell">
                            <span className={`badge text-[10px] ${acc.type === 'Actif' ? 'badge-blue' : acc.type === 'Passif' ? 'badge-purple' : acc.type === 'Charge' ? 'badge-red' : 'badge-green'}`}>
                              {acc.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center hidden lg:table-cell">
                            <span className={`badge text-[10px] ${acc.sens === 'D' ? 'badge-blue' : 'badge-orange'}`}>{acc.sens}</span>
                          </td>
                          <td className="py-2.5 px-5 text-right">
                            {acc.solde !== undefined && acc.solde !== 0 ? (
                              <span className={`text-xs font-semibold ${acc.solde > 0 ? 'text-neutral-800' : 'text-danger'}`}>
                                {acc.solde < 0 && '('}{fmt(acc.solde)}{acc.solde < 0 && ')'}
                              </span>
                            ) : <span className="text-neutral-300 text-xs">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
