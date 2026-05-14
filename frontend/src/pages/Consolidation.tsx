import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';
import {
  Building2, Globe, ArrowRightLeft, Sparkles, ArrowRight, ChevronRight,
  CheckCircle, AlertTriangle,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

interface Entite {
  code: string;
  nom: string;
  pays: string;
  drapeau: string;
  devise: string;
  participation: number;
  ca: number;
  resultat: number;
  treso: number;
  actif: number;
  passif: number;
  color: string;
}

const entites: Entite[] = [
  { code: 'HCG-SN', nom: 'H&C Group Holding',      pays: 'Sénégal',         drapeau: '🇸🇳', devise: 'XOF', participation: 100, ca: 380_400_000, resultat:  58_000_000, treso: 23_415_000, actif: 142_500_000, passif: 142_500_000, color: '#1A3C5E' },
  { code: 'AKW-CI', nom: 'AKWABA Services',         pays: 'Côte d\'Ivoire',  drapeau: '🇨🇮', devise: 'XOF', participation:  85, ca: 145_200_000, resultat:  18_400_000, treso: 12_800_000, actif:  78_500_000, passif:  78_500_000, color: '#27AE60' },
  { code: 'TGT-TG', nom: 'TogoTech Services',       pays: 'Togo',            drapeau: '🇹🇬', devise: 'XOF', participation:  75, ca:  88_400_000, resultat:   9_200_000, treso:  7_100_000, actif:  42_300_000, passif:  42_300_000, color: '#E67E22' },
  { code: 'BAM-ML', nom: 'BamakoConseil SARL',      pays: 'Mali',            drapeau: '🇲🇱', devise: 'XOF', participation:  60, ca:  62_700_000, resultat:   5_400_000, treso:  4_200_000, actif:  31_800_000, passif:  31_800_000, color: '#9B59B6' },
  { code: 'HCF-FR', nom: 'H&C France SARL',         pays: 'France',          drapeau: '🇫🇷', devise: 'EUR', participation: 100, ca:  98_000_000, resultat:  12_300_000, treso:  8_500_000, actif:  54_200_000, passif:  54_200_000, color: '#3498DB' },
];

const interSocietes = [
  { from: 'HCG-SN', to: 'AKW-CI', label: 'Prestation conseil interne',  montant: 3_200_000, statut: 'rapproche' },
  { from: 'HCG-SN', to: 'TGT-TG', label: 'Licence logicielle annuelle',  montant: 1_850_000, statut: 'rapproche' },
  { from: 'BAM-ML', to: 'HCG-SN', label: 'Refacturation frais siège',    montant:   780_000, statut: 'en_cours' },
  { from: 'HCF-FR', to: 'HCG-SN', label: 'Royalties marque H&C',         montant: 4_500_000, statut: 'rapproche' },
  { from: 'AKW-CI', to: 'TGT-TG', label: 'Mission audit ponctuelle',     montant: 2_100_000, statut: 'a_eliminer' },
];

export default function Consolidation() {
  const [periode, setPeriode] = useState<'mensuel' | 'trimestriel' | 'annuel'>('trimestriel');

  const totaux = entites.reduce((acc, e) => ({
    ca: acc.ca + e.ca,
    resultat: acc.resultat + e.resultat,
    treso: acc.treso + e.treso,
    actif: acc.actif + e.actif,
  }), { ca: 0, resultat: 0, treso: 0, actif: 0 });

  const interToEliminate = interSocietes.filter(i => i.statut === 'a_eliminer').reduce((s, i) => s + i.montant, 0);
  const caConsolide = totaux.ca - interSocietes.reduce((s, i) => s + i.montant, 0);

  const repartition = entites.map(e => ({ name: e.nom.split(' ')[0], v: e.ca, color: e.color }));

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Globe size={20} className="text-secondary" /> Consolidation multi-entités
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Vue groupe · 5 entités · 5 pays · périmètre exercice 2025-2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5">
            {(['mensuel', 'trimestriel', 'annuel'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriode(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  periode === p ? 'bg-secondary text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {p === 'mensuel' ? 'Mensuel' : p === 'trimestriel' ? 'Trim.' : 'Annuel'}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm"><Building2 size={12} /> Nouvelle entité</button>
        </div>
      </div>

      {/* KPI Groupe consolidé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiBig label="CA consolidé" value={fmtXOF(caConsolide)} sub={`Après élimination inter-sociétés (${fmt(interToEliminate)} XOF)`} tone="primary" />
        <KpiBig label="Résultat groupe" value={fmtXOF(totaux.resultat)} sub={`Marge ${Math.round(totaux.resultat / caConsolide * 100)} %`} tone="success" />
        <KpiBig label="Trésorerie groupe" value={fmtXOF(totaux.treso)} sub="Tous comptes confondus" tone="info" />
        <KpiBig label="Actif total" value={fmtXOF(totaux.actif)} sub="Cumul bilanciel" tone="warning" />
      </div>

      {/* Entités */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
        <div className="card !p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-700">Entités du périmètre</h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">Contribution au CA consolidé par entité</p>
          </div>
          <div className="divide-y divide-neutral-50">
            {entites.map(e => {
              const partCA = Math.round((e.ca / totaux.ca) * 100);
              return (
                <div key={e.code} className="px-5 py-3 hover:bg-neutral-50/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl grid place-items-center text-white font-bold text-sm flex-shrink-0 shadow-sm" style={{ background: e.color }}>
                      {e.code.slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-neutral-800">{e.nom}</span>
                        <span className="text-base">{e.drapeau}</span>
                        <span className="text-[10px] text-neutral-500">{e.pays} · {e.devise}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-500">
                        <span>Participation : <strong className="text-neutral-700">{e.participation} %</strong></span>
                        <span>·</span>
                        <span className="font-mono">{e.code}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-neutral-300" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                    <Mini label="CA" value={fmt(e.ca)} color="text-secondary" />
                    <Mini label="Résultat" value={fmt(e.resultat)} color="text-success" />
                    <Mini label="Trésorerie" value={fmt(e.treso)} color="text-neutral-700" />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${partCA}%`, background: e.color }} />
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono w-10 text-right">{partCA} %</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie répartition */}
        <div className="card">
          <h3 className="text-sm font-bold text-neutral-700 mb-3">Répartition du CA par entité</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={repartition} dataKey="v" nameKey="name" innerRadius={50} outerRadius={88} paddingAngle={2}>
                {repartition.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => fmtXOF(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 space-y-1 text-[11px]">
            {entites.map(e => (
              <li key={e.code} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: e.color }} />
                <span className="text-neutral-700 flex-1 truncate">{e.nom}</span>
                <span className="font-mono text-neutral-800 font-bold">{Math.round((e.ca / totaux.ca) * 100)} %</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* P&L consolidé */}
      <div className="card">
        <h3 className="text-sm font-bold text-neutral-700 mb-4">Performance consolidée par entité</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={entites.map(e => ({ name: e.nom.split(' ').slice(0, 2).join(' '), ca: e.ca, resultat: e.resultat }))} margin={{ top: 10, right: 8, bottom: 10, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} angle={-12} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
            <Tooltip formatter={(v: any) => fmtXOF(Number(v))} contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="ca" name="CA" fill="#2980B9" radius={[3, 3, 0, 0]} maxBarSize={32} />
            <Bar dataKey="resultat" name="Résultat" fill="#27AE60" radius={[3, 3, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Opérations inter-sociétés */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-700 flex items-center gap-2">
              <ArrowRightLeft size={14} className="text-secondary" /> Opérations inter-sociétés à éliminer
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">Flux intra-groupe qui doivent être neutralisés dans la consolidation</p>
          </div>
          <button className="btn btn-outline btn-sm">Voir tout</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2 font-semibold">Émetteur</th>
                <th className="text-center px-2 py-2 font-semibold">→</th>
                <th className="text-left px-2 py-2 font-semibold">Bénéficiaire</th>
                <th className="text-left px-2 py-2 font-semibold">Description</th>
                <th className="text-right px-2 py-2 font-semibold">Montant</th>
                <th className="text-center px-2 py-2 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {interSocietes.map((i, idx) => {
                const from = entites.find(e => e.code === i.from)!;
                const to = entites.find(e => e.code === i.to)!;
                return (
                  <tr key={idx} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-sm" style={{ background: from.color }} />
                        <span className="text-xs font-semibold text-neutral-700">{from.code}</span>
                        <span className="text-[11px]">{from.drapeau}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center"><ArrowRight size={11} className="text-neutral-300 inline" /></td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-sm" style={{ background: to.color }} />
                        <span className="text-xs font-semibold text-neutral-700">{to.code}</span>
                        <span className="text-[11px]">{to.drapeau}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-xs text-neutral-600">{i.label}</td>
                    <td className="px-2 py-2.5 text-right font-mono text-xs font-semibold text-neutral-800">{fmt(i.montant)}</td>
                    <td className="px-2 py-2.5 text-center">
                      <span className={`badge text-[10px] ${
                        i.statut === 'rapproche' ? 'badge-green' :
                        i.statut === 'en_cours' ? 'badge-blue' : 'badge-orange'
                      }`}>
                        {i.statut === 'rapproche' && <CheckCircle size={9} />}
                        {i.statut === 'en_cours' && <AlertTriangle size={9} />}
                        {i.statut === 'a_eliminer' && <AlertTriangle size={9} />}
                        {' '}
                        {i.statut === 'rapproche' ? 'Rapprochée' : i.statut === 'en_cours' ? 'En cours' : 'À éliminer'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-700">Analyse groupe</div>
          <ul className="mt-1.5 space-y-1 text-xs text-neutral-700">
            <li><strong>Top contributeur :</strong> H&C Group Holding (Sénégal) génère <strong>{Math.round(380_400_000 / totaux.ca * 100)} %</strong> du CA groupe.</li>
            <li><strong>Élimination inter-sociétés :</strong> {interSocietes.length} flux pour <strong>{fmtXOF(interSocietes.reduce((s, i) => s + i.montant, 0))}</strong> à neutraliser dans le bilan consolidé.</li>
            <li><strong>Risque change :</strong> H&C France (EUR) représente 19 % du résultat — couverture de change recommandée.</li>
            <li><strong>Participation minoritaire :</strong> BamakoConseil (60 %) — intérêts minoritaires à comptabiliser à part.</li>
          </ul>
          <button className="mt-3 btn btn-outline btn-sm border-purple-200 text-purple-700">
            Générer la liasse consolidée <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiBig({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: 'success' | 'danger' | 'warning' | 'info' | 'primary' }) {
  const tones = { success: 'text-success', danger: 'text-danger', warning: 'text-warning', info: 'text-secondary', primary: 'text-primary' };
  return (
    <div className="card">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">{label}</div>
      <div className={`mt-1.5 text-lg font-bold font-mono ${tones[tone]} truncate`}>{value}</div>
      <div className="text-[11px] text-neutral-500 mt-0.5">{sub}</div>
    </div>
  );
}

function Mini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-md bg-neutral-50 px-2 py-1.5">
      <div className="text-[9px] text-neutral-500 uppercase tracking-wide font-semibold">{label}</div>
      <div className={`font-mono text-xs font-bold ${color}`}>{value}</div>
    </div>
  );
}

