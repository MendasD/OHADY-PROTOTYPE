import { useMemo, useState } from 'react';
import {
  Plus, ArrowDownLeft, ArrowUpRight, CheckCircle, Clock, XCircle,
  Send, Banknote, ArrowLeftRight, Sparkles, ChevronDown, Filter,
  FileText, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

// ─── Types ───────────────────────────────────────────────────────────────────
type ChequeStatut = 'emis' | 'remis' | 'depose' | 'preleve' | 'rejete';
type ChequeSens = 'recu' | 'emis';

interface Cheque {
  id: string;
  numero: string;
  sens: ChequeSens;
  date: string;
  tiers: string;
  banque: string;
  compte: string;
  montant: number;
  statut: ChequeStatut;
  dateRemise?: string;
  dateValeur?: string;
  reference?: string;
  motifRejet?: string;
}

const cheques: Cheque[] = [
  // Chèques reçus
  { id: 'r1', numero: '8412785',  sens: 'recu', date: '12/05/2026', tiers: 'SONES',                banque: 'SGBS',      compte: 'SGBS C/C',     montant: 8_400_000, statut: 'preleve',  dateRemise: '13/05/2026', dateValeur: '15/05/2026', reference: 'F2026-0151' },
  { id: 'r2', numero: '4521903',  sens: 'recu', date: '10/05/2026', tiers: 'Tech Solutions SARL', banque: 'Ecobank',   compte: 'SGBS C/C',     montant: 3_500_000, statut: 'depose',   dateRemise: '13/05/2026', dateValeur: '17/05/2026', reference: 'F2026-0142' },
  { id: 'r3', numero: '7889012',  sens: 'recu', date: '08/05/2026', tiers: 'Orange Sénégal',      banque: 'BICIS',     compte: 'SGBS C/C',     montant: 7_500_000, statut: 'remis',    dateRemise: '14/05/2026', reference: 'F2026-0150' },
  { id: 'r4', numero: '3344521',  sens: 'recu', date: '06/05/2026', tiers: 'AfricTech Group',     banque: 'UBA',       compte: 'CBAO Épargne', montant: 3_100_000, statut: 'remis',    dateRemise: '14/05/2026', reference: 'F2026-0152' },
  { id: 'r5', numero: '9912345',  sens: 'recu', date: '01/05/2026', tiers: 'Dakar Dem Dikk',      banque: 'BOA',       compte: 'SGBS C/C',     montant: 4_200_000, statut: 'rejete',   dateRemise: '02/05/2026', motifRejet: 'Provision insuffisante', reference: 'F2026-0148' },
  { id: 'r6', numero: '1102339',  sens: 'recu', date: '13/05/2026', tiers: 'Banque de Dakar',     banque: 'CBAO',      compte: 'SGBS C/C',     montant: 6_300_000, statut: 'emis',     reference: 'F2026-0145' },

  // Chèques émis
  { id: 'e1', numero: 'CHQ-2026-0118', sens: 'emis', date: '10/05/2026', tiers: 'COGEMATEC SARL',  banque: 'SGBS',      compte: 'SGBS C/C',     montant: 2_124_000, statut: 'preleve',  dateRemise: '11/05/2026', dateValeur: '13/05/2026', reference: 'COGE-2026-1247' },
  { id: 'e2', numero: 'CHQ-2026-0119', sens: 'emis', date: '12/05/2026', tiers: 'SETUMA',           banque: 'SGBS',      compte: 'SGBS C/C',     montant: 1_085_600, statut: 'remis',    dateRemise: '12/05/2026',                          reference: 'SET-2026-0034' },
  { id: 'e3', numero: 'CHQ-2026-0120', sens: 'emis', date: '13/05/2026', tiers: 'INDUSTRIE 2000',  banque: 'SGBS',      compte: 'SGBS C/C',     montant: 1_475_000, statut: 'emis',                                                              reference: 'IND-2026-0089' },
  { id: 'e4', numero: 'CHQ-2026-0121', sens: 'emis', date: '13/05/2026', tiers: 'Loyer Plateau SCI',banque: 'SGBS',      compte: 'SGBS C/C',     montant: 1_500_000, statut: 'depose',   dateRemise: '13/05/2026', dateValeur: '16/05/2026' },
  { id: 'e5', numero: 'CHQ-2026-0122', sens: 'emis', date: '08/05/2026', tiers: 'Cabinet Yomenou', banque: 'CBAO',      compte: 'CBAO Épargne', montant:   850_000, statut: 'preleve',  dateRemise: '08/05/2026', dateValeur: '10/05/2026' },
];

const statutMeta: Record<ChequeStatut, { label: string; cls: string; color: string; icon: React.ElementType }> = {
  emis:    { label: 'Émis',       cls: 'badge-orange', color: '#F39C12', icon: FileText },
  remis:   { label: 'Remis',      cls: 'badge-blue',   color: '#2980B9', icon: Send },
  depose:  { label: 'Déposé',     cls: 'badge-blue',   color: '#1ABC9C', icon: Clock },
  preleve: { label: 'Prélevé',    cls: 'badge-green',  color: '#27AE60', icon: CheckCircle },
  rejete:  { label: 'Rejeté',     cls: 'badge-red',    color: '#E74C3C', icon: XCircle },
};

// ─── Virements SWIFT ─────────────────────────────────────────────────────────
const swift = [
  { id: 's1', date: '13/05/2026', beneficiaire: 'TechConsult International (IRL)',  bic: 'AIBKIE2D', montant: 4_500_000, devise: 'EUR', equivXOF: 4_500_000 * 657, statut: 'confirme', motif: 'Prestation consulting Q1' },
  { id: 's2', date: '11/05/2026', beneficiaire: 'Adobe Systems Software Ireland',    bic: 'CITIE2X',  montant:   180_000, devise: 'EUR', equivXOF:   180_000 * 657, statut: 'envoye',   motif: 'Licences Creative Cloud' },
  { id: 's3', date: '13/05/2026', beneficiaire: 'AWS EMEA SARL',                     bic: 'BLPALULL', montant:   320_000, devise: 'USD', equivXOF:   320_000 * 605, statut: 'debit',    motif: 'Hosting mai 2026' },
];

const swiftMeta: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  debit:    { label: 'Débité',   cls: 'badge-orange', icon: ArrowUpRight },
  envoye:   { label: 'SWIFT envoyé', cls: 'badge-blue', icon: Send },
  confirme: { label: 'Confirmé', cls: 'badge-green', icon: CheckCircle },
};

// ─── Mouvements internes ─────────────────────────────────────────────────────
const mouvementsInternes = [
  { id: 'm1', date: '13/05/2026', source: 'Wave Business',      dest: 'Caisse principale', montant:   300_000, motif: 'Approvisionnement caisse hebdo', user: 'I. Touré' },
  { id: 'm2', date: '12/05/2026', source: 'SGBS C/C',           dest: 'Wave Business',     montant: 1_500_000, motif: 'Renflouement Wave pour règlements fournisseurs', user: 'I. Touré' },
  { id: 'm3', date: '08/05/2026', source: 'CBAO Épargne',       dest: 'SGBS C/C',          montant: 5_000_000, motif: 'Transfert pour règlement salaires', user: 'H. Cakpo' },
  { id: 'm4', date: '06/05/2026', source: 'Orange Money Pro',   dest: 'SGBS C/C',          montant:   720_000, motif: 'Rapatriement encaissements clients', user: 'I. Touré' },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Cheques() {
  const [tab, setTab] = useState<ChequeSens>('recu');
  const [filter, setFilter] = useState<'all' | ChequeStatut>('all');

  const filtered = useMemo(() =>
    cheques
      .filter(c => c.sens === tab)
      .filter(c => filter === 'all' || c.statut === filter),
    [tab, filter]
  );

  const stats = useMemo(() => {
    const recus = cheques.filter(c => c.sens === 'recu');
    const emis = cheques.filter(c => c.sens === 'emis');
    return {
      enCirculationRecus: recus.filter(c => c.statut !== 'preleve' && c.statut !== 'rejete').reduce((s, c) => s + c.montant, 0),
      enCirculationEmis:  emis.filter(c => c.statut !== 'preleve').reduce((s, c) => s + c.montant, 0),
      preleveRecus30j: recus.filter(c => c.statut === 'preleve').reduce((s, c) => s + c.montant, 0),
      rejetes: recus.filter(c => c.statut === 'rejete').reduce((s, c) => s + c.montant, 0),
    };
  }, []);

  const counts = (Object.keys(statutMeta) as ChequeStatut[]).reduce((acc, s) => {
    acc[s] = cheques.filter(c => c.sens === tab && c.statut === s).length;
    return acc;
  }, {} as Record<ChequeStatut, number>);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Banknote size={20} className="text-secondary" /> Chèques & effets
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Suivi du cycle de vie : émis → remis → déposé → prélevé · virements SWIFT · mouvements internes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><ArrowLeftRight size={12} /> Mouvement interne</button>
          <button className="btn btn-primary btn-sm">
            <Plus size={12} /> Nouveau chèque
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="En circulation — reçus" value={fmtXOF(stats.enCirculationRecus)} sub={`${cheques.filter(c => c.sens === 'recu' && c.statut !== 'preleve' && c.statut !== 'rejete').length} chèques`} tone="info" icon={ArrowDownLeft} />
        <KpiCard label="En circulation — émis" value={fmtXOF(stats.enCirculationEmis)} sub={`${cheques.filter(c => c.sens === 'emis' && c.statut !== 'preleve').length} chèques`} tone="warning" icon={ArrowUpRight} />
        <KpiCard label="Encaissés ce mois" value={fmtXOF(stats.preleveRecus30j)} sub="Prélevés clients" tone="success" icon={CheckCircle} />
        <KpiCard label="Rejetés (provision)" value={fmtXOF(stats.rejetes)} sub="Action requise" tone="danger" icon={AlertTriangle} />
      </div>

      {/* Onglets reçus / émis */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => { setTab('recu'); setFilter('all'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'recu' ? 'bg-white text-neutral-800 shadow-card' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <ArrowDownLeft size={14} /> Chèques reçus
          <span className="badge badge-green text-[10px] ml-1">{cheques.filter(c => c.sens === 'recu').length}</span>
        </button>
        <button
          onClick={() => { setTab('emis'); setFilter('all'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'emis' ? 'bg-white text-neutral-800 shadow-card' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <ArrowUpRight size={14} /> Chèques émis
          <span className="badge badge-orange text-[10px] ml-1">{cheques.filter(c => c.sens === 'emis').length}</span>
        </button>
      </div>

      {/* Filtres par statut */}
      <div className="card-sm flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wide text-neutral-500 font-semibold mr-1">Statut :</span>
        <FilterChip active={filter === 'all'} count={cheques.filter(c => c.sens === tab).length} label="Tous" onClick={() => setFilter('all')} />
        {(Object.keys(statutMeta) as ChequeStatut[]).map(s => (
          <FilterChip
            key={s}
            active={filter === s}
            count={counts[s]}
            color={statutMeta[s].color}
            label={statutMeta[s].label}
            onClick={() => setFilter(s)}
          />
        ))}
        <button className="btn btn-outline btn-sm ml-auto"><Filter size={11} /> Période, tiers…</button>
      </div>

      {/* Cycle de vie visuel */}
      <div className="card">
        <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-500 mb-3 flex items-center gap-2">
          <Sparkles size={12} className="text-secondary" /> Cycle de vie d'un chèque {tab === 'recu' ? 'reçu' : 'émis'}
        </h3>
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['emis', 'remis', 'depose', 'preleve'] as const).map((s, i) => {
            const meta = statutMeta[s];
            const Icon = meta.icon;
            return (
              <div key={s} className="flex items-center gap-1 flex-shrink-0">
                <div className="flex flex-col items-center gap-1 min-w-[100px]">
                  <div className="w-9 h-9 rounded-full grid place-items-center shadow-sm" style={{ background: meta.color, color: 'white' }}>
                    <Icon size={14} />
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-800">{meta.label}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">{counts[s]}</div>
                </div>
                {i < 3 && <ArrowRight size={14} className="text-neutral-300 flex-shrink-0" />}
              </div>
            );
          })}
          <ArrowRight size={14} className="text-neutral-200 flex-shrink-0 ml-2" />
          <div className="flex flex-col items-center gap-1 min-w-[100px]">
            <div className="w-9 h-9 rounded-full grid place-items-center bg-red-100 text-danger">
              <XCircle size={14} />
            </div>
            <div className="text-[11px] font-semibold text-neutral-800">Rejeté</div>
            <div className="text-[10px] text-neutral-500 font-mono">{counts.rejete}</div>
          </div>
        </div>
      </div>

      {/* Tableau chèques */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-700">
            {tab === 'recu' ? 'Chèques reçus' : 'Chèques émis'} · {filtered.length}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2 font-semibold">N° chèque</th>
                <th className="text-left px-2 py-2 font-semibold">Date émis.</th>
                <th className="text-left px-2 py-2 font-semibold">{tab === 'recu' ? 'Tireur' : 'Bénéficiaire'}</th>
                <th className="text-left px-2 py-2 font-semibold">Banque</th>
                <th className="text-right px-2 py-2 font-semibold">Montant</th>
                <th className="text-left px-2 py-2 font-semibold">Statut</th>
                <th className="text-left px-2 py-2 font-semibold">Date valeur</th>
                <th className="text-left px-2 py-2 font-semibold">Ref. pièce</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const meta = statutMeta[c.statut];
                const Icon = meta.icon;
                return (
                  <tr key={c.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs font-bold text-secondary">{c.numero}</span>
                    </td>
                    <td className="px-2 py-2.5 text-xs text-neutral-500 font-mono">{c.date}</td>
                    <td className="px-2 py-2.5 text-sm font-medium text-neutral-800">{c.tiers}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-neutral-700">{c.banque}</span>
                        <span className="text-[10px] text-neutral-400">{c.compte}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <span className={`font-mono text-sm font-bold ${tab === 'recu' ? 'text-success' : 'text-neutral-700'}`}>
                        {tab === 'recu' ? '+ ' : '− '}{fmt(c.montant)}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className={`inline-flex items-center gap-1 badge ${meta.cls} text-[10px]`}>
                        <Icon size={9} /> {meta.label}
                      </span>
                      {c.motifRejet && (
                        <div className="text-[10px] text-danger mt-0.5">{c.motifRejet}</div>
                      )}
                    </td>
                    <td className="px-2 py-2.5 text-xs text-neutral-500 font-mono">
                      {c.dateValeur || (c.statut === 'preleve' ? c.dateValeur : <span className="text-neutral-300">—</span>)}
                    </td>
                    <td className="px-2 py-2.5 text-xs font-mono text-neutral-500">{c.reference || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-100 border-t-2 border-neutral-300">
                <td colSpan={4} className="px-4 py-3 text-sm font-bold text-neutral-800">Total période</td>
                <td className="px-2 py-3 text-right font-mono text-sm font-bold text-secondary">
                  {fmt(filtered.reduce((s, c) => s + c.montant, 0))} XOF
                </td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Virements SWIFT */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between bg-blue-50/30">
          <div>
            <h3 className="text-sm font-bold text-neutral-700 flex items-center gap-2">
              <Send size={13} className="text-secondary" /> Virements SWIFT — Cross-border
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">Cycle : ordre → débit → SWIFT envoyé → confirmé</p>
          </div>
          <button className="btn btn-outline btn-sm"><Plus size={11} /> Nouveau SWIFT</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100">
                <th className="text-left px-4 py-2 font-semibold">Date</th>
                <th className="text-left px-2 py-2 font-semibold">Bénéficiaire</th>
                <th className="text-left px-2 py-2 font-semibold">BIC</th>
                <th className="text-right px-2 py-2 font-semibold">Montant devise</th>
                <th className="text-right px-2 py-2 font-semibold">Équiv. XOF</th>
                <th className="text-left px-2 py-2 font-semibold">Motif</th>
                <th className="text-center px-2 py-2 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {swift.map(s => {
                const meta = swiftMeta[s.statut];
                const Icon = meta.icon;
                return (
                  <tr key={s.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-4 py-2.5 text-xs text-neutral-500 font-mono">{s.date}</td>
                    <td className="px-2 py-2.5 text-sm font-medium text-neutral-800">{s.beneficiaire}</td>
                    <td className="px-2 py-2.5">
                      <span className="font-mono text-[11px] text-secondary">{s.bic}</span>
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <span className="font-mono text-xs font-bold text-neutral-800">{fmt(s.montant)}</span>
                      <span className="text-[10px] text-neutral-400 ml-1">{s.devise}</span>
                    </td>
                    <td className="px-2 py-2.5 text-right font-mono text-xs text-neutral-600">{fmt(s.equivXOF)}</td>
                    <td className="px-2 py-2.5 text-xs text-neutral-600">{s.motif}</td>
                    <td className="px-2 py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 badge ${meta.cls} text-[10px]`}>
                        <Icon size={9} /> {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mouvements internes */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between bg-purple-50/30">
          <div>
            <h3 className="text-sm font-bold text-neutral-700 flex items-center gap-2">
              <ArrowLeftRight size={13} className="text-purple-600" /> Mouvements internes — Inter-comptes
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">Banque ↔ caisse ↔ mobile money · Écritures comptables croisées générées</p>
          </div>
          <button className="btn btn-outline btn-sm border-purple-200 text-purple-700"><Plus size={11} /> Nouveau mouvement</button>
        </div>
        <div className="divide-y divide-neutral-50">
          {mouvementsInternes.map(m => (
            <div key={m.id} className="px-5 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 grid place-items-center text-purple-600 flex-shrink-0">
                <ArrowLeftRight size={13} />
              </div>
              <div className="w-20 text-xs text-neutral-500 font-mono flex-shrink-0">{m.date}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                  <span>{m.source}</span>
                  <ArrowRight size={11} className="text-neutral-400" />
                  <span>{m.dest}</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{m.motif} · {m.user}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-mono text-sm font-bold text-neutral-800">{fmt(m.montant)} XOF</div>
              </div>
              <ChevronDown size={13} className="text-neutral-300 -rotate-90" />
            </div>
          ))}
        </div>
      </div>

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-700">Analyse circulation</div>
          <ul className="mt-1.5 space-y-1 text-xs text-neutral-700">
            <li><strong>2 chèques émis</strong> (CHQ-2026-0119 SETUMA + CHQ-2026-0120 INDUSTRIE 2000) en attente de prélèvement bancaire — provisionner <strong className="text-warning">{fmt(1_085_600 + 1_475_000)} XOF</strong> sous 5 jours.</li>
            <li><strong>1 chèque rejeté</strong> (Dakar Dem Dikk, 4,2 M XOF) — relancer le client pour un nouveau moyen de paiement.</li>
            <li>Le carnet de chèques SGBS arrivera à épuisement vers le n° <strong>CHQ-2026-0135</strong> — commander un nouveau carnet anticipativement.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, tone, icon: Icon }: { label: string; value: string; sub: string; tone: 'success' | 'danger' | 'warning' | 'info' | 'primary'; icon: React.ElementType }) {
  const tones = { success: 'text-success', danger: 'text-danger', warning: 'text-warning', info: 'text-secondary', primary: 'text-primary' };
  return (
    <div className="card">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">
        <Icon size={11} className={tones[tone]} /> {label}
      </div>
      <div className={`mt-1.5 text-lg font-bold ${tones[tone]}`}>{value}</div>
      <div className="text-[11px] text-neutral-500 mt-0.5">{sub}</div>
    </div>
  );
}

function FilterChip({ label, count, color, active, onClick }: { label: string; count: number; color?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-all ${
        active
          ? 'border-secondary bg-secondary/10 text-secondary font-semibold'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
      }`}
    >
      {color && <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
      {label} <span className="font-mono text-neutral-500">({count})</span>
    </button>
  );
}
