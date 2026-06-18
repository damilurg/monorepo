<script lang="ts">
  import { onMount } from 'svelte';

  interface TocEntry {
    id: string;
    label: string;
    level: number;
  }

  const toc: TocEntry[] = [
    { id: 'overview', label: 'Overview', level: 1 },
    { id: 'architecture', label: 'Architecture', level: 1 },
    { id: 'monorepo-structure', label: 'Monorepo Structure', level: 2 },
    { id: 'installation', label: 'Installation & Setup', level: 1 },
    { id: 'react-in-svelte', label: 'React-in-Svelte Pattern', level: 1 },
    { id: 'how-it-works', label: 'How It Works', level: 2 },
    { id: 'code-example', label: 'Code Example', level: 2 },
    { id: 'new-composition', label: 'Creating a New Composition', level: 1 },
    { id: 'step1', label: 'Step 1: Write the component', level: 2 },
    { id: 'step2', label: 'Step 2: Register in Root.tsx', level: 2 },
    { id: 'step3', label: 'Step 3: Export from index.ts', level: 2 },
    { id: 'step4', label: 'Step 4: Use in SvelteKit', level: 2 },
    { id: 'rendering', label: 'Rendering Videos', level: 1 },
    { id: 'cli-render', label: 'CLI Rendering', level: 2 },
    { id: 'server-render', label: 'Server-side Rendering', level: 2 },
    { id: 'cloud', label: 'Remotion Lambda (Cloud)', level: 1 },
    { id: 'api-reference', label: 'Remotion API Reference', level: 1 },
    { id: 'vite-config', label: 'Vite Configuration', level: 1 },
    { id: 'pds', label: 'Porsche Design System v4', level: 1 },
    { id: 'troubleshooting', label: 'Troubleshooting', level: 1 },
  ];

  let activeSection = $state('overview');

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        }
      },
      { rootMargin: '-20% 0% -70% 0%' }
    );

    for (const item of toc) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Remotion Docs — Monorepo Integration</title>
</svelte:head>

<div class="flex min-h-screen">
  <!-- Sticky sidebar TOC -->
  <aside
    class="hidden lg:block w-64 shrink-0 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-slate-800 px-4 py-8"
  >
    <div class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
      On this page
    </div>
    <nav class="space-y-1">
      {#each toc as item}
        <a
          href="#{item.id}"
          class="block text-sm transition-colors rounded px-2 py-1 {item.level === 2
            ? 'pl-5 text-slate-500 hover:text-slate-300'
            : 'text-slate-400 hover:text-white'} {activeSection === item.id
            ? 'text-indigo-400 font-medium'
            : ''}"
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </aside>

  <!-- Main content -->
  <main class="flex-1 max-w-3xl mx-auto px-6 py-10 lg:py-12">
    <!-- Page header -->
    <div class="mb-12">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-4xl">🎬</span>
        <h1 class="text-4xl font-black text-white">Remotion Integration</h1>
      </div>
      <p class="text-lg text-slate-400">
        Complete guide to using <a
          href="https://remotion.dev"
          class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer">Remotion</a
        > for programmatic video generation inside this SvelteKit monorepo.
      </p>
    </div>

    <!-- ─────────────────────────────────────────────── -->
    <!-- OVERVIEW -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="overview" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> Overview
      </h2>
      <p class="text-slate-300 mb-4 leading-relaxed">
        <strong class="text-white">Remotion</strong> is a React-based framework for creating videos
        programmatically. Instead of editing timelines in video software, you write React components
        that describe what the frame looks like at any given moment. Remotion renders those components
        frame-by-frame into MP4, GIF, or WebM files.
      </p>
      <p class="text-slate-300 mb-4 leading-relaxed">
        Because Remotion is React-based, integrating it with a SvelteKit app requires a bridging
        strategy. This monorepo uses the <strong class="text-white">React-in-Svelte</strong> pattern:
        Remotion compositions are authored as pure React components in a shared package
        (<code class="text-indigo-300 bg-slate-800 px-1 rounded">packages/remotion-compositions</code>),
        and the SvelteKit app mounts those components into a DOM element at runtime using
        <code class="text-indigo-300 bg-slate-800 px-1 rounded">createRoot</code>.
      </p>
      <div class="bg-indigo-950/50 border border-indigo-800/50 rounded-xl p-5 mt-4">
        <div class="text-sm font-semibold text-indigo-300 mb-2">What you get</div>
        <ul class="space-y-2 text-sm text-slate-300">
          <li class="flex items-start gap-2">
            <span class="text-indigo-400 mt-0.5">✓</span>
            <span
              >Live preview with the <strong class="text-white">Remotion Player</strong> embedded directly
              in the SvelteKit Studio page (port 5183)</span
            >
          </li>
          <li class="flex items-start gap-2">
            <span class="text-indigo-400 mt-0.5">✓</span>
            <span
              >Full <strong class="text-white">Remotion Studio</strong> (React devtools, timeline scrubber,
              render UI) via <code class="text-indigo-300 bg-slate-800 px-1 rounded"
                >npx remotion studio</code
              > in the compositions package</span
            >
          </li>
          <li class="flex items-start gap-2">
            <span class="text-indigo-400 mt-0.5">✓</span>
            <span
              >CLI rendering to MP4/GIF/WebM with custom props from the command line</span
            >
          </li>
          <li class="flex items-start gap-2">
            <span class="text-indigo-400 mt-0.5">✓</span>
            <span
              >Server-side rendering endpoint scaffold (<code
                class="text-indigo-300 bg-slate-800 px-1 rounded">/api/render</code
              >) ready for <code class="text-indigo-300 bg-slate-800 px-1 rounded"
                >@remotion/renderer</code
              ></span
            >
          </li>
        </ul>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <!-- ARCHITECTURE -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="architecture" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> Architecture
      </h2>
      <p class="text-slate-300 mb-6 leading-relaxed">
        The integration splits cleanly across two packages, each with its own responsibility and
        toolchain:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="bg-slate-900 rounded-xl p-5 border border-slate-700">
          <div class="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
            packages/remotion-compositions
          </div>
          <div class="text-sm text-white font-semibold mb-2">React + Remotion layer</div>
          <ul class="text-sm text-slate-400 space-y-1">
            <li>• Pure React components (TSX)</li>
            <li>• Own tsconfig with <code class="text-slate-300">"jsx": "react-jsx"</code></li>
            <li>• Remotion CLI for studio & rendering</li>
            <li>• Exports composition components via index.ts</li>
          </ul>
        </div>
        <div class="bg-slate-900 rounded-xl p-5 border border-slate-700">
          <div class="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            apps/remotion
          </div>
          <div class="text-sm text-white font-semibold mb-2">SvelteKit app (port 5183)</div>
          <ul class="text-sm text-slate-400 space-y-1">
            <li>• Svelte 5 + SvelteKit 2</li>
            <li>• Vite with React + Svelte plugins</li>
            <li>• Mounts React Player via <code class="text-slate-300">createRoot</code></li>
            <li>• Documentation page (this page)</li>
          </ul>
        </div>
      </div>

      <h3 id="monorepo-structure" class="text-lg font-semibold text-white mb-3 scroll-mt-20">
        Monorepo Structure
      </h3>
      <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        <div class="flex items-center gap-2 px-4 py-2 border-b border-slate-700 bg-slate-800/50">
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-red-500/70"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500/70"></div>
            <div class="w-3 h-3 rounded-full bg-green-500/70"></div>
          </div>
          <span class="text-xs text-slate-500 ml-1">Directory tree</span>
        </div>
        <pre
          class="p-4 text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed"><code>monorepo/
├── packages/
│   └── remotion-compositions/   <span class="text-indigo-400">← React + Remotion code</span>
│       ├── src/
│       │   ├── Root.tsx          <span class="text-slate-500">← Entry for Remotion CLI</span>
│       │   ├── compositions/
│       │   │   ├── HelloWorld.tsx
│       │   │   └── DataViz.tsx
│       │   └── index.ts          <span class="text-slate-500">← Public API for SvelteKit</span>
│       ├── remotion.config.ts
│       ├── tsconfig.json         <span class="text-slate-500">← jsx: react-jsx</span>
│       └── package.json
└── apps/
    └── remotion/                 <span class="text-indigo-400">← SvelteKit app (port 5183)</span>
        ├── src/
        │   └── routes/
        │       ├── +layout.svelte
        │       ├── +page.svelte  <span class="text-slate-500">← Studio (Remotion Player)</span>
        │       ├── docs/
        │       │   └── +page.svelte  <span class="text-slate-500">← This page</span>
        │       └── api/render/
        │           └── +server.ts    <span class="text-slate-500">← Render endpoint</span>
        ├── vite.config.ts        <span class="text-slate-500">← React + Svelte plugins</span>
        └── package.json</code></pre>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <!-- INSTALLATION -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="installation" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> Installation &amp; Setup
      </h2>
      <p class="text-slate-300 mb-4 leading-relaxed">
        All packages are already wired into the monorepo workspace. Run from the repo root:
      </p>

      <div class="space-y-4">
        <div>
          <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">
            Install all dependencies
          </div>
          <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
              <span class="text-green-400 text-xs font-mono">bash</span>
            </div>
            <pre class="p-4 text-sm font-mono text-slate-200"><code>yarn install</code></pre>
          </div>
        </div>

        <div>
          <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">
            Start the SvelteKit preview app
          </div>
          <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
              <span class="text-green-400 text-xs font-mono">bash</span>
            </div>
            <pre
              class="p-4 text-sm font-mono text-slate-200 leading-relaxed"><code><span class="text-slate-500"># from monorepo root</span>
yarn dev:remotion
<span class="text-slate-500"># → http://localhost:5183</span></code></pre>
          </div>
        </div>

        <div>
          <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">
            Start full Remotion Studio (React, separate window)
          </div>
          <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
              <span class="text-green-400 text-xs font-mono">bash</span>
            </div>
            <pre
              class="p-4 text-sm font-mono text-slate-200 leading-relaxed"><code>cd packages/remotion-compositions
npx remotion studio
<span class="text-slate-500"># → http://localhost:3000 (full Remotion Studio)</span></code></pre>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-amber-950/40 border border-amber-800/50 rounded-xl p-4">
        <div class="text-sm font-semibold text-amber-300 mb-1">Note on Node version</div>
        <p class="text-sm text-slate-300">
          Remotion requires Node.js ≥ 18. The monorepo already specifies
          <code class="text-slate-200 bg-slate-800 px-1 rounded">"node": "&gt;=20"</code> in the root
          <code class="text-slate-200 bg-slate-800 px-1 rounded">package.json</code>, so you're covered.
        </p>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <!-- REACT-IN-SVELTE -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="react-in-svelte" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> React-in-Svelte Pattern
      </h2>

      <h3 id="how-it-works" class="text-lg font-semibold text-white mb-3 mt-6 scroll-mt-20">
        How It Works
      </h3>
      <p class="text-slate-300 mb-4 leading-relaxed">
        Svelte and React can coexist on the same page because both ultimately produce DOM nodes.
        React's <code class="text-indigo-300 bg-slate-800 px-1 rounded">createRoot(container)</code>
        API takes any DOM element and mounts a React component tree into it. This means a Svelte component
        can own the container element and hand it off to React.
      </p>
      <p class="text-slate-300 mb-4 leading-relaxed">
        The key insight is that Vite must know about both ecosystems. The
        <code class="text-indigo-300 bg-slate-800 px-1 rounded">vite.config.ts</code> in
        <code class="text-indigo-300 bg-slate-800 px-1 rounded">apps/remotion</code> loads
        <code class="text-indigo-300 bg-slate-800 px-1 rounded">@vitejs/plugin-react</code> for
        <code class="text-indigo-300 bg-slate-800 px-1 rounded">.tsx/.jsx</code> files and
        <code class="text-indigo-300 bg-slate-800 px-1 rounded">@sveltejs/vite-plugin-svelte</code>
        for
        <code class="text-indigo-300 bg-slate-800 px-1 rounded">.svelte</code> files. Order matters:
        the React plugin must come first so it claims <code
          class="text-indigo-300 bg-slate-800 px-1 rounded">.tsx</code
        > files before the Svelte plugin sees them.
      </p>

      <h3 id="code-example" class="text-lg font-semibold text-white mb-3 mt-6 scroll-mt-20">
        Code Example
      </h3>
      <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden mb-4">
        <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
          <span class="text-orange-400 text-xs font-mono">+page.svelte</span>
        </div>
        <pre
          class="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"><code><span class="text-slate-500">&lt;script lang="ts"&gt;</span>
  <span class="text-purple-400">import</span> {'{ onMount }'} <span class="text-purple-400">from</span> <span class="text-green-400">'svelte'</span>;

  <span class="text-purple-400">let</span> container: HTMLDivElement;
  <span class="text-purple-400">let</span> root: {'{ unmount: () => void }'} | <span class="text-blue-400">null</span> = <span class="text-blue-400">null</span>;

  onMount(<span class="text-purple-400">async</span> () =&gt; {'{'} 
    <span class="text-slate-500">// Dynamic imports keep React out of the initial bundle</span>
    <span class="text-purple-400">const</span> [{'{ createRoot }'}, React, {'{ Player }'}, {'{ HelloWorld }'}] =
      <span class="text-purple-400">await</span> Promise.all([
        <span class="text-purple-400">import</span>(<span class="text-green-400">'react-dom/client'</span>),
        <span class="text-purple-400">import</span>(<span class="text-green-400">'react'</span>),
        <span class="text-purple-400">import</span>(<span class="text-green-400">'@remotion/player'</span>),
        <span class="text-purple-400">import</span>(<span class="text-green-400">'@repo/remotion-compositions'</span>),
      ]);

    root = createRoot(container);
    root.render(
      React.createElement(Player, {'{'} 
        component: HelloWorld,
        durationInFrames: <span class="text-yellow-400">150</span>,
        fps: <span class="text-yellow-400">30</span>,
        compositionWidth: <span class="text-yellow-400">1920</span>,
        compositionHeight: <span class="text-yellow-400">1080</span>,
        controls: <span class="text-blue-400">true</span>,
        autoPlay: <span class="text-blue-400">true</span>,
        loop: <span class="text-blue-400">true</span>,
      {'}'})
    );

    <span class="text-purple-400">return</span> () =&gt; root?.unmount(); <span class="text-slate-500">// cleanup</span>
  {'}'});
<span class="text-slate-500">&lt;/script&gt;</span>

<span class="text-slate-500">&lt;!-- Svelte owns this element; React renders inside it --&gt;</span>
<span class="text-orange-400">&lt;div</span> <span class="text-blue-300">bind:this</span>=<span class="text-green-400">{'{container}'}</span> <span class="text-blue-300">class</span>=<span class="text-green-400">"w-full aspect-video"</span><span class="text-orange-400">&gt;&lt;/div&gt;</span></code></pre>
      </div>

      <div class="bg-slate-900 border border-slate-700 rounded-xl p-4">
        <div class="text-sm font-semibold text-slate-300 mb-2">Why dynamic imports?</div>
        <p class="text-sm text-slate-400">
          Dynamic <code class="text-slate-300">import()</code> calls keep React, Remotion, and your
          composition components out of the initial JS bundle. They're lazy-loaded only when the page
          mounts in the browser, which keeps SSR clean (no React on the server) and avoids bundle
          size concerns. In the studio page, a Svelte 5
          <code class="text-slate-300">$effect</code> re-runs the mount logic whenever
          <code class="text-slate-300">selectedComposition</code> changes, cleanly unmounting the
          previous React root first.
        </p>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <!-- NEW COMPOSITION -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="new-composition" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> Creating a New Composition
      </h2>
      <p class="text-slate-300 mb-6 leading-relaxed">
        Adding a new video composition is a four-step process. Each step has a specific file to
        touch.
      </p>

      <!-- Step 1 -->
      <div id="step1" class="mb-8 scroll-mt-20">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0"
          >
            1
          </div>
          <h3 class="text-lg font-semibold text-white">Write the React component</h3>
        </div>
        <p class="text-slate-400 text-sm mb-3 ml-10">
          Create a new <code class="text-slate-200">.tsx</code> file in
          <code class="text-slate-200">packages/remotion-compositions/src/compositions/</code>.
        </p>
        <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden ml-10">
          <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
            <span class="text-purple-400 text-xs font-mono"
              >packages/remotion-compositions/src/compositions/MyComp.tsx</span
            >
          </div>
          <pre
            class="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"><code><span class="text-purple-400">import</span> {'{ AbsoluteFill, useCurrentFrame, interpolate }'} <span class="text-purple-400">from</span> <span class="text-green-400">'remotion'</span>;

<span class="text-purple-400">interface</span> <span class="text-blue-300">MyCompProps</span> {'{'} 
  message?: <span class="text-blue-400">string</span>;
{'}'}

<span class="text-purple-400">export const</span> <span class="text-yellow-300">MyComp</span>: React.FC&lt;<span class="text-blue-300">MyCompProps</span>&gt; = ({'{'} message = <span class="text-green-400">'Hello!'</span> {'}'}) =&gt; {'{'} 
  <span class="text-purple-400">const</span> frame = <span class="text-yellow-300">useCurrentFrame</span>();

  <span class="text-slate-500">// interpolate(frame, inputRange, outputRange, options)</span>
  <span class="text-purple-400">const</span> opacity = <span class="text-yellow-300">interpolate</span>(frame, [<span class="text-yellow-400">0</span>, <span class="text-yellow-400">30</span>], [<span class="text-yellow-400">0</span>, <span class="text-yellow-400">1</span>], {'{'} extrapolateRight: <span class="text-green-400">'clamp'</span> {'}'});
  <span class="text-purple-400">const</span> scale = <span class="text-yellow-300">interpolate</span>(frame, [<span class="text-yellow-400">0</span>, <span class="text-yellow-400">30</span>], [<span class="text-yellow-400">0.8</span>, <span class="text-yellow-400">1</span>], {'{'} extrapolateRight: <span class="text-green-400">'clamp'</span> {'}'});

  <span class="text-purple-400">return</span> (
    &lt;<span class="text-orange-400">AbsoluteFill</span> style={'{{ background: \'#000\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\' }}'}&gt;
      &lt;<span class="text-orange-400">h1</span> style={'{{ color: \'white\', opacity, transform: `scale($'}{'{ scale }'}{')` }}'}&gt;
        {'{'} message {'}'}
      &lt;/<span class="text-orange-400">h1</span>&gt;
    &lt;/<span class="text-orange-400">AbsoluteFill</span>&gt;
  );
{'}'};
</code></pre>
        </div>
      </div>

      <!-- Step 2 -->
      <div id="step2" class="mb-8 scroll-mt-20">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0"
          >
            2
          </div>
          <h3 class="text-lg font-semibold text-white">Register in Root.tsx</h3>
        </div>
        <p class="text-slate-400 text-sm mb-3 ml-10">
          Add a <code class="text-slate-200">&lt;Composition&gt;</code> entry. This is what the Remotion
          CLI and Studio use.
        </p>
        <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden ml-10">
          <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
            <span class="text-purple-400 text-xs font-mono"
              >packages/remotion-compositions/src/Root.tsx</span
            >
          </div>
          <pre
            class="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"><code><span class="text-purple-400">import</span> {'{ Composition }'} <span class="text-purple-400">from</span> <span class="text-green-400">'remotion'</span>;
<span class="text-purple-400">import</span> {'{ MyComp }'} <span class="text-purple-400">from</span> <span class="text-green-400">'./compositions/MyComp.js'</span>;

<span class="text-purple-400">export const</span> <span class="text-yellow-300">RemotionRoot</span>: React.FC = () =&gt; (
  &lt;&gt;
    {'{'}/* ... existing compositions ... */{'}'} 
    &lt;<span class="text-orange-400">Composition</span>
      id=<span class="text-green-400">"MyComp"</span>
      component={'{'} MyComp {'}'}
      durationInFrames={'{'} <span class="text-yellow-400">90</span> {'}'}
      fps={'{'} <span class="text-yellow-400">30</span> {'}'}
      width={'{'} <span class="text-yellow-400">1920</span> {'}'}
      height={'{'} <span class="text-yellow-400">1080</span> {'}'}
      defaultProps={'{{ message: \'Hello!\' }}'}
    /&gt;
  &lt;/&gt;
);</code></pre>
        </div>
      </div>

      <!-- Step 3 -->
      <div id="step3" class="mb-8 scroll-mt-20">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0"
          >
            3
          </div>
          <h3 class="text-lg font-semibold text-white">Export from index.ts</h3>
        </div>
        <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden ml-10">
          <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
            <span class="text-purple-400 text-xs font-mono"
              >packages/remotion-compositions/src/index.ts</span
            >
          </div>
          <pre
            class="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"><code><span class="text-purple-400">export</span> {'{ HelloWorld }'} <span class="text-purple-400">from</span> <span class="text-green-400">'./compositions/HelloWorld.js'</span>;
<span class="text-purple-400">export</span> {'{ DataViz }'} <span class="text-purple-400">from</span> <span class="text-green-400">'./compositions/DataViz.js'</span>;
<span class="text-slate-400">// Add your new export:</span>
<span class="text-purple-400">export</span> {'{ MyComp }'} <span class="text-purple-400">from</span> <span class="text-green-400">'./compositions/MyComp.js'</span>;</code></pre>
        </div>
      </div>

      <!-- Step 4 -->
      <div id="step4" class="mb-8 scroll-mt-20">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0"
          >
            4
          </div>
          <h3 class="text-lg font-semibold text-white">Use it in the SvelteKit studio page</h3>
        </div>
        <p class="text-slate-400 text-sm mb-3 ml-10">
          Add your composition to the <code class="text-slate-200">compositions</code> array in
          <code class="text-slate-200">apps/remotion/src/routes/+page.svelte</code> and update the
          <code class="text-slate-200">mountPlayer</code> function to handle the new ID.
        </p>
        <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden ml-10">
          <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
            <span class="text-orange-400 text-xs font-mono">+page.svelte (excerpt)</span>
          </div>
          <pre
            class="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"><code><span class="text-slate-500">// 1. Extend the union type</span>
<span class="text-purple-400">type</span> <span class="text-blue-300">CompositionId</span> = <span class="text-green-400">'HelloWorld'</span> | <span class="text-green-400">'DataViz'</span> | <span class="text-green-400">'MyComp'</span>;

<span class="text-slate-500">// 2. Add to the compositions array</span>
<span class="text-purple-400">const</span> compositions = [
  <span class="text-slate-500">/* ... */</span>,
  {'{'} id: <span class="text-green-400">'MyComp'</span>, label: <span class="text-green-400">'✨ My Comp'</span>, fps: <span class="text-yellow-400">30</span>, durationInFrames: <span class="text-yellow-400">90</span>, width: <span class="text-yellow-400">1920</span>, height: <span class="text-yellow-400">1080</span> {'}'},
];

<span class="text-slate-500">// 3. Import and use in mountPlayer</span>
<span class="text-purple-400">const</span> {'{ HelloWorld, DataViz, MyComp }'} = <span class="text-purple-400">await</span> <span class="text-purple-400">import</span>(<span class="text-green-400">'@repo/remotion-compositions'</span>);
<span class="text-purple-400">const</span> componentMap = {'{ HelloWorld, DataViz, MyComp }'};
<span class="text-purple-400">const</span> component = componentMap[compositionId];</code></pre>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <!-- RENDERING -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="rendering" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> Rendering Videos
      </h2>
      <p class="text-slate-300 mb-6 leading-relaxed">
        Remotion can render actual video files — not just preview them. There are two ways: the CLI
        for local development, and the
        <code class="text-indigo-300 bg-slate-800 px-1 rounded">@remotion/renderer</code> Node.js API
        for server-side rendering.
      </p>

      <h3 id="cli-render" class="text-lg font-semibold text-white mb-3 scroll-mt-20">
        CLI Rendering
      </h3>
      <p class="text-slate-400 text-sm mb-3">
        Run from <code class="text-slate-200">packages/remotion-compositions/</code>:
      </p>
      <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden mb-6">
        <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
          <span class="text-green-400 text-xs font-mono">bash</span>
        </div>
        <pre
          class="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"><code><span class="text-slate-500"># Render HelloWorld composition to MP4</span>
npx remotion render HelloWorld out/hello.mp4

<span class="text-slate-500"># Override default props</span>
npx remotion render HelloWorld out/hello.mp4 \
  --props='{"title":"Custom Title","bgColor":"#ec4899"}'

<span class="text-slate-500"># Render as GIF (great for previews/docs)</span>
npx remotion render HelloWorld out/hello.gif --codec=gif

<span class="text-slate-500"># Render a specific frame range</span>
npx remotion render HelloWorld out/clip.mp4 --frames=0-60

<span class="text-slate-500"># Render a still image (frame 30)</span>
npx remotion still HelloWorld out/still.png --frame=30

<span class="text-slate-500"># Use concurrency to speed up rendering</span>
npx remotion render HelloWorld out/hello.mp4 --concurrency=4</code></pre>
      </div>

      <h3 id="server-render" class="text-lg font-semibold text-white mb-3 scroll-mt-20">
        Server-side Rendering
      </h3>
      <p class="text-slate-400 text-sm mb-3">
        The app includes a scaffold endpoint at
        <code class="text-slate-200">/api/render</code> that demonstrates the
        <code class="text-slate-200">@remotion/renderer</code> API. Note that server-side rendering
        requires <code class="text-slate-200">ffmpeg</code> installed on the server. For production, use
        Remotion Lambda instead (see next section).
      </p>
      <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
          <span class="text-blue-400 text-xs font-mono"
            >apps/remotion/src/routes/api/render/+server.ts</span
          >
        </div>
        <pre
          class="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"><code><span class="text-purple-400">import</span> {'{ json, error }'} <span class="text-purple-400">from</span> <span class="text-green-400">'@sveltejs/kit'</span>;
<span class="text-purple-400">import type</span> {'{ RequestHandler }'} <span class="text-purple-400">from</span> <span class="text-green-400">'./$types'</span>;

<span class="text-purple-400">export const</span> <span class="text-yellow-300">POST</span>: RequestHandler = <span class="text-purple-400">async</span> ({'{ request }'}) =&gt; {'{'} 
  <span class="text-purple-400">const</span> {'{ compositionId, props }'} = <span class="text-purple-400">await</span> request.json() <span class="text-purple-400">as</span> {'{'} 
    compositionId: <span class="text-blue-400">string</span>;
    props: Record&lt;<span class="text-blue-400">string</span>, <span class="text-blue-400">unknown</span>&gt;;
  {'}'};

  <span class="text-purple-400">try</span> {'{'} 
    <span class="text-purple-400">const</span> {'{ renderMedia, selectComposition, bundle }'} =
      <span class="text-purple-400">await</span> <span class="text-purple-400">import</span>(<span class="text-green-400">'@remotion/renderer'</span>);

    <span class="text-slate-500">// Bundle the compositions package</span>
    <span class="text-purple-400">const</span> bundleLocation = <span class="text-purple-400">await</span> bundle({'{'} 
      entryPoint: <span class="text-green-400">'../../packages/remotion-compositions/src/index.ts'</span>,
    {'}'});

    <span class="text-purple-400">const</span> composition = <span class="text-purple-400">await</span> selectComposition({'{'} 
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: props,
    {'}'});

    <span class="text-purple-400">await</span> renderMedia({'{'} 
      composition,
      serveUrl: bundleLocation,
      codec: <span class="text-green-400">'h264'</span>,
      outputLocation: <span class="text-green-400">`out/${'{'} compositionId {'}'}.mp4`</span>,
      inputProps: props,
    {'}'});

    <span class="text-purple-400">return</span> json({'{'} success: <span class="text-blue-400">true</span>, path: <span class="text-green-400">`out/${'{'} compositionId {'}'}.mp4`</span> {'}'});
  {'}'} <span class="text-purple-400">catch</span> (err) {'{'} 
    console.error(<span class="text-green-400">'Render failed:'</span>, err);
    <span class="text-purple-400">throw</span> error(<span class="text-yellow-400">500</span>, <span class="text-green-400">'Rendering requires @remotion/renderer and ffmpeg'</span>);
  {'}'}
{'}'};</code></pre>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <!-- CLOUD -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="cloud" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> Remotion Lambda (Cloud Rendering)
      </h2>
      <p class="text-slate-300 mb-4 leading-relaxed">
        For production video rendering at scale, Remotion provides
        <strong class="text-white">Remotion Lambda</strong>, which runs rendering workloads on AWS
        Lambda functions. Each frame is rendered in a separate Lambda invocation, enabling massive
        parallelism and sub-minute render times for complex compositions.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-slate-900 rounded-xl p-4 border border-slate-700 text-center">
          <div class="text-2xl mb-2">⚡</div>
          <div class="text-sm font-semibold text-white mb-1">Parallel rendering</div>
          <div class="text-xs text-slate-400">Each frame on its own Lambda</div>
        </div>
        <div class="bg-slate-900 rounded-xl p-4 border border-slate-700 text-center">
          <div class="text-2xl mb-2">💰</div>
          <div class="text-sm font-semibold text-white mb-1">Pay per render</div>
          <div class="text-xs text-slate-400">No idle server costs</div>
        </div>
        <div class="bg-slate-900 rounded-xl p-4 border border-slate-700 text-center">
          <div class="text-2xl mb-2">🌍</div>
          <div class="text-sm font-semibold text-white mb-1">Global regions</div>
          <div class="text-xs text-slate-400">Deploy near your users</div>
        </div>
      </div>

      <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden mb-4">
        <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
          <span class="text-green-400 text-xs font-mono">bash — one-time setup</span>
        </div>
        <pre
          class="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"><code><span class="text-slate-500"># Install Lambda package</span>
yarn workspace @repo/remotion-compositions add @remotion/lambda

<span class="text-slate-500"># Deploy the Lambda function (requires AWS credentials)</span>
npx remotion lambda functions deploy

<span class="text-slate-500"># Deploy your compositions as a site</span>
npx remotion lambda sites create --site-name=my-remotion-site</code></pre>
      </div>

      <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
          <span class="text-blue-400 text-xs font-mono">Lambda render from a SvelteKit endpoint</span>
        </div>
        <pre
          class="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"><code><span class="text-purple-400">import</span> {'{ renderMediaOnLambda, getRenderProgress }'} <span class="text-purple-400">from</span> <span class="text-green-400">'@remotion/lambda/client'</span>;

<span class="text-purple-400">const</span> {'{ renderId, bucketName }'} = <span class="text-purple-400">await</span> renderMediaOnLambda({'{'} 
  region: <span class="text-green-400">'us-east-1'</span>,
  functionName: <span class="text-green-400">'remotion-render-4-0-272-mem2048mb-disk2048mb-120sec'</span>,
  serveUrl: <span class="text-green-400">'https://remotionlambda-xxx.s3.us-east-1.amazonaws.com/sites/my-remotion-site'</span>,
  composition: <span class="text-green-400">'HelloWorld'</span>,
  inputProps: {'{'} title: <span class="text-green-400">'Generated from SvelteKit!'</span> {'}'},
  codec: <span class="text-green-400">'h264'</span>,
  imageFormat: <span class="text-green-400">'jpeg'</span>,
{'}'});</code></pre>
      </div>

      <p class="text-slate-400 text-sm mt-4">
        See the full <a
          href="https://www.remotion.dev/docs/lambda"
          class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer">Remotion Lambda docs</a
        > for IAM permissions, region setup, and cost estimations.
      </p>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <!-- API REFERENCE -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="api-reference" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> Remotion API Reference
      </h2>
      <p class="text-slate-300 mb-6 leading-relaxed">
        The most important APIs you'll use when authoring compositions:
      </p>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-700">
              <th class="text-left py-3 px-4 text-slate-400 font-semibold">API</th>
              <th class="text-left py-3 px-4 text-slate-400 font-semibold">Package</th>
              <th class="text-left py-3 px-4 text-slate-400 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            {#each [
              { api: 'useCurrentFrame()', pkg: 'remotion', desc: 'Returns the current frame number (0-indexed). The core of all time-based animation.' },
              { api: 'useVideoConfig()', pkg: 'remotion', desc: 'Returns { fps, width, height, durationInFrames, id }. Use for responsive sizing and time calculations.' },
              { api: 'interpolate(value, input, output, options?)', pkg: 'remotion', desc: 'Map a value from one range to another. The workhorse of Remotion animation. Supports easing via extrapolateLeft/Right and easing functions.' },
              { api: 'spring({ frame, fps, config? })', pkg: 'remotion', desc: 'Physics-based spring animation. Produces natural-feeling motion without manual easing. Config: mass, damping, stiffness, overshootClamping.' },
              { api: '<Sequence from={n} durationInFrames={d}>', pkg: 'remotion', desc: 'Render children starting at frame n for d frames. Shifts useCurrentFrame() to be relative to the Sequence start.' },
              { api: '<Series>', pkg: 'remotion', desc: 'Render compositions sequentially one after another. Each child gets a durationInFrames prop.' },
              { api: '<AbsoluteFill>', pkg: 'remotion', desc: 'A div with position:absolute, inset:0. Shorthand for a full-canvas layer. Stack multiple for compositing.' },
              { api: '<Img src={...}>', pkg: 'remotion', desc: 'Image element that waits for the image to load before rendering the frame. Prevents blank frames from lazy loading.' },
              { api: '<Video src={...}>', pkg: 'remotion', desc: 'Embeds a video element synchronized to the composition timeline.' },
              { api: '<Audio src={...}>', pkg: 'remotion', desc: 'Embeds audio synchronized to the composition. Supports volume, startFrom, and endAt props.' },
              { api: 'delayRender() / continueRender()', pkg: 'remotion', desc: 'Tell Remotion to wait for async work (data fetching, font loading) before rendering a frame.' },
              { api: 'measureSpring({ config, durationInFrames })', pkg: 'remotion', desc: 'Calculate how many frames a spring animation needs to settle — useful for calculating Sequence durations.' },
            ] as row}
              <tr class="hover:bg-slate-800/50 transition-colors">
                <td class="py-3 px-4">
                  <code class="text-indigo-300 font-mono text-xs whitespace-nowrap">{row.api}</code>
                </td>
                <td class="py-3 px-4">
                  <span
                    class="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono whitespace-nowrap"
                    >{row.pkg}</span
                  >
                </td>
                <td class="py-3 px-4 text-slate-300 text-xs leading-relaxed">{row.desc}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="mt-6 bg-slate-900 rounded-xl p-5 border border-slate-700">
        <div class="text-sm font-semibold text-slate-300 mb-3">Animation pattern cookbook</div>
        <div class="space-y-4">
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">Fade in over 30 frames</div>
            <code class="text-xs font-mono text-slate-200 bg-slate-800 block px-3 py-2 rounded">
              const opacity = interpolate(frame, [0, 30], [0, 1], {'{ extrapolateRight: \'clamp\' }'});
            </code>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">Slide up from 40px</div>
            <code class="text-xs font-mono text-slate-200 bg-slate-800 block px-3 py-2 rounded">
              const y = interpolate(frame, [0, 30], [40, 0], {'{ extrapolateRight: \'clamp\' }'});
            </code>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">Spring scale-in</div>
            <code class="text-xs font-mono text-slate-200 bg-slate-800 block px-3 py-2 rounded">
              {'const scale = spring({ frame, fps, config: { damping: 12 } });'}
            </code>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">Fade out before end (last 20 frames)</div>
            <code class="text-xs font-mono text-slate-200 bg-slate-800 block px-3 py-2 rounded">
              const opacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {'{ extrapolateLeft: \'clamp\' }'});
            </code>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">Staggered list items</div>
            <code class="text-xs font-mono text-slate-200 bg-slate-800 block px-3 py-2 rounded">
              {'const opacity = interpolate(frame, [index * 8, index * 8 + 20], [0, 1], { extrapolateRight: \'clamp\' });'}
            </code>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <!-- VITE CONFIG -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="vite-config" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> Vite Configuration
      </h2>
      <p class="text-slate-300 mb-4 leading-relaxed">
        The <code class="text-indigo-300 bg-slate-800 px-1 rounded">vite.config.ts</code> in
        <code class="text-indigo-300 bg-slate-800 px-1 rounded">apps/remotion</code> has several important
        settings:
      </p>
      <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden mb-6">
        <div class="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
          <span class="text-blue-400 text-xs font-mono">apps/remotion/vite.config.ts</span>
        </div>
        <pre
          class="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"><code><span class="text-purple-400">import</span> {'{ sveltekit }'} <span class="text-purple-400">from</span> <span class="text-green-400">'@sveltejs/kit/vite'</span>;
<span class="text-purple-400">import</span> tailwindcss <span class="text-purple-400">from</span> <span class="text-green-400">'@tailwindcss/vite'</span>;
<span class="text-purple-400">import</span> react <span class="text-purple-400">from</span> <span class="text-green-400">'@vitejs/plugin-react'</span>;
<span class="text-purple-400">import</span> {'{ defineConfig }'} <span class="text-purple-400">from</span> <span class="text-green-400">'vite'</span>;

<span class="text-purple-400">export default</span> defineConfig({'{'} 
  plugins: [
    tailwindcss(),
    <span class="text-slate-500">// ↓ React plugin MUST come before sveltekit()</span>
    <span class="text-slate-500">// It claims .tsx/.jsx files so Svelte plugin doesn't see them</span>
    react({'{'} include: <span class="text-green-400">/\.(tsx|jsx)$/</span> {'}'}),
    sveltekit(),
  ],
  server: {'{'} port: <span class="text-yellow-400">5183</span>, fs: {'{'} allow: [<span class="text-green-400">'../..'</span>] {'}'} {'}'},
  optimizeDeps: {'{'} 
    <span class="text-slate-500">// Don't pre-bundle the workspace package —</span>
    <span class="text-slate-500">// let Vite resolve it from source on demand</span>
    exclude: [<span class="text-green-400">'@repo/remotion-compositions'</span>],
  {'}'},
  ssr: {'{'} 
    <span class="text-slate-500">// These packages contain browser APIs and can't be</span>
    <span class="text-slate-500">// externalized during SSR — Vite must bundle them</span>
    noExternal: [<span class="text-green-400">'@repo/remotion-compositions'</span>, <span class="text-green-400">'remotion'</span>, <span class="text-green-400">'@remotion/player'</span>],
  {'}'},
{'}'});</code></pre>
      </div>

      <div class="space-y-3">
        <div class="bg-slate-900 rounded-xl p-4 border border-slate-700">
          <div class="text-sm font-semibold text-white mb-1">
            Why <code class="text-indigo-300">react({'{ include: /\.(tsx|jsx)$/ }'})</code>?
          </div>
          <p class="text-sm text-slate-400">
            Without the <code class="text-slate-300">include</code> filter, the React plugin tries to
            transform <code class="text-slate-300">.ts</code> files too, which conflicts with the Svelte
            plugin. The regex restricts React's transform to only JSX-containing files.
          </p>
        </div>
        <div class="bg-slate-900 rounded-xl p-4 border border-slate-700">
          <div class="text-sm font-semibold text-white mb-1">
            Why <code class="text-indigo-300">ssr.noExternal</code>?
          </div>
          <p class="text-sm text-slate-400">
            During SSR, Vite normally externalizes Node.js packages (loads them via
            <code class="text-slate-300">require()</code>). Remotion packages contain browser-specific
            code (Canvas, Web Audio, etc.) that breaks when Node.js tries to evaluate them. Marking
            them <code class="text-slate-300">noExternal</code> forces Vite to bundle them instead,
            where it can tree-shake and stub the browser APIs safely.
          </p>
        </div>
        <div class="bg-slate-900 rounded-xl p-4 border border-slate-700">
          <div class="text-sm font-semibold text-white mb-1">
            Why <code class="text-indigo-300">fs.allow: ['../..']</code>?
          </div>
          <p class="text-sm text-slate-400">
            The dev server's file system sandbox is restricted to the app directory by default. Since
            <code class="text-slate-300">@repo/remotion-compositions</code> is two levels up in the
            monorepo, this setting expands the sandbox to include the entire monorepo root.
          </p>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <!-- PORSCHE DESIGN SYSTEM v4 -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="pds" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> Porsche Design System v4
      </h2>

      <p class="text-slate-300 mb-6 leading-relaxed">
        PDS is included in this app because it provides official React components
        (<code class="bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-300">@porsche-design-system/components-react</code>),
        making it a natural fit for the React-in-Svelte architecture used here.
        The SvelteKit pages remain pure Svelte; PDS components are mounted inside
        a <code class="bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-300">div</code> via
        <code class="bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-300">createRoot</code>, the same pattern used for the Remotion Player.
      </p>

      <h3 class="text-lg font-semibold text-white mb-3 mt-6 scroll-mt-20">Installation</h3>
      <div class="bg-slate-950 rounded-xl border border-slate-700 overflow-hidden mb-6">
        <div class="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-900">
          <span class="text-xs text-slate-400 font-mono">terminal</span>
        </div>
        <pre class="p-4 text-sm font-mono text-slate-300 overflow-x-auto">npm install @porsche-design-system/components-react</pre>
      </div>

      <h3 class="text-lg font-semibold text-white mb-3 mt-6 scroll-mt-20">Provider setup in <code class="text-indigo-300 font-mono text-base">+layout.svelte</code></h3>
      <p class="text-slate-400 text-sm mb-3">
        Wrap the React tree with <code class="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-300">PorscheDesignSystemProvider</code>
        so all PDS components share the same theme context.
      </p>
      <div class="bg-slate-950 rounded-xl border border-slate-700 overflow-hidden mb-6">
        <div class="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-900">
          <span class="text-xs text-slate-400 font-mono">apps/remotion/src/routes/+layout.svelte (conceptual)</span>
        </div>
        <pre class="p-4 text-sm font-mono text-slate-300 overflow-x-auto"><code>{`// Mount PDS provider once via React-in-Svelte pattern
import { PorscheDesignSystemProvider } from '@porsche-design-system/components-react';

const root = createRoot(container);
root.render(
  React.createElement(PorscheDesignSystemProvider, null,
    // your PDS components here
  )
);`}</code></pre>
      </div>

      <h3 class="text-lg font-semibold text-white mb-3 mt-6 scroll-mt-20">Code example — PButton, PHeading, PText</h3>
      <div class="bg-slate-950 rounded-xl border border-slate-700 overflow-hidden mb-6">
        <div class="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-900">
          <span class="text-xs text-slate-400 font-mono">+page.svelte</span>
        </div>
        <pre class="p-4 text-sm font-mono text-slate-300 overflow-x-auto"><code>{`import { PorscheDesignSystemProvider, PButton, PHeading, PText }
  from '@porsche-design-system/components-react';

root.render(
  React.createElement(PorscheDesignSystemProvider, null,
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
      React.createElement(PHeading, { size: 'large' }, 'PDS + Remotion + SvelteKit'),
      React.createElement(PText, null, 'Porsche Design System React components rendered inside SvelteKit'),
      React.createElement('div', { style: { display: 'flex', gap: '8px' } },
        React.createElement(PButton, { variant: 'primary' }, 'Primary'),
        React.createElement(PButton, { variant: 'secondary' }, 'Secondary'),
        React.createElement(PButton, { variant: 'ghost' }, 'Ghost'),
      )
    )
  )
);`}</code></pre>
      </div>

      <div class="bg-slate-900 rounded-xl p-4 border border-slate-700 text-sm text-slate-400">
        <span class="text-slate-300 font-semibold">Live demo:</span> The Studio page
        (<a href="/" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">/</a>)
        includes a live PDS demo section below the Remotion Player — scroll down to see PDS components
        mounted via the React-in-Svelte pattern.
      </div>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <!-- TROUBLESHOOTING -->
    <!-- ─────────────────────────────────────────────── -->
    <section id="troubleshooting" class="mb-12 scroll-mt-20">
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-indigo-400">#</span> Troubleshooting
      </h2>

      <div class="space-y-4">
        {#each [
          {
            problem: 'Player shows blank / "Loading player..." persists',
            cause: 'The dynamic imports failed silently.',
            fix: 'Open DevTools → Console. Look for import errors. Common cause: `@repo/remotion-compositions` not found — run `yarn install` from the monorepo root.',
          },
          {
            problem: 'TypeError: React is not defined in .tsx file',
            cause: 'The TSX file is being processed without the React transform.',
            fix: 'Ensure `@vitejs/plugin-react` is listed BEFORE `sveltekit()` in `vite.config.ts`, and the `include: /\\.(tsx|jsx)$/` filter is set.',
          },
          {
            problem: 'SSR error: "Cannot use import statement in a module"',
            cause: 'A Remotion package is being externalized and loaded by Node.js as CommonJS.',
            fix: 'Add the failing package to `ssr.noExternal` in `vite.config.ts`.',
          },
          {
            problem: 'Remotion Studio (port 3000) shows blank composition',
            cause: 'Root.tsx does not re-export the composition, or the file has a syntax error.',
            fix: 'Check `src/Root.tsx` — every composition must be registered with a `<Composition>` element. Check the terminal running `npx remotion studio` for errors.',
          },
          {
            problem: 'render fails with "ffmpeg not found"',
            cause: '@remotion/renderer requires ffmpeg on PATH.',
            fix: 'Install ffmpeg: `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Linux). For production, use Remotion Lambda instead.',
          },
          {
            problem: 'Composition props TypeScript errors in SvelteKit',
            cause: 'React types are not available in the Svelte app.',
            fix: '`apps/remotion` has `@types/react` in devDependencies. Run `yarn install`. The types are used only at compile time for the dynamic import.',
          },
        ] as item}
          <div class="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-700 bg-red-950/30 flex items-start gap-2">
              <span class="text-red-400 mt-0.5 shrink-0">⚠</span>
              <span class="text-sm font-semibold text-red-300">{item.problem}</span>
            </div>
            <div class="px-4 py-3 space-y-2">
              <div class="text-xs text-slate-400"><span class="text-slate-500 uppercase tracking-widest text-xs">Cause:</span> {item.cause}</div>
              <div class="text-xs text-slate-300"><span class="text-slate-500 uppercase tracking-widest text-xs">Fix:</span> {item.fix}</div>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-8 bg-slate-900 rounded-xl p-5 border border-indigo-800/40">
        <div class="text-sm font-semibold text-indigo-300 mb-2">Further reading</div>
        <ul class="space-y-2 text-sm">
          <li>
            <a
              href="https://www.remotion.dev/docs"
              class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer">Remotion documentation</a
            >
            — comprehensive guides and API reference
          </li>
          <li>
            <a
              href="https://www.remotion.dev/docs/player"
              class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer">@remotion/player docs</a
            >
            — all Player props (autoPlay, loop, clickToPlay, doubleClickToFullscreen…)
          </li>
          <li>
            <a
              href="https://www.remotion.dev/docs/lambda"
              class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer">Remotion Lambda docs</a
            >
            — production cloud rendering
          </li>
          <li>
            <a
              href="https://github.com/remotion-dev/remotion/tree/main/packages/template-helloworld"
              class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer">Remotion Hello World template</a
            >
            — official starter project
          </li>
        </ul>
      </div>
    </section>
  </main>
</div>
