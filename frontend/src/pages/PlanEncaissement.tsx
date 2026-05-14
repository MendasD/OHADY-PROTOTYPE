import { useState } from 'react';
import {
  Calendar, Plus, RotateCcw, FileText, ArrowRight, CheckCircle, Clock,
  AlertTriangle, Sparkles, Repeat, Percent, MoreVertical,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

type Tab = 'plans' | 'recurrentes' | 'echeanciers' | 'escompte';

// Plans d'encaissement par client (acomptes)
interface PlanAcompte {
  id: string;
  client: string;
  facture: string;
  total: number;
  acomptes: { numero: number; montant: number; date: string; statut: 'paye' | 'a_venir' | 'retard' }[];
}

const plansEncaissement: PlanAcompte[] = [
  { id: 'p1', client: 'SONES', facture: 'F2026-0151', total: 9_912_000,
    acomptes: [
      { numero: 1, montant: 4_956_000, date: '15/05/2026', statut: 'paye' },
      { numero: 2, montant: 4_956_000, date: '15/06/2026', statut: 'a_venir' },
    ] },
  { id: 'p2', client: 'Orange Sénégal', facture: 'F2026-0150', total: 7_500_000,
    acomptes: [
      { numero: 1, montant: 2_500_000, date: '20/04/2026', statut: 'paye' },
      { numero: 2, montant: 2_500_000, date: '20/05/2026', statut: 'paye' },
      { numero: 3, montant: 2_500_000, date: '20/06/2026', statut: 'a_venir' },
    ] },
  { id: 'p3', client: 'Ministère Finances', facture: 'F2026-0143', total: 12_600_000,
    acomptes: [
      { numero: 1, montant: 6_300_000, date: '10/04/2026', statut: 'retard' },
      { numero: 2, montant: 6_300_000, date: '10/05/2026', statut: 'retard' },
    ] },
];

// Factures récurrentes
interface FactureRecurrente {
  id: string;
  nom: string;
  client: string;
  montant: number;
  periodicite: 'mensuelle' | 'trimestrielle' | 'annuelle';
  prochaineDate: string;
  prochaineDateLabel: string;
  contratDebut: string;
  contratFin: string;
  totalEmis: number;
  actif: boolean;
}

const recurrentes: FactureRecurrente[] = [
  { id: 'r1', nom: 'Support OHADY Pro',         client: 'SONES',                 montant:    450_000, periodicite: 'mensuelle',  prochaineDate: '01/06/2026', prochaineDateLabel: 'dans 18 jours', contratDebut: '01/01/2026', contratFin: '31/12/2026', totalEmis:  2_250_000, actif: true },
  { id: 'r2', nom: 'Outsourcing comptabilité', client: 'Tech Solutions SARL',    montant:    850_000, periodicite: 'mensuelle',  prochaineDate: '01/06/2026', prochaineDateLabel: 'dans 18 jours', contratDebut: '01/03/2026', contratFin: '28/02/2027', totalEmis:  2_550_000, actif: true },
  { id: 'r3', nom: 'Licences Adobe Cloud (12 postes)', client: 'AfricTech Group', montant:    320_000, periodicite: 'mensuelle',  prochaineDate: '05/06/2026', prochaineDateLabel: 'dans 22 jours', contratDebut: '05/02/2026', contratFin: '04/02/2027', totalEmis:  1_280_000, actif: true },
  { id: 'r4', nom: 'Hébergement & infogérance', client: 'Banque de Dakar',       montant:  1_200_000, periodicite: 'trimestrielle', prochaineDate: '01/07/2026', prochaineDateLabel: 'dans 48 jours', contratDebut: '01/01/2025', contratFin: '31/12/2026', totalEmis:  6_000_000, actif: true },
  { id: 'r5', nom: 'Mission audit annuelle',    client: 'Sonatel SA',             montant:  4_500_000, periodicite: 'annuelle',   prochaineDate: '01/01/2027', prochaineDateLabel: 'dans 232 jours',contratDebut: '01/01/2024', contratFin: '31/12/2027', totalEmis: 13_500_000, actif: true },
];

// Échéanciers en N fois
interface Echeancier {
  id: string;
  client: string;
  facture: string;
  total: number;
  nbEcheances: number;
  prochaineDate: string;
  prochaineMontant: number;
  payees: number;
  totalPaye: number;
}

const echeanciers: Echeancier[] = [
  { id: 'e1', client: 'Garage Loubet & Frères', facture: 'F2026-0099', total: 8_400_000, nbEcheances: 6, prochaineDate: '15/06/2026', prochaineMontant: 1_400_000, payees: 2, totalPaye: 2_800_000 },
  { id: 'e2', client: 'Pharmacie du Plateau',    facture: 'F2026-0112', total: 4_200_000, nbEcheances: 4, prochaineDate: '01/06/2026', prochaineMontant: 1_050_000, payees: 1, totalPaye: 1_050_000 },
  { id: 'e3', client: 'NDS Communication',       facture: 'F2026-0120', total: 12_500_000, nbEcheances: 10, prochaineDate: '20/05/2026', prochaineMontant: 1_250_000, payees: 5, totalPaye: 6_250_000 },
];

const statutMeta = {
  paye:    { label: 'Payé',   cls: 'badge-green',  icon: CheckCircle },
  a_venir: { label: 'À venir', cls: 'badge-blue',   icon: Clock },
  retard:  { label: 'Retard',  cls: 'badge-red',    icon: AlertTriangle },
};

export default function PlanEncaissement() {
  const [tab, setTab] = useState<Tab>('plans');

  const totalRecurrent = recurrentes.reduce((s, r) => s + (r.periodicite === 'mensuelle' ? r.montant * 12 : r.periodicite === 'trimestrielle' ? r.montant * 4 : r.montant), 0);
  const totalEcheances = echeanciers.reduce((s, e) => s + (e.total - e.totalPaye), 0);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Calendar size={20} className="text-secondary" /> Plans d'encaissement
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Acomptes contractuels · Factures récurrentes · Échéanciers en N fois · Escompte</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouveau plan</button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Plans actifs (acomptes)" value={plansEncaissement.length.toString()} sub={`${plansEncaissement.reduce((s, p) => s + p.acomptes.length, 0)} acomptes contractés`} tone="info" />
        <KpiCard label="Récurrentes — CA annuel" value={fmtXOF(totalRecurrent)} sub={`${recurrentes.length} contrats actifs`} tone="success" />
        <KpiCard label="Échéanciers — restant dû" value={fmtXOF(totalEcheances)} sub={`${echeanciers.length} échéanciers en cours`} tone="warning" />
        <KpiCard label="Escompte appliqué (mai)" value={fmtXOF(125_000)} sub="3 paiements anticipés" tone="primary" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        {[
          { id: 'plans',        label: 'Plans d\'acomptes',     icon: Calendar },
          { id: 'recurrentes',  label: 'Factures récurrentes',  icon: Repeat },
          { id: 'echeanciers',  label: 'Échéanciers en N fois', icon: RotateCcw },
          { id: 'escompte',     label: 'Escompte anticipé',     icon: Percent },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-white text-neutral-800 shadow-card' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Plans d'acomptes */}
      {tab === 'plans' && (
        <div className="space-y-3">
          {plansEncaissement.map(p => {
            const paye = p.acomptes.filter(a => a.statut === 'paye').reduce((s, a) => s + a.montant, 0);
            const pct = Math.round((paye / p.total) * 100);
            return (
              <div key={p.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-800">{p.client}</span>
                      <span className="font-mono text-[11px] text-secondary">{p.facture}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {p.acomptes.length} acomptes · Total {fmt(p.total)} XOF
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Encaissé</div>
                    <div className="text-sm font-bold text-success font-mono">{fmt(paye)} / {fmt(p.total)}</div>
                  </div>
                </div>

                {/* Progression */}
                <div className="mt-3 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1 text-right text-[10px] text-neutral-500">{pct} % encaissé</div>

                {/* Acomptes */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  {p.acomptes.map(a => {
                    const meta = statutMeta[a.statut];
                    const Icon = meta.icon;
                    return (
                      <div key={a.numero} className={`rounded-lg border p-3 ${
                        a.statut === 'paye' ? 'border-green-200 bg-green-50/40' :
                        a.statut === 'retard' ? 'border-red-200 bg-red-50/40' :
                        'border-blue-200 bg-blue-50/40'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wide text-neutral-500 font-semibold">Acompte {a.numero}</span>
                          <span className={`badge ${meta.cls} text-[10px]`}>
                            <Icon size={9} /> {meta.label}
                          </span>
                        </div>
                        <div className="mt-1.5 text-sm font-bold text-neutral-800 font-mono">{fmt(a.montant)}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">{a.date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Factures récurrentes */}
      {tab === 'recurrentes' && (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-2 font-semibold">Contrat</th>
                  <th className="text-left px-2 py-2 font-semibold">Client</th>
                  <th className="text-center px-2 py-2 font-semibold">Périodicité</th>
                  <th className="text-right px-2 py-2 font-semibold">Montant</th>
                  <th className="text-left px-2 py-2 font-semibold">Prochaine émission</th>
                  <th className="text-left px-2 py-2 font-semibold">Période contrat</th>
                  <th className="text-right px-2 py-2 font-semibold">Cumul émis</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {recurrentes.map(r => (
                  <tr key={r.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Repeat size={13} className="text-secondary" />
                        <span className="text-sm font-semibold text-neutral-800">{r.nom}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-sm text-neutral-700">{r.client}</td>
                    <td className="px-2 py-2.5 text-center">
                      <span className={`badge text-[10px] ${
                        r.periodicite === 'mensuelle' ? 'badge-blue' :
                        r.periodicite === 'trimestrielle' ? 'badge-orange' : 'badge-green'
                      }`}>{r.periodicite}</span>
                    </td>
                    <td className="px-2 py-2.5 text-right font-mono text-sm font-bold text-neutral-800">{fmt(r.montant)}</td>
                    <td className="px-2 py-2.5">
                      <div className="text-xs text-neutral-700 font-mono">{r.prochaineDate}</div>
                      <div className="text-[10px] text-neutral-500">{r.prochaineDateLabel}</div>
                    </td>
                    <td className="px-2 py-2.5 text-[11px] text-neutral-500">
                      {r.contratDebut} → {r.contratFin}
                    </td>
                    <td className="px-2 py-2.5 text-right font-mono text-xs text-success font-semibold">{fmt(r.totalEmis)}</td>
                    <td className="px-2 py-2.5">
                      <button className="btn btn-outline btn-sm"><MoreVertical size={11} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Échéanciers */}
      {tab === 'echeanciers' && (
        <div className="space-y-3">
          {echeanciers.map(e => {
            const pct = Math.round((e.totalPaye / e.total) * 100);
            return (
              <div key={e.id} className="card">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-neutral-800">{e.client}</span>
                      <span className="font-mono text-[11px] text-secondary">{e.facture}</span>
                      <span className="badge badge-blue text-[10px]">Paiement en {e.nbEcheances} fois</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Total : <strong className="text-neutral-700">{fmt(e.total)} XOF</strong> · {e.payees} / {e.nbEcheances} échéances payées
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Prochaine échéance</div>
                    <div className="text-sm font-bold text-secondary">{e.prochaineDate}</div>
                    <div className="text-xs font-mono font-semibold text-neutral-800">{fmt(e.prochaineMontant)} XOF</div>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-neutral-500">
                  <span>{fmt(e.totalPaye)} encaissés</span>
                  <span>{pct} %</span>
                  <span>Reste {fmt(e.total - e.totalPaye)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Escompte */}
      {tab === 'escompte' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-bold text-neutral-700 mb-3">Politique d'escompte</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <EscompteCard label="Paiement comptant" reduction="2 %" delay="Sous 8 j" />
              <EscompteCard label="Paiement anticipé" reduction="1 %" delay="Sous 15 j" />
              <EscompteCard label="Paiement à échéance" reduction="0 %" delay="30-60 j" />
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-bold text-neutral-700 mb-3">Escomptes accordés ce mois</h3>
            <div className="space-y-2">
              {[
                { client: 'SONES', facture: 'F2026-0151', baseHT: 8_400_000, taux: 2, escompte: 168_000, paye: '08/05/2026' },
                { client: 'Orange Sénégal', facture: 'F2026-0150', baseHT: 6_355_932, taux: 1, escompte: 63_559, paye: '12/05/2026' },
                { client: 'AfricTech Group', facture: 'F2026-0152', baseHT: 2_627_119, taux: 2, escompte: 52_542, paye: '13/05/2026' },
              ].map((e, i) => (
                <div key={i} className="rounded-lg border border-neutral-100 px-4 py-2.5 flex items-center gap-3 bg-neutral-50/40">
                  <Percent size={13} className="text-secondary" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-neutral-800">{e.client}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">{e.facture} · Base HT {fmt(e.baseHT)} · Taux {e.taux}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-success">− {fmt(e.escompte)} XOF</div>
                    <div className="text-[10px] text-neutral-500">Payé {e.paye}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-700">Optimisation encaissements</div>
          <ul className="mt-1.5 space-y-1 text-xs text-neutral-700">
            <li>Le Ministère des Finances a <strong className="text-danger">2 acomptes en retard</strong> ({fmt(12_600_000)} XOF) — escalader en direct DAF ?</li>
            <li>L'escompte à 2% appliqué génère <strong>{fmt(284_101)} XOF de remise</strong> mais accélère l'encaissement de 22 jours en moyenne (impact BFR positif).</li>
            <li>{recurrentes.length} contrats récurrents = <strong>{fmt(totalRecurrent)} XOF garantis annuellement</strong>. Renouveler proactivement avant échéance.</li>
          </ul>
          <button className="mt-3 btn btn-outline btn-sm border-purple-200 text-purple-700">
            Lancer la campagne anti-retard <ArrowRight size={12} />
          </button>
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
      <div className={`mt-1.5 text-lg font-bold ${tones[tone]} truncate`}>{value}</div>
      <div className="text-[11px] text-neutral-500 mt-0.5">{sub}</div>
    </div>
  );
}

function EscompteCard({ label, reduction, delay }: { label: string; reduction: string; delay: string }) {
  return (
    <div className="rounded-xl border-2 border-neutral-100 bg-neutral-50/40 p-4 text-center hover:border-secondary transition-all">
      <Percent size={20} className="mx-auto text-secondary" />
      <div className="mt-2 text-2xl font-bold text-secondary font-mono">{reduction}</div>
      <div className="text-xs font-semibold text-neutral-700 mt-1">{label}</div>
      <div className="text-[10px] text-neutral-500 mt-0.5">{delay}</div>
      <button className="mt-3 btn btn-outline btn-sm w-full justify-center">
        <FileText size={11} /> Configurer
      </button>
    </div>
  );
}
