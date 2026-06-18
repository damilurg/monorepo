<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { PageHeader, Loader, ErrorState } from '@repo/shared/ui';
  import { WORLD_CITIES } from '$modules/maps/data/cities.js';
  import type { MapMarker, Coordinates, LocationDTO } from '$modules/maps/model/types.js';
  import { formatApiError } from '@repo/shared';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  interface InternalMarker extends MapMarker {
    _leafletMarker: unknown;
  }

  let mapContainer = $state<HTMLDivElement | null>(null);
  let internalMarkers = $state<InternalMarker[]>([]);
  let searchQuery = $state('');
  let searching = $state(false);
  let searchError = $state('');
  let locationName = $state(
    data.disabled ? '' : data.renderMode === 'ssr' ? data.locationName : 'Загрузка...'
  );
  let leafletMap: unknown = null;
  let leafletLib: typeof import('leaflet') | null = null;

  function getInitialCenter(): Coordinates {
    if (data.disabled) return { lat: 55.7558, lon: 37.6173 };
    if (data.renderMode === 'ssr') return data.center;
    return { lat: parseFloat(data.lat), lon: parseFloat(data.lon) };
  }

  function createIcon(L: typeof import('leaflet')) {
    return L.divIcon({
      className: 'custom-marker',
      html: '<div style="width:24px;height:24px;background:#3b82f6;border:2px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
  }

  onMount(async () => {
    if (!browser || !mapContainer || data.disabled) return;

    const L = (await import('leaflet')).default;
    leafletLib = L;
    const icon = createIcon(L);
    const center = getInitialCenter();
    const initialZoom = data.renderMode === 'ssr' ? (data.zoom ?? 12) : 12;

    const map = L.map(mapContainer).setView([center.lat, center.lon], initialZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = e.latlng;
      const newMarker: MapMarker = {
        id: crypto.randomUUID(),
        coordinates: { lat, lon: lng },
        label: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        createdAt: new Date().toISOString(),
      };

      const leafletMarker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(newMarker.label)
        .openPopup();

      internalMarkers = [
        ...internalMarkers,
        { ...newMarker, _leafletMarker: leafletMarker },
      ];
    });

    leafletMap = map;
  });

  async function searchLocation() {
    if (!searchQuery.trim()) return;
    searching = true;
    searchError = '';

    try {
      const res = await fetch(`/geocode?q=${encodeURIComponent(searchQuery.trim())}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const dto = await res.json() as LocationDTO;

      locationName = dto.displayName;

      if (leafletMap && leafletLib) {
        const L = leafletLib;
        const map = leafletMap as ReturnType<typeof L.map>;
        map.flyTo([dto.coordinates.lat, dto.coordinates.lon], 13, { duration: 1.5 });
        goto(`/${dto.coordinates.lat.toFixed(6)}/${dto.coordinates.lon.toFixed(6)}`, {
          replaceState: true,
          noScroll: true,
        });
      }
    } catch (e) {
      searchError = formatApiError(e);
    } finally {
      searching = false;
    }
  }

  function handleSearchKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') void searchLocation();
  }

  function removeMarker(id: string) {
    const marker = internalMarkers.find((m) => m.id === id);
    if (marker && leafletMap && leafletLib) {
      const L = leafletLib;
      const map = leafletMap as ReturnType<typeof L.map>;
      (marker._leafletMarker as ReturnType<typeof L.marker>).removeFrom(map);
    }
    internalMarkers = internalMarkers.filter((m) => m.id !== id);
  }

  function flyToCity(city: { lat: number; lon: number }) {
    goto(`/${city.lat}/${city.lon}`);
  }

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  let markers = $derived(internalMarkers.map(({ _leafletMarker: _lm, ...rest }) => rest));
</script>

<svelte:head>
  <title>Карты — {locationName}</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

{#if data.disabled}
  <div class="mx-auto max-w-2xl px-4 py-20 text-center">
    <p class="text-gray-500 text-lg">Карты временно недоступны</p>
  </div>
{:else}
  <PageHeader
    title="Карты"
    subtitle={locationName}
  />

  <div class="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-4">

    <!-- Search bar -->
    <div class="flex gap-2">
      <div class="flex-1">
        <input
          type="text"
          placeholder="Поиск места..."
          bind:value={searchQuery}
          onkeydown={handleSearchKeydown}
          disabled={searching}
          class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
        />
      </div>
      <button
        onclick={() => void searchLocation()}
        disabled={searching}
        class="flex-shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {searching ? 'Поиск...' : 'Найти'}
      </button>
    </div>

    {#if searchError}
      <ErrorState message={searchError} onRetry={() => void searchLocation()} />
    {/if}

    <!-- City chips -->
    <div class="flex gap-2 overflow-x-auto pb-1">
      {#each WORLD_CITIES as city (city.name)}
        <button
          onclick={() => flyToCity(city)}
          class="flex-shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          {city.name}
        </button>
      {/each}
    </div>

    <!-- Map container -->
    <div class="relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5" style="height: 60vh;">
      <div bind:this={mapContainer} class="h-full w-full"></div>
      {#if !browser}
        <div class="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader text="Карта загружается..." />
        </div>
      {/if}
    </div>

    <!-- Markers list -->
    {#if markers.length > 0}
      <div class="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-50">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Маркеры ({markers.length})
          </p>
        </div>
        <div class="divide-y divide-gray-50">
          {#each markers as marker (marker.id)}
            <div class="flex items-center gap-3 px-4 py-3">
              <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span class="text-sm">📍</span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-900 truncate">{marker.label}</p>
                <p class="text-xs text-gray-400">{formatTime(marker.createdAt)}</p>
              </div>
              <button
                onclick={() => removeMarker(marker.id)}
                class="flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                aria-label="Удалить маркер"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}

  </div>
{/if}
