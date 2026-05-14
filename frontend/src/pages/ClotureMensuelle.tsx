import { useState } from 'react';
import {
  CheckCircle, Circle, AlertTriangle, Clock, Lock, Sparkles, ArrowRight,
  ChevronDown, ChevronRight, FileText, Calculator,
} from 'lucide-react';
import { fmt } from '../data/mockData';

interface Step {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'done' | 'in_progress' | 'todo' | 'warn';
  assignee?: string;
  controle?: string;
  detail?: string;
}

const steps: Step[] = [
  // Saisie
  { id: 's1', category: 'Saisie & rapprochement', title: 'Saisie des écritures du mois', description: 'Toutes les pièces du mois sont saisies (achats, ventes, banque, caisse, OD)', status: 'done', assignee: 'Awa', detail: '418 écritures saisies' },
  { id: 's2', category: 'Saisie & rapprochement', title: 'Rapprochement bancaire SGBS',  description: 'Solde compta = solde relevé', status: 'done',  assignee: 'Awa', detail: 'Écart 0 XOF' },
  { id: 's3', category: 'Saisie & rapprochement', title: 'Rapprochement CBAO + Wave',     description: 'Comptes secondaires rapprochés', status: 'in_progress', assignee: 'Awa', detail: '2/2 en cours' },
  { id: 's4', category: 'Saisie & rapprochement', title: 'Arrêté de caisse',              description: 'Décompte physique = compta', status: 'done',  assignee: 'Trésorier' },
  // Régularisations
  { id: 'r1', category: 'Régularisations', title: 'Dotations aux amortissements',         description: 'Calcul + écriture OD pour le mois', status: 'done',  assignee: 'IA + Doudou', detail: '285 000 XOF' },
  { id: 'r2', category: 'Régularisations', title: 'Provisions clients douteux',           description: 'Revue ICTS Global + autres > 90j', status: 'warn', assignee: 'Doudou', controle: 'À vérifier — provision 3,8 M XOF manquante' },
  { id: 'r3', category: 'Régularisations', title: 'Charges constatées d\'avance',         description: 'Loyer, assurances payés en avance', status: 'todo', assignee: 'Doudou' },
  { id: 'r4', category: 'Régularisations', title: 'Produits à recevoir',                  description: 'Prestations non encore facturées', status: 'todo', assignee: 'Doudou' },
  // Contrôles
  { id: 'c1', category: 'Contrôles & révision', title: 'Anomalies IA résolues',          description: 'Toutes les alertes Intelligence IA traitées', status: 'in_progress', assignee: 'Doudou', detail: '5/7 résolues' },
  { id: 'c2', category: 'Contrôles & révision', title: 'Écritures en suspens',           description: 'Compte 47100 vidé', status: 'warn', assignee: 'Doudou', controle: '185 000 XOF en suspens depuis 23j' },
  { id: 'c3', category: 'Contrôles & révision', title: 'Validation écritures juniors',    description: 'Brouillons + soumis → validés', status: 'todo', assignee: 'Doudou', detail: '12 écritures en attente' },
  // Fiscal
  { id: 'f1', category: 'Fiscal & social', title: 'TVA collectée vs comptabilité',         description: 'Concordance compte 44310 et CA', status: 'done', assignee: 'Doudou', detail: 'TVA à verser : 1 240 000 XOF' },
  { id: 'f2', category: 'Fiscal & social', title: 'Préparation déclaration TVA',           description: 'Génération du formulaire DGID', status: 'in_progress', assignee: 'IA + Doudou' },
  { id: 'f3', category: 'Fiscal & social', title: 'Préparation BRS + IRPP',                description: 'Bordereaux retenues à la source', status: 'todo', assignee: 'Doudou' },
  // Édition
  { id: 'e1', category: 'Édition & verrouillage', title: 'Balance générale mai',          description: 'Édition + contrôle équilibre', status: 'todo', assignee: 'Doudou' },
  { id: 'e2', category: 'Édition & verrouillage', title: 'Grand livre des comptes clés',    description: 'Export PDF pour archivage', status: 'todo', assignee: 'Doudou' },
  { id: 'e3', category: 'Édition & verrouillage', title: 'Verrouillage du mois',            description: 'Lock définitif des écritures de mai', status: 'todo', assignee: 'Doudou' },
];

const categories = ['Saisie & rapprochement', 'Régularisations', 'Contrôles & révision', 'Fiscal & social', 'Édition & verrouillage'];

const statusMeta = {
  done:        { label: 'Fait',          icon: CheckCircle, color: 'text-success', bg: 'bg-green-50', dot: 'bg-success' },
  in_progress: { label: 'En cours',      icon: Clock,       color: 'text-secondary', bg: 'bg-blue-50',  dot: 'bg-secondary' },
  todo:        { label: 'À faire',        icon: Circle,      color: 'text-neutral-400', bg: 'bg-neutral-50', dot: 'bg-neutral-300' },
  warn:        { label: 'À surveiller',  icon: AlertTriangle, color: 'text-warning', bg: 'bg-orange-50', dot: 'bg-warning' },
};

export default function ClotureMensuelle() {
  const [openCats, setOpenCats] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map(c => [c, true]))
  );

  const total = steps.length;
  const done = steps.filter(s => s.status === 'done').length;
  const inProgress = steps.filter(s => s.status === 'in_progress').length;
  const warn = steps.filter(s => s.status === 'warn').length;
  const progress = Math.round((done / total) * 100);

  const toggle = (c: string) => setOpenCats(p => ({ ...p, [c]: !p[c] }));

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Lock size={20} className="text-primary" /> Clôture mensuelle — Mai 2026
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Checklist guidée par l'IA · Cible : 31 mai 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm">Brouillon</button>
          <button disabled={done < total} className={`btn btn-sm ${done === total ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'}`}>
            <Lock size={12} /> Verrouiller la clôture
          </button>
        </div>
      </div>

      {/* Progress bar global */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-neutral-800">Progression globale — {progress} %</h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">{done} étapes complétées sur {total}</p>
          </div>
          <span className={`badge text-[10px] ${
            progress === 100 ? 'badge-green' : progress >= 70 ? 'badge-blue' : 'badge-orange'
          }`}>
            {progress === 100 ? 'Prête à verrouiller' : progress >= 70 ? 'Avancée' : 'À compléter'}
          </span>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 flex">
            <div className="bg-success" style={{ width: `${(done / total) * 100}%` }} />
            <div className="bg-secondary" style={{ width: `${(inProgress / total) * 100}%` }} />
            <div className="bg-warning" style={{ width: `${(warn / total) * 100}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <Legend dot="bg-success" label="Fait" value={done} />
          <Legend dot="bg-secondary" label="En cours" value={inProgress} />
          <Legend dot="bg-warning" label="À surveiller" value={warn} />
          <Legend dot="bg-neutral-300" label="À faire" value={steps.filter(s => s.status === 'todo').length} />
        </div>
      </div>

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-700">Assistant clôture — 2 points bloquants détectés</div>
          <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
            <strong>1.</strong> Provision créances douteuses ICTS Global manquante (3,8 M XOF, 72j de retard) — impact sur le résultat net.
            <br />
            <strong>2.</strong> 185 000 XOF en suspens (compte 47100) depuis 23 jours — à reclasser avant le 31/05.
          </p>
          <button className="mt-2 btn btn-outline btn-sm border-purple-200 text-purple-700">
            Voir les recommandations détaillées <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Checklist par catégorie */}
      <div className="space-y-3">
        {categories.map(cat => {
          const stepsCat = steps.filter(s => s.category === cat);
          const doneCat = stepsCat.filter(s => s.status === 'done').length;
          const isOpen = openCats[cat];
          return (
            <div key={cat} className="card !p-0 overflow-hidden">
              <button
                onClick={() => toggle(cat)}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50/50 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary/10 grid place-items-center flex-shrink-0">
                  {cat === 'Fiscal & social' ? <Calculator size={15} className="text-secondary" /> : <FileText size={15} className="text-secondary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-neutral-800">{cat}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">{doneCat} / {stepsCat.length} étapes</div>
                </div>
                <div className="w-32 h-1.5 bg-neutral-100 rounded-full overflow-hidden hidden md:block">
                  <div className="h-full bg-success rounded-full transition-all" style={{ width: `${(doneCat / stepsCat.length) * 100}%` }} />
                </div>
                {isOpen ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
              </button>
              {isOpen && (
                <div className="divide-y divide-neutral-50 border-t border-neutral-100">
                  {stepsCat.map(s => {
                    const meta = statusMeta[s.status];
                    const Icon = meta.icon;
                    return (
                      <div key={s.id} className="flex items-start gap-3 px-5 py-3 hover:bg-neutral-50/40 transition-colors">
                        <Icon size={18} className={`${meta.color} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-neutral-800">{s.title}</span>
                            <span className={`badge ${s.status === 'done' ? 'badge-green' : s.status === 'in_progress' ? 'badge-blue' : s.status === 'warn' ? 'badge-orange' : 'badge-gray'} text-[10px]`}>
                              {meta.label}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">{s.description}</div>
                          {(s.detail || s.controle) && (
                            <div className={`mt-1.5 text-[11px] inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${s.status === 'warn' ? 'bg-orange-50 text-warning' : 'bg-neutral-50 text-neutral-600'}`}>
                              {s.status === 'warn' && <AlertTriangle size={10} />}
                              {s.controle || s.detail}
                            </div>
                          )}
                          {s.assignee && (
                            <div className="text-[10px] text-neutral-400 mt-1">Assigné : <span className="font-semibold text-neutral-600">{s.assignee}</span></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Récap résultat */}
      <div className="card bg-neutral-50/40">
        <h3 className="text-sm font-bold text-neutral-700 mb-3">Aperçu résultat — Mai 2026 (provisoire)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ResultItem label="CA mensuel" value={fmt(47_850_000)} color="text-secondary" />
          <ResultItem label="Charges" value={fmt(38_320_000)} color="text-neutral-700" />
          <ResultItem label="Résultat net (provisoire)" value={fmt(5_920_000)} color="text-success" />
          <ResultItem label="Marge nette" value="12,4 %" color="text-success" />
        </div>
      </div>
    </div>
  );
}

function Legend({ dot, label, value }: { dot: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
      <span className="text-neutral-500">{label}</span>
      <span className="font-bold text-neutral-800 ml-auto">{value}</span>
    </div>
  );
}

function ResultItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-semibold">{label}</div>
      <div className={`mt-1 text-lg font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
}
