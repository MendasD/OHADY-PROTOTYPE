import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart, Line, ReferenceLine,
} from 'recharts';
import { Download, Plus, AlertTriangle, Info } from 'lucide-react';
import { budgetLines, revenueData } from '../data/mockData';
import { fmtXOF } from '../data/mockData';

const scenarios = [
  { id: 'optimiste',  label: 'Optimiste',  ca: 620000000, result: 89000000, bg: 'bg-green-50',  text: 'text-success', border: 'border-green-200' },
  { id: 'realiste',   label: 'Réaliste',   ca: 540000000, result: 58000000, bg: 'bg-blue-50',   text: 'text-secondary', border: 'border-blue-200' },
  { id: 'pessimiste', label: 'Pessimiste', ca: 445000000, result: 18000000, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
];

export default function Budget() {
  const [activeScenario, setActiveScenario] = useState('realiste');

  const totalBudget = budgetLines.reduce((s, l) => s + l.budget, 0);
  const totalRealise = budgetLines.reduce((s, l) => s + l.realise, 0);
  const totalEngagement = budgetLines.reduce((s, l) => s + l.engagement, 0);
  const totalDispo = totalBudget - totalRealise - totalEngagement;
  const pctGlobal = Math.round((totalRealise + totalEngagement) / totalBudget * 100);

  const budgetChartData = budgetLines.map(l => ({
    rubric: l.rubric.split(' ')[0],
    budget: l.budget,
    realise: l.realise,
    engagement: l.engagement,
    disponible: Math.max(0, l.disponible),
  }));

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Budget & Prévisions</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Exercice 2025–2026 · Analyse budgétaire et modélisation de scénarios</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Download size={13} /> Exporter</button>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> Modifier budget</button>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Budget annuel total',     value: fmtXOF(totalBudget),      color: 'text-neutral-800' },
          { label: 'Réalisé (mai)',           value: fmtXOF(totalRealise),     color: 'text-secondary' },
          { label: 'Engagé',                  value: fmtXOF(totalEngagement),  color: 'text-orange-500' },
          { label: 'Disponible restant',      value: fmtXOF(totalDispo),       color: totalDispo > 0 ? 'text-success' : 'text-danger' },
        ].map(item => (
          <div key={item.label} className="card text-center">
            <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-neutral-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Budget consumption bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Consommation budgétaire globale — {pctGlobal}%</h2>
          <span className={`badge text-xs ${pctGlobal > 90 ? 'badge-red' : pctGlobal > 75 ? 'badge-orange' : 'badge-green'}`}>
            {pctGlobal > 90 ? 'Critique' : pctGlobal > 75 ? 'Vigilance' : 'Normal'}
          </span>
        </div>
        <div className="h-4 bg-neutral-100 rounded-full overflow-hidden flex mb-3">
          <div className="h-full bg-secondary" style={{ width: `${Math.round(totalRealise/totalBudget*100)}%` }} />
          <div className="h-full bg-secondary/40" style={{ width: `${Math.round(totalEngagement/totalBudget*100)}%` }} />
          <div className="h-full bg-success/20" style={{ width: `${Math.round(Math.max(0, totalDispo)/totalBudget*100)}%` }} />
        </div>
        <div className="flex gap-6 text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-secondary" /> Réalisé ({Math.round(totalRealise/totalBudget*100)}%)</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-secondary/40" /> Engagé ({Math.round(totalEngagement/totalBudget*100)}%)</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-success/30" /> Disponible ({Math.round(Math.max(0, totalDispo)/totalBudget*100)}%)</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="section-title mb-4">Budget vs Réalisé par rubrique</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={budgetChartData} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="rubric" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: any) => fmtXOF(Number(v))} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="budget"    name="Budget"    fill="#E2E8F0" radius={[3,3,0,0]} maxBarSize={20} />
              <Bar dataKey="realise"   name="Réalisé"   fill="#2980B9" radius={[3,3,0,0]} maxBarSize={20} />
              <Bar dataKey="engagement" name="Engagé"  fill="#F39C12" radius={[3,3,0,0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="section-title mb-4">Évolution CA vs Budget mensuel</h2>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={revenueData} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: any) => fmtXOF(Number(v))} />
              <ReferenceLine y={45000000} stroke="#E67E22" strokeDasharray="4 2" label={{ value: 'Objectif', fill: '#E67E22', fontSize: 10 }} />
              <Bar dataKey="ca" name="CA réalisé" fill="#2980B9" radius={[3,3,0,0]} maxBarSize={24} />
              <Line dataKey="charges" name="Charges" stroke="#E74C3C" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenarios */}
      <div className="card">
        <h2 className="section-title mb-4">Modélisation de scénarios — Exercice 2025–2026</h2>
        <div className="grid grid-cols-3 gap-4 mb-5">
          {scenarios.map(sc => (
            <div
              key={sc.id}
              onClick={() => setActiveScenario(sc.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                activeScenario === sc.id ? `${sc.bg} ${sc.border}` : 'bg-neutral-50 border-neutral-100 hover:border-neutral-200'
              }`}
            >
              <div className="text-xs font-semibold text-neutral-500 mb-2">{sc.label}</div>
              <div className={`text-xl font-bold ${activeScenario === sc.id ? sc.text : 'text-neutral-700'}`}>
                {(sc.ca / 1000000).toFixed(0)}M XOF
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">CA prévisionnel</div>
              <div className={`text-sm font-bold mt-3 ${activeScenario === sc.id ? sc.text : 'text-neutral-600'}`}>
                Résultat net : {(sc.result / 1000000).toFixed(0)}M XOF
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800">
            <strong>Scénario sélectionné : {scenarios.find(s => s.id === activeScenario)?.label}.</strong> Les hypothèses de ce scénario peuvent être modifiées dans le module de Modélisation financière. L'IA peut générer automatiquement les hypothèses à partir des tendances historiques.
          </div>
        </div>
      </div>

      {/* Budget table */}
      <div className="card">
        <h2 className="section-title mb-4">Détail des enveloppes budgétaires</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rubrique</th>
                <th className="text-right">Budget</th>
                <th className="text-right">Réalisé</th>
                <th className="text-right">Engagé</th>
                <th className="text-right">Disponible</th>
                <th>Consommation</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {budgetLines.map(line => {
                const pct = Math.round((line.realise + line.engagement) / line.budget * 100);
                const isOver = line.disponible < 0;
                const isAlert = pct > 90 && !isOver;
                return (
                  <tr key={line.rubric}>
                    <td className="font-medium text-neutral-800">{line.rubric}</td>
                    <td className="text-right text-neutral-700">{fmtXOF(line.budget)}</td>
                    <td className="text-right text-secondary font-semibold">{fmtXOF(line.realise)}</td>
                    <td className="text-right text-orange-500">{fmtXOF(line.engagement)}</td>
                    <td className={`text-right font-bold ${isOver ? 'text-danger' : 'text-success'}`}>
                      {isOver ? '-' : ''}{fmtXOF(Math.abs(line.disponible))}
                    </td>
                    <td className="w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isOver ? 'bg-danger' : isAlert ? 'bg-orange-400' : 'bg-secondary'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className={`text-[10px] font-bold w-8 ${isOver ? 'text-danger' : isAlert ? 'text-orange-500' : 'text-neutral-600'}`}>{pct}%</span>
                      </div>
                    </td>
                    <td>
                      {isOver ? (
                        <span className="badge badge-red text-[10px]"><AlertTriangle size={9} /> Dépassé</span>
                      ) : isAlert ? (
                        <span className="badge badge-orange text-[10px]">Vigilance</span>
                      ) : (
                        <span className="badge badge-green text-[10px]">Normal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
