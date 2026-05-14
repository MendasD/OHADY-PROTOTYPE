import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Building2, Shield, UserCog, Bell, Database,
  ChevronRight, Check, Plus, Edit, Trash2, Eye,
  Key, Smartphone, AlertCircle, CheckCircle,
} from 'lucide-react';

type AdminTab = 'parametrage' | 'utilisateurs' | 'securite';
const pathToTab: Record<string, AdminTab> = {
  '/administration': 'parametrage',
  '/utilisateurs': 'utilisateurs',
  '/securite': 'securite',
};
const tabToPath: Record<AdminTab, string> = {
  parametrage: '/administration',
  utilisateurs: '/utilisateurs',
  securite: '/securite',
};

const users = [
  { id: 'u1', name: 'Hermann Cakpo',    email: 'h.cakpo@ohady.sn',      role: 'DAF',              status: 'active',   twofa: true,  lastLogin: 'Maintenant' },
  { id: 'u2', name: 'Aminata Diallo',   email: 'a.diallo@ohady.sn',     role: 'Comptable junior', status: 'active',   twofa: true,  lastLogin: 'il y a 2h' },
  { id: 'u3', name: 'Fatou Ndiaye',     email: 'f.ndiaye@ohady.sn',     role: 'Comptable junior', status: 'active',   twofa: false, lastLogin: 'il y a 5h' },
  { id: 'u4', name: 'Oumar Seck',       email: 'o.seck@ohady.sn',       role: 'Chef comptable',   status: 'active',   twofa: true,  lastLogin: 'Hier' },
  { id: 'u5', name: 'Ibrahima Touré',   email: 'i.toure@ohady.sn',      role: 'Trésorier',        status: 'active',   twofa: true,  lastLogin: 'Hier' },
  { id: 'u6', name: 'Boukari Yomenou',  email: 'b.yomenou@cabinet.sn',  role: 'Expert-comptable', status: 'external', twofa: true,  lastLogin: '12/05/2026' },
  { id: 'u7', name: 'Raissa Abissama',  email: 'r.abissama@ohady.sn',   role: 'PMO',              status: 'inactive', twofa: false, lastLogin: '10/05/2026' },
];

const roles = [
  { id: 'daf',       name: 'DAF / Directeur Financier', users: 1, permissions: 'Accès complet — tous les modules', color: 'bg-red-100 text-red-800' },
  { id: 'chef_cpta', name: 'Chef Comptable',            users: 1, permissions: 'Comptabilité, validation, clôture, reporting', color: 'bg-purple-100 text-purple-800' },
  { id: 'cpta_jr',   name: 'Comptable Junior',          users: 2, permissions: 'Saisie, rapprochement — pas de validation', color: 'bg-blue-100 text-blue-800' },
  { id: 'tresorier', name: 'Trésorier',                 users: 1, permissions: 'Trésorerie, bons de dépense, encaissements', color: 'bg-green-100 text-green-800' },
  { id: 'ec',        name: 'Expert-Comptable',          users: 1, permissions: 'Lecture + commentaires — accès révocable', color: 'bg-orange-100 text-orange-800' },
  { id: 'pmo',       name: 'PMO / Administrateur',      users: 1, permissions: 'Administration, paramétrage, utilisateurs', color: 'bg-gray-100 text-gray-700' },
  { id: 'auditeur',  name: 'Auditeur',                  users: 0, permissions: 'Lecture seule — accès ponctuels', color: 'bg-yellow-100 text-yellow-800' },
];

const paramSections = [
  {
    label: 'Entreprise', icon: Building2, fields: [
      { label: 'Raison sociale',    value: 'Tech Solutions SARL',          type: 'text' },
      { label: 'NINEA',             value: '007234821 B2',                  type: 'text' },
      { label: 'RC',                value: '2019-B-2847',                   type: 'text' },
      { label: 'Forme juridique',   value: 'SARL',                         type: 'select', options: ['SARL', 'SA', 'SAS', 'GIE', 'SUARL'] },
      { label: 'Régime fiscal',     value: 'Réel Normal',                  type: 'select', options: ['Réel Normal', 'Réel Simplifié', 'Micro-entreprise'] },
      { label: 'Pays',              value: 'Sénégal',                       type: 'select', options: ['Sénégal', 'Côte d\'Ivoire', 'Cameroun', 'Mali'] },
    ],
  },
  {
    label: 'Comptabilité', icon: Database, fields: [
      { label: 'Système comptable', value: 'Normal',                       type: 'select', options: ['Normal', 'Allégé', 'SMT'] },
      { label: 'Devise principale', value: 'XOF (Franc CFA)',              type: 'select', options: ['XOF (Franc CFA)', 'EUR', 'USD'] },
      { label: 'Début exercice',    value: '01/07/2025',                   type: 'date' },
      { label: 'Fin exercice',      value: '30/06/2026',                   type: 'date' },
      { label: 'Taux TVA standard', value: '18%',                          type: 'text' },
      { label: 'Seuil approbation N1', value: '500 000 XOF',              type: 'text' },
    ],
  },
];

export default function Administration() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>(pathToTab[pathname] ?? 'parametrage');

  useEffect(() => {
    const t = pathToTab[pathname];
    if (t && t !== activeTab) setActiveTab(t);
  }, [pathname, activeTab]);

  const changeTab = (t: AdminTab) => {
    setActiveTab(t);
    if (tabToPath[t] !== pathname) navigate(tabToPath[t]);
  };

  const statusStyle: Record<string, { badge: string; label: string }> = {
    active:   { badge: 'badge-green', label: 'Actif'     },
    inactive: { badge: 'badge-gray',  label: 'Inactif'   },
    external: { badge: 'badge-blue',  label: 'Externe'   },
  };

  const avatarColor = (name: string) => {
    const colors = ['#2980B9', '#E67E22', '#27AE60', '#9B59B6', '#E74C3C', '#1ABC9C', '#F39C12'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Administration</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Paramétrage · Utilisateurs · Sécurité & RBAC</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        {[
          { id: 'parametrage',  label: 'Paramétrage',   icon: Building2 },
          { id: 'utilisateurs', label: 'Utilisateurs',  icon: UserCog   },
          { id: 'securite',     label: 'Sécurité',      icon: Shield    },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => changeTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-neutral-800 shadow-card' : 'text-neutral-500 hover:text-neutral-700'
              }`}>
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Parametrage tab */}
      {activeTab === 'parametrage' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {paramSections.map(section => {
            const Icon = section.icon;
            return (
              <div key={section.label} className="card">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Icon size={16} className="text-secondary" />
                  </div>
                  <h2 className="section-title">{section.label}</h2>
                </div>
                <div className="space-y-4">
                  {section.fields.map(field => (
                    <div key={field.label}>
                      <label>{field.label}</label>
                      {field.type === 'select' ? (
                        <select className="select" defaultValue={field.value}>
                          {field.options?.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={field.type === 'date' ? 'text' : 'text'} className="input" defaultValue={field.value} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-neutral-100 flex justify-end">
                  <button className="btn btn-primary btn-sm"><Check size={13} /> Enregistrer</button>
                </div>
              </div>
            );
          })}

          {/* Notifications */}
          <div className="card xl:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <Bell size={16} className="text-accent" />
              </div>
              <h2 className="section-title">Notifications & alertes</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {[
                { category: 'Trésorerie',   items: ['Solde sous le seuil d\'alerte', 'Rapprochement bancaire', 'Prévision tréso quotidienne'] },
                { category: 'Recouvrement', items: ['Facture en retard > 30j', 'Facture en retard > 60j', 'Avance non justifiée > seuil'] },
                { category: 'Comptabilité', items: ['Écriture non validée > 7j', 'Clôture mensuelle à venir', 'Déclaration TVA à préparer'] },
              ].map(group => (
                <div key={group.category}>
                  <div className="text-xs font-semibold text-neutral-700 mb-2">{group.category}</div>
                  <div className="space-y-2">
                    {group.items.map(item => (
                      <label key={item} className="flex items-center gap-2.5 cursor-pointer mb-0">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-xs text-neutral-600">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Utilisateurs tab */}
      {activeTab === 'utilisateurs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Utilisateurs actifs', value: users.filter(u=>u.status==='active').length, color: 'text-success' },
              { label: 'Externes',            value: users.filter(u=>u.status==='external').length, color: 'text-secondary' },
              { label: '2FA activé',          value: users.filter(u=>u.twofa).length, color: 'text-purple-600' },
              { label: 'Inactifs',            value: users.filter(u=>u.status==='inactive').length, color: 'text-neutral-400' },
            ].map(item => (
              <div key={item.label} className="card text-center">
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-neutral-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="card xl:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Équipe ({users.length})</h2>
                <button className="btn btn-primary btn-sm"><Plus size={13} /> Inviter un utilisateur</button>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>2FA</th>
                      <th>Dernière connexion</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => {
                      const sConf = statusStyle[user.status];
                      return (
                        <tr key={user.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: avatarColor(user.name) }}>
                                {user.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                              </div>
                              <div>
                                <div className="font-semibold text-neutral-800 text-xs">{user.name}</div>
                                <div className="text-[10px] text-neutral-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-gray text-[10px]">{user.role}</span>
                          </td>
                          <td>
                            <span className={`badge ${sConf.badge} text-[10px]`}>{sConf.label}</span>
                          </td>
                          <td>
                            {user.twofa ? (
                              <CheckCircle size={14} className="text-success" />
                            ) : (
                              <AlertCircle size={14} className="text-orange-400" />
                            )}
                          </td>
                          <td className="text-xs text-neutral-500">{user.lastLogin}</td>
                          <td>
                            <div className="flex gap-1">
                              <button className="btn btn-ghost btn-sm py-1 px-2"><Edit size={11} /></button>
                              <button className="btn btn-ghost btn-sm py-1 px-2"><Eye size={11} /></button>
                              {user.status === 'external' && (
                                <button className="btn btn-ghost btn-sm py-1 px-2 text-danger"><Trash2 size={11} /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Roles */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Profils & Rôles</h2>
                <button className="btn btn-ghost btn-sm text-xs"><Plus size={11} /></button>
              </div>
              <div className="space-y-2.5">
                {roles.map(role => (
                  <div key={role.id} className="flex items-start justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge text-[10px] ${role.color} ring-0`}>{role.name}</span>
                        <span className="text-[10px] text-neutral-400">{role.users} utilisateur(s)</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 leading-snug">{role.permissions}</div>
                    </div>
                    <ChevronRight size={13} className="text-neutral-300 mt-0.5 flex-shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Securite tab */}
      {activeTab === 'securite' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <Shield size={16} className="text-danger" />
              </div>
              <h2 className="section-title">Politique de sécurité</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Authentification 2FA obligatoire',   enabled: true,  desc: 'TOTP (Google Authenticator) ou SMS' },
                { label: 'Chiffrement des données au repos',   enabled: true,  desc: 'AES-256 · RDS chiffré · S3 chiffré' },
                { label: 'TLS 1.3 en transit',                enabled: true,  desc: 'Toutes les connexions HTTPS' },
                { label: 'Piste d\'audit immuable',           enabled: true,  desc: 'Chaque action tracée avec horodatage' },
                { label: 'Session timeout (30 min inactivité)', enabled: true, desc: 'Déconnexion automatique' },
                { label: 'Isolation par tenant (RLS)',          enabled: true, desc: 'PostgreSQL Row Level Security' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 py-2 border-b border-neutral-100 last:border-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.enabled ? 'bg-success' : 'bg-neutral-200'}`}>
                    <Check size={11} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-800">{item.label}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-secondary/30 rounded-full peer peer-checked:bg-success transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Key size={16} className="text-secondary" />
                <h2 className="section-title">Gestion des sessions</h2>
              </div>
              <div className="space-y-2.5 text-sm">
                {[
                  { label: 'Sessions actives',      value: '3',  color: 'text-neutral-800' },
                  { label: 'Durée session max.',     value: '8h', color: 'text-neutral-800' },
                  { label: 'Timeout inactivité',     value: '30 min', color: 'text-neutral-800' },
                  { label: 'Tentatives échouées',    value: '0',  color: 'text-success' },
                  { label: 'Dernière connexion',     value: 'Maintenant · 197.234.56.78', color: 'text-neutral-500' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between border-b border-neutral-100 pb-2 last:border-0">
                    <span className="text-xs text-neutral-500">{item.label}</span>
                    <span className={`text-xs font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 btn btn-danger btn-sm">Déconnecter toutes les sessions</button>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone size={16} className="text-purple-500" />
                <h2 className="section-title">Double authentification (2FA)</h2>
              </div>
              <div className="space-y-2.5">
                {[
                  { method: 'TOTP (Authenticator App)', configured: true,  recommended: true },
                  { method: 'SMS OTP',                  configured: true,  recommended: false },
                  { method: 'Email OTP',                configured: false, recommended: false },
                ].map(m => (
                  <div key={m.method} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                    <div className="flex items-center gap-2">
                      {m.configured ? <CheckCircle size={14} className="text-success" /> : <AlertCircle size={14} className="text-neutral-300" />}
                      <span className="text-xs text-neutral-700">{m.method}</span>
                      {m.recommended && <span className="badge badge-green text-[9px]">Recommandé</span>}
                    </div>
                    <button className="btn btn-ghost btn-sm text-xs py-1">
                      {m.configured ? 'Modifier' : 'Configurer'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
