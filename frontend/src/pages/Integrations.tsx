import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Plus, Zap, Globe, CreditCard, Building2, Phone } from 'lucide-react';

type StatutInteg = 'Connecté' | 'Déconnecté' | 'Erreur' | 'Configuration';
type Categorie = 'Bancaire' | 'Paiement mobile' | 'ERP / Comptabilité' | 'Fiscal' | 'RH' | 'eCommerce';

interface Integration {
  id: string;
  nom: string;
  logo: string;
  categorie: Categorie;
  description: string;
  statut: StatutInteg;
  dernierSync: string;
  donneesSync: string;
  configurable: boolean;
}

const integrations: Integration[] = [
  { id: 'INT-001', nom: 'SGBS — Société Générale', logo: '🏦', categorie: 'Bancaire', description: 'Import automatique des relevés bancaires et rapprochement', statut: 'Connecté', dernierSync: 'Il y a 2 heures', donneesSync: 'Relevés + opérations', configurable: true },
  { id: 'INT-002', nom: 'CBAO — Banque Atlantique', logo: '🏦', categorie: 'Bancaire', description: 'Import des relevés et prélèvements automatiques', statut: 'Connecté', dernierSync: 'Il y a 4 heures', donneesSync: 'Relevés bancaires', configurable: true },
  { id: 'INT-003', nom: 'Wave Money', logo: '💙', categorie: 'Paiement mobile', description: 'Suivi des paiements et recharges Wave en temps réel', statut: 'Connecté', dernierSync: 'Il y a 12 min', donneesSync: 'Transactions temps réel', configurable: true },
  { id: 'INT-004', nom: 'Orange Money Sénégal', logo: '🟠', categorie: 'Paiement mobile', description: 'Intégration des flux Orange Money vers la trésorerie', statut: 'Erreur', dernierSync: 'Il y a 2 jours', donneesSync: 'Transactions', configurable: true },
  { id: 'INT-005', nom: 'Sage 100 Cloud', logo: '📊', categorie: 'ERP / Comptabilité', description: 'Synchronisation bidirectionnelle du journal comptable', statut: 'Déconnecté', dernierSync: 'Jamais', donneesSync: 'Journal, balance', configurable: true },
  { id: 'INT-006', nom: 'DGI Sénégal — e-Services', logo: '🏛️', categorie: 'Fiscal', description: 'Dépôt électronique des déclarations TVA et IS', statut: 'Configuration', dernierSync: '—', donneesSync: 'Déclarations fiscales', configurable: true },
  { id: 'INT-007', nom: 'IPRES — Retraite', logo: '🔒', categorie: 'RH', description: 'Déclarations sociales et cotisations retraite', statut: 'Déconnecté', dernierSync: 'Jamais', donneesSync: 'Bulletins, cotisations', configurable: false },
  { id: 'INT-008', nom: 'CSS — Sécurité Sociale', logo: '🏥', categorie: 'RH', description: 'Déclarations CSS et accidents de travail', statut: 'Déconnecté', dernierSync: 'Jamais', donneesSync: 'Bulletins, AT', configurable: false },
  { id: 'INT-009', nom: 'WooCommerce', logo: '🛒', categorie: 'eCommerce', description: 'Import automatique des commandes et factures en ligne', statut: 'Déconnecté', dernierSync: 'Jamais', donneesSync: 'Commandes, paiements', configurable: true },
];

const statutCfg: Record<StatutInteg, { cls: string; icon: React.ReactNode; dot: string }> = {
  'Connecté':      { cls: 'badge-green', icon: <CheckCircle size={11} />, dot: 'bg-green-400' },
  'Déconnecté':    { cls: 'bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full text-[10px] font-medium', icon: <XCircle size={11} />, dot: 'bg-neutral-300' },
  'Erreur':        { cls: 'badge-red', icon: <XCircle size={11} />, dot: 'bg-red-400' },
  'Configuration': { cls: 'badge-orange', icon: <RefreshCw size={11} />, dot: 'bg-amber-400' },
};

const catIcon: Record<Categorie, React.ReactNode> = {
  'Bancaire': <Building2 size={14} />,
  'Paiement mobile': <Phone size={14} />,
  'ERP / Comptabilité': <Globe size={14} />,
  'Fiscal': <CreditCard size={14} />,
  'RH': <Zap size={14} />,
  'eCommerce': <Globe size={14} />,
};

const categories: Categorie[] = ['Bancaire', 'Paiement mobile', 'ERP / Comptabilité', 'Fiscal', 'RH', 'eCommerce'];

export default function Integrations() {
  const [filtreCat, setFiltreCat] = useState<Categorie | ''>('');
  const [filtreStatut, setFiltreStatut] = useState<StatutInteg | ''>('');

  const filtered = integrations.filter(i =>
    (!filtreCat || i.categorie === filtreCat) &&
    (!filtreStatut || i.statut === filtreStatut)
  );

  const connectees = integrations.filter(i => i.statut === 'Connecté').length;
  const erreurs = integrations.filter(i => i.statut === 'Erreur').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Intégrations & API</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Connecteurs vers systèmes externes — banques, paiements, ERP, fiscal</p>
        </div>
        <button className="btn btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Ajouter une intégration
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Intégrations disponibles', val: integrations.length.toString(), color: 'text-blue-600' },
          { label: 'Connectées & actives', val: connectees.toString(), color: 'text-green-600' },
          { label: 'En erreur', val: erreurs.toString(), color: erreurs > 0 ? 'text-red-600' : 'text-neutral-400' },
          { label: 'En configuration', val: integrations.filter(i => i.statut === 'Configuration').length.toString(), color: 'text-amber-600' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className={`text-xs font-medium mb-1 ${k.color}`}>{k.label}</div>
            <div className={`text-lg font-bold ${k.color}`}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {(['', ...categories] as (Categorie | '')[]).map(c => (
            <button key={c} onClick={() => setFiltreCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${filtreCat === c ? 'bg-primary text-white' : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300'}`}>
              {c && catIcon[c]}{c || 'Toutes catégories'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 ml-auto">
          {(['', 'Connecté', 'Erreur', 'Déconnecté', 'Configuration'] as (StatutInteg | '')[]).map(s => (
            <button key={s} onClick={() => setFiltreStatut(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filtreStatut === s ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>
              {s || 'Tous'}
            </button>
          ))}
        </div>
      </div>

      {/* Grille d'intégrations */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(integ => {
          const cfg = statutCfg[integ.statut];
          return (
            <div key={integ.id} className="card hover:shadow-card-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-xl">
                    {integ.logo}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-800 leading-tight">{integ.nom}</div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                      {catIcon[integ.categorie]}{integ.categorie}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${cfg.dot} ${integ.statut === 'Connecté' ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">{integ.description}</p>

              <div className="border-t border-neutral-100 pt-3 space-y-1.5 text-xs text-neutral-500">
                <div className="flex justify-between">
                  <span>Données sync.</span>
                  <span className="text-neutral-700 font-medium">{integ.donneesSync}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dernière sync.</span>
                  <span className="text-neutral-700">{integ.dernierSync}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className={`badge flex items-center gap-1 ${cfg.cls}`}>
                  {cfg.icon}{integ.statut}
                </span>
                <div className="flex gap-1.5">
                  {integ.statut === 'Connecté' && (
                    <button className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center" title="Synchroniser">
                      <RefreshCw size={13} className="text-neutral-500" />
                    </button>
                  )}
                  {integ.configurable && (
                    <button className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                      integ.statut === 'Connecté' ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200' :
                      integ.statut === 'Erreur' ? 'bg-red-50 text-red-600 hover:bg-red-100' :
                      'btn-primary bg-secondary text-white hover:bg-secondary/90'
                    }`}>
                      {integ.statut === 'Connecté' ? 'Configurer' : integ.statut === 'Erreur' ? 'Réparer' : 'Connecter'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Webhooks */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-700">Webhooks & API Key</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Intégration personnalisée via API REST OHADY</p>
          </div>
          <button className="btn border border-neutral-200 bg-white text-neutral-600 text-xs px-3 py-1.5 flex items-center gap-1">
            <Plus size={12} /> Nouveau webhook
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <div className="flex-1">
              <div className="text-xs font-medium text-neutral-700">Clé API principale</div>
              <div className="font-mono text-xs text-neutral-400 mt-0.5">ohd_live_sk_••••••••••••••••••••••••••3f9a</div>
            </div>
            <button className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200">Copier</button>
            <button className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">Révoquer</button>
          </div>
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <div className="flex-1">
              <div className="text-xs font-medium text-neutral-700">Webhook — Nouvelles factures</div>
              <div className="font-mono text-xs text-neutral-400 mt-0.5">https://erp.example.sn/webhooks/ohady/invoices</div>
            </div>
            <span className="badge badge-green text-[10px]">Actif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
