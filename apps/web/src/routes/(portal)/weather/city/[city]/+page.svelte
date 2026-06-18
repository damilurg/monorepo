<script lang="ts">
  import type { PageData } from './$types';
  import { PageHeader, Loader, ErrorState } from '@repo/shared/ui';
  import { getWeatherEmoji, getWeatherDescription } from '$modules/weather/model/types.js';
  import { formatApiError } from '@repo/shared';
  import type { WeatherData } from '$modules/weather/model/types.js';
  import { goto } from '$app/navigation';
  import Seo from '$lib/components/Seo.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let spaWeather = $state<WeatherData | null>(null);
  let spaCity = $state(data.city);
  let spaLoading = $state(false);
  let spaError = $state('');

  interface WeatherApiResponse {
    location: { name: string; country: string };
    weather: { current: WeatherData['current']; daily: WeatherData['daily'] };
  }

  async function fetchWeather(city: string) {
    spaLoading = true;
    spaError = '';
    try {
      const res = await fetch(`/weather/city/${encodeURIComponent(city.toLowerCase())}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as WeatherApiResponse;
      spaCity = json.location.name;
      spaWeather = {
        city: json.location.name,
        country: json.location.country,
        current: json.weather.current,
        daily: json.weather.daily,
      };
    } catch (e) {
      spaError = formatApiError(e);
    } finally {
      spaLoading = false;
    }
  }

  $effect(() => {
    if (data.renderMode === 'spa') {
      void fetchWeather(data.city);
    }
  });

  let weather = $derived(data.renderMode === 'ssr' ? data.weather : spaWeather);
  let cityInput = $state(data.city);

  function searchCity() {
    if (!cityInput.trim()) return;
    goto(`/weather/city/${encodeURIComponent(cityInput.trim().toLowerCase())}`);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') searchCity();
  }

  const POPULAR_CITIES = ['Moscow', 'London', 'New York', 'Tokyo', 'Berlin', 'Paris'];

  function formatTemp(temp: number): string {
    return `${Math.round(temp)}°`;
  }

  function formatDay(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  let displayCity = $derived(data.renderMode === 'ssr' ? data.city : spaCity);
</script>

<Seo
  title="Погода — {displayCity}"
  description="Прогноз погоды для {displayCity}. Текущая температура, влажность, ветер и прогноз на 7 дней."
  canonical="https://example.com/weather/city/{data.city}"
  jsonLd={{
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Погода — ${displayCity}`,
    description: `Прогноз погоды для ${displayCity}`,
    url: `https://example.com/weather/city/${data.city}`,
  }}
/>

<PageHeader
  title="Погода"
  subtitle={weather ? `${weather.city}, ${weather.country}` : displayCity}
  backHref="/"
  backLabel="На главную"
/>
<span data-testid="city-name" class="sr-only">{displayCity}</span>

<div class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

  <!-- Search -->
  <div class="flex gap-2">
    <div class="flex-1">
      <input
        class="input"
        type="text"
        placeholder="Введите город..."
        bind:value={cityInput}
        onkeydown={handleKeydown}
      />
    </div>
    <button onclick={searchCity} class="btn variant-filled-primary flex-shrink-0">
      Найти
    </button>
  </div>

  <!-- Quick cities -->
  <div class="flex flex-wrap gap-2">
    {#each POPULAR_CITIES as city (city)}
      <a
        data-testid="city-chip"
        href="/weather/city/{city.toLowerCase()}"
        class="chip {displayCity.toLowerCase() === city.toLowerCase() ? 'variant-filled-primary' : 'variant-soft-surface'}"
      >{city}</a>
    {/each}
  </div>

  {#if data.renderMode === 'spa' && spaLoading}
    <Loader text="Загружаем погоду..." />
  {:else if spaError}
    <div data-testid="error-state">
      <ErrorState message={spaError} onRetry={() => fetchWeather(cityInput)} />
    </div>
  {:else if weather}

    <!-- Current weather card -->
    <div class="card variant-filled-surface p-6 rounded-2xl text-center">
      <span class="text-7xl mb-4 block">{getWeatherEmoji(weather.current.weather_code)}</span>
      <div data-testid="temperature" class="text-5xl font-bold mb-2">{formatTemp(weather.current.temperature_2m)}</div>
      <p class="opacity-70">{getWeatherDescription(weather.current.weather_code)}</p>
      <p class="text-sm opacity-50 mt-1">Ощущается как {formatTemp(weather.current.apparent_temperature)}</p>
    </div>

    <!-- Stats with progress bars -->
    <div class="card p-4 space-y-4">
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span class="opacity-60">Влажность</span>
          <span class="font-medium">{weather.current.relative_humidity_2m}%</span>
        </div>
        <div class="h-2 w-full rounded-full bg-white/10"><div class="h-2 rounded-full bg-sky-400 transition-all" style="width:{weather.current.relative_humidity_2m}%"></div></div>
      </div>
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span class="opacity-60">Ветер</span>
          <span class="font-medium">{Math.round(weather.current.wind_speed_10m)} км/ч</span>
        </div>
        <div class="h-2 w-full rounded-full bg-white/10"><div class="h-2 rounded-full bg-sky-400 transition-all" style="width:{Math.min(weather.current.wind_speed_10m, 100)}%"></div></div>
      </div>
      <div class="flex justify-between text-sm pt-1">
        <span class="opacity-60">Состояние</span>
        <span class="chip variant-soft-surface text-xs">{weather.current.is_day ? 'День' : 'Ночь'}</span>
      </div>
    </div>

    <!-- 7-day forecast -->
    <div class="card p-4">
      <div data-testid="forecast">
        <p class="text-xs font-semibold uppercase tracking-wide opacity-50 mb-3">7 дней</p>
        <div class="flex flex-col divide-y divide-surface-200-700-token">
          {#each weather.daily.time as day, i (day)}
            <div class="flex items-center gap-3 py-3">
              <span class="text-xl w-8">{getWeatherEmoji(weather.daily.weather_code[i])}</span>
              <span class="text-sm opacity-70 flex-1">{formatDay(day)}</span>
              <div class="flex items-center gap-2 text-sm">
                <span class="font-semibold">{formatTemp(weather.daily.temperature_2m_max[i])}</span>
                <span class="opacity-40">{formatTemp(weather.daily.temperature_2m_min[i])}</span>
              </div>
              {#if weather.daily.precipitation_probability_max[i] > 0}
                <span class="chip variant-soft-primary text-xs w-12 text-center">{weather.daily.precipitation_probability_max[i]}%</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

  {/if}
</div>
