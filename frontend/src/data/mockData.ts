import type {
  KPICard, BankAccount, CashForecastPoint, Invoice, ReconciliationItem,
  ExpenseRequest, JournalEntry, BudgetLine, Alert, ChatMessage
} from '../types';

export const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(n);

export const fmtXOF = (n: number) =>
  `${fmt(n)} XOF`;

// ─── KPI Cards ────────────────────────────────────────────────────────────────
export const kpiCards: KPICard[] = [
  {
    id: 'ca',
    label: "Chiffre d'affaires (mai)",
    value: '47 850 000',
    raw: 47850000,
    change: 8.3,
    changeLabel: 'vs avril 2026',
    icon: 'TrendingUp',
    iconBg: 'bg-blue-50',
    iconColor: 'text-secondary',
    trend: 'up',
    goodWhenUp: true,
  },
  {
    id: 'resultat',
    label: 'Résultat net',
    value: '5 920 000',
    raw: 5920000,
    change: 12.4,
    changeLabel: 'vs avril 2026',
    icon: 'BarChart3',
    iconBg: 'bg-green-50',
    iconColor: 'text-success',
    trend: 'up',
    goodWhenUp: true,
  },
  {
    id: 'tresorerie',
    label: 'Trésorerie nette',
    value: '23 415 000',
    raw: 23415000,
    change: -3.2,
    changeLabel: 'vs 30 jours',
    icon: 'Wallet',
    iconBg: 'bg-orange-50',
    iconColor: 'text-accent',
    trend: 'down',
    goodWhenUp: true,
  },
  {
    id: 'creances',
    label: 'Créances clients',
    value: '15 230 000',
    raw: 15230000,
    change: 5.7,
    changeLabel: 'DSO: 47 jours',
    icon: 'Clock',
    iconBg: 'bg-red-50',
    iconColor: 'text-danger',
    trend: 'up',
    goodWhenUp: false,
  },
];

// ─── Revenue chart (monthly) ──────────────────────────────────────────────────
export const revenueData = [
  { mois: 'Oct', ca: 32400000, charges: 26100000 },
  { mois: 'Nov', ca: 38200000, charges: 28900000 },
  { mois: 'Déc', ca: 51600000, charges: 37200000 },
  { mois: 'Jan', ca: 35800000, charges: 27400000 },
  { mois: 'Fév', ca: 39100000, charges: 29800000 },
  { mois: 'Mar', ca: 44200000, charges: 32600000 },
  { mois: 'Avr', ca: 44170000, charges: 31900000 },
  { mois: 'Mai', ca: 47850000, charges: 34200000 },
];

// ─── Budget lines ─────────────────────────────────────────────────────────────
export const budgetLines: BudgetLine[] = [
  { rubric: 'Ressources humaines',     budget: 18000000, realise: 15200000, engagement: 1800000, disponible: 1000000 },
  { rubric: 'Loyer & charges locatives', budget: 4800000, realise: 4000000, engagement: 400000,  disponible: 400000 },
  { rubric: 'Achats & fournitures',    budget: 8500000,  realise: 5100000, engagement: 1200000, disponible: 2200000 },
  { rubric: 'Marketing & comm.',       budget: 3200000,  realise: 3050000, engagement: 200000,  disponible: -50000 },
  { rubric: 'Informatique & tech.',    budget: 2400000,  realise: 1600000, engagement: 600000,  disponible: 200000 },
  { rubric: 'Déplacements & missions', budget: 1800000,  realise: 980000,  engagement: 420000,  disponible: 400000 },
];

// ─── Bank accounts ─────────────────────────────────────────────────────────────
export const bankAccounts: BankAccount[] = [
  {
    id: 'ba1', name: 'Compte courant exploitation', bank: 'SGBS', accountNumber: 'SN01 0300 0012 3456 7890 1234 567',
    balance: 15240000, currency: 'XOF', lastSync: 'il y a 2 min',
    syncStatus: 'synced', type: 'bank', pendingReconciliation: 4, color: '#1A3C5E',
  },
  {
    id: 'ba2', name: 'Compte épargne', bank: 'CBAO', accountNumber: 'SN01 0200 0098 7654 3210 9876 543',
    balance: 5820000, currency: 'XOF', lastSync: 'il y a 18 min',
    syncStatus: 'synced', type: 'bank', pendingReconciliation: 0, color: '#2980B9',
  },
  {
    id: 'ba3', name: 'Wave Business', bank: 'Wave Sénégal', accountNumber: '+221 77 123 45 67',
    balance: 1450000, currency: 'XOF', lastSync: 'il y a 5 min',
    syncStatus: 'synced', type: 'mobile_money', pendingReconciliation: 2, color: '#1DC1FF',
  },
  {
    id: 'ba4', name: 'Orange Money Pro', bank: 'Orange Money', accountNumber: '+221 76 987 65 43',
    balance: 680000, currency: 'XOF', lastSync: 'il y a 43 min',
    syncStatus: 'pending', type: 'mobile_money', pendingReconciliation: 1, color: '#FF6600',
  },
  {
    id: 'ba5', name: 'Caisse principale', bank: 'Caisse physique', accountNumber: '—',
    balance: 225000, currency: 'XOF', lastSync: 'Mise à jour manuelle',
    syncStatus: 'synced', type: 'caisse', pendingReconciliation: 0, color: '#27AE60',
  },
];

// ─── Cash forecast (30 days) ───────────────────────────────────────────────────
export const cashForecast: CashForecastPoint[] = [
  { date: '14 mai', encaissements: 2800000, decaissements: 1200000, solde: 23415000 },
  { date: '15 mai', encaissements: 1500000, decaissements: 3500000, solde: 21415000 },
  { date: '16 mai', encaissements: 4200000, decaissements: 900000,  solde: 24715000 },
  { date: '17 mai', encaissements: 800000,  decaissements: 2100000, solde: 23415000 },
  { date: '20 mai', encaissements: 6500000, decaissements: 1800000, solde: 28115000 },
  { date: '21 mai', encaissements: 900000,  decaissements: 4200000, solde: 24815000 },
  { date: '22 mai', encaissements: 1200000, decaissements: 2800000, solde: 23215000 },
  { date: '23 mai', encaissements: 3800000, decaissements: 1500000, solde: 25515000 },
  { date: '25 mai', encaissements: 2100000, decaissements: 5800000, solde: 21815000 },
  { date: '27 mai', encaissements: 8200000, decaissements: 2100000, solde: 27915000 },
  { date: '30 mai', encaissements: 1500000, decaissements: 9200000, solde: 20215000 },
  { date: '2 jun',  encaissements: 5400000, decaissements: 1200000, solde: 24415000 },
  { date: '5 jun',  encaissements: 3200000, decaissements: 2800000, solde: 24815000 },
  { date: '10 jun', encaissements: 2800000, decaissements: 4500000, solde: 23115000 },
];

// ─── Reconciliation items ──────────────────────────────────────────────────────
export const reconciliationItems: ReconciliationItem[] = [
  { id: 'r1', date: '13/05/2026', libelle: 'VIR ENTRANT — TECH SOLUTIONS SARL', amount: 3500000, matchStatus: 'exact', bankRef: 'VIR20260513001', proposedEntry: 'Facture F2026-0142 — Tech Solutions SARL', confidence: 99 },
  { id: 'r2', date: '13/05/2026', libelle: 'PRELEVEMENT SGBS CREDIT', amount: -850000, matchStatus: 'ia_proposed', bankRef: 'PRE20260513002', proposedEntry: 'Remboursement emprunt court terme SGBS', confidence: 87 },
  { id: 'r3', date: '12/05/2026', libelle: 'CHQ N°234512 — Dépôt', amount: 1200000, matchStatus: 'uncertain', bankRef: 'CHQ20260512003', proposedEntry: undefined, confidence: 54 },
  { id: 'r4', date: '12/05/2026', libelle: 'WAVE PAY — DIGITAL HUB CI', amount: 480000, matchStatus: 'exact', bankRef: 'WAV20260512001', proposedEntry: 'Facture F2026-0138 — Digital Hub CI', confidence: 99 },
  { id: 'r5', date: '11/05/2026', libelle: 'FRAIS GESTION COMPTE SGBS', amount: -15000, matchStatus: 'ia_proposed', bankRef: 'FRS20260511001', proposedEntry: 'Charges bancaires — compte courant SGBS', confidence: 95 },
  { id: 'r6', date: '11/05/2026', libelle: 'VIR SORTANT — PRESTATAIRE XYZ', amount: -2100000, matchStatus: 'manual_required', bankRef: 'VIR20260511004', proposedEntry: undefined, confidence: 0 },
];

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const invoices: Invoice[] = [
  { id: 'i1',  number: 'F2026-0151', client: 'SONES',              amount: 8400000,  status: 'facture',       date: '05/05/2026', dueDate: '05/06/2026' },
  { id: 'i2',  number: 'F2026-0148', client: 'Dakar Dem Dikk',     amount: 4200000,  status: 'a_recouvrer',   date: '25/04/2026', dueDate: '25/05/2026', daysOverdue: 12 },
  { id: 'i3',  number: 'F2026-0143', client: 'Ministère Finances',  amount: 12600000, status: 'retard_30',     date: '10/04/2026', dueDate: '10/05/2026', daysOverdue: 33, hasRelance: true },
  { id: 'i4',  number: 'F2026-0139', client: 'SENELEC',             amount: 5800000,  status: 'retard_60',     date: '10/03/2026', dueDate: '10/04/2026', daysOverdue: 63, hasRelance: true },
  { id: 'i5',  number: 'F2026-0152', client: 'AfricTech Group',     amount: 3100000,  status: 'devis_envoye',  date: '12/05/2026', dueDate: '—' },
  { id: 'i6',  number: 'F2026-0150', client: 'Orange Sénégal',      amount: 7500000,  status: 'bc_recu',       date: '02/05/2026', dueDate: '—' },
  { id: 'i7',  number: 'F2026-0149', client: 'Total Energies SN',   amount: 9200000,  status: 'en_cours',      date: '29/04/2026', dueDate: '—' },
  { id: 'i8',  number: 'F2026-0145', client: 'Banque de Dakar',     amount: 6300000,  status: 'livraison',     date: '18/04/2026', dueDate: '18/05/2026' },
  { id: 'i9',  number: 'F2026-0137', client: 'ICTS Global',         amount: 3800000,  status: 'litige',        date: '01/03/2026', dueDate: '01/04/2026', daysOverdue: 72 },
  { id: 'i10', number: 'F2026-0153', client: 'Ecobank Sénégal',     amount: 11000000, status: 'devis_envoye',  date: '13/05/2026', dueDate: '—' },
];

// ─── Expense requests ──────────────────────────────────────────────────────────
export const expenseRequests: ExpenseRequest[] = [
  { id: 'e1', employee: 'Aminata Diallo',  type: 'Mission terrain',     amount: 850000,  rubric: 'Déplacements & missions', status: 'pending',          requestDate: '12/05/2026', budgetUsed: 980000,  budgetTotal: 1800000, justification: 'Mission Thiès — Audit client SAED (3 jours)' },
  { id: 'e2', employee: 'Oumar Seck',      type: 'Achat équipement',    amount: 1250000, rubric: 'Informatique & tech.',    status: 'approved',         requestDate: '11/05/2026', approver: 'Hermann Cakpo', budgetUsed: 1600000, budgetTotal: 2400000, justification: 'Laptop Lenovo ThinkPad — remplacement urgence' },
  { id: 'e3', employee: 'Fatou Ndiaye',    type: 'Fournitures bureau',  amount: 185000,  rubric: 'Achats & fournitures',    status: 'bon_depense',      requestDate: '10/05/2026', approver: 'Marie-Reine Cakpo', budgetUsed: 5100000, budgetTotal: 8500000, justification: 'Papiers, cartouches imprimante, consommables' },
  { id: 'e4', employee: 'Ibrahima Touré',  type: 'Repas client',        amount: 320000,  rubric: 'Marketing & comm.',       status: 'disbursed',        requestDate: '09/05/2026', approver: 'Hermann Cakpo', budgetUsed: 3050000, budgetTotal: 3200000, justification: 'Déjeuner prospection — DG LONASE' },
  { id: 'e5', employee: 'Rokhaya Dieng',   type: 'Transport',           amount: 95000,   rubric: 'Déplacements & missions', status: 'receipt_returned', requestDate: '08/05/2026', budgetUsed: 980000, budgetTotal: 1800000, justification: 'Taxi aéroport — retour mission Abidjan' },
  { id: 'e6', employee: 'Moussa Camara',   type: 'Formation',           amount: 450000,  rubric: 'Ressources humaines',     status: 'validated',        requestDate: '05/05/2026', approver: 'Marie-Reine Cakpo', budgetUsed: 15200000, budgetTotal: 18000000, justification: 'Formation SYSCOHADA révisé — Cabinet CPC Dakar' },
  { id: 'e7', employee: 'Aïssatou Barry',  type: 'Achat matières',      amount: 2100000, rubric: 'Achats & fournitures',    status: 'rejected',         requestDate: '07/05/2026', budgetUsed: 5100000, budgetTotal: 8500000, justification: 'Achats papier imprimé — budget dépassé' },
];

// ─── Journal entries ───────────────────────────────────────────────────────────
export const journalEntries: JournalEntry[] = [
  { id: 'j1',  date: '13/05/2026', journal: 'BQ', reference: 'BQ-2026-0821', libelle: 'Encaissement — Facture F2026-0142', account: '52110', accountLabel: 'Banque SGBS C/C', debit: 3500000, credit: 0, status: 'validated', user: 'A. Diallo' },
  { id: 'j2',  date: '13/05/2026', journal: 'BQ', reference: 'BQ-2026-0821', libelle: 'Soldé — Créance Tech Solutions SARL',  account: '41100', accountLabel: 'Clients — Tech Solutions SARL', debit: 0, credit: 3500000, status: 'validated', user: 'A. Diallo' },
  { id: 'j3',  date: '12/05/2026', journal: 'HA', reference: 'HA-2026-0419', libelle: 'Facture fournisseur — COGEMATEC', account: '60100', accountLabel: 'Achats marchandises', debit: 1800000, credit: 0, status: 'validated', user: 'F. Ndiaye' },
  { id: 'j4',  date: '12/05/2026', journal: 'HA', reference: 'HA-2026-0419', libelle: 'TVA déductible — COGEMATEC', account: '44510', accountLabel: 'TVA déductible sur achats', debit: 324000, credit: 0, status: 'validated', user: 'F. Ndiaye' },
  { id: 'j5',  date: '12/05/2026', journal: 'HA', reference: 'HA-2026-0419', libelle: 'Fournisseur COGEMATEC', account: '40100', accountLabel: 'Fournisseurs — COGEMATEC', debit: 0, credit: 2124000, status: 'validated', user: 'F. Ndiaye' },
  { id: 'j6',  date: '11/05/2026', journal: 'OD', reference: 'OD-2026-0118', libelle: 'Dotation amortissement équipements mai', account: '68100', accountLabel: 'Dotations amortissements', debit: 285000, credit: 0, status: 'submitted', user: 'O. Seck' },
  { id: 'j7',  date: '11/05/2026', journal: 'OD', reference: 'OD-2026-0118', libelle: 'Amort. cumulé équipements informatiques', account: '28400', accountLabel: 'Amortissements — Mat. informatique', debit: 0, credit: 285000, status: 'submitted', user: 'O. Seck' },
  { id: 'j8',  date: '10/05/2026', journal: 'VT', reference: 'VT-2026-0612', libelle: 'Facture F2026-0151 — SONES', account: '41100', accountLabel: 'Clients — SONES', debit: 9912000, credit: 0, status: 'validated', user: 'A. Diallo' },
  { id: 'j9',  date: '10/05/2026', journal: 'VT', reference: 'VT-2026-0612', libelle: 'Prestations services — F2026-0151', account: '70600', accountLabel: 'Prestation de services', debit: 0, credit: 8400000, status: 'validated', user: 'A. Diallo' },
  { id: 'j10', date: '10/05/2026', journal: 'VT', reference: 'VT-2026-0612', libelle: 'TVA collectée 18% — F2026-0151', account: '44310', accountLabel: 'TVA collectée 18%', debit: 0, credit: 1512000, status: 'validated', user: 'A. Diallo' },
  { id: 'j11', date: '09/05/2026', journal: 'CA', reference: 'CA-2026-0204', libelle: 'Décaissement petite caisse — fournitures', account: '60220', accountLabel: 'Fournitures de bureau', debit: 48500, credit: 0, status: 'draft', user: 'M. Camara' },
  { id: 'j12', date: '09/05/2026', journal: 'CA', reference: 'CA-2026-0204', libelle: 'Caisse principale — sortie espèces', account: '57100', accountLabel: 'Caisse principale', debit: 0, credit: 48500, status: 'draft', user: 'M. Camara' },
];

// ─── Alerts ────────────────────────────────────────────────────────────────────
export const alerts: Alert[] = [
  { id: 'al1', type: 'error',   title: 'Créances échues > 60j',       description: '2 factures (SENELEC, ICTS Global) — 9 600 000 XOF à risque', action: 'Voir recouvrement', createdAt: 'Maintenant' },
  { id: 'al2', type: 'warning', title: 'Budget Marketing dépassé',     description: 'Marketing & comm. : dépassement de 50 000 XOF (104 % consommé)', action: 'Voir budget', createdAt: 'il y a 2h' },
  { id: 'al3', type: 'warning', title: 'Rapprochement en attente',     description: '6 opérations non réconciliées — SGBS (mai 2026)', action: 'Réconcilier', createdAt: 'il y a 3h' },
  { id: 'al4', type: 'info',    title: 'Déclaration TVA à préparer',   description: 'TVA mai 2026 — échéance le 20/06/2026 (dans 38 jours)', action: 'Préparer', createdAt: 'il y a 5h' },
  { id: 'al5', type: 'warning', title: 'Avance non justifiée',         description: 'I. Touré — 320 000 XOF depuis 9 jours (limite 15 j)', action: 'Rappeler', createdAt: 'il y a 6h' },
  { id: 'al6', type: 'info',    title: 'Clôture mai à planifier',      description: '18 jours avant la fin du mois — checklist à 40% complétée', action: 'Voir checklist', createdAt: 'il y a 1j' },
];

// ─── Chat messages ─────────────────────────────────────────────────────────────
export const chatMessages: ChatMessage[] = [
  {
    id: 'cm1', role: 'assistant',
    content: 'Bonjour ! Je suis l\'assistant OHADY. Je peux répondre à vos questions sur vos données financières, vous aider à analyser vos comptes ou générer des rapports. Que puis-je faire pour vous ?',
    timestamp: '09:14',
  },
  {
    id: 'cm2', role: 'user',
    content: 'Quel est mon DSO actuel et est-ce que c\'est bon par rapport au secteur ?',
    timestamp: '09:22',
  },
  {
    id: 'cm3', role: 'assistant',
    content: 'Votre **DSO (Days Sales Outstanding)** actuel est de **47 jours**, calculé sur les 3 derniers mois (créances clients moyennes : 15,2M XOF / CA journalier moyen : 325K XOF).\n\nPour votre secteur (services B2B au Sénégal), la médiane est autour de **35-40 jours**. Vous êtes donc légèrement au-dessus de la normale, principalement à cause de 3 clients publics (SENELEC, Ministère des Finances, SONES) qui représentent 68% de vos créances.\n\n💡 **Recommandation :** Envoyer une relance formelle aux 2 factures en retard > 30j (12,6M XOF au total). Voulez-je prépare le courrier de relance ?',
    timestamp: '09:22',
    sources: ['Créances au 13/05/2026', 'Factures F2026-0143, F2026-0139'],
  },
  {
    id: 'cm4', role: 'user',
    content: 'Oui prépare le courrier pour SENELEC en priorité',
    timestamp: '09:24',
  },
  {
    id: 'cm5', role: 'assistant',
    content: 'Voici le courrier de relance préparé pour **SENELEC** :\n\n---\n*Objet : Relance amiable — Facture F2026-0139 — 5 800 000 XOF*\n\nMonsieur / Madame,\n\nNous vous contactons au sujet de la facture **F2026-0139** du 10 mars 2026, d\'un montant de **5 800 000 XOF**, dont l\'échéance était fixée au **10 avril 2026** (63 jours de retard).\n\nMalgré nos précédentes relances, nous n\'avons pas encore reçu le règlement correspondant. Nous vous serions reconnaissants de bien vouloir procéder au virement dans les meilleurs délais...\n\n---\n\nVoulez-vous l\'envoyer par email, WhatsApp, ou l\'imprimer ?',
    timestamp: '09:24',
    sources: ['Facture F2026-0139', 'Données client SENELEC'],
  },
];
