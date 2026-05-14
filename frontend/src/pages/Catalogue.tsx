import { useMemo, useState } from 'react';
import {
  Plus, Search, Tag, Package2, Edit, Copy, Eye, ChevronDown,
  TrendingUp, Sparkles,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

type Categorie = 'service' | 'produit' | 'abonnement';

interface Article {
  id: string;
  ref: string;
  designation: string;
  categorie: Categorie;
  famille: string;
  unite: string;
  prixHT: number;
  tauxTVA: number;
  marge: number;
  stockDispo?: number;
  ventes30j: number;
  ca30j: number;
  actif: boolean;
}

const articles: Article[] = [
  { id: 'a1', ref: 'SRV-001', designation: 'Mission audit comptable — Forfait jour',     categorie: 'service',     famille: 'Audit & conseil',    unite: 'Jour',     prixHT:   150_000, tauxTVA: 18, marge: 78, ventes30j: 12, ca30j: 1_800_000, actif: true },
  { id: 'a2', ref: 'SRV-002', designation: 'Conseil fiscal SYSCOHADA',                    categorie: 'service',     famille: 'Audit & conseil',    unite: 'Heure',    prixHT:    35_000, tauxTVA: 18, marge: 82, ventes30j: 28, ca30j:    980_000, actif: true },
  { id: 'a3', ref: 'SRV-003', designation: 'Accompagnement clôture mensuelle',            categorie: 'abonnement',  famille: 'Outsourcing',        unite: 'Mois',     prixHT:   450_000, tauxTVA: 18, marge: 65, ventes30j:  6, ca30j: 2_700_000, actif: true },
  { id: 'a4', ref: 'SRV-004', designation: 'Formation IFRS sur site',                     categorie: 'service',     famille: 'Formation',           unite: 'Jour',     prixHT:   280_000, tauxTVA: 18, marge: 72, ventes30j:  4, ca30j: 1_120_000, actif: true },
  { id: 'a5', ref: 'PRD-101', designation: 'Licence OHADY Standard',                      categorie: 'abonnement',  famille: 'Software',            unite: 'Utilisateur',prixHT: 25_000, tauxTVA: 18, marge: 88, ventes30j: 35, ca30j:    875_000, actif: true },
  { id: 'a6', ref: 'PRD-102', designation: 'Licence OHADY Pro',                           categorie: 'abonnement',  famille: 'Software',            unite: 'Utilisateur',prixHT: 45_000, tauxTVA: 18, marge: 88, ventes30j: 12, ca30j:    540_000, actif: true },
  { id: 'a7', ref: 'PRD-201', designation: 'Pack démarrage entreprise (livraison)',       categorie: 'produit',     famille: 'Pack & matériel',    unite: 'Unité',    prixHT: 1_250_000, tauxTVA: 18, marge: 22, stockDispo: 8, ventes30j: 2, ca30j: 2_500_000, actif: true },
  { id: 'a8', ref: 'PRD-202', designation: 'Imprimante laser Brother HL-L8260',           categorie: 'produit',     famille: 'Pack & matériel',    unite: 'Unité',    prixHT:   295_000, tauxTVA: 18, marge: 18, stockDispo: 12, ventes30j: 3, ca30j:    885_000, actif: false },
  { id: 'a9', ref: 'SRV-005', designation: 'Hotline support utilisateur 24/7',            categorie: 'abonnement',  famille: 'Support',             unite: 'Mois',     prixHT:    85_000, tauxTVA: 18, marge: 70, ventes30j: 22, ca30j: 1_870_000, actif: true },
];

const familles = ['Audit & conseil', 'Outsourcing', 'Formation', 'Software', 'Pack & matériel', 'Support'];

const categorieMeta: Record<Categorie, { label: string; color: string; bg: string; cls: string }> = {
  service:    { label: 'Service',    color: '#2980B9', bg: 'bg-blue-50',   cls: 'badge-blue' },
  produit:    { label: 'Produit',    color: '#E67E22', bg: 'bg-orange-50', cls: 'badge-orange' },
  abonnement: { label: 'Abonnement', color: '#9B59B6', bg: 'bg-purple-50', cls: 'badge-blue' },
};

export default function Catalogue() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<Categorie | 'all'>('all');
  const [activeFam, setActiveFam] = useState<string | 'all'>('all');

  const filtered = articles.filter(a =>
    (activeCat === 'all' || a.categorie === activeCat) &&
    (activeFam === 'all' || a.famille === activeFam) &&
    (!search || a.designation.toLowerCase().includes(search.toLowerCase()) || a.ref.includes(search))
  );

  const stats = useMemo(() => ({
    total: articles.length,
    actifs: articles.filter(a => a.actif).length,
    ca30j: articles.reduce((s, a) => s + a.ca30j, 0),
    margeMoy: Math.round(articles.reduce((s, a) => s + a.marge, 0) / articles.length),
    bestseller: [...articles].sort((a, b) => b.ca30j - a.ca30j)[0],
  }), []);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Tag size={20} className="text-secondary" /> Catalogue produits & services
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">{articles.length} articles · {familles.length} familles</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Copy size={12} /> Dupliquer</button>
          <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouvel article</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Articles actifs" value={`${stats.actifs} / ${stats.total}`} sub="Référencés au catalogue" tone="info" />
        <KpiCard label="CA 30 derniers jours" value={fmtXOF(stats.ca30j)} sub="Tous articles confondus" tone="success" />
        <KpiCard label="Marge moyenne" value={`${stats.margeMoy} %`} sub="Marge HT pondérée" tone="primary" />
        <KpiCard label="Bestseller" value={stats.bestseller.ref} sub={stats.bestseller.designation.slice(0, 32) + '...'} tone="warning" />
      </div>

      {/* Filtres */}
      <div className="card-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-8 py-1.5 text-xs" placeholder="Réf. ou désignation..."
          />
        </div>
        <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5">
          <button onClick={() => setActiveCat('all')} className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${activeCat === 'all' ? 'bg-secondary text-white shadow-sm' : 'text-neutral-600'}`}>
            Tous
          </button>
          {(Object.keys(categorieMeta) as Categorie[]).map(c => (
            <button
              key={c} onClick={() => setActiveCat(c)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${activeCat === c ? 'bg-secondary text-white shadow-sm' : 'text-neutral-600'}`}
            >
              {categorieMeta[c].label}
            </button>
          ))}
        </div>
        <select
          value={activeFam} onChange={e => setActiveFam(e.target.value)}
          className="select text-xs py-1.5 w-auto"
        >
          <option value="all">Toutes familles</option>
          {familles.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <span className="text-[11px] text-neutral-500 ml-auto">{filtered.length} résultats</span>
      </div>

      {/* Grid catalogue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(a => {
          const meta = categorieMeta[a.categorie];
          return (
            <div key={a.id} className={`card !p-0 overflow-hidden transition-all hover:shadow-card-md ${!a.actif ? 'opacity-60' : ''}`}>
              {/* Header */}
              <div className={`px-4 py-3 border-b border-neutral-100 ${meta.bg} flex items-start justify-between gap-2`}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold" style={{ color: meta.color }}>{a.ref}</span>
                    <span className={`badge ${meta.cls} text-[10px]`}>{meta.label}</span>
                    {!a.actif && <span className="badge badge-gray text-[10px]">Inactif</span>}
                  </div>
                </div>
                <button className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0">
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="px-4 py-3">
                <h3 className="text-sm font-bold text-neutral-800 leading-snug min-h-[2.5rem]">{a.designation}</h3>
                <div className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1.5">
                  <Package2 size={10} /> {a.famille}
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-bold text-neutral-800 font-mono">{fmt(a.prixHT)}</span>
                      <span className="text-[11px] text-neutral-500 ml-1">XOF / {a.unite}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">TVA {a.tauxTVA}%</span>
                  </div>
                  <div className="text-[11px] text-neutral-600 mt-1 flex items-center gap-1">
                    TTC : <span className="font-mono font-semibold">{fmt(a.prixHT * (1 + a.tauxTVA / 100))} XOF</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg bg-neutral-50/50 px-2 py-1.5">
                    <div className="text-neutral-400 text-[10px]">Marge</div>
                    <div className={`font-bold ${a.marge >= 50 ? 'text-success' : a.marge >= 25 ? 'text-secondary' : 'text-warning'}`}>{a.marge} %</div>
                  </div>
                  <div className="rounded-lg bg-neutral-50/50 px-2 py-1.5">
                    <div className="text-neutral-400 text-[10px]">CA 30j</div>
                    <div className="font-bold text-neutral-700 font-mono">{fmt(a.ca30j)}</div>
                  </div>
                </div>

                {a.stockDispo !== undefined && (
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span className="text-neutral-500">Stock dispo :</span>
                    <span className={`font-bold ${a.stockDispo < 5 ? 'text-warning' : 'text-success'}`}>{a.stockDispo} {a.unite.toLowerCase()}{a.stockDispo > 1 ? 's' : ''}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
                  <TrendingUp size={11} className="text-success" /> {a.ventes30j} ventes sur 30j
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50/30 flex items-center gap-1">
                <button className="flex-1 btn btn-outline btn-sm justify-center"><Eye size={11} /> Voir</button>
                <button className="btn btn-outline btn-sm"><Edit size={11} /></button>
                <button className="btn btn-outline btn-sm"><Copy size={11} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-700">Recommandation IA</div>
          <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
            La <strong>Licence OHADY Standard</strong> (PRD-101) génère 35 ventes/mois pour un panier moyen modeste.
            En la combinant avec <strong>Hotline support 24/7</strong> (SRV-005) en bundle, vous pourriez augmenter la marge globale de 8 points.
            <br />
            <span className="text-neutral-500">L'<strong>Imprimante Brother HL-L8260</strong> a été désactivée mais a généré 0 ventes en 60j — confirmer la mise hors catalogue ?</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: 'success' | 'danger' | 'warning' | 'info' | 'primary' }) {
  const tones = { success: 'text-success', danger: 'text-danger', warning: 'text-warning', info: 'text-secondary', primary: 'text-primary' };
  return (
    <div className="card">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">{label}</div>
      <div className={`mt-1.5 text-lg font-bold ${tones[tone]}`}>{value}</div>
      <div className="text-[11px] text-neutral-500 mt-0.5 truncate">{sub}</div>
    </div>
  );
}
