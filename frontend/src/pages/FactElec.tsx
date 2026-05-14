import { useState } from 'react';
import {
  Send, CheckCircle, AlertCircle, Clock, Sparkles, ExternalLink, RefreshCw,
  FileText, Shield, ArrowRight, Plug,
} from 'lucide-react';
import { fmt } from '../data/mockData';

type FactStatut = 'envoyee' | 'acceptee' | 'rejetee' | 'pending';

interface FactElec {
  id: string;
  numero: string;
  date: string;
  client: string;
  ninea: string;
  montantTTC: number;
  statut: FactStatut;
  codeDgid?: string;
  dateEnvoi?: string;
  motifRejet?: string;
}

const factures: FactElec[] = [
  { id: 'f1', numero: 'F2026-0151', date: '05/05/2026', client: 'SONES',                ninea: '0010547821 B2', montantTTC:  9_912_000, statut: 'acceptee', codeDgid: 'DGID-SN-2026-051178', dateEnvoi: '05/05/2026 14:32' },
  { id: 'f2', numero: 'F2026-0150', date: '02/05/2026', client: 'Orange Sénégal',       ninea: '0012458732 A1', montantTTC:  7_500_000, statut: 'acceptee', codeDgid: 'DGID-SN-2026-051034', dateEnvoi: '02/05/2026 09:15' },
  { id: 'f3', numero: 'F2026-0152', date: '12/05/2026', client: 'AfricTech Group',      ninea: '0019874562 C3', montantTTC:  3_100_000, statut: 'envoyee', dateEnvoi: '13/05/2026 11:08' },
  { id: 'f4', numero: 'F2026-0149', date: '29/04/2026', client: 'Total Energies SN',    ninea: '0014785236 B1', montantTTC:  9_200_000, statut: 'acceptee', codeDgid: 'DGID-SN-2026-049821', dateEnvoi: '29/04/2026 16:42' },
  { id: 'f5', numero: 'F2026-0148', date: '25/04/2026', client: 'Dakar Dem Dikk',       ninea: '0017456823 A2', montantTTC:  4_956_000, statut: 'rejetee',  motifRejet: 'NINEA invalide ou inactif', dateEnvoi: '25/04/2026 10:21' },
  { id: 'f6', numero: 'F2026-0153', date: '13/05/2026', client: 'Ecobank Sénégal',      ninea: '0011245789 B2', montantTTC: 12_980_000, statut: 'pending' },
];

const statutMeta: Record<FactStatut, { label: string; cls: string; icon: React.ElementType; color: string }> = {
  acceptee: { label: 'Acceptée DGID', cls: 'badge-green', icon: CheckCircle, color: '#27AE60' },
  envoyee:  { label: 'En attente DGID', cls: 'badge-blue', icon: Send, color: '#2980B9' },
  rejetee:  { label: 'Rejetée', cls: 'badge-red', icon: AlertCircle, color: '#E74C3C' },
  pending:  { label: 'À envoyer', cls: 'badge-orange', icon: Clock, color: '#F39C12' },
};

export default function FactElec() {
  const [filter, setFilter] = useState<'all' | FactStatut>('all');

  const filtered = filter === 'all' ? factures : factures.filter(f => f.statut === filter);

  const stats = {
    accepte: factures.filter(f => f.statut === 'acceptee').length,
    envoyee: factures.filter(f => f.statut === 'envoyee').length,
    rejete: factures.filter(f => f.statut === 'rejetee').length,
    pending: factures.filter(f => f.statut === 'pending').length,
  };
  const tauxConformite = Math.round((stats.accepte / factures.length) * 100);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Shield size={20} className="text-secondary" /> Facturation électronique
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Envoi automatique à la plateforme DGID — Sénégal</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><RefreshCw size={12} /> Synchroniser</button>
          <button className="btn btn-primary btn-sm"><Send size={12} /> Envoyer en lot ({stats.pending})</button>
        </div>
      </div>

      {/* Statut connexion DGID */}
      <div className="card border-l-4 border-l-green-400 bg-green-50/30 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-green-100 grid place-items-center flex-shrink-0">
          <Plug size={16} className="text-success" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-neutral-800">Connexion DGID Sénégal — Active</span>
            <span className="badge badge-green text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-success mr-1 animate-pulse" /> En ligne
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            API e-Tax v2.4 · Certificat valide jusqu'au 30/11/2026 · Dernière synchro il y a 4 min
          </div>
        </div>
        <button className="btn btn-outline btn-sm">
          <ExternalLink size={12} /> Portail DGID
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Taux de conformité" value={`${tauxConformite} %`} sub="Cumul 2026" tone="success" />
        <KpiCard label="En attente d'envoi" value={stats.pending.toString()} sub="À envoyer manuellement" tone="warning" />
        <KpiCard label="Acceptées" value={stats.accepte.toString()} sub="Code DGID reçu" tone="info" />
        <KpiCard label="Rejetées" value={stats.rejete.toString()} sub="Action requise" tone="danger" />
      </div>

      {/* Filtres */}
      <div className="card-sm flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wide text-neutral-500 font-semibold mr-2">Filtrer :</span>
        <FilterChip active={filter === 'all'} count={factures.length} label="Toutes" onClick={() => setFilter('all')} />
        {(Object.keys(statutMeta) as FactStatut[]).map(s => (
          <FilterChip
            key={s}
            active={filter === s}
            count={factures.filter(f => f.statut === s).length}
            color={statutMeta[s].color}
            label={statutMeta[s].label}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {/* Liste */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2 font-semibold">N° Facture</th>
                <th className="text-left px-2 py-2 font-semibold">Date</th>
                <th className="text-left px-2 py-2 font-semibold">Client</th>
                <th className="text-left px-2 py-2 font-semibold">NINEA</th>
                <th className="text-right px-2 py-2 font-semibold">TTC</th>
                <th className="text-left px-2 py-2 font-semibold">Statut DGID</th>
                <th className="text-left px-2 py-2 font-semibold">Code conformité</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => {
                const meta = statutMeta[f.statut];
                const Icon = meta.icon;
                return (
                  <tr key={f.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs font-bold text-secondary">{f.numero}</span>
                    </td>
                    <td className="px-2 py-2.5 text-xs text-neutral-500 font-mono">{f.date}</td>
                    <td className="px-2 py-2.5 text-sm font-medium text-neutral-800">{f.client}</td>
                    <td className="px-2 py-2.5">
                      <span className="font-mono text-[11px] text-neutral-500">{f.ninea}</span>
                    </td>
                    <td className="px-2 py-2.5 text-right font-mono text-xs font-semibold text-neutral-800">{fmt(f.montantTTC)}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex flex-col gap-0.5">
                        <span className={`inline-flex items-center gap-1 badge ${meta.cls} text-[10px] w-fit`}>
                          <Icon size={9} /> {meta.label}
                        </span>
                        {f.dateEnvoi && <span className="text-[10px] text-neutral-400">{f.dateEnvoi}</span>}
                        {f.motifRejet && <span className="text-[10px] text-danger font-semibold">{f.motifRejet}</span>}
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      {f.codeDgid ? (
                        <span className="font-mono text-[10px] bg-green-50 text-green-700 border border-green-200 rounded px-1.5 py-0.5">{f.codeDgid}</span>
                      ) : <span className="text-neutral-300 text-xs">—</span>}
                    </td>
                    <td className="px-2 py-2.5">
                      {f.statut === 'pending' && (
                        <button className="btn btn-primary btn-sm" title="Envoyer maintenant"><Send size={11} /></button>
                      )}
                      {f.statut === 'rejetee' && (
                        <button className="btn btn-outline btn-sm" title="Corriger et renvoyer"><RefreshCw size={11} /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* IA + cycle */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-bold text-neutral-700 mb-3">Cycle de validation DGID</h3>
          <ol className="space-y-3">
            <Step n={1} title="Émission de la facture" desc="Facture créée et validée dans OHADY" status="done" />
            <Step n={2} title="Signature numérique" desc="Apposition du certificat électronique de l'entreprise" status="done" />
            <Step n={3} title="Envoi à la DGID" desc="Transmission via API e-Tax (chiffrée TLS 1.3)" status="active" />
            <Step n={4} title="Réception code conformité" desc="DGID renvoie un identifiant unique sous 24h" status="pending" />
            <Step n={5} title="Archivage légal" desc="Conservation 10 ans avec preuve d'envoi" status="pending" />
          </ol>
        </div>

        <div className="card border-l-4 border-purple-300 bg-purple-50/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-purple-500" />
            <span className="text-sm font-bold text-purple-700">Insights conformité</span>
          </div>
          <ul className="space-y-2 text-xs text-neutral-700">
            <li className="flex items-start gap-2">
              <AlertCircle size={12} className="text-warning mt-0.5 flex-shrink-0" />
              <span><strong>1 facture rejetée</strong> par la DGID (NINEA invalide). Le client Dakar Dem Dikk a-t-il changé d'identité fiscale ?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={12} className="text-success mt-0.5 flex-shrink-0" />
              <span>Délai moyen de réponse DGID : <strong>3h 28min</strong> ce mois (objectif &lt; 6h).</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText size={12} className="text-secondary mt-0.5 flex-shrink-0" />
              <span>Recommandation : activer l'envoi automatique pour gagner 2h/mois en moyenne.</span>
            </li>
          </ul>
          <button className="mt-3 btn btn-outline btn-sm border-purple-200 text-purple-700">
            Activer l'envoi auto <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: 'success' | 'danger' | 'warning' | 'info' }) {
  const tones = { success: 'text-success', danger: 'text-danger', warning: 'text-warning', info: 'text-secondary' };
  return (
    <div className="card">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">{label}</div>
      <div className={`mt-1.5 text-xl font-bold ${tones[tone]}`}>{value}</div>
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

function Step({ n, title, desc, status }: { n: number; title: string; desc: string; status: 'done' | 'active' | 'pending' }) {
  const styles = {
    done:    { bg: 'bg-success text-white', label: 'text-neutral-800' },
    active:  { bg: 'bg-secondary text-white animate-pulse', label: 'text-neutral-800' },
    pending: { bg: 'bg-neutral-200 text-neutral-500', label: 'text-neutral-500' },
  }[status];
  return (
    <li className="flex items-start gap-3">
      <div className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold flex-shrink-0 ${styles.bg}`}>
        {status === 'done' ? <CheckCircle size={14} /> : n}
      </div>
      <div className="flex-1">
        <div className={`text-sm font-semibold ${styles.label}`}>{title}</div>
        <div className="text-[11px] text-neutral-500 mt-0.5">{desc}</div>
      </div>
    </li>
  );
}
