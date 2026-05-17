import { useState } from 'react';
import {
  Workflow, Plus, Filter, Sparkles, FileText, Package, Truck,
  Receipt, Clock, AlertTriangle,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

type Etape = 'devis' | 'bc-recu' | 'plan-enc' | 'livre' | 'facture' | 'a-encaisser' | 'creance' | 'recouvrement';

interface OpportuniteCommerciale {
  id: string; reference: string; client: string; objet: string; montant: number;
  etape: Etape; dateProchaine: string; responsable: string;
}

const pipeline: OpportuniteCommerciale[] = [
  { id: 'op1', reference: 'OPP-2026-145', client: 'BANQUE ATLANTIQUE', objet: 'Refonte SI comptable',         montant: 18_500_000, etape: 'devis',          dateProchaine: '18/05', responsable: 'Awa D.' },
  { id: 'op2', reference: 'OPP-2026-144', client: 'SUNU Assurances',    objet: 'Audit légal exercice 2025',    montant:  8_400_000, etape: 'devis',          dateProchaine: '20/05', responsable: 'Doudou S.' },
  { id: 'op3', reference: 'OPP-2026-143', client: 'CIE-Holding',         objet: 'Mission consolidation Q3',    montant: 12_000_000, etape: 'bc-recu',        dateProchaine: '17/05', responsable: 'Issa Y.' },
  { id: 'op4', reference: 'OPP-2026-142', client: 'Sonatel',             objet: 'Conseil fiscal annuel',        montant:  6_200_000, etape: 'plan-enc',       dateProchaine: '21/05', responsable: 'Hermann C.' },
  { id: 'op5', reference: 'OPP-2026-141', client: 'SONES',               objet: 'Mission audit SI',             montant:  9_912_000, etape: 'livre',          dateProchaine: '19/05', responsable: 'Awa D.' },
  { id: 'op6', reference: 'OPP-2026-140', client: 'Orange Sénégal',      objet: 'Formation IFRS',               montant:  4_500_000, etape: 'facture',        dateProchaine: '25/05', responsable: 'Doudou S.' },
  { id: 'op7', reference: 'OPP-2026-139', client: 'AfricTech Group',    objet: 'Audit blanc',                  montant:  3_100_000, etape: 'a-encaisser',    dateProchaine: '30/05', responsable: 'Awa D.' },
  { id: 'op8', reference: 'OPP-2026-138', client: 'Dakar Dem Dikk',      objet: 'Conseil exercice 2024',        montant:  4_200_000, etape: 'creance',        dateProchaine: 'Retard 12j', responsable: 'Issa Y.' },
  { id: 'op9', reference: 'OPP-2026-137', client: 'Ministère Finances', objet: 'Mission spéciale',             montant: 12_600_000, etape: 'recouvrement',   dateProchaine: 'Retard 33j', responsable: 'Hermann C.' },
];

const etapesConfig: { id: Etape; label: string; Icon: React.ElementType; color: string }[] = [
  { id: 'devis',         label: 'Devis envoyé',         Icon: FileText,      color: '#94A3B8' },
  { id: 'bc-recu',       label: 'BC reçu',              Icon: Package,       color: '#2980B9' },
  { id: 'plan-enc',      label: 'Plan d\'encaissement', Icon: Clock,         color: '#9B59B6' },
  { id: 'livre',         label: 'Livraison effectuée',  Icon: Truck,         color: '#1ABC9C' },
  { id: 'facture',       label: 'Facture émise',        Icon: Receipt,       color: '#27AE60' },
  { id: 'a-encaisser',   label: 'À encaisser',          Icon: Clock,         color: '#F39C12' },
  { id: 'creance',       label: 'Créance < 30j',        Icon: AlertTriangle, color: '#E67E22' },
  { id: 'recouvrement',  label: 'Recouvrement',         Icon: AlertTriangle, color: '#E74C3C' },
];

export default function PipelineCommercial() {
  const [vue, setVue] = useState<'kanban' | 'liste'>('kanban');

  const totalPipeline = pipeline.reduce((s, p) => s + p.montant, 0);
  const totalSigne = pipeline.filter(p => ['bc-recu', 'plan-enc', 'livre', 'facture', 'a-encaisser'].includes(p.etape)).reduce((s, p) => s + p.montant, 0);
  const totalRisque = pipeline.filter(p => ['creance', 'recouvrement'].includes(p.etape)).reduce((s, p) => s + p.montant, 0);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2"><Workflow size={20} className="text-secondary" /> Pipeline commercial</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Cycle complet : devis → BC → livraison → facture → encaissement · 8 statuts SYSCOHADA</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5">
            <button onClick={() => setVue('kanban')} className={`px-3 py-1.5 text-xs font-medium rounded-md ${vue === 'kanban' ? 'bg-secondary text-white' : 'text-neutral-600'}`}>Kanban</button>
            <button onClick={() => setVue('liste')} className={`px-3 py-1.5 text-xs font-medium rounded-md ${vue === 'liste' ? 'bg-secondary text-white' : 'text-neutral-600'}`}>Liste</button>
          </div>
          <button className="btn btn-outline btn-sm"><Filter size={12} /> Filtres</button>
          <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouvelle opportunité</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Pipeline total</div><div className="mt-1 text-lg font-bold text-primary">{fmtXOF(totalPipeline)}</div><div className="text-[11px] text-neutral-500 mt-0.5">{pipeline.length} opportunités</div></div>
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Signé (BC reçus+)</div><div className="mt-1 text-lg font-bold text-success">{fmtXOF(totalSigne)}</div><div className="text-[11px] text-neutral-500 mt-0.5">{pipeline.filter(p => ['bc-recu', 'plan-enc', 'livre', 'facture', 'a-encaisser'].includes(p.etape)).length} opp.</div></div>
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">À risque</div><div className="mt-1 text-lg font-bold text-warning">{fmtXOF(totalRisque)}</div><div className="text-[11px] text-neutral-500 mt-0.5">{pipeline.filter(p => ['creance', 'recouvrement'].includes(p.etape)).length} opp. en retard</div></div>
        <div className="card"><div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Conversion devis → BC</div><div className="mt-1 text-lg font-bold text-secondary">68%</div><div className="text-[11px] text-neutral-500 mt-0.5">Moyenne 6 derniers mois</div></div>
      </div>

      {vue === 'kanban' && (
        <div className="overflow-x-auto pb-3">
          <div className="flex gap-3 min-w-max">
            {etapesConfig.map(et => {
              const items = pipeline.filter(p => p.etape === et.id);
              const Icon = et.Icon;
              const sum = items.reduce((s, i) => s + i.montant, 0);
              return (
                <div key={et.id} className="w-64 flex-shrink-0">
                  <div className="rounded-lg px-3 py-2 mb-2 flex items-center gap-2" style={{ background: `${et.color}15`, borderTop: `3px solid ${et.color}` }}>
                    <Icon size={14} style={{ color: et.color }} />
                    <span className="text-xs font-bold text-neutral-800 flex-1">{et.label}</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: et.color }}>{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(it => (
                      <div key={it.id} className="bg-white rounded-lg border border-neutral-100 p-2.5 hover:shadow-card-md transition-shadow cursor-pointer">
                        <div className="text-[10px] font-mono text-neutral-400">{it.reference}</div>
                        <div className="text-xs font-semibold text-neutral-800 mt-0.5 truncate">{it.client}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5 truncate" title={it.objet}>{it.objet}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-mono font-bold text-secondary">{fmt(it.montant)}</span>
                          <span className="text-[10px] text-neutral-400">{it.responsable.split(' ')[0]}</span>
                        </div>
                        <div className="text-[10px] mt-1" style={{ color: it.dateProchaine.includes('Retard') ? '#E74C3C' : '#94A3B8' }}>{it.dateProchaine}</div>
                      </div>
                    ))}
                    {items.length === 0 && <div className="text-center text-[10px] text-neutral-300 py-4">—</div>}
                  </div>
                  <div className="text-[10px] text-neutral-500 text-center mt-2">{fmt(sum)} XOF</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {vue === 'liste' && (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-2 font-semibold">Référence</th>
                  <th className="text-left px-2 py-2 font-semibold">Client</th>
                  <th className="text-left px-2 py-2 font-semibold">Objet</th>
                  <th className="text-right px-2 py-2 font-semibold">Montant</th>
                  <th className="text-left px-2 py-2 font-semibold">Étape</th>
                  <th className="text-left px-2 py-2 font-semibold">Prochaine action</th>
                  <th className="text-left px-2 py-2 font-semibold">Resp.</th>
                </tr>
              </thead>
              <tbody>
                {pipeline.map(p => {
                  const et = etapesConfig.find(e => e.id === p.etape)!;
                  const Icon = et.Icon;
                  return (
                    <tr key={p.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-xs font-bold text-secondary">{p.reference}</td>
                      <td className="px-2 py-2.5 text-sm font-semibold text-neutral-800">{p.client}</td>
                      <td className="px-2 py-2.5 text-xs text-neutral-600 max-w-xs truncate">{p.objet}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-sm font-bold text-secondary">{fmt(p.montant)}</td>
                      <td className="px-2 py-2.5"><span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: et.color }}><Icon size={11} /> {et.label}</span></td>
                      <td className="px-2 py-2.5 text-xs" style={{ color: p.dateProchaine.includes('Retard') ? '#E74C3C' : '#64748B' }}>{p.dateProchaine}</td>
                      <td className="px-2 py-2.5 text-xs text-neutral-600">{p.responsable}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <Sparkles size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-neutral-700 leading-relaxed">
          <strong>Suivi de bout en bout</strong> : chaque opportunité avance dans le pipeline à mesure que les acomptes sont définis, la livraison faite, la facture émise et l'encaissement reçu.
          L'IA détecte les opportunités stagnantes (&gt; 30j sans changement d'étape) et propose une relance.
        </div>
      </div>
    </div>
  );
}
