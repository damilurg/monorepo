export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  currency: string;
  iban: string;
  cardLast4: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  merchant: string;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  color: string;
  icon: string;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
}

export const ACCOUNTS: Account[] = [
  {
    id: 'acc1',
    name: 'Main Account',
    type: 'checking',
    balance: 12_450.80,
    currency: 'USD',
    iban: 'US12 3456 7890 1234',
    cardLast4: '4821',
  },
  {
    id: 'acc2',
    name: 'Savings',
    type: 'savings',
    balance: 34_200.00,
    currency: 'USD',
    iban: 'US12 3456 7890 5678',
    cardLast4: '9103',
  },
  {
    id: 'acc3',
    name: 'Credit Card',
    type: 'credit',
    balance: -2_340.50,
    currency: 'USD',
    iban: 'US12 3456 7890 9012',
    cardLast4: '2277',
  },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: 'acc1', date: '2026-06-18', description: 'Salary June', amount: 5200.00, type: 'credit', category: 'Income', merchant: 'Employer Inc.' },
  { id: 't2', accountId: 'acc1', date: '2026-06-17', description: 'Whole Foods Market', amount: -84.50, type: 'debit', category: 'Groceries', merchant: 'Whole Foods' },
  { id: 't3', accountId: 'acc1', date: '2026-06-17', description: 'Uber', amount: -18.20, type: 'debit', category: 'Transport', merchant: 'Uber' },
  { id: 't4', accountId: 'acc1', date: '2026-06-16', description: 'Netflix', amount: -15.99, type: 'debit', category: 'Entertainment', merchant: 'Netflix' },
  { id: 't5', accountId: 'acc1', date: '2026-06-16', description: 'Starbucks', amount: -6.50, type: 'debit', category: 'Food & Drink', merchant: 'Starbucks' },
  { id: 't6', accountId: 'acc1', date: '2026-06-15', description: 'Amazon', amount: -129.99, type: 'debit', category: 'Shopping', merchant: 'Amazon' },
  { id: 't7', accountId: 'acc1', date: '2026-06-15', description: 'Planet Fitness', amount: -24.99, type: 'debit', category: 'Health', merchant: 'Planet Fitness' },
  { id: 't8', accountId: 'acc1', date: '2026-06-14', description: 'Con Edison', amount: -95.00, type: 'debit', category: 'Utilities', merchant: 'Con Edison' },
  { id: 't9', accountId: 'acc1', date: '2026-06-14', description: 'Transfer to Savings', amount: -500.00, type: 'debit', category: 'Transfer', merchant: 'Internal' },
  { id: 't10', accountId: 'acc2', date: '2026-06-14', description: 'Transfer from Checking', amount: 500.00, type: 'credit', category: 'Transfer', merchant: 'Internal' },
  { id: 't11', accountId: 'acc1', date: '2026-06-13', description: 'Chipotle', amount: -15.40, type: 'debit', category: 'Food & Drink', merchant: 'Chipotle' },
  { id: 't12', accountId: 'acc1', date: '2026-06-12', description: 'AT&T', amount: -75.00, type: 'debit', category: 'Utilities', merchant: 'AT&T' },
  { id: 't13', accountId: 'acc1', date: '2026-06-12', description: 'Freelance Payment', amount: 800.00, type: 'credit', category: 'Income', merchant: 'Acme Corp' },
  { id: 't14', accountId: 'acc1', date: '2026-06-11', description: 'Target', amount: -67.30, type: 'debit', category: 'Shopping', merchant: 'Target' },
  { id: 't15', accountId: 'acc1', date: '2026-06-10', description: 'Spotify', amount: -10.99, type: 'debit', category: 'Entertainment', merchant: 'Spotify' },
  { id: 't16', accountId: 'acc1', date: '2026-06-09', description: "Trader Joe's", amount: -52.80, type: 'debit', category: 'Groceries', merchant: "Trader Joe's" },
  { id: 't17', accountId: 'acc1', date: '2026-06-09', description: 'Lyft', amount: -23.60, type: 'debit', category: 'Transport', merchant: 'Lyft' },
  { id: 't18', accountId: 'acc1', date: '2026-06-08', description: 'Airbnb', amount: -320.00, type: 'debit', category: 'Travel', merchant: 'Airbnb' },
  { id: 't19', accountId: 'acc1', date: '2026-06-07', description: 'ATM Withdrawal', amount: -200.00, type: 'debit', category: 'Cash', merchant: 'Chase ATM' },
  { id: 't20', accountId: 'acc3', date: '2026-06-06', description: 'Apple Store', amount: -999.00, type: 'debit', category: 'Shopping', merchant: 'Apple' },
];

export const SPENDING_CATEGORIES: SpendingCategory[] = [
  { name: 'Shopping', amount: 1196.29, color: '#6366f1', icon: '🛍️' },
  { name: 'Food & Drink', amount: 350.40, color: '#ec4899', icon: '🍔' },
  { name: 'Groceries', amount: 137.30, color: '#10b981', icon: '🥦' },
  { name: 'Transport', amount: 41.80, color: '#f59e0b', icon: '🚗' },
  { name: 'Entertainment', amount: 26.98, color: '#8b5cf6', icon: '🎬' },
  { name: 'Utilities', amount: 170.00, color: '#06b6d4', icon: '⚡' },
  { name: 'Health', amount: 24.99, color: '#ef4444', icon: '💪' },
  { name: 'Travel', amount: 320.00, color: '#f97316', icon: '✈️' },
];

export const MONTHLY_STATS: MonthlyStats[] = [
  { month: 'Jan', income: 5200, expenses: 3100 },
  { month: 'Feb', income: 5200, expenses: 2800 },
  { month: 'Mar', income: 6000, expenses: 3600 },
  { month: 'Apr', income: 5200, expenses: 4100 },
  { month: 'May', income: 5200, expenses: 2950 },
  { month: 'Jun', income: 6000, expenses: 2267 },
];
