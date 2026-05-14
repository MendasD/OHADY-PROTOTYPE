import { useState } from 'react';
import { Search, Shield, User, FileText, Settings, Trash2, Edit, LogIn, Download } from 'lucide-react';

type ActionType = 'Connexion' | 'Création' | 'Modification' | 'Suppression' | 'Export' | 'Validation' | 'Paramétrage';
type Module = 'Comptabilité' | 'Trésorerie' | 'RH' | 'Ventes' | 'Achats' | 'Système' | 'Administration';

interface LogEntry {
  id: string;
  timestamp: string;
  utilisateur: string;
  role: string;
  action: ActionType;
  module: Module;
  detail: string;
  ip: string;
  statut: 'Succès' | 'Échec' | 'Avertissement';
}

const logs: LogEntry[] = [
  { id: 'AUD-8821', timestamp: '13/05/2026 09:42:17', utilisateur: 'Fatou Diallo', role: 'DAF', action: 'Validation', module: 'Comptabilité', detail: 'Validation journal des achats — période avril 2026', ip: '192.168.1.12', statut: 'Succès' },
  { id: 'AUD-8820', timestamp: '13/05/2026 09:31:04', utilisateur: 'Mamadou Sow', role: 'Commercial', action: 'Création', module: 'Ventes', detail: 'Création facture FAC-2026-0389 — SONATEL — 4 850 000 XOF', ip: '192.168.1.25', statut: 'Succès' },
  { id: 'AUD-8819', timestamp: '13/05/2026 09:18:55', utilisateur: 'Système', role: 'Bot', action: 'Export', module: 'Trésorerie', detail: 'Export rapprochement bancaire SGBS — automatique', ip: 'localhost', statut: 'Succès' },
  { id: 'AUD-8818', timestamp: '13/05/2026 08:55:02', utilisateur: 'Cheikh Ndiaye', role: 'Responsable stock', action: 'Modification', module: 'Achats', detail: 'Modification BC-2026-0341 — montant 1 260 000 XOF → 1 350 000 XOF', ip: '192.168.1.18', statut: 'Avertissement' },
  { id: 'AUD-8817', timestamp: '13/05/2026 08:41:30', utilisateur: 'Fatou Diallo', role: 'DAF', action: 'Connexion', module: 'Système', detail: 'Connexion réussie — session démarrée', ip: '192.168.1.12', statut: 'Succès' },
  { id: 'AUD-8816', timestamp: '12/05/2026 17:23:11', utilisateur: 'inconnu@ext.com', role: '—', action: 'Connexion', module: 'Système', detail: 'Tentative de connexion échouée — mot de passe incorrect (3ème tentative)', ip: '41.82.114.55', statut: 'Échec' },
  { id: 'AUD-8815', timestamp: '12/05/2026 16:48:22', utilisateur: 'Aissatou Ba', role: 'Comptable', action: 'Modification', module: 'Comptabilité', detail: 'Correction écriture JNL-2026-1842 — extourne double saisie', ip: '192.168.1.31', statut: 'Succès' },
  { id: 'AUD-8814', timestamp: '12/05/2026 15:30:09', utilisateur: 'Admin OHADY', role: 'Super Admin', action: 'Paramétrage', module: 'Administration', detail: 'Ajout utilisateur Ibrahim Dieng — rôle Contrôleur de gestion', ip: '192.168.1.1', statut: 'Succès' },
  { id: 'AUD-8813', timestamp: '12/05/2026 14:12:44', utilisateur: 'Moussa Kouyaté', role: 'Magasinier', action: 'Suppression', module: 'Achats', detail: 'Tentative suppression BC-2026-0339 — refusé (droits insuffisants)', ip: '192.168.1.42', statut: 'Échec' },
  { id: 'AUD-8812', timestamp: '12/05/2026 11:05:33', utilisateur: 'Fatou Diallo', role: 'DAF', action: 'Export', module: 'RH', detail: 'Export états de paie mai 2026 — PDF (confidentiel)', ip: '192.168.1.12', statut: 'Succès' },
];

const actionIcon: Record<ActionType, React.ReactNode> = {
  Connexion: <LogIn size={12} />,
  Création: <FileText size={12} />,
  Modification: <Edit size={12} />,
  Suppression: <Trash2 size={12} />,
  Export: <Download size={12} />,
  Validation: <Shield size={12} />,
  Paramétrage: <Settings size={12} />,
};

const statutCfg = {
  Succès: 'badge-green',
  Échec: 'badge-red',
  Avertissement: 'badge-orange',
};

export default function Audit() {
  const [search, setSearch] = useState('');
  const [filtreModule, setFiltreModule] = useState<Module | ''>('');
  const [filtreStatut, setFiltreStatut] = useState<'Succès' | 'Échec' | 'Avertissement' | ''>('');

  const filtered = logs.filter(l =>
    (l.utilisateur.toLowerCase().includes(search.toLowerCase()) ||
     l.detail.toLowerCase().includes(search.toLowerCase()) ||
     l.action.toLowerCase().includes(search.toLowerCase())) &&
    (!filtreModule || l.module === filtreModule) &&
    (!filtreStatut || l.statut === filtreStatut)
  );

  const echecs = logs.filter(l => l.statut === 'Échec').length;
  const avertissements = logs.filter(l => l.statut === 'Avertissement').length;
  const modules = [...new Set(logs.map(l => l.module))];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Journal d'audit</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Traçabilité complète des actions utilisateurs — OHADY</p>
        </div>
        <button className="btn border border-neutral-200 text-neutral-600 bg-white flex items-center gap-1.5 text-sm">
          <Download size={14} /> Exporter le journal
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Actions enregistrées (24h)', val: logs.length.toString(), color: 'text-blue-600' },
          { label: 'Utilisateurs actifs', val: [...new Set(logs.filter(l => l.utilisateur !== 'Système').map(l => l.utilisateur))].length.toString(), color: 'text-green-600' },
          { label: 'Tentatives échouées', val: echecs.toString(), color: echecs > 0 ? 'text-red-600' : 'text-neutral-400' },
          { label: 'Avertissements', val: avertissements.toString(), color: avertissements > 0 ? 'text-amber-600' : 'text-neutral-400' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className={`text-xs font-medium mb-1 ${k.color}`}>{k.label}</div>
            <div className={`text-lg font-bold ${k.color}`}>{k.val}</div>
          </div>
        ))}
      </div>

      {echecs > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <Shield size={16} className="text-red-600 flex-shrink-0" />
          <span className="text-sm font-medium text-red-800">
            {echecs} tentative(s) de connexion échouée(s) détectées — vérifier les IP suspectes
          </span>
        </div>
      )}

      <div className="card">
        {/* Filtres */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-neutral-200 rounded-lg px-3 py-2 bg-white">
            <Search size={14} className="text-neutral-400" />
            <input className="flex-1 outline-none text-sm bg-transparent" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input text-sm py-2" value={filtreModule} onChange={e => setFiltreModule(e.target.value as any)}>
            <option value="">Tous les modules</option>
            {modules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className="flex gap-1.5">
            {(['', 'Succès', 'Échec', 'Avertissement'] as const).map(s => (
              <button key={s} onClick={() => setFiltreStatut(s as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filtreStatut === s ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>
                {s || 'Tous'}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
              <th className="text-left pb-2">Horodatage</th>
              <th className="text-left pb-2">Utilisateur</th>
              <th className="text-center pb-2">Action</th>
              <th className="text-center pb-2">Module</th>
              <th className="text-left pb-2">Détail</th>
              <th className="text-left pb-2">IP</th>
              <th className="text-center pb-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className={`border-t border-neutral-50 hover:bg-neutral-50 transition-colors ${l.statut === 'Échec' ? 'bg-red-50/30' : l.statut === 'Avertissement' ? 'bg-amber-50/30' : ''}`}>
                <td className="py-2.5 text-xs text-neutral-500 whitespace-nowrap">{l.timestamp}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <User size={9} className="text-neutral-500" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-neutral-800">{l.utilisateur}</div>
                      <div className="text-[10px] text-neutral-400">{l.role}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-center">
                  <span className="flex items-center gap-1 justify-center text-xs text-neutral-600">
                    {actionIcon[l.action]}{l.action}
                  </span>
                </td>
                <td className="py-2.5 text-center">
                  <span className="badge badge-blue text-[10px]">{l.module}</span>
                </td>
                <td className="py-2.5 text-xs text-neutral-600 max-w-[280px] truncate">{l.detail}</td>
                <td className="py-2.5 font-mono text-xs text-neutral-400">{l.ip}</td>
                <td className="py-2.5 text-center">
                  <span className={`badge ${statutCfg[l.statut]}`}>{l.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
