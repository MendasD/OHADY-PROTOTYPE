import { useState } from 'react';
import {
  FileText, Download, Plus, Filter, AlertTriangle, CheckCircle,
  Sparkles, ArrowRight, Calendar,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

type RetenueType = 'BRS' | 'IRPP' | 'RAS-NR' | 'TOM';
const types: { id: RetenueType; label: string; tx: string; color: string; description: string }[] = [
  { id: 'BRS', label: 'BRS — Bordereau retenue à la source', tx: '5–15 %', color: '#E67E22', description: 'Sur prestations services (audit, conseil, IT) au Sénégal' },
  { id: 'IRPP', label: 'IRPP — Impôt sur revenu',            tx: '0–43 %', color: '#9B59B6', description: 'Retenue mensuelle sur salaires (barème progressif)' },
  { id: 'RAS-NR', label: 'RAS Non-Résidents',                tx: '10–25 %', color: '#E74C3C', description: 'Retenue sur prestations facturées par fournisseurs étrangers' },
  { id: 'TOM', label: 'TOM — Taxe d\'enlèvement',            tx: 'Forfait', color: '#2980B9', description: 'Taxe communale sur ordures ménagères' },
];

interface Retenue {
  id: string;
  date: string;
  type: RetenueType;
  beneficiaire: string;
  baseHT: number;
  taux: number;
  retenue: number;
  reference: string;
  statut: 'a_verser' | 'verse' | 'declare';
}

const retenues: Retenue[] = [
  { id: 'r1', date: '02/05/2026', type: 'BRS',     beneficiaire: 'COGEMATEC SARL',           baseHT: 1_800_000, taux: 5,  retenue:  90_000, reference: 'F-COGE-2026-1247', statut: 'a_verser' },
  { id: 'r2', date: '05/05/2026', type: 'BRS',     beneficiaire: 'SETUMA',                    baseHT:   920_000, taux: 5,  retenue:  46_000, reference: 'F-SET-2026-0034',  statut: 'a_verser' },
  { id: 'r3', date: '08/05/2026', type: 'RAS-NR',  beneficiaire: 'TechConsult International', baseHT: 4_500_000, taux: 20, retenue: 900_000, reference: 'F-TCI-IRL-2026-08', statut: 'declare' },
  { id: 'r4', date: '10/04/2026', type: 'BRS',     beneficiaire: 'INDUSTRIE 2000',            baseHT: 1_250_000, taux: 5,  retenue:  62_500, reference: 'F-IND-2026-0089',  statut: 'verse' },
  { id: 'r5', date: '01/05/2026', type: 'IRPP',    beneficiaire: 'Masse salariale mai',        baseHT: 5_850_000, taux: 12.5, retenue: 731_250, reference: 'PAIE-2026-05',    statut: 'verse' },
  { id: 'r6', date: '15/04/2026', type: 'TOM',     beneficiaire: 'Mairie de Dakar',           baseHT:   500_000, taux: 0,  retenue: 125_000, reference: 'TOM-2026-Q2',      statut: 'verse' },
];

const statutMeta: Record<Retenue['statut'], { label: string; cls: string }> = {
  a_verser: { label: 'À verser',  cls: 'badge-orange' },
  declare:  { label: 'Déclarée',  cls: 'badge-blue' },
  verse:    { label: 'Versée',    cls: 'badge-green' },
};

export default function Retenues() {
  const [activeType, setActiveType] = useState<RetenueType | 'all'>('all');

  const filtered = activeType === 'all' ? retenues : retenues.filter(r => r.type === activeType);

  const totalAVerser = retenues.filter(r => r.statut === 'a_verser').reduce((s, r) => s + r.retenue, 0);
  const totalDeclare = retenues.filter(r => r.statut === 'declare').reduce((s, r) => s + r.retenue, 0);
  const totalAnnuel = retenues.reduce((s, r) => s + r.retenue, 0);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Retenues à la source</h1>
          <p className="text-sm text-neutral-500 mt-0.5">BRS · IRPP · RAS non-résidents · TOM — Réglementation DGID Sénégal</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Download size={12} /> Bordereau DGID</button>
          <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouvelle retenue</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="À verser ce mois" value={fmtXOF(totalAVerser)} tone="warning" sub="2 retenues BRS en attente" />
        <KpiCard label="Déclarées en cours" value={fmtXOF(totalDeclare)} tone="info" sub="1 RAS non-résident" />
        <KpiCard label="Total versé cumulé 2026" value={fmtXOF(retenues.filter(r => r.statut === 'verse').reduce((s, r) => s + r.retenue, 0))} tone="success" sub="3 retenues" />
        <KpiCard label="Cumul annuel" value={fmtXOF(totalAnnuel)} tone="primary" sub={`${retenues.length} retenues`} />
      </div>

      {/* Types de retenues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {types.map(t => {
          const count = retenues.filter(r => r.type === t.id).length;
          const total = retenues.filter(r => r.type === t.id).reduce((s, r) => s + r.retenue, 0);
          return (
            <button
              key={t.id}
              onClick={() => setActiveType(activeType === t.id ? 'all' : t.id)}
              className={`card text-left transition-all hover:shadow-card-md ${activeType === t.id ? 'ring-2 ring-secondary/40' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: t.color }}>{t.id}</span>
                <span className="text-[10px] text-neutral-400">Taux {t.tx}</span>
              </div>
              <div className="text-[11px] text-neutral-700 font-medium leading-snug min-h-[2.5rem]">{t.label.split('—')[1]?.trim() || t.label}</div>
              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-baseline justify-between">
                <span className="text-[11px] text-neutral-500">{count} retenue{count > 1 ? 's' : ''}</span>
                <span className="text-sm font-bold font-mono" style={{ color: t.color }}>{fmt(total)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tableau */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-neutral-700">Retenues détaillées</h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {activeType === 'all' ? `${retenues.length} retenues toutes catégories` : `Filtré : ${activeType} (${filtered.length} retenues)`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline btn-sm"><Filter size={12} /> Période</button>
            {activeType !== 'all' && (
              <button onClick={() => setActiveType('all')} className="btn btn-outline btn-sm">Réinitialiser</button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2 font-semibold">Date</th>
                <th className="text-left px-2 py-2 font-semibold">Type</th>
                <th className="text-left px-2 py-2 font-semibold">Bénéficiaire</th>
                <th className="text-left px-2 py-2 font-semibold">Référence</th>
                <th className="text-right px-2 py-2 font-semibold">Base HT</th>
                <th className="text-right px-2 py-2 font-semibold">Taux</th>
                <th className="text-right px-2 py-2 font-semibold">Retenue</th>
                <th className="text-center px-2 py-2 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const type = types.find(t => t.id === r.type)!;
                const st = statutMeta[r.statut];
                return (
                  <tr key={r.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-4 py-2.5 text-xs text-neutral-500 font-mono">{r.date}</td>
                    <td className="px-2 py-2.5">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded text-white" style={{ background: type.color }}>{r.type}</span>
                    </td>
                    <td className="px-2 py-2.5 text-sm font-semibold text-neutral-800">{r.beneficiaire}</td>
                    <td className="px-2 py-2.5 text-xs font-mono text-neutral-500">{r.reference}</td>
                    <td className="px-2 py-2.5 text-right font-mono text-xs text-neutral-700">{fmt(r.baseHT)}</td>
                    <td className="px-2 py-2.5 text-right font-mono text-xs text-neutral-500">{r.taux} %</td>
                    <td className="px-2 py-2.5 text-right font-mono text-sm font-bold" style={{ color: type.color }}>{fmt(r.retenue)}</td>
                    <td className="px-2 py-2.5 text-center">
                      <span className={`badge ${st.cls} text-[10px]`}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-100 border-t-2 border-neutral-300">
                <td colSpan={6} className="px-4 py-3 text-sm font-bold text-neutral-800">Total période</td>
                <td className="px-2 py-3 text-right font-mono text-sm font-bold text-secondary">{fmt(filtered.reduce((s, r) => s + r.retenue, 0))} XOF</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Échéances + IA */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-bold text-neutral-700 mb-3 flex items-center gap-2">
            <Calendar size={14} className="text-secondary" /> Échéances de versement
          </h3>
          <ul className="space-y-2">
            <Echeance date="15 mai 2026" libelle="Bordereau BRS avril 2026" montant={62_500} statut="verse" />
            <Echeance date="15 juin 2026" libelle="Bordereau BRS mai 2026" montant={136_000} statut="a_venir" />
            <Echeance date="15 juin 2026" libelle="IRPP mai 2026 (paie)" montant={731_250} statut="a_venir" />
            <Echeance date="30 juin 2026" libelle="RAS non-résidents Q2" montant={900_000} statut="declare" />
          </ul>
        </div>
        <div className="card border-l-4 border-purple-300 bg-purple-50/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-purple-500" />
            <span className="text-sm font-bold text-purple-700">Conformité fiscale — IA</span>
          </div>
          <p className="text-xs text-neutral-700 leading-relaxed">
            <strong>3 factures fournisseurs étrangers</strong> détectées sans retenue RAS-NR (8,2 M XOF cumulés).
            <br />
            La convention fiscale Sénégal-France/Irlande prévoit un taux de retenue de <strong>20 %</strong> sur les prestations
            de service. Estimation à régulariser : <strong className="text-purple-700">1,64 M XOF</strong>.
          </p>
          <button className="mt-3 btn btn-outline btn-sm border-purple-200 text-purple-700">
            Voir les 3 factures concernées <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, tone, sub }: { label: string; value: string; tone: 'success' | 'danger' | 'warning' | 'info' | 'primary'; sub: string }) {
  const tones = { success: 'text-success', danger: 'text-danger', warning: 'text-warning', info: 'text-secondary', primary: 'text-primary' };
  return (
    <div className="card">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">{label}</div>
      <div className={`mt-1.5 text-lg font-bold font-mono ${tones[tone]}`}>{value}</div>
      <div className="text-[11px] text-neutral-500 mt-0.5">{sub}</div>
    </div>
  );
}

function Echeance({ date, libelle, montant, statut }: { date: string; libelle: string; montant: number; statut: 'verse' | 'declare' | 'a_venir' }) {
  const meta = {
    verse:   { color: 'text-success', icon: CheckCircle, label: 'Versé' },
    declare: { color: 'text-secondary', icon: FileText, label: 'Déclaré' },
    a_venir: { color: 'text-warning', icon: AlertTriangle, label: 'À venir' },
  }[statut];
  const Icon = meta.icon;
  return (
    <li className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0">
      <Icon size={14} className={`${meta.color} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-neutral-800 truncate">{libelle}</div>
        <div className="text-[10px] text-neutral-500">{date}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-mono font-bold text-neutral-700">{fmt(montant)}</div>
        <div className={`text-[10px] ${meta.color} font-semibold`}>{meta.label}</div>
      </div>
    </li>
  );
}
