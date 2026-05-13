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
      { id: 'dashboard',        label: 'Tableau de bord',        path: '/dashboard'        },
      { id: 'budget',           label: 'Budget & Prévisions',    path: '/budget'           },
      { id: 'modelisation',     label: 'Modélisation financière',path: '/modelisation'     },
      { id: 'etats-financiers', label: 'États financiers',       path: '/etats-financiers' },
    ],
  },
  {
    id: 'tresorerie', label: 'Trésorerie', icon: 'Wallet', accent: '#34D399',
    children: [
      { id: 'tresorerie',    label: 'Position de trésorerie', path: '/tresorerie'    },
      { id: 'rapprochement', label: 'Rapprochement bancaire', path: '/rapprochement', badge: '6', badgeColor: 'orange' },
      { id: 'prevision',     label: 'Prévision J+30',         path: '/prevision'     },
      { id: 'caisse',        label: 'Caisse',                 path: '/caisse'        },
    ],
  },
  {
    id: 'ventes', label: 'Ventes & Clients', icon: 'ShoppingCart', accent: '#A78BFA',
    children: [
      { id: 'ventes',       label: 'Facturation',         path: '/ventes'       },
      { id: 'devis',        label: 'Devis & Contrats',    path: '/devis'        },
      { id: 'recouvrement', label: 'Recouvrement',        path: '/recouvrement', badge: '4', badgeColor: 'red' },
      { id: 'relances',     label: 'Relances automatiques',path: '/relances'    },
    ],
  },
  {
    id: 'achats', label: 'Achats & Dépenses', icon: 'Package', accent: '#FBBF24',
    children: [
      { id: 'achats',         label: 'Approbations',      path: '/achats',          badge: '3', badgeColor: 'orange' },
      { id: 'bons-commande',  label: 'Bons de commande',  path: '/bons-commande'    },
      { id: 'fournisseurs',   label: 'Fournisseurs',      path: '/fournisseurs'     },
      { id: 'avances',        label: 'Avances & Frais',   path: '/avances'          },
    ],
  },
  {
    id: 'comptabilite', label: 'Comptabilité', icon: 'BookOpen', accent: '#F87171',
    children: [
      { id: 'comptabilite',   label: 'Journal',              path: '/comptabilite'   },
      { id: 'plan-comptable', label: 'Plan comptable SYSCOHADA', path: '/plan-comptable' },
      { id: 'cloture',        label: 'Clôture mensuelle',    path: '/cloture'        },
      { id: 'suspens',        label: 'Comptes de suspens',   path: '/suspens'        },
      { id: 'tva',            label: 'TVA & Déclarations',   path: '/tva'            },
    ],
  },
  {
    id: 'rh', label: 'RH & Paie', icon: 'Users', accent: '#FB923C',
    children: [
      { id: 'employes',    label: 'Employés',           path: '/employes'     },
      { id: 'paie',        label: 'Paie & Bulletins',   path: '/paie'         },
      { id: 'conges',      label: 'Congés & Absences',  path: '/conges'       },
      { id: 'avances-rh',  label: 'Avances sur salaire',path: '/avances-rh'   },
    ],
  },
  {
    id: 'stocks', label: 'Stocks & Immobilisations', icon: 'Archive', accent: '#4ADE80',
    children: [
      { id: 'articles',        label: 'Articles & Catalogue', path: '/articles'        },
      { id: 'mouvements',      label: 'Mouvements de stock',  path: '/mouvements'      },
      { id: 'inventaire',      label: 'Inventaire physique',  path: '/inventaire'      },
      { id: 'immobilisations', label: 'Immobilisations',      path: '/immobilisations' },
      { id: 'amortissements',  label: 'Amortissements',       path: '/amortissements'  },
    ],
  },
  {
    id: 'intelligence', label: 'Intelligence IA', icon: 'Bot', accent: '#C084FC',
    children: [
      { id: 'intelligence', label: 'Assistant IA',      path: '/intelligence' },
      { id: 'ocr',          label: 'OCR & Saisie auto', path: '/ocr'          },
      { id: 'anomalies',    label: 'Anomalies',         path: '/anomalies',    badge: '2', badgeColor: 'red' },
    ],
  },
  {
    id: 'administration', label: 'Administration', icon: 'Settings', accent: '#94A3B8',
    children: [
      { id: 'administration', label: 'Paramétrage',        path: '/administration' },
      { id: 'utilisateurs',   label: 'Utilisateurs & Rôles',path: '/utilisateurs'  },
      { id: 'securite',       label: 'Sécurité & RBAC',    path: '/securite'       },
      { id: 'audit',          label: "Journal d'audit",    path: '/audit'          },
      { id: 'integrations',   label: 'Intégrations',       path: '/integrations'   },
    ],
  },
];
