<script lang="ts">
  import { base } from '$app/paths';
  const features = [
    {
      icon: '⚡',
      title: 'Instant Transfers',
      description: 'Send money in seconds, 24/7, zero delays. No waiting for business days.',
    },
    {
      icon: '🛡️',
      title: 'Bank-Grade Security',
      description: '256-bit encryption, biometric auth, and real-time fraud detection.',
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'AI-powered insights on your spending patterns to help you save more.',
    },
    {
      icon: '💸',
      title: 'Zero Hidden Fees',
      description: 'No monthly fees, no ATM fees, no surprises. Ever.',
    },
    {
      icon: '🌍',
      title: 'Global Payments',
      description: 'Send money to 150+ countries at real exchange rates, instantly.',
    },
    {
      icon: '💰',
      title: 'High-Yield Savings',
      description: 'Earn 4.75% APY on your savings, automatically — no action needed.',
    },
  ];

  const testimonials = [
    {
      initials: 'SA',
      name: 'Sarah A.',
      role: 'Freelance Designer',
      color: 'bg-pink-500',
      text: 'NovaBank completely changed how I manage my finances. International payments used to take days — now it\'s instant.',
    },
    {
      initials: 'MR',
      name: 'Marcus R.',
      role: 'Software Engineer',
      color: 'bg-indigo-500',
      text: 'The analytics dashboard is incredible. I finally understand where my money goes each month. Saved $400 in the first month.',
    },
    {
      initials: 'JL',
      name: 'Julia L.',
      role: 'Small Business Owner',
      color: 'bg-emerald-500',
      text: 'Switched my business account to NovaBank 6 months ago. The zero-fee policy alone saves me hundreds every quarter.',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      highlight: false,
      features: [
        'Basic transfers',
        '1 account',
        'Standard support',
        'Mobile app',
        'Spending insights',
      ],
      cta: 'Get Started',
    },
    {
      name: 'Pro',
      price: '$9',
      period: '/mo',
      highlight: true,
      features: [
        'Unlimited accounts',
        'Instant transfers',
        'Advanced analytics',
        'Priority support',
        'Virtual cards',
        'Savings goals',
      ],
      cta: 'Start Free Trial',
    },
    {
      name: 'Business',
      price: '$29',
      period: '/mo',
      highlight: false,
      features: [
        'Multi-user access',
        'API access',
        'Advanced analytics',
        'Dedicated manager',
        'Custom integrations',
        'Invoicing tools',
      ],
      cta: 'Contact Sales',
    },
  ];

  // Sparkline SVG path for mock balance chart
  const sparklinePoints = '0,40 10,35 20,38 30,28 40,32 50,20 60,25 70,15 80,18 90,10 100,12';
</script>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-24 pt-16">
  <!-- Animated blob decorations -->
  <div
    class="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"
  ></div>
  <div
    class="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl"
  ></div>
  <div
    class="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"
  ></div>

  <div class="relative mx-auto max-w-6xl px-4">
    <div class="flex flex-col items-center gap-16 lg:flex-row lg:items-center">
      <!-- Hero text -->
      <div class="flex-1 text-center lg:text-left">
        <div
          class="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300"
        >
          <span class="h-2 w-2 animate-pulse rounded-full bg-indigo-400"></span>
          Now with 4.75% APY savings
        </div>
        <h1 class="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl">
          Banking that works<br />
          <span class="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            as hard as you do
          </span>
        </h1>
        <p class="mb-8 text-lg leading-relaxed text-slate-400">
          Zero fees. Instant transfers. Smart budgeting. All in one place.<br />
          Join 2 million people banking smarter with NovaBank.
        </p>
        <div class="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
          <a
            href="{base}/dashboard"
            class="rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40"
          >
            Get Started Free
          </a>
          <a
            href="{base}/dashboard"
            class="flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-base font-semibold text-white/80 transition-all hover:border-white/40 hover:text-white"
          >
            See Dashboard <span>→</span>
          </a>
        </div>
        <p class="mt-4 text-sm text-slate-500">No credit card required. Free forever plan available.</p>
      </div>

      <!-- Mock bank card visual -->
      <div class="flex-shrink-0">
        <div class="relative">
          <!-- Glow effect -->
          <div
            class="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 blur-2xl opacity-40"
          ></div>
          <!-- Card -->
          <div
            class="relative h-52 w-88 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-6 shadow-2xl"
            style="width: 340px;"
          >
            <!-- Card top row -->
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-indigo-300/70">NovaBank</p>
                <p class="text-sm font-bold text-white">◆ NOVA</p>
              </div>
              <!-- Chip -->
              <div
                class="h-8 w-11 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner"
              >
                <div class="h-full w-full rounded-md opacity-50"
                  style="background: repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px);"
                ></div>
              </div>
            </div>

            <!-- Card number -->
            <div class="mt-6 flex items-center gap-3">
              <div class="flex gap-1">
                {#each [0, 1, 2, 3] as _}
                  <div class="h-2 w-2 rounded-full bg-white/60"></div>
                {/each}
              </div>
              <div class="flex gap-1">
                {#each [0, 1, 2, 3] as _}
                  <div class="h-2 w-2 rounded-full bg-white/60"></div>
                {/each}
              </div>
              <div class="flex gap-1">
                {#each [0, 1, 2, 3] as _}
                  <div class="h-2 w-2 rounded-full bg-white/60"></div>
                {/each}
              </div>
              <span class="font-mono text-base font-semibold text-white">4821</span>
            </div>

            <!-- Card bottom row -->
            <div class="mt-4 flex items-end justify-between">
              <div>
                <p class="text-xs text-indigo-300/60">Card Holder</p>
                <p class="text-sm font-semibold text-white">ALEX MORGAN</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-indigo-300/60">Expires</p>
                <p class="text-sm font-semibold text-white">06/29</p>
              </div>
              <!-- Visa-like logo -->
              <div class="flex h-8 w-12 items-center justify-center">
                <div class="flex">
                  <div class="h-8 w-8 rounded-full bg-red-500/80 -mr-3"></div>
                  <div class="h-8 w-8 rounded-full bg-yellow-500/80"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Second card peek -->
          <div
            class="absolute -bottom-4 -right-4 -z-10 h-52 w-88 rounded-3xl bg-gradient-to-br from-purple-700 to-slate-800 opacity-60"
            style="width: 340px;"
          ></div>
        </div>
      </div>
    </div>

    <!-- Floating stats below hero -->
    <div class="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {#each [
        { value: '2M+', label: 'Happy customers' },
        { value: '$12B+', label: 'Processed monthly' },
        { value: '150+', label: 'Countries supported' },
        { value: '4.9★', label: 'App store rating' },
      ] as stat}
        <div
          class="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center backdrop-blur-sm"
        >
          <p class="text-2xl font-bold text-white">{stat.value}</p>
          <p class="text-sm text-slate-400">{stat.label}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="bg-gray-50 py-24">
  <div class="mx-auto max-w-6xl px-4">
    <div class="mb-16 text-center">
      <h2 class="mb-4 text-4xl font-bold text-gray-900">Everything you need to bank better</h2>
      <p class="text-lg text-gray-500">
        Built for the modern world. Designed around your life.
      </p>
    </div>

    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {#each features as feature}
        <div
          class="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <div
            class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl"
          >
            {feature.icon}
          </div>
          <h3 class="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
          <p class="text-sm leading-relaxed text-gray-500">{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Dashboard Preview Section -->
<section class="bg-slate-900 py-24">
  <div class="mx-auto max-w-6xl px-4">
    <div class="mb-12 text-center">
      <h2 class="mb-4 text-4xl font-bold text-white">Your finances at a glance</h2>
      <p class="text-lg text-slate-400">
        A powerful dashboard that puts everything you need in one place.
      </p>
    </div>

    <!-- Mock dashboard card -->
    <div class="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-800 shadow-2xl">
      <!-- Dashboard header -->
      <div class="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="h-3 w-3 rounded-full bg-red-500"></div>
          <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div class="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div class="rounded-lg bg-slate-700 px-4 py-1 text-xs text-slate-400">
          app.novabank.com/dashboard
        </div>
        <div class="w-16"></div>
      </div>

      <div class="p-6">
        <!-- Balance section -->
        <div class="mb-6 flex items-start justify-between">
          <div>
            <p class="text-sm text-slate-400">Total Balance</p>
            <p class="text-4xl font-bold text-white">$46,650.80</p>
            <p class="mt-1 text-sm text-emerald-400">↑ +$5,200 this month</p>
          </div>
          <!-- Sparkline chart -->
          <div class="rounded-xl bg-indigo-600/20 p-3">
            <svg viewBox="0 0 100 50" class="h-12 w-24" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#6366f1" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
                </linearGradient>
              </defs>
              <polyline
                points={sparklinePoints}
                fill="none"
                stroke="#6366f1"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="mb-6 grid grid-cols-3 gap-3">
          {#each [
            { label: 'Income', value: '$6,000', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Expenses', value: '$2,267', color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Savings Rate', value: '62%', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          ] as stat}
            <div class="rounded-xl {stat.bg} p-4">
              <p class="text-xs text-slate-400">{stat.label}</p>
              <p class="text-xl font-bold {stat.color}">{stat.value}</p>
            </div>
          {/each}
        </div>

        <!-- Transactions preview -->
        <div class="space-y-2">
          {#each [
            { icon: '💼', name: 'Salary June', date: 'Jun 18', amount: '+$5,200', color: 'text-emerald-400' },
            { icon: '🛒', name: 'Whole Foods', date: 'Jun 17', amount: '-$84.50', color: 'text-red-400' },
            { icon: '🚗', name: 'Uber', date: 'Jun 17', amount: '-$18.20', color: 'text-red-400' },
          ] as tx}
            <div class="flex items-center justify-between rounded-xl bg-slate-700/50 px-4 py-3">
              <div class="flex items-center gap-3">
                <span class="text-lg">{tx.icon}</span>
                <div>
                  <p class="text-sm font-medium text-white">{tx.name}</p>
                  <p class="text-xs text-slate-400">{tx.date}</p>
                </div>
              </div>
              <span class="text-sm font-semibold {tx.color}">{tx.amount}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Pricing Section -->
<section class="bg-white py-24">
  <div class="mx-auto max-w-6xl px-4">
    <div class="mb-16 text-center">
      <h2 class="mb-4 text-4xl font-bold text-gray-900">Simple, transparent pricing</h2>
      <p class="text-lg text-gray-500">No surprises. No hidden fees. Cancel anytime.</p>
    </div>

    <div class="grid gap-8 md:grid-cols-3">
      {#each plans as plan}
        <div
          class="relative flex flex-col rounded-3xl border p-8 {plan.highlight
            ? 'border-indigo-500 bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30'
            : 'border-gray-200 bg-white text-gray-900'}"
        >
          {#if plan.highlight}
            <div
              class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 px-4 py-1 text-xs font-bold text-white shadow-lg"
            >
              Most Popular
            </div>
          {/if}

          <div class="mb-6">
            <h3 class="mb-2 text-xl font-bold">{plan.name}</h3>
            <div class="flex items-end gap-1">
              <span class="text-4xl font-extrabold">{plan.price}</span>
              <span class="mb-1 text-sm opacity-60">{plan.period}</span>
            </div>
          </div>

          <ul class="mb-8 flex-1 space-y-3">
            {#each plan.features as feature}
              <li class="flex items-center gap-3 text-sm">
                <span
                  class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full {plan.highlight
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-100 text-indigo-600'} text-xs font-bold"
                >
                  ✓
                </span>
                {feature}
              </li>
            {/each}
          </ul>

          <a
            href="{base}/dashboard"
            class="block rounded-full py-3 text-center text-sm font-semibold transition-all {plan.highlight
              ? 'bg-white text-indigo-600 hover:bg-indigo-50'
              : 'border border-gray-200 text-gray-900 hover:bg-gray-50'}"
          >
            {plan.cta}
          </a>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Testimonials Section -->
<section class="bg-gray-50 py-24">
  <div class="mx-auto max-w-6xl px-4">
    <div class="mb-16 text-center">
      <h2 class="mb-4 text-4xl font-bold text-gray-900">Loved by millions</h2>
      <p class="text-lg text-gray-500">Real stories from real customers.</p>
    </div>

    <div class="grid gap-8 md:grid-cols-3">
      {#each testimonials as t}
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div class="mb-4 text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
          <p class="mb-6 text-sm leading-relaxed text-gray-600">"{t.text}"</p>
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full {t.color} text-sm font-bold text-white"
            >
              {t.initials}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">{t.name}</p>
              <p class="text-xs text-gray-400">{t.role}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA Footer Section -->
<section class="bg-gradient-to-br from-indigo-600 to-purple-700 py-24">
  <div class="mx-auto max-w-3xl px-4 text-center">
    <h2 class="mb-4 text-4xl font-extrabold text-white">Ready to get started?</h2>
    <p class="mb-8 text-lg text-indigo-200">
      Join 2M+ users who bank smarter. No fees, no complexity, just better banking.
    </p>
    <a
      href="{base}/dashboard"
      class="inline-block rounded-full bg-white px-10 py-4 text-base font-bold text-indigo-600 shadow-xl shadow-indigo-900/30 transition-all hover:bg-indigo-50 hover:shadow-2xl"
    >
      Open Free Account
    </a>
    <p class="mt-4 text-sm text-indigo-300">Setup takes less than 2 minutes.</p>
  </div>
</section>

<!-- Footer -->
<footer class="bg-slate-900 py-12">
  <div class="mx-auto max-w-6xl px-4">
    <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div class="flex items-center gap-2 text-xl font-bold text-indigo-400">
        <span>◆</span> NovaBank
      </div>
      <p class="text-sm text-slate-500">
        © 2026 NovaBank. Demo application — not a real financial institution.
      </p>
    </div>
  </div>
</footer>
