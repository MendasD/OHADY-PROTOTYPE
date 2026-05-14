import { useState } from 'react';
import {
  Calendar, Download, Send, AlertTriangle, CheckCircle, Clock, FileText,
  Bell, Sparkles, ExternalLink,
} from 'lucide-react';
import { fmtXOF, fmt } from '../data/mockData';

interface Declaration {
  id: string;
  code: string;
  label: string;
  periode: string;
  dateLimite: string;
  joursRestants: number;
  montantEstime?: number;
  statut: 'a_preparer' | 'en_preparation' | 'soumise' | 'paye' | 'retard';
  destinataire: string;
}

const declarations: Declaration[] = [
  { id: 'd1', code: 'TVA-05',  label: 'Déclaration TVA mensuelle',           periode: 'Mai 2026',  dateLimite: '15/06/2026', joursRestants: 31, montantEstime: 1_240_000, statut: 'en_preparation', destinataire: 'DGID' },
  { id: 'd2', code: 'BRS-05',  label: 'Bordereau retenue à la source',       periode: 'Mai 2026',  dateLimite: '15/06/2026', joursRestants: 31, montantEstime:   136_000, statut: 'a_preparer',     destinataire: 'DGID' },
  { id: 'd3', code: 'IRPP-05', label: 'IRPP — Retenue sur salaires',         periode: 'Mai 2026',  dateLimite: '15/06/2026', joursRestants: 31, montantEstime:   731_250, statut: 'a_preparer',     destinataire: 'DGID' },
  { id: 'd4', code: 'IS-T1',   label: 'Acompte IS trimestriel',              periode: 'T1 2026',   dateLimite: '30/06/2026', joursRestants: 46, montantEstime: 1_480_000, statut: 'a_preparer',     destinataire: 'DGID' },
  { id: 'd5', code: 'CSS-05',  label: 'Cotisations IPRES + CSS',             periode: 'Mai 2026',  dateLimite: '10/06/2026', joursRestants: 26, montantEstime: 1_280_000, statut: 'a_preparer',     destinataire: 'IPRES / CSS' },
  { id: 'd6', code: 'TVA-04',  label: 'Déclaration TVA mensuelle',           periode: 'Avril 2026',dateLimite: '15/05/2026', joursRestants: -1, montantEstime: 1_180_000, statut: 'retard',         destinataire: 'DGID' },
  { id: 'd7', code: 'DGID-1102', label: 'Déclaration des sommes versées',    periode: '2025',      dateLimite: '30/04/2026', joursRestants: -14, statut: 'soumise',  destinataire: 'DGID' },
  { id: 'd8', code: 'TVA-03',  label: 'Déclaration TVA mensuelle',           periode: 'Mars 2026', dateLimite: '15/04/2026', joursRestants: -29, montantEstime: 1_220_000, statut: 'paye',          destinataire: 'DGID' },
];

const statutMeta: Record<Declaration['statut'], { label: string; cls: string; icon: React.ElementType; color: string }> = {
  a_preparer:     { label: 'À préparer',    cls: 'badge-orange', icon: Clock, color: '#F39C12' },
  en_preparation: { label: 'En préparation', cls: 'badge-blue',   icon: FileText, color: '#2980B9' },
  soumise:        { label: 'Soumise',        cls: 'badge-blue',   icon: Send, color: '#1ABC9C' },
  paye:           { label: 'Payée',          cls: 'badge-green',  icon: CheckCircle, color: '#27AE60' },
  retard:         { label: 'En retard',      cls: 'badge-red',    icon: AlertTriangle, color: '#E74C3C' },
};

export default function Declarations() {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const enRetard = declarations.filter(d => d.statut === 'retard');
  const aPreparer = declarations.filter(d => d.statut === 'a_preparer' || d.statut === 'en_preparation');
  const cumul = declarations.filter(d => d.statut === 'a_preparer' || d.statut === 'en_preparation' || d.statut === 'retard')
    .reduce((s, d) => s + (d.montantEstime ?? 0), 0);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Déclarations & Échéances fiscales</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Calendrier DGID / IPRES / CSS — Sénégal · Exercice 2025-2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5">
            <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === 'list' ? 'bg-secondary text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'}`}>Liste</button>
            <button onClick={() => setView('calendar')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === 'calendar' ? 'bg-secondary text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'}`}>Calendrier</button>
          </div>
          <button className="btn btn-outline btn-sm"><Bell size={12} /> Configurer rappels</button>
          <button className="btn btn-primary btn-sm"><Download size={12} /> Export DGID</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="En retard" value={enRetard.length.toString()} sub="Action immédiate requise" tone="danger" icon={AlertTriangle} />
        <KpiCard label="À préparer (mai-juin)" value={aPreparer.length.toString()} sub="Délais à venir" tone="warning" icon={Clock} />
        <KpiCard label="Cumul dû" value={fmtXOF(cumul)} sub="Estimation" tone="info" icon={FileText} />
        <KpiCard label="Conformité globale" value="88 %" sub="Délais respectés cumul 2026" tone="success" icon={CheckCircle} />
      </div>

      {/* En retard */}
      {enRetard.length > 0 && (
        <div className="card border-l-4 border-danger bg-red-50/40">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 grid place-items-center flex-shrink-0">
              <AlertTriangle size={18} className="text-danger" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-neutral-800">Déclarations en retard — pénalités possibles</div>
              <div className="text-xs text-neutral-600 mt-1">
                {enRetard.map(d => (
                  <span key={d.id} className="inline-flex items-center gap-1.5 mr-3">
                    <FileText size={11} className="text-danger" />
                    <strong>{d.code}</strong> · {d.label} ({d.periode}) — limite : {d.dateLimite}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-[11px] text-danger font-semibold">
                Pénalité estimée : 50 000 XOF par déclaration + intérêts de retard 1 %/mois.
              </div>
            </div>
            <button className="btn btn-primary btn-sm flex-shrink-0">Régulariser maintenant</button>
          </div>
        </div>
      )}

      {/* Vue Liste */}
      {view === 'list' && (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-2 font-semibold">Code</th>
                  <th className="text-left px-2 py-2 font-semibold">Déclaration</th>
                  <th className="text-left px-2 py-2 font-semibold">Période</th>
                  <th className="text-left px-2 py-2 font-semibold">Destinataire</th>
                  <th className="text-center px-2 py-2 font-semibold">Date limite</th>
                  <th className="text-right px-2 py-2 font-semibold">Montant estimé</th>
                  <th className="text-center px-2 py-2 font-semibold">Statut</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {declarations.map(d => {
                  const meta = statutMeta[d.statut];
                  const Icon = meta.icon;
                  return (
                    <tr key={d.id} className="border-t border-neutral-50 hover:bg-neutral-50/40 transition-colors">
                      <td className="px-4 py-2.5">
                        <span className="font-mono text-xs font-bold text-secondary">{d.code}</span>
                      </td>
                      <td className="px-2 py-2.5 text-sm font-medium text-neutral-800">{d.label}</td>
                      <td className="px-2 py-2.5 text-xs text-neutral-500">{d.periode}</td>
                      <td className="px-2 py-2.5">
                        <span className="text-xs text-neutral-600">{d.destinataire}</span>
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <div className="text-xs font-mono text-neutral-700">{d.dateLimite}</div>
                        <div className={`text-[10px] mt-0.5 ${
                          d.joursRestants < 0 ? 'text-danger font-bold' :
                          d.joursRestants < 7 ? 'text-warning font-bold' :
                          d.joursRestants < 30 ? 'text-secondary' : 'text-neutral-400'
                        }`}>
                          {d.joursRestants < 0 ? `${Math.abs(d.joursRestants)} j de retard` : `J − ${d.joursRestants}`}
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-right font-mono text-sm text-neutral-700">
                        {d.montantEstime ? fmt(d.montantEstime) : <span className="text-neutral-300">—</span>}
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <span className={`inline-flex items-center gap-1 badge ${meta.cls} text-[10px]`}>
                          <Icon size={9} /> {meta.label}
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <button className="w-7 h-7 rounded-md hover:bg-secondary/10 text-neutral-400 hover:text-secondary grid place-items-center transition-colors">
                          <ExternalLink size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vue Calendrier */}
      {view === 'calendar' && (
        <div className="card">
          <h3 className="text-sm font-bold text-neutral-700 mb-4 flex items-center gap-2">
            <Calendar size={14} className="text-secondary" /> Calendrier fiscal mai-juin 2026
          </h3>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
              <div key={d} className="text-[10px] font-semibold text-neutral-400 py-1">{d}</div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const isEcheance = [10, 15, 30].includes(day);
              const isToday = day === 13;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-md text-xs flex flex-col items-center justify-center transition-all ${
                    isToday ? 'bg-secondary text-white font-bold' :
                    isEcheance ? 'bg-orange-100 text-orange-700 font-semibold cursor-pointer hover:bg-orange-200' :
                    'text-neutral-500 hover:bg-neutral-100'
                  }`}
                >
                  {day}
                  {isEcheance && <div className="w-1 h-1 rounded-full bg-orange-500 mt-0.5" />}
                </div>
              );
            })}
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <CalendarEvent date="10 juin" label="Cotisations IPRES + CSS mai" montant={1_280_000} />
            <CalendarEvent date="15 juin" label="TVA + BRS + IRPP mai" montant={2_107_250} />
            <CalendarEvent date="30 juin" label="Acompte IS T2" montant={1_480_000} />
          </div>
        </div>
      )}

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-700">Préparation automatique par l'IA</div>
          <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
            La déclaration TVA mai 2026 est <strong>prête à 87 %</strong>. Il manque la validation de 3 factures fournisseurs.
            <br />
            Total TVA collectée : <strong>1 848 000 XOF</strong> · Total TVA déductible : <strong>608 000 XOF</strong> ·
            TVA à verser : <strong className="text-purple-700">1 240 000 XOF</strong>.
          </p>
          <button className="mt-2 btn btn-sm border-purple-200 text-purple-700 btn-outline">
            Compléter la déclaration TVA <Send size={12} />
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
      <div className={`mt-1.5 text-lg font-bold ${tones[tone]}`}>{value}</div>
      <div className="text-[11px] text-neutral-500 mt-0.5">{sub}</div>
    </div>
  );
}

function CalendarEvent({ date, label, montant }: { date: string; label: string; montant: number }) {
  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50/30 px-3 py-2.5 flex items-center gap-3">
      <div className="text-center flex-shrink-0">
        <div className="text-[10px] uppercase text-orange-700 font-semibold">{date.split(' ')[1]}</div>
        <div className="text-base font-bold text-orange-700">{date.split(' ')[0]}</div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-neutral-800 truncate">{label}</div>
        <div className="text-sm font-mono font-bold text-orange-700 mt-0.5">{fmt(montant)} XOF</div>
      </div>
    </div>
  );
}
