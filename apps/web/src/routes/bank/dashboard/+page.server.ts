import type { PageServerLoad } from './$types';
import {
  ACCOUNTS,
  TRANSACTIONS,
  SPENDING_CATEGORIES,
  MONTHLY_STATS,
} from '$lib/data/bank-data/mock-banking.js';

export const load: PageServerLoad = () => ({
  accounts: ACCOUNTS,
  transactions: TRANSACTIONS,
  categories: SPENDING_CATEGORIES,
  monthlyStats: MONTHLY_STATS,
});
