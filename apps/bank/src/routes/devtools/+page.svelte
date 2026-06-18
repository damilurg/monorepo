<script lang="ts">
  import { browser } from '$app/environment';

  interface Device {
    name: string;
    width: number;
    height: number;
    icon: string;
  }

  const DEVICES: Device[] = [
    { name: 'iPhone SE', width: 375, height: 667, icon: '📱' },
    { name: 'iPhone 14 Pro', width: 393, height: 852, icon: '📱' },
    { name: 'iPhone 14 Plus', width: 430, height: 932, icon: '📱' },
    { name: 'Galaxy S23', width: 360, height: 780, icon: '📱' },
    { name: 'Galaxy Fold', width: 280, height: 653, icon: '📱' },
    { name: 'iPad Mini', width: 768, height: 1024, icon: '🖥️' },
    { name: 'iPad Pro', width: 1024, height: 1366, icon: '💻' },
  ];

  let urlInput = $state('https://example.com');
  let activeUrl = $state('');
  let selectedDevice = $state(DEVICES[0]);
  let landscape = $state(false);
  let zoom = $state(75);
  let showFrame = $state(true);

  let deviceWidth = $derived(landscape ? selectedDevice.height : selectedDevice.width);
  let deviceHeight = $derived(landscape ? selectedDevice.width : selectedDevice.height);

  function preview() {
    let url = urlInput.trim();
    if (!url.startsWith('http')) url = 'https://' + url;
    activeUrl = url;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') preview();
  }

  function selectDevice(device: Device) {
    selectedDevice = device;
  }
</script>

<div class="flex h-screen flex-col bg-gray-950 text-white" style="height: calc(100vh - 65px);">
  <div class="flex flex-1 overflow-hidden">
    <!-- Left panel: controls -->
    <aside class="flex w-80 flex-shrink-0 flex-col gap-5 overflow-y-auto border-r border-white/10 bg-gray-900 p-5">
      <!-- Title -->
      <div>
        <h1 class="text-lg font-bold text-white">Mobile DevTools</h1>
        <p class="text-xs text-gray-400">Simulate mobile webviews</p>
      </div>

      <!-- URL input -->
      <div>
        <label class="mb-1.5 block text-xs font-medium text-gray-400">URL to preview</label>
        <div class="flex gap-2">
          <input
            type="text"
            bind:value={urlInput}
            onkeydown={handleKeydown}
            placeholder="https://example.com"
            class="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            onclick={preview}
            class="flex-shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Go
          </button>
        </div>
        <p class="mt-1.5 text-xs text-gray-500">Press Enter or click Go to load</p>
      </div>

      <!-- Device selector -->
      <div>
        <label class="mb-2 block text-xs font-medium text-gray-400">Device</label>
        <div class="grid grid-cols-2 gap-2">
          {#each DEVICES as device}
            <button
              onclick={() => selectDevice(device)}
              class="flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-all {selectedDevice.name === device.name
                ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'}"
            >
              <span>{device.icon}</span>
              <span class="truncate font-medium">{device.name}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Orientation toggle -->
      <div>
        <label class="mb-2 block text-xs font-medium text-gray-400">Orientation</label>
        <div class="flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            onclick={() => (landscape = false)}
            class="flex-1 rounded-lg py-1.5 text-xs font-medium transition-all {!landscape
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white'}"
          >
            ↕ Portrait
          </button>
          <button
            onclick={() => (landscape = true)}
            class="flex-1 rounded-lg py-1.5 text-xs font-medium transition-all {landscape
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white'}"
          >
            ↔ Landscape
          </button>
        </div>
      </div>

      <!-- Zoom slider -->
      <div>
        <div class="mb-2 flex items-center justify-between">
          <label class="text-xs font-medium text-gray-400">Zoom</label>
          <span class="rounded-lg bg-white/10 px-2 py-0.5 text-xs font-mono text-white"
            >{zoom}%</span
          >
        </div>
        <input
          type="range"
          min="30"
          max="100"
          step="5"
          bind:value={zoom}
          class="w-full accent-indigo-500"
        />
        <div class="mt-1 flex justify-between text-xs text-gray-600">
          <span>30%</span>
          <span>100%</span>
        </div>
      </div>

      <!-- Show frame toggle -->
      <div class="flex items-center justify-between">
        <label class="text-xs font-medium text-gray-400" for="show-frame">Device frame</label>
        <button
          id="show-frame"
          onclick={() => (showFrame = !showFrame)}
          class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors {showFrame
            ? 'bg-indigo-600'
            : 'bg-gray-600'}"
          role="switch"
          aria-checked={showFrame}
        >
          <span
            class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform {showFrame
              ? 'translate-x-4'
              : 'translate-x-1'}"
          ></span>
        </button>
      </div>

      <!-- Device info box -->
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <p class="mb-2 text-xs font-semibold text-gray-300">{selectedDevice.name}</p>
        <div class="space-y-1 text-xs text-gray-400">
          <div class="flex justify-between">
            <span>Physical</span>
            <span class="font-mono text-white"
              >{selectedDevice.width} × {selectedDevice.height}px</span
            >
          </div>
          <div class="flex justify-between">
            <span>Rendered</span>
            <span class="font-mono text-white">{deviceWidth} × {deviceHeight}px</span>
          </div>
          <div class="flex justify-between">
            <span>Scaled</span>
            <span class="font-mono text-white"
              >{Math.round(deviceWidth * zoom / 100)} × {Math.round(
                deviceHeight * zoom / 100,
              )}px</span
            >
          </div>
        </div>
      </div>

      <!-- Notice -->
      <div class="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3">
        <p class="text-xs leading-relaxed text-yellow-300">
          ⚠️ Many sites block iframe embedding (X-Frame-Options / CSP). Try
          <strong>example.com</strong>, <strong>wikipedia.org</strong>, or your
          <strong>localhost</strong> projects.
        </p>
      </div>
    </aside>

    <!-- Right panel: preview -->
    <main class="flex flex-1 flex-col overflow-hidden bg-gray-950">
      <!-- Preview toolbar -->
      <div class="flex items-center gap-3 border-b border-white/10 bg-gray-900 px-5 py-3">
        <div class="flex items-center gap-1.5">
          <div class="h-2.5 w-2.5 rounded-full bg-red-500"></div>
          <div class="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
          <div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
        </div>
        <div class="flex-1 truncate rounded-lg bg-white/5 px-3 py-1 text-xs text-gray-400">
          {activeUrl || 'No URL loaded'}
        </div>
        <button
          onclick={preview}
          class="rounded-lg bg-white/10 px-3 py-1 text-xs text-gray-300 hover:bg-white/20 transition-colors"
        >
          ↺ Reload
        </button>
      </div>

      <!-- Preview area -->
      <div class="flex flex-1 items-start justify-center overflow-auto p-8">
        {#if !activeUrl}
          <!-- Empty state -->
          <div class="flex flex-col items-center justify-center text-center" style="margin-top: 80px;">
            <div class="mb-4 text-6xl opacity-40">📱</div>
            <h2 class="mb-2 text-lg font-semibold text-gray-400">No preview loaded</h2>
            <p class="max-w-xs text-sm text-gray-600">
              Enter a URL in the left panel and click <strong class="text-gray-400">Go</strong> to
              preview it in the selected device viewport.
            </p>
            <div class="mt-6 flex flex-wrap justify-center gap-2">
              {#each ['https://example.com', 'https://en.wikipedia.org', 'http://localhost:3000'] as suggestion}
                <button
                  onclick={() => {
                    urlInput = suggestion;
                    activeUrl = suggestion;
                  }}
                  class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 hover:border-white/20 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              {/each}
            </div>
          </div>
        {:else}
          <!-- Device frame wrapper — scaled -->
          <div
            style="transform: scale({zoom / 100}); transform-origin: top center; flex-shrink: 0;"
          >
            {#if showFrame}
              <!-- Phone frame -->
              <div
                style="
                  border: 8px solid #0f0f1a;
                  border-radius: 40px;
                  background: #0f0f1a;
                  box-shadow: 0 0 0 2px #333, 0 20px 60px rgba(0,0,0,0.5);
                  overflow: hidden;
                  position: relative;
                  width: {deviceWidth + 16}px;
                  height: {deviceHeight + 16}px;
                "
              >
                <!-- Dynamic island / notch -->
                <div
                  style="position:absolute;top:8px;left:50%;transform:translateX(-50%);width:80px;height:20px;background:#0f0f1a;border-radius:10px;z-index:10;display:flex;align-items:center;justify-content:center;gap:4px;"
                >
                  <div
                    style="width:8px;height:8px;border-radius:50%;background:#222;"
                  ></div>
                  <div
                    style="width:12px;height:12px;border-radius:50%;background:#1a1a2e;"
                  ></div>
                </div>

                <!-- Status bar -->
                <div
                  style="position:absolute;top:0;left:0;right:0;height:44px;background:rgba(0,0,0,0.3);z-index:5;display:flex;align-items:flex-end;padding:0 20px 6px;justify-content:space-between;color:white;font-size:11px;font-weight:600;font-family:-apple-system,sans-serif;"
                >
                  <span>9:41</span>
                  <span style="letter-spacing: -0.5px;">● ● ●  WiFi  ▮▮▯</span>
                </div>

                <!-- iframe -->
                <iframe
                  src={activeUrl}
                  title="Mobile preview of {activeUrl}"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  style="display:block;border:none;width:{deviceWidth}px;height:{deviceHeight}px;"
                ></iframe>

                <!-- Home indicator -->
                <div
                  style="position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:100px;height:4px;border-radius:2px;background:#444;"
                ></div>
              </div>
            {:else}
              <!-- Bare iframe, no frame -->
              <iframe
                src={activeUrl}
                title="Mobile preview of {activeUrl}"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                style="display:block;border:2px solid #333;border-radius:4px;width:{deviceWidth}px;height:{deviceHeight}px;"
              ></iframe>
            {/if}
          </div>
        {/if}
      </div>
    </main>
  </div>
</div>
