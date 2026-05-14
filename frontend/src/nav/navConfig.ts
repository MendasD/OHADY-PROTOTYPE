export interface NavChild {
  id: string;
  label: string;
  path: string;
  badge?: string;
  badgeColor?: 'red' | 'orange' | 'blue' | 'green';
}

export interface NavModule {
  id: string;
  label: string;
  icon: string;
  accent: string;
  children: NavChild[];
}

export const navModules: NavModule[] = [
  {
    id: 'pilotage', label: 'Pilotage', icon: 'LayoutDashboard', accent: '#60A5FA',
    children: [
      { id: 'dashboard',      label: 'Tableau de bord',         path: '/dashboard' },
      { id: 'budget',         label: 'Budget & Prévisions',     path: '/budget' },
      { id: 'analytique',     label: 'Analytique',              path: '/analytique' },
      { id: 'modelisation',   label: 'Modélisation',            path: '/modelisation' },
      { id: 'consolidation',  label: 'Consolidation groupe',    path: '/consolidation' },
      { id: 'portail-ec',     label: 'Portail multi-dossiers',  path: '/portail-ec' },
      { id: 'pilotage-bd',    label: 'Cockpit personnalisé',    path: '/pilotage' },
    ],
  },
  {
    id: 'comptabilite', label: 'Comptabilité', icon: 'BookOpen', accent: '#F87171',
    children: [
      { id: 'saisie',        label: "Saisie d'écritures",     path: '/saisie',        badge: '5', badgeColor: 'blue' },
      { id: 'comptabilite',  label: 'Journaux',                path: '/comptabilite' },
      { id: 'grand-livre',   label: 'Grand livre',             path: '/grand-livre' },
      { id: 'balance',       label: 'Balance',                 path: '/balance' },
      { id: 'lettrage',      label: 'Lettrage',                path: '/lettrage' },
      { id: 'plan-comptable',label: 'Plan comptable',          path: '/plan-comptable' },
      { id: 'suspens',       label: 'Comptes de suspens',      path: '/suspens' },
    ],
  },
  {
    id: 'tresorerie', label: 'Trésorerie', icon: 'Wallet', accent: '#34D399',
    children: [
      { id: 'tresorerie',    label: 'Vue trésorerie',          path: '/tresorerie' },
      { id: 'rapprochement', label: 'Rapprochement bancaire',  path: '/rapprochement', badge: '6', badgeColor: 'orange' },
      { id: 'cheques',       label: 'Chèques & effets',        path: '/cheques',       badge: '3', badgeColor: 'blue' },
      { id: 'caisse',        label: 'Caisse',                  path: '/caisse' },
      { id: 'prevision',     label: 'Prévisions',              path: '/prevision' },
    ],
  },
  {
    id: 'ventes', label: 'Ventes', icon: 'ShoppingCart', accent: '#A78BFA',
    children: [
      { id: 'ventes',        label: 'Factures de vente',       path: '/ventes' },
      { id: 'devis',         label: 'Devis & Contrats',        path: '/devis' },
      { id: 'recouvrement',  label: 'Clients & Recouvrement',  path: '/recouvrement', badge: '4', badgeColor: 'red' },
      { id: 'plans-enc',     label: 'Plans d\'encaissement',    path: '/plans-encaissement' },
      { id: 'catalogue',     label: 'Catalogue',               path: '/catalogue' },
      { id: 'relances',      label: 'Relances automatiques',   path: '/relances' },
    ],
  },
  {
    id: 'achats', label: 'Achats', icon: 'Package', accent: '#FBBF24',
    children: [
      { id: 'achats-inbox',  label: 'Pile factures fournisseurs', path: '/achats-inbox', badge: '12', badgeColor: 'orange' },
      { id: 'fournisseurs',  label: 'Fournisseurs',             path: '/fournisseurs' },
      { id: 'bons-commande', label: 'Bons de commande',         path: '/bons-commande' },
      { id: 'achats',        label: 'Demandes & approbations',  path: '/achats',         badge: '3', badgeColor: 'orange' },
      { id: 'avances',       label: 'Avances & Frais',          path: '/avances' },
    ],
  },
  {
    id: 'rh', label: 'RH & Tiers', icon: 'Users', accent: '#FB923C',
    children: [
      { id: 'employes',    label: 'Employés',                    path: '/employes' },
      { id: 'paie',        label: 'Paie & Bulletins',            path: '/paie' },
      { id: 'conges',      label: 'Congés & Absences',           path: '/conges' },
      { id: 'avances-rh',  label: 'Avances sur salaire',         path: '/avances-rh' },
      { id: 'tiers',       label: 'Fiche tier détaillée',        path: '/tiers' },
    ],
  },
  {
    id: 'stocks', label: 'Stocks & Immo.', icon: 'Archive', accent: '#4ADE80',
    children: [
      { id: 'articles',        label: 'Articles & Catalogue',    path: '/articles' },
      { id: 'mouvements',      label: 'Mouvements de stock',     path: '/mouvements' },
      { id: 'inventaire',      label: 'Inventaire physique',     path: '/inventaire' },
      { id: 'immobilisations', label: 'Immobilisations',         path: '/immobilisations' },
      { id: 'amortissements',  label: 'Amortissements',          path: '/amortissements' },
    ],
  },
  {
    id: 'fiscal', label: 'Fiscal', icon: 'Percent', accent: '#22D3EE',
    children: [
      { id: 'tva',           label: 'TVA',                       path: '/tva' },
      { id: 'retenues',      label: 'Retenues à la source',      path: '/retenues' },
      { id: 'declarations',  label: 'Déclarations & Échéances',  path: '/declarations', badge: '2', badgeColor: 'orange' },
      { id: 'fact-elec',     label: 'Facturation électronique',  path: '/fact-elec' },
    ],
  },
  {
    id: 'cloture', label: 'Clôture', icon: 'Lock', accent: '#F472B6',
    children: [
      { id: 'cloture-m',    label: 'Clôture mensuelle',          path: '/cloture-m' },
      { id: 'cloture-a',    label: 'Clôture annuelle',           path: '/cloture-a' },
      { id: 'etats-financiers', label: 'États financiers',       path: '/etats-financiers' },
      { id: 'flux-tresorerie', label: 'Flux de trésorerie',      path: '/flux-tresorerie' },
      { id: 'liasses',      label: 'Liasses fiscales',           path: '/liasses' },
    ],
  },
  {
    id: 'intelligence', label: 'Intelligence IA', icon: 'Bot', accent: '#C084FC',
    children: [
      { id: 'intelligence', label: 'Chat IA',                    path: '/intelligence' },
      { id: 'ocr',          label: 'OCR & Saisie auto',          path: '/ocr' },
      { id: 'anomalies',    label: 'Anomalies',                  path: '/anomalies', badge: '2', badgeColor: 'red' },
    ],
  },
  {
    id: 'parametres', label: 'Paramètres', icon: 'Settings', accent: '#94A3B8',
    children: [
      { id: 'parametres',     label: 'Paramètres généraux',      path: '/parametres' },
      { id: 'administration', label: 'Administration',           path: '/administration' },
      { id: 'utilisateurs',   label: 'Utilisateurs & Rôles',     path: '/utilisateurs' },
      { id: 'securite',       label: 'Sécurité & RBAC',          path: '/securite' },
      { id: 'audit',          label: "Journal d'audit",          path: '/audit' },
      { id: 'integrations',   label: 'Intégrations',             path: '/integrations' },
      { id: 'migration',      label: 'Migration de données',     path: '/migration' },
    ],
  },
];
