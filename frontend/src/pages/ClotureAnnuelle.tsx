import {
  Lock, CheckCircle, Clock, Sparkles,
  Calendar, RotateCw, ChevronRight,
} from 'lucide-react';
import { fmt } from '../data/mockData';

const sections = [
  {
    title: 'État d\'avancement',
    items: [
      { label: 'Exercice à clôturer', value: '2025-2026', sub: 'Du 01/07/2025 au 30/06/2026' },
      { label: 'Mois clôturés',       value: '11 / 12',   sub: 'Reste juin 2026' },
      { label: 'Travail estimé',      value: '12 jours',   sub: 'Selon historique 2024' },
      { label: 'Cible publication',   value: '15/09/2026', sub: 'Soit 75 j après clôture' },
    ],
  },
];

const phases = [
  {
    n: 1, title: 'Pré-clôture', dates: 'Juin 2026', status: 'active' as const,
    steps: [
      { label: 'Clôture mensuelle de juin', done: false },
      { label: 'Revue des comptes auxiliaires', done: false },
      { label: 'Inventaire physique stocks & immobilisations', done: false },
      { label: 'Confirmation soldes bancaires', done: false },
    ],
  },
  {
    n: 2, title: 'Régularisations annuelles', dates: 'Juillet 2026', status: 'todo' as const,
    steps: [
      { label: 'Dotations amortissements annuelles', done: false },
      { label: 'Provisions pour risques & créances', done: false },
      { label: 'Stocks finaux + variation', done: false },
      { label: 'Écritures de cut-off', done: false },
      { label: 'Reclassements de comptes', done: false },
    ],
  },
  {
    n: 3, title: 'Calcul du résultat', dates: 'Août 2026', status: 'todo' as const,
    steps: [
      { label: 'Détermination du résultat brut', done: false },
      { label: 'Calcul de l\'IS (impôt sur les sociétés)', done: false },
      { label: 'Écritures de résultat net', done: false },
      { label: 'Validation par expert-comptable (Issa)', done: false },
    ],
  },
  {
    n: 4, title: 'États financiers SYSCOHADA', dates: 'Août 2026', status: 'todo' as const,
    steps: [
      { label: 'Bilan actif + passif', done: false },
      { label: 'Compte de résultat', done: false },
      { label: 'TAFIRE (tableau financier)', done: false },
      { label: 'État annexé', done: false },
      { label: 'Comparaison N / N-1', done: false },
    ],
  },
  {
    n: 5, title: 'Liasse fiscale & dépôt', dates: 'Sept. 2026', status: 'todo' as const,
    steps: [
      { label: 'Génération liasse fiscale DSF', done: false },
      { label: 'Validation finale DAF + Expert-compta', done: false },
      { label: 'Dépôt DGID', done: false },
      { label: 'Verrouillage définitif de l\'exercice', done: false },
      { label: 'Génération à-nouveaux exercice suivant', done: false },
    ],
  },
];

const statusMeta = {
  active: { label: 'En cours', cls: 'badge-blue', dot: 'bg-secondary animate-pulse' },
  todo:   { label: 'À venir',  cls: 'badge-gray', dot: 'bg-neutral-300' },
  done:   { label: 'Terminé',  cls: 'badge-green', dot: 'bg-success' },
};

export default function ClotureAnnuelle() {
  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Lock size={20} className="text-primary" /> Clôture annuelle — Exercice 2025-2026
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Processus complet de clôture en 5 phases · Cible publication 15 sept. 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Calendar size={12} /> Plan détaillé</button>
          <button className="btn btn-primary btn-sm"><RotateCw size={12} /> Travail sur 2 exercices</button>
        </div>
      </div>

      {/* Banner deux exercices */}
      <div className="card bg-gradient-to-r from-blue-50 to-white border-l-4 border-l-secondary flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-100 grid place-items-center flex-shrink-0">
          <RotateCw size={16} className="text-secondary" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-neutral-800">Travail en parallèle sur 2 exercices</div>
          <p className="text-[11px] text-neutral-600 mt-0.5">
            Exercice <strong>2025-2026</strong> en cours de clôture · Exercice <strong>2026-2027</strong> déjà démarré (saisies courantes possibles).
            Les à-nouveaux seront générés automatiquement au verrouillage final.
          </p>
        </div>
        <span className="badge badge-blue text-[10px]">Auto-A.N.</span>
      </div>

      {/* État */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {sections[0].items.map(s => (
          <div key={s.label} className="card">
            <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">{s.label}</div>
            <div className="mt-1.5 text-lg font-bold text-primary">{s.value}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Frise des 5 phases */}
      <div className="card">
        <h3 className="text-sm font-bold text-neutral-700 mb-5">Phases de clôture annuelle</h3>
        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-neutral-200" />

          <div className="space-y-6">
            {phases.map(p => {
              const meta = statusMeta[p.status];
              const done = p.steps.filter(s => s.done).length;
              return (
                <div key={p.n} className="relative pl-14">
                  {/* Bullet */}
                  <div className={`absolute left-2 top-1 w-7 h-7 rounded-full grid place-items-center text-xs font-bold border-2 border-white shadow-sm ${
                    (p.status as string) === 'active' ? 'bg-secondary text-white' :
                    (p.status as string) === 'done'   ? 'bg-success text-white'   :
                                                        'bg-neutral-100 text-neutral-500'
                  }`}>
                    {(p.status as string) === 'done' ? <CheckCircle size={13} /> : p.n}
                  </div>

                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-neutral-800">Phase {p.n} · {p.title}</span>
                        <span className={`badge ${meta.cls} text-[10px]`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-2">
                        <Calendar size={11} /> {p.dates}
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {done} / {p.steps.length} étapes
                    </div>
                  </div>

                  {/* Substeps */}
                  <ul className="mt-3 space-y-1.5">
                    {p.steps.map((step, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-neutral-600">
                        {step.done ? <CheckCircle size={12} className="text-success" /> : <Clock size={12} className="text-neutral-300" />}
                        <span className={step.done ? 'line-through text-neutral-400' : ''}>{step.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-700">Préparation anticipée — IA</div>
          <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
            Sur la base de l'exercice précédent, voici les points à anticiper dès maintenant :
          </p>
          <ul className="mt-2 space-y-1.5 text-[11px] text-neutral-700">
            <li className="flex items-start gap-2">
              <ChevronRight size={11} className="text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Inventaire stocks à programmer entre le 25 et le 30 juin (3 jours requis)</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight size={11} className="text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Provision créances douteuses estimée à <strong>4,1 M XOF</strong> (vs 3,2 M en N-1)</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight size={11} className="text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Cabinet Issa Yomenou : prévoir 5 jours de revue entre le 15 et le 20 août</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Comparatif N-1 */}
      <div className="card">
        <h3 className="text-sm font-bold text-neutral-700 mb-4">Aperçu provisoire vs exercice précédent</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Comparatif label="CA prévisionnel" cur={fmt(540_000_000)} prev={fmt(478_200_000)} unit="XOF" delta={+12.9} />
          <Comparatif label="Résultat net" cur={fmt(58_000_000)} prev={fmt(46_500_000)} unit="XOF" delta={+24.7} />
          <Comparatif label="Marge nette" cur="10,7 %" prev="9,7 %" unit="" delta={+1.0} />
        </div>
        <div className="mt-3 text-[11px] text-neutral-500 italic">
          Valeurs basées sur le réalisé à fin mai 2026 + projection juin selon le scénario "Base" de la Modélisation.
        </div>
      </div>
    </div>
  );
}

function Comparatif({ label, cur, prev, unit, delta }: { label: string; cur: string; prev: string; unit: string; delta: number }) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50/40 p-4">
      <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-semibold">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-bold text-primary">{cur}</span>
        <span className="text-[10px] text-neutral-400">{unit}</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-[11px]">
        <span className="text-neutral-500">N-1 : {prev}</span>
        <span className={`font-bold ${delta >= 0 ? 'text-success' : 'text-danger'}`}>
          {delta >= 0 ? '+' : ''}{delta.toFixed(1)} %
        </span>
      </div>
    </div>
  );
}
