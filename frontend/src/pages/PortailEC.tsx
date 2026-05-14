import { useState } from 'react';
import {
  Building2, Search, Filter, Sparkles, AlertTriangle, CheckCircle, Clock,
  ArrowRight, FileText, Users, MoreVertical, Plus, ExternalLink, Lock,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

interface Dossier {
  id: string;
  code: string;
  nom: string;
  secteur: string;
  exercice: string;
  collaborateur: string;
  collaborateurInitiales: string;
  collaborateurColor: string;
  ca: number;
  anomalies: number;
  cloture: 'cloturee' | 'en_cours' | 'a_demarrer' | 'retard';
  echeance: string;
  pays: string;
  syscohada: 'Normal' | 'Allégé' | 'SMT';
  derniereAction: string;
  taches: number;
  alertes: { type: 'warn' | 'danger' | 'info'; label: string }[];
}

const dossiers: Dossier[] = [
  { id: 'd1', code: 'TS-2026', nom: 'Tech Solutions SARL', secteur: 'Conseil & ingénierie', exercice: '2025-2026', collaborateur: 'Issa Yomenou', collaborateurInitiales: 'IY', collaborateurColor: '#16A085', ca: 380_400_000, anomalies: 2, cloture: 'en_cours', echeance: '15/09/2026', pays: 'Sénégal', syscohada: 'Normal', derniereAction: 'Il y a 2h — Revue compte 41100', taches: 3,
    alertes: [{ type: 'warn', label: 'TVA mai en retard' }, { type: 'info', label: 'Liasse DSF à valider' }] },
  { id: 'd2', code: 'AKW-2026', nom: 'AKWABA Services', secteur: 'Conseil & ingénierie', exercice: '2025-2026', collaborateur: 'Issa Yomenou', collaborateurInitiales: 'IY', collaborateurColor: '#16A085', ca: 145_200_000, anomalies: 0, cloture: 'cloturee', echeance: 'Clôturée 28/04', pays: 'Côte d\'Ivoire', syscohada: 'Normal', derniereAction: 'Hier — Liasse DGID transmise', taches: 0, alertes: [] },
  { id: 'd3', code: 'COG-2026', nom: 'COGEMATEC SARL', secteur: 'Import-export', exercice: '2025-2026', collaborateur: 'Issa Yomenou', collaborateurInitiales: 'IY', collaborateurColor: '#16A085', ca: 850_200_000, anomalies: 5, cloture: 'retard', echeance: '15/05/2026 (en retard 0j)', pays: 'Sénégal', syscohada: 'Normal', derniereAction: 'Avant-hier — Échec import relevé SGBS', taches: 8,
    alertes: [{ type: 'danger', label: 'Clôture mensuelle en retard' }, { type: 'danger', label: '5 anomalies non résolues' }] },
  { id: 'd4', code: 'SDR-2026', nom: 'SUD Distribution', secteur: 'Distribution', exercice: '2025-2026', collaborateur: 'Awa Ndiaye',  collaborateurInitiales: 'AN', collaborateurColor: '#9B59B6', ca: 1_200_400_000, anomalies: 1, cloture: 'en_cours', echeance: '20/06/2026', pays: 'Sénégal', syscohada: 'Normal', derniereAction: 'Il y a 4h — Rapprochement CBAO', taches: 2, alertes: [{ type: 'info', label: 'Inventaire à programmer' }] },
  { id: 'd5', code: 'GLT-2026', nom: 'Garage Loubet & Frères', secteur: 'Automobile', exercice: '2025-2026', collaborateur: 'Fatou Diallo', collaborateurInitiales: 'FD', collaborateurColor: '#E67E22', ca: 78_900_000, anomalies: 3, cloture: 'a_demarrer', echeance: '30/06/2026', pays: 'Sénégal', syscohada: 'Allégé', derniereAction: 'Il y a 8h — Note saisie', taches: 5,
    alertes: [{ type: 'warn', label: 'OCR factures fournisseurs en attente' }] },
  { id: 'd6', code: 'BTP-2026', nom: 'BTP Pikine SA', secteur: 'BTP', exercice: '2024-2025', collaborateur: 'Issa Yomenou', collaborateurInitiales: 'IY', collaborateurColor: '#16A085', ca: 2_400_000_000, anomalies: 0, cloture: 'cloturee', echeance: 'Clôturée 15/03', pays: 'Sénégal', syscohada: 'Normal', derniereAction: '15 mars — DSF déposée', taches: 0, alertes: [] },
  { id: 'd7', code: 'KSN-2026', nom: 'Kawral Sénégal', secteur: 'Restauration', exercice: '2025-2026', collaborateur: 'Awa Ndiaye',  collaborateurInitiales: 'AN', collaborateurColor: '#9B59B6', ca: 32_500_000, anomalies: 0, cloture: 'en_cours', echeance: '20/06/2026', pays: 'Sénégal', syscohada: 'SMT',   derniereAction: 'Il y a 1h — Saisie ventes mai', taches: 1, alertes: [] },
  { id: 'd8', code: 'NDS-2026', nom: 'NDS Communication', secteur: 'Communication', exercice: '2025-2026', collaborateur: 'Fatou Diallo', collaborateurInitiales: 'FD', collaborateurColor: '#E67E22', ca: 188_700_000, anomalies: 2, cloture: 'en_cours', echeance: '20/06/2026', pays: 'Mali', syscohada: 'Normal', derniereAction: 'Il y a 3h — Validation paie', taches: 4,
    alertes: [{ type: 'warn', label: 'Conventions RAS non-résidents à revoir' }] },
];

const clotureMeta = {
  cloturee:    { label: 'Clôturée',     cls: 'badge-green',  color: '#27AE60', icon: CheckCircle },
  en_cours:    { label: 'En cours',     cls: 'badge-blue',   color: '#2980B9', icon: Clock },
  a_demarrer:  { label: 'À démarrer',   cls: 'badge-gray',   color: '#94A3B8', icon: Clock },
  retard:      { label: 'En retard',    cls: 'badge-red',    color: '#E74C3C', icon: AlertTriangle },
};

export default function PortailEC() {
  const [filter, setFilter] = useState<'all' | keyof typeof clotureMeta>('all');
  const [search, setSearch] = useState('');

  const filtered = dossiers.filter(d => {
    const matchFilter = filter === 'all' || d.cloture === filter;
    const matchSearch = !search || d.nom.toLowerCase().includes(search.toLowerCase()) || d.code.includes(search);
    return matchFilter && matchSearch;
  });

  const stats = {
    total: dossiers.length,
    enRetard: dossiers.filter(d => d.cloture === 'retard').length,
    anomalies: dossiers.reduce((s, d) => s + d.anomalies, 0),
    cloturees: dossiers.filter(d => d.cloture === 'cloturee').length,
    caGlobal: dossiers.reduce((s, d) => s + d.ca, 0),
  };

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Building2 size={20} className="text-primary" /> Portail expert-comptable
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Vue multi-dossiers · Cabinet H&C Conseil · {dossiers.length} clients actifs</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Users size={12} /> Mes collaborateurs</button>
          <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouveau dossier</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Dossiers actifs" value={stats.total.toString()} sub="Tous portefeuilles confondus" tone="primary" icon={Building2} />
        <KpiCard label="En retard" value={stats.enRetard.toString()} sub="Action immédiate requise" tone="danger" icon={AlertTriangle} />
        <KpiCard label="Anomalies cumulées" value={stats.anomalies.toString()} sub={`Sur ${dossiers.filter(d => d.anomalies > 0).length} dossiers`} tone="warning" icon={Sparkles} />
        <KpiCard label="CA cumulé suivi" value={fmtXOF(stats.caGlobal)} sub={`${stats.cloturees} clôtures terminées`} tone="success" icon={CheckCircle} />
      </div>

      {/* Filtres + search */}
      <div className="card-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-md">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-8 py-1.5 text-xs"
            placeholder="Nom client ou code dossier..."
          />
        </div>
        <FilterChip active={filter === 'all'} count={dossiers.length} label="Tous" onClick={() => setFilter('all')} />
        {(Object.keys(clotureMeta) as (keyof typeof clotureMeta)[]).map(s => (
          <FilterChip
            key={s}
            active={filter === s}
            count={dossiers.filter(d => d.cloture === s).length}
            color={clotureMeta[s].color}
            label={clotureMeta[s].label}
            onClick={() => setFilter(s)}
          />
        ))}
        <button className="btn btn-outline btn-sm"><Filter size={11} /> Plus de filtres</button>
      </div>

      {/* Grid dossiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(d => {
          const meta = clotureMeta[d.cloture];
          const Icon = meta.icon;
          return (
            <div key={d.id} className="card !p-0 overflow-hidden transition-all hover:shadow-card-md">
              <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-3" style={{ background: `${meta.color}08` }}>
                <div className="w-10 h-10 rounded-lg grid place-items-center text-white font-bold text-sm flex-shrink-0" style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` }}>
                  {d.nom.split(' ').map(w => w[0]).filter(w => /[A-Z]/.test(w)).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-secondary">{d.code}</span>
                    <span className={`badge ${meta.cls} text-[10px] inline-flex items-center gap-0.5`}>
                      <Icon size={9} /> {meta.label}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-neutral-800 mt-0.5 truncate">{d.nom}</div>
                </div>
                <button className="text-neutral-400 hover:text-neutral-600 transition-colors"><MoreVertical size={14} /></button>
              </div>

              <div className="px-4 py-3 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                  <span className="badge badge-gray text-[9px]">{d.pays}</span>
                  <span>·</span>
                  <span>{d.secteur}</span>
                  <span>·</span>
                  <span>SYSCOHADA {d.syscohada}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-50">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">CA exercice</div>
                    <div className="text-sm font-bold text-neutral-800 font-mono">{fmt(d.ca)} XOF</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Échéance</div>
                    <div className={`text-xs font-semibold ${d.cloture === 'retard' ? 'text-danger' : 'text-neutral-700'}`}>{d.echeance}</div>
                  </div>
                </div>

                {/* Alertes */}
                {d.alertes.length > 0 && (
                  <div className="pt-2 border-t border-neutral-50 space-y-1">
                    {d.alertes.map((a, i) => (
                      <div key={i} className={`flex items-center gap-1.5 text-[11px] ${
                        a.type === 'danger' ? 'text-danger' : a.type === 'warn' ? 'text-warning' : 'text-secondary'
                      }`}>
                        <AlertTriangle size={11} className="flex-shrink-0" />
                        <span className="truncate">{a.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-50 flex items-center gap-2 text-[10px]">
                  <div className="w-5 h-5 rounded-full grid place-items-center text-white text-[9px] font-bold flex-shrink-0" style={{ background: d.collaborateurColor }}>
                    {d.collaborateurInitiales}
                  </div>
                  <span className="text-neutral-600 truncate flex-1">{d.collaborateur}</span>
                  <span className="text-neutral-400">{d.derniereAction.split('—')[0].trim()}</span>
                </div>

                {d.taches > 0 && (
                  <div className="text-[11px] text-secondary font-semibold">{d.taches} tâche{d.taches > 1 ? 's' : ''} en attente</div>
                )}
              </div>

              <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50/40 flex items-center gap-1">
                <button className="flex-1 btn btn-outline btn-sm justify-center"><ExternalLink size={11} /> Ouvrir</button>
                <button className="btn btn-outline btn-sm"><FileText size={11} /></button>
                {d.cloture !== 'cloturee' && <button className="btn btn-outline btn-sm"><Lock size={11} /></button>}
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
          <div className="text-sm font-bold text-purple-700">Recommandation cabinet</div>
          <ul className="mt-1.5 space-y-1 text-xs text-neutral-700">
            <li><strong>Priorité 1 :</strong> <strong className="text-danger">COGEMATEC SARL</strong> — clôture mensuelle en retard + 5 anomalies. Bloquer 2h cette semaine.</li>
            <li><strong>Priorité 2 :</strong> 3 liasses DSF à valider (Tech Solutions, AKWABA, BTP Pikine). Décharge à signer par le client.</li>
            <li><strong>Charge collaborateurs :</strong> Issa surchargé (4 dossiers actifs). Réallouer NDS Communication à Awa ?</li>
          </ul>
          <button className="mt-3 btn btn-outline btn-sm border-purple-200 text-purple-700">
            Voir le plan de charge cabinet <ArrowRight size={12} />
          </button>
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
      <div className={`mt-1.5 text-lg font-bold ${tones[tone]} truncate`}>{value}</div>
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
