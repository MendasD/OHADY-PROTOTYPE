import { useState } from 'react';
import { Package, ArrowUp, ArrowDown, ClipboardList, Plus, Search, AlertTriangle } from 'lucide-react';

const fmtXOF = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(n) + ' XOF';

type Tab = 'articles' | 'mouvements' | 'inventaire';

const categories = ['Fournitures bureau', 'Matériel informatique', 'Consommables', 'Mobilier', 'Équipements divers'];

const articles = [
  { code: 'ART-001', label: 'Ramette papier A4 80g', cat: 'Fournitures bureau', stock: 48, stockMin: 20, pu: 3500, unite: 'Rame' },
  { code: 'ART-002', label: 'Cartouche encre HP LaserJet', cat: 'Consommables', stock: 5, stockMin: 8, pu: 18500, unite: 'Unité' },
  { code: 'ART-003', label: 'Ordinateur portable Dell Latitude', cat: 'Matériel informatique', stock: 12, stockMin: 3, pu: 580000, unite: 'Unité' },
  { code: 'ART-004', label: 'Chaise de bureau ergonomique', cat: 'Mobilier', stock: 8, stockMin: 5, pu: 95000, unite: 'Unité' },
  { code: 'ART-005', label: 'Switch réseau 24 ports', cat: 'Équipements divers', stock: 3, stockMin: 2, pu: 145000, unite: 'Unité' },
  { code: 'ART-006', label: 'Climatiseur Daikin 1.5CV', cat: 'Équipements divers', stock: 6, stockMin: 2, pu: 420000, unite: 'Unité' },
  { code: 'ART-007', label: 'Stylos bille (boîte 12)', cat: 'Fournitures bureau', stock: 32, stockMin: 15, pu: 2500, unite: 'Boîte' },
  { code: 'ART-008', label: 'Câble USB-C 2m', cat: 'Consommables', stock: 18, stockMin: 10, pu: 4500, unite: 'Unité' },
];

const mouvements = [
  { date: '13/05/2026', heure: '09:15', type: 'Entrée', art: 'ART-001 — Ramette papier A4 80g', qte: 20, motif: 'Commande fournisseur', ref: 'BC-2026-0342', agent: 'Fatou Diallo' },
  { date: '13/05/2026', heure: '10:30', type: 'Sortie', art: 'ART-003 — Ordinateur portable Dell', qte: 2, motif: 'Attribution personnel', ref: 'BS-2026-0189', agent: 'Mamadou Sow' },
  { date: '12/05/2026', heure: '14:45', type: 'Sortie', art: 'ART-002 — Cartouche encre HP', qte: 3, motif: 'Consommation service', ref: 'BS-2026-0188', agent: 'Aissatou Ba' },
  { date: '12/05/2026', heure: '11:00', type: 'Entrée', art: 'ART-006 — Climatiseur Daikin', qte: 3, motif: 'Réception commande', ref: 'BC-2026-0341', agent: 'Cheikh Ndiaye' },
  { date: '11/05/2026', heure: '08:30', type: 'Sortie', art: 'ART-004 — Chaise bureau ergonomique', qte: 1, motif: 'Attribution bureau 12', ref: 'BS-2026-0187', agent: 'Fatou Diallo' },
  { date: '10/05/2026', heure: '16:00', type: 'Ajustement', art: 'ART-007 — Stylos bille (boîte)', qte: -4, motif: 'Inventaire physique — correction', ref: 'INV-2026-003', agent: 'Moussa Kouyaté' },
  { date: '09/05/2026', heure: '09:00', type: 'Entrée', art: 'ART-008 — Câble USB-C 2m', qte: 10, motif: 'Réassort automatique', ref: 'BC-2026-0340', agent: 'Système' },
];

const inventaireData = [
  { code: 'ART-001', label: 'Ramette papier A4 80g', theorique: 52, physique: 48, statut: 'Ecart' },
  { code: 'ART-002', label: 'Cartouche encre HP', theorique: 5, physique: 5, statut: 'OK' },
  { code: 'ART-003', label: 'Ordinateur portable Dell', theorique: 12, physique: 12, statut: 'OK' },
  { code: 'ART-004', label: 'Chaise bureau ergonomique', theorique: 8, physique: 8, statut: 'OK' },
  { code: 'ART-005', label: 'Switch réseau 24 ports', theorique: 3, physique: 3, statut: 'OK' },
  { code: 'ART-006', label: 'Climatiseur Daikin', theorique: 6, physique: 6, statut: 'OK' },
  { code: 'ART-007', label: 'Stylos bille (boîte 12)', theorique: 36, physique: 32, statut: 'Ecart' },
  { code: 'ART-008', label: 'Câble USB-C 2m', theorique: 18, physique: 19, statut: 'Ecart' },
];

export default function Stocks() {
  const [tab, setTab] = useState<Tab>('articles');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const tabs = [
    { id: 'articles' as Tab, label: 'Articles & Catalogue', icon: <Package size={14} /> },
    { id: 'mouvements' as Tab, label: 'Mouvements', icon: <ArrowUp size={14} /> },
    { id: 'inventaire' as Tab, label: 'Inventaire physique', icon: <ClipboardList size={14} /> },
  ];

  const filteredArticles = articles.filter(a =>
    (a.label.toLowerCase().includes(search.toLowerCase()) || a.code.toLowerCase().includes(search.toLowerCase())) &&
    (!catFilter || a.cat === catFilter)
  );

  const totalValeur = articles.reduce((sum, a) => sum + a.stock * a.pu, 0);
  const alerteRupture = articles.filter(a => a.stock <= a.stockMin).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Stocks</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Gestion des articles, mouvements et inventaires</p>
        </div>
        <button className="btn btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Nouveau mouvement
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Références actives', val: articles.length.toString(), icon: <Package size={18} />, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Valeur totale stock', val: fmtXOF(totalValeur), icon: <Package size={18} />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Alertes rupture', val: alerteRupture.toString(), icon: <AlertTriangle size={18} />, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Mouvements (mai)', val: mouvements.length.toString(), icon: <ArrowUp size={18} />, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map(kpi => (
          <div key={kpi.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>{kpi.icon}</div>
            <div>
              <div className="text-xs text-neutral-400">{kpi.label}</div>
              <div className={`text-sm font-bold ${kpi.color}`}>{kpi.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white rounded-xl shadow-card w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-primary text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ARTICLES */}
      {tab === 'articles' && (
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 input py-2 px-3">
              <Search size={14} className="text-neutral-400" />
              <input
                className="flex-1 outline-none text-sm bg-transparent"
                placeholder="Rechercher un article..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input text-sm py-2"
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
            >
              <option value="">Toutes catégories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                <th className="text-left pb-2">Code</th>
                <th className="text-left pb-2">Désignation</th>
                <th className="text-left pb-2">Catégorie</th>
                <th className="text-right pb-2">Stock</th>
                <th className="text-right pb-2">Stock min.</th>
                <th className="text-right pb-2">Prix unitaire</th>
                <th className="text-right pb-2">Valeur stock</th>
                <th className="text-center pb-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map(a => {
                const isAlert = a.stock <= a.stockMin;
                return (
                  <tr key={a.code} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="py-2.5 font-mono text-xs text-neutral-500">{a.code}</td>
                    <td className="py-2.5 font-medium text-neutral-800">{a.label}</td>
                    <td className="py-2.5">
                      <span className="badge badge-blue text-[10px]">{a.cat}</span>
                    </td>
                    <td className={`py-2.5 text-right font-bold ${isAlert ? 'text-red-500' : 'text-neutral-800'}`}>
                      {a.stock} {a.unite}
                    </td>
                    <td className="py-2.5 text-right text-neutral-400 text-xs">{a.stockMin}</td>
                    <td className="py-2.5 text-right text-neutral-600">{fmtXOF(a.pu)}</td>
                    <td className="py-2.5 text-right font-semibold text-neutral-800">{fmtXOF(a.stock * a.pu)}</td>
                    <td className="py-2.5 text-center">
                      {isAlert
                        ? <span className="badge badge-red flex items-center gap-1 justify-center"><AlertTriangle size={10} />Rupture</span>
                        : <span className="badge badge-green">OK</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-neutral-200 bg-neutral-50">
              <tr>
                <td colSpan={6} className="py-2 pl-2 font-bold text-neutral-700">Total</td>
                <td className="py-2 text-right font-bold text-primary">{fmtXOF(filteredArticles.reduce((s, a) => s + a.stock * a.pu, 0))}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* MOUVEMENTS */}
      {tab === 'mouvements' && (
        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                <th className="text-left pb-2">Date & Heure</th>
                <th className="text-left pb-2">Type</th>
                <th className="text-left pb-2">Article</th>
                <th className="text-right pb-2">Qté</th>
                <th className="text-left pb-2">Motif</th>
                <th className="text-left pb-2">Référence</th>
                <th className="text-left pb-2">Agent</th>
              </tr>
            </thead>
            <tbody>
              {mouvements.map((m, i) => (
                <tr key={i} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="py-2.5 text-neutral-500 text-xs">
                    <div>{m.date}</div>
                    <div className="text-neutral-400">{m.heure}</div>
                  </td>
                  <td className="py-2.5">
                    <span className={`badge flex items-center gap-1 w-fit ${
                      m.type === 'Entrée' ? 'badge-green' :
                      m.type === 'Sortie' ? 'badge-red' : 'badge-orange'
                    }`}>
                      {m.type === 'Entrée' ? <ArrowDown size={10} /> : m.type === 'Sortie' ? <ArrowUp size={10} /> : null}
                      {m.type}
                    </span>
                  </td>
                  <td className="py-2.5 font-medium text-neutral-800 text-xs">{m.art}</td>
                  <td className={`py-2.5 text-right font-bold ${m.qte < 0 ? 'text-orange-500' : m.type === 'Sortie' ? 'text-red-500' : 'text-green-600'}`}>
                    {m.qte > 0 ? '+' : ''}{m.qte}
                  </td>
                  <td className="py-2.5 text-neutral-600 text-xs">{m.motif}</td>
                  <td className="py-2.5 font-mono text-xs text-neutral-400">{m.ref}</td>
                  <td className="py-2.5 text-neutral-600 text-xs">{m.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* INVENTAIRE */}
      {tab === 'inventaire' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Dernier inventaire physique : 10/05/2026 — {inventaireData.filter(r => r.statut !== 'OK').length} écarts constatés</span>
            </div>
            <button className="btn btn-primary text-xs px-3 py-1.5">Lancer un inventaire</button>
          </div>
          <div className="card">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                  <th className="text-left pb-2">Code</th>
                  <th className="text-left pb-2">Désignation</th>
                  <th className="text-right pb-2">Stock théorique</th>
                  <th className="text-right pb-2">Stock physique</th>
                  <th className="text-right pb-2">Écart</th>
                  <th className="text-center pb-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {inventaireData.map(r => {
                  const ecart = r.physique - r.theorique;
                  return (
                    <tr key={r.code} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                      <td className="py-2.5 font-mono text-xs text-neutral-500">{r.code}</td>
                      <td className="py-2.5 font-medium text-neutral-800">{r.label}</td>
                      <td className="py-2.5 text-right text-neutral-600">{r.theorique}</td>
                      <td className="py-2.5 text-right font-semibold text-neutral-800">{r.physique}</td>
                      <td className={`py-2.5 text-right font-bold ${ecart === 0 ? 'text-neutral-400' : ecart > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {ecart > 0 ? '+' : ''}{ecart === 0 ? '—' : ecart}
                      </td>
                      <td className="py-2.5 text-center">
                        {r.statut === 'OK'
                          ? <span className="badge badge-green">Conforme</span>
                          : <span className="badge badge-orange">Écart</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
