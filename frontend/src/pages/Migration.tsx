import { useState } from 'react';
import {
  Upload, Database, ArrowRight, CheckCircle, AlertCircle, FileText, Sparkles,
  Loader2, ArrowLeft, FileSpreadsheet, FileCheck, Lock,
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4;
type Source = 'sage100' | 'sage1000' | 'excel' | 'ciel' | 'ebp' | 'manual';

const sources: { id: Source; label: string; sub: string; logo: string; color: string }[] = [
  { id: 'sage100',  label: 'Sage 100', sub: 'Comptabilité',  logo: 'S', color: '#00875A' },
  { id: 'sage1000', label: 'Sage 1000', sub: 'Gestion ERP',   logo: 'S', color: '#006644' },
  { id: 'excel',    label: 'Excel / CSV', sub: 'Fichier libre', logo: 'X', color: '#1F7244' },
  { id: 'ciel',     label: 'Ciel Compta', sub: 'Auto-entrepreneur', logo: 'C', color: '#0066B3' },
  { id: 'ebp',      label: 'EBP Compta', sub: 'PME', logo: 'E', color: '#E60028' },
  { id: 'manual',   label: 'Aucun (saisie manuelle)', sub: 'Nouveau dossier', logo: '+', color: '#94A3B8' },
];

const dataTypes = [
  { id: 'pc',      label: 'Plan comptable',      count: 248, status: 'ready' as const,  required: true },
  { id: 'tiers',   label: 'Tiers (clients/fourn.)', count: 156, status: 'ready' as const,  required: true },
  { id: 'balance', label: 'Balance d\'ouverture',  count: 87,  status: 'ready' as const,  required: true },
  { id: 'immob',   label: 'Immobilisations',      count: 24,  status: 'mapping' as const, required: false },
  { id: 'art',     label: 'Articles & catalogue', count: 89,  status: 'warning' as const, required: false },
  { id: 'hist',    label: 'Écritures historiques (3 ans)', count: 12_400, status: 'ready' as const, required: false },
];

const statusDataMeta = {
  ready:   { label: 'Prêt à importer', cls: 'badge-green', icon: CheckCircle, color: 'text-success' },
  mapping: { label: 'Mapping requis',  cls: 'badge-blue',  icon: ArrowRight,  color: 'text-secondary' },
  warning: { label: 'À revoir',        cls: 'badge-orange', icon: AlertCircle, color: 'text-warning' },
};

export default function Migration() {
  const [step, setStep] = useState<Step>(1);
  const [source, setSource] = useState<Source | null>(null);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  const launch = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
      setStep(4);
    }, 2500);
  };

  const steps = [
    { n: 1, title: 'Source',         desc: 'Choisir l\'outil d\'origine' },
    { n: 2, title: 'Import fichiers', desc: 'Téléverser exports / Excel' },
    { n: 3, title: 'Mapping & contrôle', desc: 'Vérifier les correspondances' },
    { n: 4, title: 'Validation',     desc: 'Lancement définitif' },
  ];

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Database size={20} className="text-secondary" /> Assistant de migration
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Importez vos données existantes vers OHADY en 4 étapes</p>
        </div>
        {done && (
          <span className="badge badge-green text-[10px]">
            <CheckCircle size={9} /> Migration terminée
          </span>
        )}
      </div>

      {/* Stepper */}
      <div className="card">
        <div className="flex items-start gap-2">
          {steps.map((s, i) => {
            const active = step === s.n;
            const completed = step > s.n;
            return (
              <div key={s.n} className="flex-1 flex items-start gap-2">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full grid place-items-center font-bold text-sm transition-all ${
                    completed ? 'bg-success text-white' : active ? 'bg-secondary text-white shadow-md' : 'bg-neutral-100 text-neutral-400'
                  }`}>
                    {completed ? <CheckCircle size={16} /> : s.n}
                  </div>
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <div className={`text-xs font-bold ${active ? 'text-neutral-800' : completed ? 'text-success' : 'text-neutral-400'}`}>
                    Étape {s.n} · {s.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 truncate">{s.desc}</div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 mt-3 mr-2 rounded-full ${completed ? 'bg-success' : 'bg-neutral-100'}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1 — Source */}
      {step === 1 && (
        <div className="card">
          <h2 className="text-base font-bold text-neutral-800 mb-2">Quel est votre outil actuel ?</h2>
          <p className="text-sm text-neutral-500 mb-5">Sélectionnez la source d'origine de vos données comptables.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sources.map(s => {
              const active = source === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSource(s.id)}
                  className={`card-sm text-left transition-all hover:shadow-card-md border-2 ${
                    active ? 'border-secondary shadow-md bg-secondary/5' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl grid place-items-center text-white font-bold text-base flex-shrink-0" style={{ background: s.color }}>
                      {s.logo}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-800">{s.label}</div>
                      <div className="text-[11px] text-neutral-500">{s.sub}</div>
                    </div>
                    {active && <CheckCircle size={14} className="text-secondary ml-auto" />}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setStep(2)} disabled={!source} className={`btn btn-sm ${source ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'}`}>
              Continuer <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Import */}
      {step === 2 && (
        <>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-neutral-800">Téléversez vos exports</h2>
              <span className="text-[11px] text-neutral-500">Source : <strong>{sources.find(s => s.id === source)?.label}</strong></span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Export plan comptable',        format: '.txt / .csv / .xls', required: true, file: 'plan_comptable_2026.csv', size: '128 Ko' },
                { label: 'Export balance d\'ouverture',  format: '.csv / .xls', required: true,  file: 'balance_01072025.xls', size: '46 Ko' },
                { label: 'Export tiers (clients/fournisseurs)', format: '.csv', required: true,  file: 'tiers.csv', size: '92 Ko' },
                { label: 'Export immobilisations',       format: '.csv',  required: false, file: 'immo.csv', size: '18 Ko' },
                { label: 'Écritures historiques (optionnel)', format: '.txt / .csv', required: false, file: null, size: null },
              ].map((f, i) => (
                <div key={i} className="rounded-lg border border-neutral-100 bg-neutral-50/40 p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-white border border-neutral-100 grid place-items-center flex-shrink-0">
                    <FileSpreadsheet size={14} className="text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-800">{f.label}</span>
                      {f.required && <span className="badge badge-red text-[9px]">Requis</span>}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">Format accepté : <span className="font-mono">{f.format}</span></div>
                  </div>
                  {f.file ? (
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-[11px] font-mono text-neutral-700">{f.file}</div>
                        <div className="text-[10px] text-neutral-400">{f.size}</div>
                      </div>
                      <CheckCircle size={14} className="text-success" />
                    </div>
                  ) : (
                    <button className="btn btn-outline btn-sm"><Upload size={11} /> Téléverser</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <button onClick={() => setStep(1)} className="btn btn-outline btn-sm"><ArrowLeft size={12} /> Retour</button>
            <button onClick={() => setStep(3)} className="btn btn-primary btn-sm">Analyser le mapping <ArrowRight size={12} /></button>
          </div>
        </>
      )}

      {/* Step 3 — Mapping */}
      {step === 3 && (
        <>
          <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
            <Sparkles size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-neutral-700 leading-relaxed">
              <strong>L'IA a analysé vos fichiers</strong> et créé automatiquement les correspondances entre votre plan comptable {sources.find(s => s.id === source)?.label} et SYSCOHADA Révisé.
              <br />Confiance moyenne : <strong className="text-success">94 %</strong> · 8 comptes nécessitent une revue manuelle.
            </div>
          </div>

          <div className="card !p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-700">Données détectées</h3>
            </div>
            <div className="divide-y divide-neutral-50">
              {dataTypes.map(d => {
                const meta = statusDataMeta[d.status];
                const Icon = meta.icon;
                return (
                  <div key={d.id} className="px-5 py-3 flex items-center gap-3 hover:bg-neutral-50/40 transition-colors">
                    <div className={`w-9 h-9 rounded-lg bg-neutral-50 grid place-items-center ${meta.color} flex-shrink-0`}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-800">{d.label}</span>
                        {d.required && <span className="badge badge-gray text-[9px]">Requis</span>}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 font-mono">{d.count.toLocaleString('fr-FR')} lignes détectées</div>
                    </div>
                    <span className={`badge ${meta.cls} text-[10px]`}>
                      <Icon size={9} /> {meta.label}
                    </span>
                    <button className="btn btn-outline btn-sm"><ArrowRight size={11} /> Mapping</button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <button onClick={() => setStep(2)} className="btn btn-outline btn-sm"><ArrowLeft size={12} /> Retour</button>
            <button onClick={launch} disabled={importing} className="btn btn-primary btn-sm">
              {importing ? <><Loader2 size={12} className="animate-spin" /> Import en cours...</> : <>Lancer la migration <ArrowRight size={12} /></>}
            </button>
          </div>
        </>
      )}

      {/* Step 4 — Done */}
      {step === 4 && done && (
        <>
          <div className="card border-l-4 border-l-green-400 bg-green-50/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-success grid place-items-center text-white flex-shrink-0">
                <FileCheck size={20} />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-neutral-800">Migration terminée avec succès</div>
                <p className="text-xs text-neutral-600 mt-1">
                  Vos données sont maintenant intégrées à OHADY. Vous pouvez commencer à saisir vos écritures et à utiliser les modules.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <StatTile label="Comptes" value="248" />
                  <StatTile label="Tiers" value="156" />
                  <StatTile label="Soldes ouverts" value="87" />
                  <StatTile label="Anomalies" value="3" tone="warning" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-bold text-neutral-700 mb-3">Recommandations IA — Prochaines étapes</h3>
            <ul className="space-y-2 text-xs text-neutral-700">
              <RecLine label="Vérifier les 3 anomalies détectées (comptes mappés avec confiance &lt; 80 %)" badge="À faire" badgeColor="badge-orange" />
              <RecLine label="Lancer le 1er rapprochement bancaire pour valider les soldes d'ouverture" badge="Recommandé" badgeColor="badge-blue" />
              <RecLine label="Inviter les utilisateurs internes (DAF, comptables, trésorier)" badge="Recommandé" badgeColor="badge-blue" />
              <RecLine label="Configurer les modèles de factures et devis aux couleurs de votre entreprise" badge="Optionnel" badgeColor="badge-gray" />
              <RecLine label="Activer la facturation électronique DGID si pas encore fait" badge="Optionnel" badgeColor="badge-gray" />
            </ul>
          </div>

          <div className="card flex flex-wrap items-center justify-between gap-3 bg-neutral-50/40">
            <div className="flex items-center gap-3">
              <Lock size={14} className="text-neutral-400" />
              <div>
                <div className="text-xs font-bold text-neutral-800">Sauvegarde automatique</div>
                <div className="text-[11px] text-neutral-500">Vos données sont chiffrées (AES-256) et sauvegardées quotidiennement.</div>
              </div>
            </div>
            <button className="btn btn-primary btn-sm">Aller au tableau de bord <ArrowRight size={12} /></button>
          </div>
        </>
      )}
    </div>
  );
}

function StatTile({ label, value, tone = 'primary' }: { label: string; value: string; tone?: 'primary' | 'warning' }) {
  return (
    <div className="rounded-lg border border-neutral-100 bg-white p-3">
      <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-semibold">{label}</div>
      <div className={`mt-1 text-lg font-bold ${tone === 'warning' ? 'text-warning' : 'text-primary'}`}>{value}</div>
    </div>
  );
}

function RecLine({ label, badge, badgeColor }: { label: string; badge: string; badgeColor: string }) {
  return (
    <li className="flex items-start gap-2">
      <FileText size={11} className="text-neutral-400 mt-0.5 flex-shrink-0" />
      <span className="flex-1" dangerouslySetInnerHTML={{ __html: label }} />
      <span className={`badge ${badgeColor} text-[10px]`}>{badge}</span>
    </li>
  );
}
