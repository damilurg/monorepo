<script lang="ts">
  import type { PageData } from './$types';
  import type { Transaction } from '$lib/data/mock-banking.js';

  let { data }: { data: PageData } = $props();

  const { accounts, transactions, categories, monthlyStats } = data;

  // Computed totals
  const totalBalance = $derived(
    accounts.filter((a) => a.balance > 0).reduce((sum, a) => sum + a.balance, 0),
  );

  const currentMonth = monthlyStats[monthlyStats.length - 1];
  const savingsRate = $derived(
    Math.round(((currentMonth.income - currentMonth.expenses) / currentMonth.income) * 100),
  );

  // Donut chart math
  const totalSpend = $derived(categories.reduce((sum, c) => sum + c.amount, 0));
  const circumference = 2 * Math.PI * 30; // ≈ 188.5

  interface DonutSlice {
    category: (typeof categories)[0];
    dasharray: string;
    dashoffset: number;
    percentage: number;
  }

  const donutSlices = $derived<DonutSlice[]>(() => {
    let offset = 0;
    return categories.map((cat) => {
      const fraction = cat.amount / totalSpend;
      const arc = fraction * circumference;
      const slice: DonutSlice = {
        category: cat,
        dasharray: `${arc} ${circumference}`,
        dashoffset: -offset,
        percentage: Math.round(fraction * 100),
      };
      offset += arc;
      return slice;
    });
  });

  // Bar chart config
  const barChartHeight = 120;
  const maxValue = $derived(
    Math.max(...monthlyStats.flatMap((m) => [m.income, m.expenses])),
  );

  function barHeight(value: number): number {
    return (value / maxValue) * barChartHeight;
  }

  // Transactions state
  let categoryFilter = $state('All');
  let searchQuery = $state('');
  let showCount = $state(10);

  const allCategories = $derived(['All', ...new Set(transactions.map((t) => t.category))]);

  const filteredTransactions = $derived(
    transactions
      .filter((t) => {
        if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
        if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase()))
          return false;
        return true;
      })
      .slice(0, showCount),
  );

  const categoryIcons: Record<string, string> = {
    Income: '💼',
    Groceries: '🛒',
    Transport: '🚗',
    Entertainment: '🎬',
    'Food & Drink': '🍔',
    Shopping: '🛍️',
    Health: '💪',
    Utilities: '⚡',
    Transfer: '↕️',
    Travel: '✈️',
    Cash: '💵',
  };

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Transfer form state
  let transferFrom = $state('acc1');
  let transferAmount = $state('');
  let transferTo = $state('acc2');
</script>

<div class="min-h-screen bg-slate-950">
  <div class="mx-auto max-w-7xl px-4 py-8">
    <!-- Page header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <p class="text-sm text-slate-400">Welcome back, Alex · June 18, 2026</p>
      </div>
      <button
        class="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        + New Transfer
      </button>
    </div>

    <!-- Accounts row -->
    <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each accounts as account}
        {@const isCredit = account.type === 'credit'}
        {@const borderColor = account.type === 'checking'
          ? 'border-l-indigo-500'
          : account.type === 'savings'
            ? 'border-l-emerald-500'
            : 'border-l-orange-500'}
        <div
          class="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-sm border-l-4 {borderColor}"
        >
          <div class="mb-4 flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400">{account.name}</p>
              <span
                class="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize {account.type === 'checking'
                  ? 'bg-indigo-100 text-indigo-700'
                  : account.type === 'savings'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-orange-100 text-orange-700'}"
              >
                {account.type}
              </span>
            </div>
            <div class="rounded-lg bg-slate-800 px-2 py-1 font-mono text-xs text-slate-400">
              •••• {account.cardLast4}
            </div>
          </div>

          <p
            class="mb-1 text-3xl font-bold {isCredit ? 'text-orange-400' : 'text-white'}"
          >
            {isCredit ? '-' : ''}{formatCurrency(account.balance)}
          </p>
          <p class="mb-4 text-xs text-slate-500">{account.iban}</p>

          <div class="flex gap-2">
            <button
              class="flex-1 rounded-lg border border-slate-700 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Transfer
            </button>
            <button
              class="flex-1 rounded-lg border border-slate-700 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      {/each}
    </div>

    <!-- Stats bar -->
    <div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {#each [
        { label: 'Total Balance', value: formatCurrency(totalBalance), sub: 'Across all accounts', color: 'text-white' },
        { label: 'Monthly Income', value: formatCurrency(currentMonth.income), sub: 'June 2026', color: 'text-emerald-600' },
        { label: 'Monthly Expenses', value: formatCurrency(currentMonth.expenses), sub: 'June 2026', color: 'text-red-500' },
        { label: 'Savings Rate', value: `${savingsRate}%`, sub: 'This month', color: 'text-indigo-600' },
      ] as stat}
        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-sm">
          <p class="text-xs font-medium text-slate-500">{stat.label}</p>
          <p class="mt-1 text-2xl font-bold {stat.color}">{stat.value}</p>
          <p class="text-xs text-slate-500">{stat.sub}</p>
        </div>
      {/each}
    </div>

    <!-- Charts row -->
    <div class="mb-8 grid gap-6 lg:grid-cols-2">
      <!-- Donut chart: spending by category -->
      <div class="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
        <h2 class="mb-6 text-base font-semibold text-white">Spending by Category</h2>
        <div class="flex items-center gap-6">
          <!-- SVG Donut -->
          <div class="flex-shrink-0">
            <svg viewBox="0 0 100 100" class="h-40 w-40" xmlns="http://www.w3.org/2000/svg">
              {#each donutSlices as slice}
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke={slice.category.color}
                  stroke-width="15"
                  stroke-dasharray={slice.dasharray}
                  stroke-dashoffset={slice.dashoffset}
                  stroke-linecap="butt"
                  transform="rotate(-90 50 50)"
                />
              {/each}
              <!-- Center text -->
              <text
                x="50"
                y="47"
                text-anchor="middle"
                class="text-xs"
                style="font-size: 7px; font-weight: 700; fill: #f1f5f9;"
              >
                {formatCurrency(totalSpend).replace('.00', '')}
              </text>
              <text
                x="50"
                y="56"
                text-anchor="middle"
                style="font-size: 5px; fill: #9ca3af;"
              >
                total spent
              </text>
            </svg>
          </div>

          <!-- Legend -->
          <div class="flex-1 space-y-2">
            {#each donutSlices as slice}
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div
                    class="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style="background: {slice.category.color}"
                  ></div>
                  <span class="text-xs text-slate-400">{slice.category.name}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium text-white"
                    >{formatCurrency(slice.category.amount)}</span
                  >
                  <span class="w-8 text-right text-xs text-slate-500">{slice.percentage}%</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Bar chart: income vs expenses -->
      <div class="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
        <h2 class="mb-6 text-base font-semibold text-white">Income vs Expenses</h2>
        <div class="flex items-end justify-between gap-2">
          {#each monthlyStats as stat, i}
            {@const incomeH = barHeight(stat.income)}
            {@const expenseH = barHeight(stat.expenses)}
            <div class="flex flex-1 flex-col items-center gap-1">
              <!-- Bar group -->
              <div
                class="relative flex w-full items-end justify-center gap-0.5"
                style="height: {barChartHeight}px;"
              >
                <!-- Income bar -->
                <div
                  class="w-4 rounded-t-md bg-indigo-500 transition-all hover:bg-indigo-400"
                  style="height: {incomeH}px;"
                  title="Income: {formatCurrency(stat.income)}"
                ></div>
                <!-- Expense bar -->
                <div
                  class="w-4 rounded-t-md bg-pink-400 transition-all hover:bg-pink-300"
                  style="height: {expenseH}px;"
                  title="Expenses: {formatCurrency(stat.expenses)}"
                ></div>
              </div>
              <span class="text-xs text-slate-500">{stat.month}</span>
            </div>
          {/each}
        </div>

        <!-- Legend -->
        <div class="mt-4 flex items-center gap-4">
          <div class="flex items-center gap-1.5">
            <div class="h-3 w-3 rounded-sm bg-indigo-500"></div>
            <span class="text-xs text-slate-400">Income</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="h-3 w-3 rounded-sm bg-pink-400"></div>
            <span class="text-xs text-slate-400">Expenses</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions + Sidebar row -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Transactions list (2/3 width) -->
      <div class="rounded-2xl border border-slate-700 bg-slate-900 shadow-sm lg:col-span-2">
        <div class="border-b border-slate-700 p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-semibold text-white">Recent Transactions</h2>
            <span class="text-xs text-slate-500">{filteredTransactions.length} shown</span>
          </div>

          <!-- Filters -->
          <div class="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search transactions…"
              bind:value={searchQuery}
              class="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-900"
            />
            <select
              bind:value={categoryFilter}
              class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {#each allCategories as cat}
                <option value={cat}>{cat}</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="divide-y divide-slate-800">
          {#each filteredTransactions as tx}
            <div class="flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors">
              <div class="flex items-center gap-4">
                <div
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800 text-lg"
                >
                  {categoryIcons[tx.category] ?? '💳'}
                </div>
                <div>
                  <p class="text-sm font-medium text-white">{tx.description}</p>
                  <div class="flex items-center gap-2">
                    <p class="text-xs text-slate-500">{formatDate(tx.date)}</p>
                    <span
                      class="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
                    >
                      {tx.category}
                    </span>
                  </div>
                </div>
              </div>
              <span
                class="text-sm font-semibold {tx.type === 'credit'
                  ? 'text-emerald-600'
                  : 'text-slate-200'}"
              >
                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
            </div>
          {/each}
        </div>

        {#if showCount < transactions.filter((t) => (categoryFilter === 'All' || t.category === categoryFilter) && (!searchQuery || t.description.toLowerCase().includes(searchQuery.toLowerCase()))).length}
          <div class="border-t border-slate-700 p-4 text-center">
            <button
              onclick={() => (showCount += 10)}
              class="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Load more
            </button>
          </div>
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="flex flex-col gap-6">
        <!-- Quick Transfer -->
        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
          <h2 class="mb-4 text-base font-semibold text-white">Quick Transfer</h2>
          <div class="space-y-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-400">From</label>
              <select
                bind:value={transferFrom}
                class="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                {#each accounts.filter((a) => a.type !== 'credit') as acc}
                  <option value={acc.id}>{acc.name} · {formatCurrency(acc.balance)}</option>
                {/each}
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-400">To</label>
              <select
                bind:value={transferTo}
                class="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                {#each accounts as acc}
                  <option value={acc.id}>{acc.name}</option>
                {/each}
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-400">Amount (USD)</label>
              <input
                type="number"
                placeholder="0.00"
                bind:value={transferAmount}
                class="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-900"
              />
            </div>
            <button
              class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Transfer Funds
            </button>
            <p class="text-center text-xs text-slate-500">Demo — no real transfers made</p>
          </div>
        </div>

        <!-- Savings Goal -->
        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
          <h2 class="mb-4 text-base font-semibold text-white">Savings Goal</h2>
          <div class="mb-3 flex items-end justify-between">
            <div>
              <p class="text-xs text-slate-400">Emergency Fund</p>
              <p class="text-2xl font-bold text-white">$34,200</p>
            </div>
            <p class="text-sm font-medium text-indigo-600">of $50,000</p>
          </div>
          <!-- Progress bar -->
          <div class="mb-2 h-3 overflow-hidden rounded-full bg-slate-700">
            <div
              class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              style="width: 68.4%"
            ></div>
          </div>
          <p class="text-xs text-slate-500">68% complete · $15,800 remaining</p>

          <div class="mt-4 rounded-xl bg-indigo-900/30 border border-indigo-800 p-3">
            <p class="text-xs font-medium text-indigo-300">At your current savings rate of 62%, you'll reach your goal in ~3.5 months.</p>
          </div>
        </div>

        <!-- APY card -->
        <div class="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-sm">
          <div class="mb-2 flex items-center gap-2">
            <span class="text-xl">💰</span>
            <p class="text-sm font-medium text-emerald-100">Savings Account</p>
          </div>
          <p class="text-3xl font-extrabold">4.75% APY</p>
          <p class="mt-1 text-sm text-emerald-200">
            Earning ${(34200 * 0.0475 / 12).toFixed(2)}/month passively
          </p>
          <button
            class="mt-4 w-full rounded-xl bg-white/20 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/30"
          >
            Boost Savings →
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
