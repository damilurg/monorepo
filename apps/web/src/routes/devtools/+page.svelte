<script lang="ts">
  import { langStore } from '$lib/lang-store.svelte.js';

  const T = {
    ru: {
      appTitle: 'DevTools',
      urlOpen: 'Открыть',
      portrait: 'Портрет',
      landscape: 'Альбом',
      filterAll: 'Все',
      resolution: 'Разрешение',
      pixelRatio: 'Пиксельная плотность',
      physicalPx: 'Физические пиксели',
      year: 'Год',
      emptyTitle: 'Введите URL выше и нажмите «Открыть»',
      emptyWarning: 'Некоторые сайты блокируют встраивание через X-Frame-Options',
    },
    en: {
      appTitle: 'DevTools',
      urlOpen: 'Open',
      portrait: 'Portrait',
      landscape: 'Landscape',
      filterAll: 'All',
      resolution: 'Resolution',
      pixelRatio: 'Pixel ratio',
      physicalPx: 'Physical pixels',
      year: 'Year',
      emptyTitle: 'Enter a URL above and click Open',
      emptyWarning: 'Some sites block embedding via X-Frame-Options',
    },
  };
  const t = $derived(T[langStore.current]);

  interface Device {
    name: string;
    brand: 'apple' | 'samsung' | 'google';
    width: number;
    height: number;
    pixelRatio: number;
    notchType: 'none' | 'notch' | 'dynamic-island' | 'punch';
    icon: string;
    year: number;
  }

  const DEVICES: Device[] = [
    { name: 'iPhone SE (3rd gen)', brand: 'apple', width: 375, height: 667, pixelRatio: 2, notchType: 'none', icon: '📱', year: 2022 },
    { name: 'iPhone 14', brand: 'apple', width: 390, height: 844, pixelRatio: 3, notchType: 'notch', icon: '📱', year: 2022 },
    { name: 'iPhone 14 Pro', brand: 'apple', width: 393, height: 852, pixelRatio: 3, notchType: 'dynamic-island', icon: '📱', year: 2022 },
    { name: 'iPhone 15 Pro Max', brand: 'apple', width: 430, height: 932, pixelRatio: 3, notchType: 'dynamic-island', icon: '📱', year: 2023 },
    { name: 'iPad Mini (6th gen)', brand: 'apple', width: 744, height: 1133, pixelRatio: 2, notchType: 'none', icon: '⬜', year: 2021 },
    { name: 'iPad Pro 11"', brand: 'apple', width: 834, height: 1194, pixelRatio: 2, notchType: 'none', icon: '⬜', year: 2022 },
    { name: 'Galaxy S24', brand: 'samsung', width: 360, height: 780, pixelRatio: 3, notchType: 'punch', icon: '📱', year: 2024 },
    { name: 'Galaxy S24 Ultra', brand: 'samsung', width: 384, height: 824, pixelRatio: 3.088, notchType: 'punch', icon: '📱', year: 2024 },
    { name: 'Galaxy Z Fold 5', brand: 'samsung', width: 344, height: 882, pixelRatio: 2.625, notchType: 'punch', icon: '📱', year: 2023 },
    { name: 'Pixel 8 Pro', brand: 'google', width: 412, height: 892, pixelRatio: 3.5, notchType: 'punch', icon: '📱', year: 2023 },
  ];

  let selectedDevice = $state<Device>(DEVICES[1]);
  let landscape = $state(false);
  let zoom = $state(60);
  let urlInput = $state('https://example.com');
  let previewUrl = $state('');
  let loading = $state(false);
  let iframeEl = $state<HTMLIFrameElement | null>(null);
  let brandFilter = $state<string>('all');

  let frameWidth = $derived(landscape ? selectedDevice.height : selectedDevice.width);
  let frameHeight = $derived(landscape ? selectedDevice.width : selectedDevice.height);
  let scale = $derived(zoom / 100);

  let filteredDevices = $derived(
    brandFilter === 'all' ? DEVICES : DEVICES.filter((d) => d.brand === brandFilter)
  );

  let isIPad = $derived(
    selectedDevice.name.toLowerCase().includes('ipad')
  );

  let statusBarHeight = $derived(
    selectedDevice.notchType === 'notch'
      ? 28
      : selectedDevice.notchType === 'dynamic-island'
        ? 54
        : 28
  );

  function handlePreview() {
    let url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
      urlInput = url;
    }
    loading = true;
    previewUrl = url;
  }

  function loadQuickUrl(url: string) {
    urlInput = url;
    handlePreview();
  }
</script>

<div class="flex flex-col h-screen overflow-hidden">
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 flex-shrink-0">
    <div class="flex items-center gap-2 flex-shrink-0">
      <span class="text-xl">🔧</span>
      <span class="font-bold text-white hidden sm:block">{t.appTitle}</span>
    </div>

    <div class="flex-1 flex gap-2 max-w-2xl">
      <div class="flex-1 relative">
        <input
          bind:value={urlInput}
          onkeydown={(e) => e.key === 'Enter' && handlePreview()}
          placeholder="https://example.com"
          class="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 pr-10"
        />
        {#if urlInput}
          <button
            onclick={() => (urlInput = '')}
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
          >
            ✕
          </button>
        {/if}
      </div>
      <button
        onclick={handlePreview}
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors"
      >
        {loading ? '...' : t.urlOpen}
      </button>
    </div>

    <div class="hidden md:flex items-center gap-2 text-sm text-slate-400 flex-shrink-0">
      <span>{selectedDevice.icon}</span>
      <span>{selectedDevice.name}</span>
      <span class="text-slate-600">·</span>
      <span class="font-mono text-xs">{frameWidth}×{frameHeight}</span>
    </div>
  </header>

  <!-- Body -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-800 overflow-y-auto p-4">
      <!-- Brand filters -->
      <div class="flex gap-1.5 mb-3">
        {#each ['all', 'apple', 'samsung', 'google'] as brand}
          <button
            onclick={() => (brandFilter = brand)}
            class="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all {brandFilter === brand
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}"
          >
            {brand === 'all' ? t.filterAll : brand === 'apple' ? '🍎' : brand === 'samsung' ? '🌀' : '🔵'}
          </button>
        {/each}
      </div>

      <!-- Device list -->
      <div class="flex flex-col gap-1 mb-4">
        {#each filteredDevices as device}
          <button
            onclick={() => {
              selectedDevice = device;
              landscape = false;
            }}
            class="w-full text-left p-3 rounded-xl transition-all {selectedDevice.name === device.name
              ? 'bg-blue-600/20 border border-blue-500/40'
              : 'border border-transparent hover:bg-slate-800'}"
          >
            <div class="flex items-center gap-2">
              <span class="text-base">{device.icon}</span>
              <div>
                <div class="text-sm font-medium text-white">{device.name}</div>
                <div class="text-xs text-slate-400">{device.width}×{device.height} · {device.pixelRatio}x</div>
              </div>
            </div>
          </button>
        {/each}
      </div>

      <div class="border-t border-slate-800 pt-4">
        <!-- Orientation toggle -->
        <p class="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Orientation</p>
        <div class="flex gap-2">
          <button
            onclick={() => (landscape = false)}
            class="flex-1 py-2 rounded-lg text-xs font-medium transition-all {!landscape
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}"
          >
            ◻ {t.portrait}
          </button>
          <button
            onclick={() => (landscape = true)}
            class="flex-1 py-2 rounded-lg text-xs font-medium transition-all {landscape
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}"
          >
            ▭ {t.landscape}
          </button>
        </div>

        <!-- Zoom slider -->
        <label class="text-xs text-slate-400 mt-4 block font-medium uppercase tracking-wide">
          Zoom: {zoom}%
        </label>
        <input
          type="range"
          min="25"
          max="100"
          step="5"
          bind:value={zoom}
          class="w-full mt-1 accent-blue-500"
        />

        <!-- Device info -->
        <div class="mt-4 bg-slate-800 rounded-xl p-3 text-xs space-y-1.5">
          <div class="flex justify-between">
            <span class="text-slate-400">{t.resolution}</span>
            <span class="font-mono text-white">{frameWidth}×{frameHeight}px</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">{t.pixelRatio}</span>
            <span class="font-mono text-white">{selectedDevice.pixelRatio}x</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">{t.physicalPx}</span>
            <span class="font-mono text-white"
              >{Math.round(frameWidth * selectedDevice.pixelRatio)}×{Math.round(
                frameHeight * selectedDevice.pixelRatio
              )}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Brand</span>
            <span class="font-mono text-white capitalize">{selectedDevice.brand}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">{t.year}</span>
            <span class="font-mono text-white">{selectedDevice.year}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Preview area -->
    <main class="flex-1 overflow-auto bg-slate-950 flex items-start justify-center p-8 pt-12">
      <div
        style="transform: scale({scale}); transform-origin: top center; transition: transform 0.2s ease;"
      >
        <!-- Phone frame -->
        <div
          style="
            position: relative;
            background: #1a1a1f;
            border-radius: {isIPad ? 18 : 44}px;
            padding: 12px;
            box-shadow:
              0 0 0 2px #3a3a3f,
              0 0 0 4px #0a0a0f,
              0 25px 80px rgba(0,0,0,0.7),
              inset 0 0 0 1px rgba(255,255,255,0.08);
            width: {frameWidth + 24}px;
            transition: all 0.3s ease;
          "
        >
          <!-- Side buttons: left volume up -->
          <div
            style="position:absolute; left:-3px; top:80px; width:3px; height:30px; background:#2a2a2f; border-radius:2px 0 0 2px;"
          ></div>
          <!-- Side buttons: left volume down -->
          <div
            style="position:absolute; left:-3px; top:120px; width:3px; height:50px; background:#2a2a2f; border-radius:2px 0 0 2px;"
          ></div>
          <!-- Side buttons: right power -->
          <div
            style="position:absolute; right:-3px; top:100px; width:3px; height:60px; background:#2a2a2f; border-radius:0 2px 2px 0;"
          ></div>

          <!-- Screen area -->
          <div
            style="
              position: relative;
              background: black;
              border-radius: {isIPad ? 10 : 36}px;
              overflow: hidden;
              width: {frameWidth}px;
              height: {frameHeight}px;
            "
          >
            <!-- Notch / Dynamic Island / Punch hole -->
            {#if selectedDevice.notchType === 'notch'}
              <div
                style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:150px;height:28px;background:#1a1a1f;border-radius:0 0 18px 18px;z-index:10;"
              ></div>
            {:else if selectedDevice.notchType === 'dynamic-island'}
              <div
                style="position:absolute;top:10px;left:50%;transform:translateX(-50%);width:120px;height:34px;background:#1a1a1f;border-radius:20px;z-index:10;display:flex;align-items:center;justify-content:flex-end;padding-right:10px;gap:6px;"
              >
                <div
                  style="width:10px;height:10px;border-radius:50%;background:#0a0a0f;border:2px solid #333;"
                ></div>
                <div
                  style="width:14px;height:14px;border-radius:50%;background:#0a0a0f;border:2px solid #333;"
                ></div>
              </div>
            {:else if selectedDevice.notchType === 'punch'}
              <div
                style="position:absolute;top:12px;left:50%;transform:translateX(-50%);width:12px;height:12px;border-radius:50%;background:#0a0a0f;z-index:10;"
              ></div>
            {/if}

            <!-- Status bar -->
            <div
              style="position:absolute;top:0;left:0;right:0;height:{statusBarHeight}px;display:flex;align-items:flex-end;padding:0 16px 4px;justify-content:space-between;color:white;font-size:11px;font-weight:600;z-index:5;pointer-events:none;"
            >
              <span>9:41</span>
              <div style="display:flex;gap:4px;align-items:center;">
                <!-- Signal bars -->
                <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
                  <rect x="0" y="8" width="3" height="4" rx="1" />
                  <rect x="4.5" y="5" width="3" height="7" rx="1" />
                  <rect x="9" y="2" width="3" height="10" rx="1" />
                  <rect x="13.5" y="0" width="2.5" height="12" rx="1" opacity="0.3" />
                </svg>
                <!-- WiFi -->
                <svg width="14" height="12" viewBox="0 0 14 12" fill="white">
                  <path d="M7 10a1 1 0 100-2 1 1 0 000 2z" />
                  <path
                    d="M4.5 7.5a3.5 3.5 0 015 0"
                    stroke="white"
                    stroke-width="1.5"
                    fill="none"
                    stroke-linecap="round"
                  />
                  <path
                    d="M2 5a6 6 0 0110 0"
                    stroke="white"
                    stroke-width="1.5"
                    fill="none"
                    stroke-linecap="round"
                    opacity="0.6"
                  />
                </svg>
                <!-- Battery -->
                <div style="display:flex;align-items:center;gap:1px;">
                  <div
                    style="width:22px;height:10px;border:1.5px solid rgba(255,255,255,0.7);border-radius:2px;position:relative;padding:1.5px;"
                  >
                    <div style="width:80%;height:100%;background:white;border-radius:1px;"></div>
                  </div>
                  <div
                    style="width:2px;height:5px;background:rgba(255,255,255,0.7);border-radius:0 1px 1px 0;"
                  ></div>
                </div>
              </div>
            </div>

            <!-- iframe or empty state -->
            {#if previewUrl}
              <iframe
                bind:this={iframeEl}
                src={previewUrl}
                title="Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-navigation"
                style="display:block;border:none;width:{frameWidth}px;height:{frameHeight}px;margin-top:0;"
                onload={() => {
                  loading = false;
                }}
              ></iframe>
            {:else}
              <!-- Empty state -->
              <div
                style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;padding:24px;text-align:center;background:#0f172a;"
              >
                <div style="font-size:48px;">🔗</div>
                <p style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.5;">
                  {t.emptyTitle}
                </p>
                <p style="color:rgba(255,255,255,0.3);font-size:11px;">
                  {t.emptyWarning}
                </p>
                <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
                  {#each ['https://example.com', 'https://wikipedia.org', 'https://hacker-news.firebaseio.com'] as quickUrl}
                    <button
                      onclick={() => loadQuickUrl(quickUrl)}
                      style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.8);padding:6px 12px;border-radius:8px;font-size:11px;cursor:pointer;font-family:monospace;"
                    >
                      {quickUrl}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Home indicator (Apple with notch/DI = swipe bar) -->
            {#if selectedDevice.brand === 'apple' && selectedDevice.notchType !== 'none'}
              <div
                style="position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:120px;height:4px;border-radius:2px;background:rgba(255,255,255,0.4);z-index:10;pointer-events:none;"
              ></div>
            {:else if selectedDevice.brand === 'apple' && selectedDevice.notchType === 'none' && !isIPad}
              <!-- iPhone SE: home button ring below screen, rendered outside screen but inside frame -->
            {/if}
          </div>

          <!-- iPhone SE home button (outside screen div, inside frame div) -->
          {#if selectedDevice.brand === 'apple' && selectedDevice.notchType === 'none' && !isIPad}
            <div
              style="display:flex;justify-content:center;padding-top:10px;"
            >
              <div
                style="width:44px;height:44px;border-radius:50%;border:3px solid #3a3a3f;background:#1a1a1f;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.05);"
              ></div>
            </div>
          {/if}
        </div>
      </div>
    </main>
  </div>
</div>
