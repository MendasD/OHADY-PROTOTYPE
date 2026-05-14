import { useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  Plus, Download, BarChart3, PieChart as PieIcon, Sparkles, ArrowRight,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

type Axe = 'projet' | 'departement' | 'client' | 'produit';

const axes: { id: Axe; label: string; description: string; color: string }[] = [
  { id: 'projet',      label: 'Par projet',     description: 'Performance économique des chantiers, missions, projets', color: '#2980B9' },
  { id: 'departement', label: 'Par département', description: 'Centres de coûts internes (Finance, IT, Commercial, RH)', color: '#27AE60' },
  { id: 'client',      label: 'Par client',     description: 'Marge et rentabilité par client / segment de marché', color: '#E67E22' },
  { id: 'produit',     label: 'Par produit',    description: 'Ventilation par famille de produits / services', color: '#9B59B6' },
];

const dataParAxe: Record<Axe, { name: string; ca: number; charges: number; resultat: number; color: string }[]> = {
  projet: [
    { name: 'Mission SONES Q2',    ca: 12_400_000, charges:  7_800_000, resultat: 4_600_000, color: '#2980B9' },
    { name: 'Audit CIE-Holding',   ca:  8_900_000, charges:  6_200_000, resultat: 2_700_000, color: '#3498DB' },
    { name: 'Refonte CI Total',    ca:  6_800_000, charges:  4_900_000, resultat: 1_900_000, color: '#5DADE2' },
    { name: 'Formation Bolloré',   ca:  4_200_000, charges:  2_800_000, resultat: 1_400_000, color: '#85C1E2' },
    { name: 'Conseil DGID',        ca:  3_600_000, charges:  2_400_000, resultat: 1_200_000, color: '#AED6F1' },
  ],
  departement: [
    { name: 'Finance',     ca: 18_400_000, charges: 12_800_000, resultat: 5_600_000, color: '#27AE60' },
    { name: 'IT & Tech',   ca: 12_200_000, charges:  9_400_000, resultat: 2_800_000, color: '#2ECC71' },
    { name: 'Commercial',  ca: 10_800_000, charges:  7_200_000, resultat: 3_600_000, color: '#58D68D' },
    { name: 'RH',          ca:  3_500_000, charges:  2_900_000, resultat:   600_000, color: '#82E0AA' },
    { name: 'Direction',   ca:  2_950_000, charges:  6_020_000, resultat: -3_070_000, color: '#ABEBC6' },
  ],
  client: [
    { name: 'SONES',                 ca: 24_500_000, charges: 16_200_000, resultat: 8_300_000, color: '#E67E22' },
    { name: 'Ministère Finances',    ca: 12_600_000, charges:  9_400_000, resultat: 3_200_000, color: '#F39C12' },
    { name: 'Orange Sénégal',        ca:  7_500_000, charges:  5_800_000, resultat: 1_700_000, color: '#F8C471' },
    { name: 'Tech Solutions SARL',   ca:  3_500_000, charges:  2_100_000, resultat: 1_400_000, color: '#F5CBA7' },
    { name: 'Autres',                ca: 11_000_000, charges:  8_500_000, resultat: 2_500_000, color: '#FAE5D3' },
  ],
  produit: [
    { name: 'Audit & conseil',  ca: 22_400_000, charges: 14_500_000, resultat: 7_900_000, color: '#9B59B6' },
    { name: 'Outsourcing',      ca: 12_800_000, charges:  9_200_000, resultat: 3_600_000, color: '#AF7AC5' },
    { name: 'Software',         ca:  5_400_000, charges:  1_100_000, resultat: 4_300_000, color: '#BB8FCE' },
    { name: 'Formation',        ca:  4_800_000, charges:  2_900_000, resultat: 1_900_000, color: '#C39BD3' },
    { name: 'Support',          ca:  2_450_000, charges:  1_300_000, resultat: 1_150_000, color: '#D7BDE2' },
  ],
};

const periodes = ['Mai 2026', 'T2 2026', 'YTD 2026', 'Exercice 2025-2026'];

export default function Analytique() {
  const [axe, setAxe] = useState<Axe>('projet');
  const [periode, setPeriode] = useState(periodes[2]);

  const data = dataParAxe[axe];
  const totalCA = data.reduce((s, d) => s + d.ca, 0);
  const totalCharges = data.reduce((s, d) => s + d.charges, 0);
  const totalResultat = totalCA - totalCharges;
  const meilleur = [...data].sort((a, b) => b.resultat - a.resultat)[0];
  const pire = [...data].sort((a, b) => a.resultat - b.resultat)[0];

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <PieIcon size={20} className="text-secondary" /> Comptabilité analytique
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Ventilation du résultat selon les axes paramétrables — Multi-axes simultanés</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={periode} onChange={e => setPeriode(e.target.value)} className="select text-xs py-1.5 w-auto">
            {periodes.map(p => <option key={p}>{p}</option>)}
          </select>
          <button className="btn btn-outline btn-sm"><Plus size={12} /> Nouvel axe</button>
          <button className="btn btn-primary btn-sm"><Download size={12} /> Exporter</button>
        </div>
      </div>

      {/* Sélecteur d'axe */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {axes.map(a => (
          <button
            key={a.id}
            onClick={() => setAxe(a.id)}
            className={`card text-left transition-all hover:shadow-card-md ${axe === a.id ? 'ring-2 ring-secondary/40' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: a.color }}
              />
              <span className="text-sm font-bold text-neutral-800">{a.label}</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-snug">{a.description}</p>
          </button>
        ))}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="CA total" value={fmtXOF(totalCA)} sub={`${data.length} éléments`} tone="info" />
        <KpiCard label="Charges directes" value={fmtXOF(totalCharges)} sub={`${Math.round(totalCharges / totalCA * 100)} % du CA`} tone="warning" />
        <KpiCard label="Résultat" value={fmtXOF(totalResultat)} sub={`Marge ${Math.round(totalResultat / totalCA * 100)} %`} tone={totalResultat >= 0 ? 'success' : 'danger'} />
        <KpiCard label="Best performer" value={meilleur.name} sub={`Marge ${Math.round(meilleur.resultat / meilleur.ca * 100)} %`} tone="primary" />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Bar chart résultat par élément */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-neutral-700">Performance par {axes.find(a => a.id === axe)!.label.toLowerCase()}</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">CA · Charges · Résultat</p>
            </div>
            <BarChart3 size={14} className="text-neutral-400" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => fmtXOF(Number(v))}
              />
              <Bar dataKey="ca" name="CA" fill="#2980B9" radius={[3, 3, 0, 0]} maxBarSize={28} />
              <Bar dataKey="charges" name="Charges" fill="#E2E8F0" radius={[3, 3, 0, 0]} maxBarSize={28} />
              <Bar dataKey="resultat" name="Résultat" radius={[3, 3, 0, 0]} maxBarSize={28}>
                {data.map((d, i) => <Cell key={i} fill={d.resultat >= 0 ? '#27AE60' : '#E74C3C'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie répartition CA */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-neutral-700">Répartition du CA</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Poids relatif de chaque {axes.find(a => a.id === axe)!.label.toLowerCase()}</p>
            </div>
            <PieIcon size={14} className="text-neutral-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data} dataKey="ca" nameKey="name" innerRadius={50} outerRadius={88} paddingAngle={2}>
                  {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any) => fmtXOF(Number(v))}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-1.5">
              {data.map(d => (
                <li key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-neutral-700 truncate flex-1">{d.name}</span>
                  <span className="font-mono font-semibold text-neutral-800">{Math.round(d.ca / totalCA * 100)} %</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-700">Détail par {axes.find(a => a.id === axe)!.label.toLowerCase()}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2 font-semibold">{axes.find(a => a.id === axe)!.label}</th>
                <th className="text-right px-2 py-2 font-semibold">CA</th>
                <th className="text-right px-2 py-2 font-semibold">Charges directes</th>
                <th className="text-right px-2 py-2 font-semibold">Résultat</th>
                <th className="text-right px-2 py-2 font-semibold">Marge</th>
                <th className="text-right px-2 py-2 font-semibold">% CA total</th>
                <th className="text-center px-2 py-2 font-semibold">Tendance</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => {
                const marge = Math.round(d.resultat / d.ca * 100);
                const partCA = Math.round(d.ca / totalCA * 100);
                const tendance = i % 3 === 0 ? 'up' : i % 3 === 1 ? 'flat' : 'down';
                return (
                  <tr key={d.name} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
                        <span className="text-sm font-semibold text-neutral-800">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-right font-mono text-xs text-neutral-700">{fmt(d.ca)}</td>
                    <td className="px-2 py-2.5 text-right font-mono text-xs text-neutral-500">{fmt(d.charges)}</td>
                    <td className={`px-2 py-2.5 text-right font-mono text-sm font-bold ${d.resultat >= 0 ? 'text-success' : 'text-danger'}`}>{fmt(d.resultat)}</td>
                    <td className="px-2 py-2.5 text-right">
                      <span className={`text-xs font-bold ${marge >= 30 ? 'text-success' : marge >= 0 ? 'text-secondary' : 'text-danger'}`}>{marge} %</span>
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${partCA}%`, background: d.color }} />
                        </div>
                        <span className="text-xs text-neutral-600 font-mono w-10">{partCA} %</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      {tendance === 'up' && <TrendingUp size={13} className="text-success inline" />}
                      {tendance === 'flat' && <span className="text-neutral-300">—</span>}
                      {tendance === 'down' && <TrendingDown size={13} className="text-danger inline" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-100 border-t-2 border-neutral-300">
                <td className="px-4 py-3 text-sm font-bold text-neutral-800">Total</td>
                <td className="px-2 py-3 text-right font-mono text-sm font-bold text-neutral-800">{fmt(totalCA)}</td>
                <td className="px-2 py-3 text-right font-mono text-sm font-bold text-neutral-600">{fmt(totalCharges)}</td>
                <td className={`px-2 py-3 text-right font-mono text-sm font-bold ${totalResultat >= 0 ? 'text-success' : 'text-danger'}`}>{fmt(totalResultat)}</td>
                <td className="px-2 py-3 text-right text-sm font-bold text-neutral-700">{Math.round(totalResultat / totalCA * 100)} %</td>
                <td colSpan={2} className="px-2 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-700">Lecture analytique</div>
          <ul className="mt-1.5 space-y-1 text-xs text-neutral-700">
            <li><strong>Top performance :</strong> <span className="font-semibold">{meilleur.name}</span> dégage <span className="text-success font-bold">{fmtXOF(meilleur.resultat)}</span> de marge ({Math.round(meilleur.resultat / meilleur.ca * 100)} %).</li>
            <li><strong>Point d'attention :</strong> <span className="font-semibold">{pire.name}</span> {pire.resultat < 0 ? <span className="text-danger">est déficitaire de {fmtXOF(Math.abs(pire.resultat))}</span> : <span>n'apporte que {fmtXOF(pire.resultat)} de marge</span>} — à investiguer.</li>
            <li><strong>Concentration :</strong> les 3 premiers représentent {Math.round((data.slice(0, 3).reduce((s, d) => s + d.ca, 0) / totalCA) * 100)} % du CA total. Diversification à envisager ?</li>
          </ul>
          <button className="mt-3 btn btn-outline btn-sm border-purple-200 text-purple-700">
            Voir l'analyse détaillée <ArrowRight size={12} />
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
