import { useState } from 'react';
import {
  Building2, Percent, BookOpen, Calendar, Users, Shield, FileText,
  Save, ChevronRight, Check, Edit, Plus, Sparkles,
} from 'lucide-react';

type Tab = 'general' | 'fiscal' | 'plan' | 'exercices' | 'users' | 'roles' | 'modeles';

interface TabDef { id: Tab; label: string; icon: React.ElementType; description: string; color: string; }
const tabs: TabDef[] = [
  { id: 'general',   label: 'Général',        icon: Building2, description: 'Identité de l\'entreprise', color: '#2980B9' },
  { id: 'fiscal',    label: 'Fiscalité',      icon: Percent,    description: 'Régime fiscal et taux', color: '#22D3EE' },
  { id: 'plan',      label: 'Plan comptable', icon: BookOpen,   description: 'SYSCOHADA & personnalisations', color: '#F87171' },
  { id: 'exercices', label: 'Exercices',      icon: Calendar,   description: 'Périodes comptables', color: '#F472B6' },
  { id: 'users',     label: 'Utilisateurs',   icon: Users,      description: 'Comptes et accès', color: '#27AE60' },
  { id: 'roles',     label: 'Rôles & droits', icon: Shield,     description: 'RBAC et permissions', color: '#9B59B6' },
  { id: 'modeles',   label: 'Modèles',        icon: FileText,   description: 'Factures, devis, relances', color: '#E67E22' },
];

const usersList = [
  { name: 'Hermann Cakpo',    email: 'h.cakpo@ohady.sn',     role: 'DAF',              twofa: true,  last: 'Maintenant' },
  { name: 'Doudou Sow',       email: 'd.sow@ohady.sn',       role: 'Chef comptable',   twofa: true,  last: 'il y a 1h' },
  { name: 'Awa Diallo',       email: 'a.diallo@ohady.sn',    role: 'Comptable junior', twofa: true,  last: 'il y a 2h' },
  { name: 'Fatou Ndiaye',     email: 'f.ndiaye@ohady.sn',    role: 'Comptable junior', twofa: false, last: 'il y a 5h' },
  { name: 'Elis Kouakou',     email: 'e.kouakou@ohady.sn',   role: 'Finance',           twofa: true,  last: 'Hier' },
  { name: 'Issa Yomenou',     email: 'i.yomenou@cabinet.sn', role: 'Expert-comptable', twofa: true,  last: '12/05' },
];

const rolesList = [
  { name: 'DAF',                count: 1, perm: 'Accès complet à tous les modules · Validation finale', color: '#E74C3C' },
  { name: 'Chef comptable',     count: 1, perm: 'Compta + validation écritures + clôture', color: '#9B59B6' },
  { name: 'Comptable junior',   count: 2, perm: 'Saisie + rapprochement · Soumission uniquement', color: '#2980B9' },
  { name: 'Trésorier',          count: 1, perm: 'Trésorerie · Bons de dépense · Caisse', color: '#27AE60' },
  { name: 'Expert-comptable',   count: 1, perm: 'Lecture + commentaires · Révocable', color: '#E67E22' },
  { name: 'Auditeur externe',   count: 0, perm: 'Lecture seule · Accès ponctuel', color: '#F39C12' },
];

const exercices = [
  { id: 'ex1', annee: '2025-2026', debut: '01/07/2025', fin: '30/06/2026', statut: 'actif',     mois: 11 },
  { id: 'ex2', annee: '2024-2025', debut: '01/07/2024', fin: '30/06/2025', statut: 'cloture',   mois: 12 },
  { id: 'ex3', annee: '2023-2024', debut: '01/07/2023', fin: '30/06/2024', statut: 'archive',   mois: 12 },
];

const modelesDocs = [
  { id: 'm1', label: 'Facture standard',          format: 'PDF',  modified: '12/05/2026', actif: true },
  { id: 'm2', label: 'Facture multi-langues',     format: 'PDF',  modified: '02/04/2026', actif: false },
  { id: 'm3', label: 'Devis professionnel',       format: 'PDF',  modified: '08/05/2026', actif: true },
  { id: 'm4', label: 'Relance amiable',            format: 'Email', modified: '15/04/2026', actif: true },
  { id: 'm5', label: 'Relance ferme',              format: 'Email', modified: '15/04/2026', actif: true },
  { id: 'm6', label: 'Mise en demeure',            format: 'PDF',  modified: '20/03/2026', actif: true },
];

export default function Parametres() {
  const [tab, setTab] = useState<Tab>('general');

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Paramètres généraux</h1>
          <p className="text-sm text-neutral-500 mt-0.5">7 sections de configuration · Entièrement paramétrable, aucune valeur en dur</p>
        </div>
        <button className="btn btn-primary btn-sm"><Save size={12} /> Enregistrer</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-5">
        {/* Onglets verticaux */}
        <div className="card !p-0 overflow-hidden h-fit xl:sticky xl:top-20">
          <div className="divide-y divide-neutral-50">
            {tabs.map((t, i) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 ${
                    active ? 'bg-secondary/5 border-l-2 border-secondary' : 'hover:bg-neutral-50/50'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg grid place-items-center flex-shrink-0"
                    style={{ background: `${t.color}15`, color: t.color }}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                      <span className="text-neutral-400 font-mono">{String(i + 1).padStart(2, '0')}</span>
                      {t.label}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5 truncate">{t.description}</div>
                  </div>
                  <ChevronRight size={12} className={`text-neutral-300 ${active ? 'text-secondary' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu */}
        <div className="space-y-4">
          {/* GENERAL */}
          {tab === 'general' && (
            <>
              <SectionCard title="Identité de l'entreprise" icon={Building2} color="#2980B9">
                <FormGrid>
                  <Field label="Raison sociale" value="Tech Solutions SARL" />
                  <Field label="NINEA" value="007234821 B2" mono />
                  <Field label="Registre du commerce (RC)" value="2019-B-2847" mono />
                  <Field label="Forme juridique" value="SARL" />
                  <Field label="Capital social" value="50 000 000 XOF" />
                  <Field label="Activité principale" value="Conseil & ingénierie B2B" />
                </FormGrid>
              </SectionCard>
              <SectionCard title="Coordonnées" icon={Building2}>
                <FormGrid>
                  <Field label="Adresse" value="Plateau, 23 Av. Léopold Sédar Senghor" />
                  <Field label="Ville" value="Dakar" />
                  <Field label="Pays" value="Sénégal" />
                  <Field label="Téléphone" value="+221 33 859 12 34" mono />
                  <Field label="Email" value="contact@techsolutions.sn" />
                  <Field label="Site web" value="www.techsolutions.sn" />
                </FormGrid>
              </SectionCard>
            </>
          )}

          {/* FISCAL */}
          {tab === 'fiscal' && (
            <>
              <SectionCard title="Régime fiscal" icon={Percent} color="#22D3EE">
                <FormGrid>
                  <Field label="Régime fiscal" value="Réel Normal" />
                  <Field label="Système comptable" value="Normal (SYSCOHADA Révisé)" />
                  <Field label="Devise principale" value="XOF (Franc CFA)" />
                  <Field label="Devise de reporting" value="XOF" />
                  <Field label="N° agrément DGID" value="DGI-SN-002584" mono />
                  <Field label="Code centre des impôts" value="DAKAR-PLATEAU-01" mono />
                </FormGrid>
              </SectionCard>
              <SectionCard title="Taux & seuils fiscaux" icon={Percent}>
                <FormGrid cols={3}>
                  <Field label="TVA standard" value="18 %" />
                  <Field label="TVA réduite" value="10 %" />
                  <Field label="TVA exonérée" value="0 %" />
                  <Field label="Impôt sur les sociétés" value="30 %" />
                  <Field label="BRS prestations" value="5 %" />
                  <Field label="IRPP max" value="43 %" />
                  <Field label="RAS non-résidents" value="20 %" />
                  <Field label="Patente locale" value="2,5 %" />
                  <Field label="Seuil approbation N1" value="500 000 XOF" />
                </FormGrid>
              </SectionCard>
            </>
          )}

          {/* PLAN COMPTABLE */}
          {tab === 'plan' && (
            <SectionCard title="Plan comptable SYSCOHADA Révisé" icon={BookOpen} color="#F87171">
              <p className="text-xs text-neutral-600 mb-4">
                Le plan comptable contient les <strong>7 classes</strong> SYSCOHADA Révisé.
                Vous pouvez ajouter des sous-comptes auxiliaires (par tiers, par projet, par produit).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { c: '1', l: 'Comptes de ressources durables', n: 24 },
                  { c: '2', l: 'Comptes d\'actif immobilisé', n: 38 },
                  { c: '3', l: 'Comptes de stocks', n: 12 },
                  { c: '4', l: 'Comptes de tiers', n: 87 },
                  { c: '5', l: 'Comptes de trésorerie', n: 11 },
                  { c: '6', l: 'Comptes de charges', n: 56 },
                  { c: '7', l: 'Comptes de produits', n: 14 },
                ].map(c => (
                  <div key={c.c} className="rounded-lg border border-neutral-100 bg-neutral-50/40 p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary font-bold text-sm grid place-items-center flex-shrink-0">
                      {c.c}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-neutral-800">{c.l}</div>
                      <div className="text-[10px] text-neutral-500">{c.n} comptes</div>
                    </div>
                    <button className="btn btn-outline btn-sm"><Edit size={11} /></button>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline btn-sm mt-4"><Plus size={12} /> Ajouter une sous-classe</button>
            </SectionCard>
          )}

          {/* EXERCICES */}
          {tab === 'exercices' && (
            <SectionCard title="Exercices comptables" icon={Calendar} color="#F472B6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                      <th className="text-left px-3 py-2 font-semibold">Exercice</th>
                      <th className="text-left px-2 py-2 font-semibold">Période</th>
                      <th className="text-right px-2 py-2 font-semibold">Mois clôturés</th>
                      <th className="text-center px-2 py-2 font-semibold">Statut</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercices.map(e => (
                      <tr key={e.id} className="border-t border-neutral-50">
                        <td className="px-3 py-2.5 font-semibold text-neutral-800">{e.annee}</td>
                        <td className="px-2 py-2.5 text-xs text-neutral-500 font-mono">{e.debut} → {e.fin}</td>
                        <td className="px-2 py-2.5 text-right">
                          <span className="text-xs font-mono font-bold text-secondary">{e.mois} / 12</span>
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <span className={`badge text-[10px] ${
                            e.statut === 'actif' ? 'badge-blue' : e.statut === 'cloture' ? 'badge-green' : 'badge-gray'
                          }`}>
                            {e.statut === 'actif' ? 'En cours' : e.statut === 'cloture' ? 'Clôturé' : 'Archivé'}
                          </span>
                        </td>
                        <td className="px-2 py-2.5">
                          <button className="btn btn-outline btn-sm"><Edit size={11} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="btn btn-outline btn-sm mt-4"><Plus size={12} /> Nouvel exercice</button>
            </SectionCard>
          )}

          {/* USERS */}
          {tab === 'users' && (
            <SectionCard title={`Utilisateurs (${usersList.length})`} icon={Users} color="#27AE60">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                      <th className="text-left px-3 py-2 font-semibold">Utilisateur</th>
                      <th className="text-left px-2 py-2 font-semibold">Email</th>
                      <th className="text-left px-2 py-2 font-semibold">Rôle</th>
                      <th className="text-center px-2 py-2 font-semibold">2FA</th>
                      <th className="text-left px-2 py-2 font-semibold">Dernière connexion</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u.email} className="border-t border-neutral-50">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-secondary/10 grid place-items-center text-secondary text-xs font-bold flex-shrink-0">
                              {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </div>
                            <span className="text-sm font-semibold text-neutral-800">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2.5 text-xs text-neutral-500 font-mono">{u.email}</td>
                        <td className="px-2 py-2.5"><span className="badge badge-blue text-[10px]">{u.role}</span></td>
                        <td className="px-2 py-2.5 text-center">
                          {u.twofa ? <Check size={14} className="text-success inline" /> : <span className="text-warning text-xs">Off</span>}
                        </td>
                        <td className="px-2 py-2.5 text-xs text-neutral-500">{u.last}</td>
                        <td className="px-2 py-2.5">
                          <button className="btn btn-outline btn-sm"><Edit size={11} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button className="btn btn-primary btn-sm"><Plus size={12} /> Inviter un utilisateur</button>
                <span className="text-[11px] text-neutral-500 ml-2">2FA exigée pour tous les utilisateurs ayant accès à la validation des écritures.</span>
              </div>
            </SectionCard>
          )}

          {/* ROLES */}
          {tab === 'roles' && (
            <SectionCard title="Rôles & permissions" icon={Shield} color="#9B59B6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rolesList.map(r => (
                  <div key={r.name} className="rounded-xl border border-neutral-100 p-3 hover:shadow-card-md transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg grid place-items-center text-white text-xs font-bold flex-shrink-0" style={{ background: r.color }}>
                          {r.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-800">{r.name}</div>
                          <div className="text-[10px] text-neutral-500">{r.count} utilisateur{r.count > 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <button className="btn btn-outline btn-sm"><Edit size={11} /></button>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-2 leading-snug">{r.perm}</p>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline btn-sm mt-4"><Plus size={12} /> Nouveau rôle</button>
            </SectionCard>
          )}

          {/* MODELES */}
          {tab === 'modeles' && (
            <SectionCard title="Modèles de documents" icon={FileText} color="#E67E22">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-neutral-400 text-[10px] uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/60">
                      <th className="text-left px-3 py-2 font-semibold">Modèle</th>
                      <th className="text-left px-2 py-2 font-semibold">Format</th>
                      <th className="text-left px-2 py-2 font-semibold">Dernière modification</th>
                      <th className="text-center px-2 py-2 font-semibold">Statut</th>
                      <th className="w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelesDocs.map(m => (
                      <tr key={m.id} className="border-t border-neutral-50">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <FileText size={13} className="text-neutral-400" />
                            <span className="text-sm font-semibold text-neutral-800">{m.label}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2.5"><span className="badge badge-gray text-[10px]">{m.format}</span></td>
                        <td className="px-2 py-2.5 text-xs text-neutral-500">{m.modified}</td>
                        <td className="px-2 py-2.5 text-center">
                          <span className={`badge ${m.actif ? 'badge-green' : 'badge-gray'} text-[10px]`}>
                            {m.actif ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-2 py-2.5">
                          <button className="btn btn-outline btn-sm"><Edit size={11} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="btn btn-outline btn-sm mt-4"><Plus size={12} /> Importer un modèle</button>
            </SectionCard>
          )}

          {/* IA help footer */}
          <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
            <Sparkles size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-neutral-700 leading-relaxed">
              <strong>Tout est paramétrable.</strong> Aucune valeur métier n'est codée en dur — taux fiscaux, plan comptable,
              modèles, rôles, seuils, exercices : chaque entreprise les définit librement.
              L'IA peut suggérer une configuration optimale basée sur votre secteur d'activité.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, color = '#2980B9', children }: { title: string; icon: React.ElementType; color?: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg grid place-items-center flex-shrink-0" style={{ background: `${color}15`, color }}>
          <Icon size={16} />
        </div>
        <h2 className="text-base font-bold text-neutral-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FormGrid({ cols = 2, children }: { cols?: 2 | 3; children: React.ReactNode }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols === 3 ? 'xl:grid-cols-3' : ''} gap-4`}>
      {children}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wide text-neutral-500 font-semibold">{label}</label>
      <input
        type="text"
        defaultValue={value}
        className={`input mt-1 ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}
