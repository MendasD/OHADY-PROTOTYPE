export type PageId =
  | 'dashboard' | 'budget' | 'modelisation'
  | 'tresorerie' | 'rapprochement' | 'prevision'
  | 'ventes' | 'recouvrement' | 'relances'
  | 'achats' | 'fournisseurs' | 'avances'
  | 'comptabilite' | 'plan-comptable' | 'cloture'
  | 'intelligence' | 'ocr' | 'anomalies'
  | 'administration' | 'utilisateurs' | 'securite';

export interface NavChild {
  id: PageId;
  label: string;
  path: string;
  badge?: string;
  badgeColor?: 'red' | 'orange' | 'blue';
}

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  path: string;
  color: string;
  children: NavChild[];
}

export interface KPICard {
  id: string;
  label: string;
  value: string;
  raw: number;
  change: number;
  changeLabel: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend: 'up' | 'down' | 'neutral';
  goodWhenUp: boolean;
}

export interface BankAccount {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  balance: number;
  currency: string;
  lastSync: string;
  syncStatus: 'synced' | 'pending' | 'error';
  type: 'bank' | 'mobile_money' | 'caisse';
  pendingReconciliation: number;
  color: string;
}

export interface CashForecastPoint {
  date: string;
  encaissements: number;
  decaissements: number;
  solde: number;
}

export interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  daysOverdue?: number;
  hasRelance?: boolean;
}

export type InvoiceStatus =
  | 'devis_envoye' | 'bc_recu' | 'en_cours' | 'livraison'
  | 'facture' | 'a_recouvrer' | 'retard_30' | 'retard_60' | 'litige';

export interface ReconciliationItem {
  id: string;
  date: string;
  libelle: string;
  amount: number;
  matchStatus: 'exact' | 'ia_proposed' | 'uncertain' | 'manual_required';
  bankRef?: string;
  proposedEntry?: string;
  confidence?: number;
}

export interface ExpenseRequest {
  id: string;
  employee: string;
  avatar?: string;
  type: string;
  amount: number;
  rubric: string;
  status: ExpenseStatus;
  requestDate: string;
  approver?: string;
  budgetUsed: number;
  budgetTotal: number;
  justification: string;
}

export type ExpenseStatus =
  | 'pending' | 'approved' | 'bon_depense' | 'disbursed'
  | 'receipt_returned' | 'validated' | 'rejected';

export interface JournalEntry {
  id: string;
  date: string;
  journal: 'HA' | 'VT' | 'BQ' | 'CA' | 'OD';
  reference: string;
  libelle: string;
  account: string;
  accountLabel: string;
  debit: number;
  credit: number;
  status: 'draft' | 'submitted' | 'validated';
  user: string;
}

export interface BudgetLine {
  rubric: string;
  budget: number;
  realise: number;
  engagement: number;
  disponible: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  description: string;
  action?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
}
