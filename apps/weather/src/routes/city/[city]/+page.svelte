<script lang="ts">
  import type { PageData } from './$types';
  import { PageHeader, Card, Input, Loader, ErrorState } from '@repo/shared/ui';
  import { getWeatherEmoji, getWeatherDescription } from '$modules/weather/model/types.js';
  import { formatApiError } from '@repo/shared';
  import type { WeatherData } from '$modules/weather/model/types.js';
  import { goto } from '$app/navigation';

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
      const res = await fetch(`/city/${encodeURIComponent(city.toLowerCase())}`);
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
    goto(`/city/${encodeURIComponent(cityInput.trim().toLowerCase())}`);
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

<svelte:head>
  <title>Погода — {displayCity} — Automotive Portal</title>
</svelte:head>

<PageHeader
  title="Погода"
  subtitle={weather ? `${weather.city}, ${weather.country}` : displayCity}
  backHref="/"
  backLabel="На главную"
/>

<div class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

  <!-- Search -->
  <div class="flex gap-2">
    <div class="flex-1">
      <Input placeholder="Введите город..." bind:value={cityInput} onkeydown={handleKeydown} />
    </div>
    <button onclick={searchCity} class="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex-shrink-0">
      Найти
    </button>
  </div>

  <!-- Quick cities -->
  <div class="flex flex-wrap gap-2">
    {#each POPULAR_CITIES as city (city)}
      <a
        href="/city/{city.toLowerCase()}"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors
          {displayCity.toLowerCase() === city.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
      >{city}</a>
    {/each}
  </div>

  {#if data.renderMode === 'spa' && spaLoading}
    <Loader text="Загружаем погоду..." />
  {:else if spaError}
    <ErrorState message={spaError} onRetry={() => fetchWeather(cityInput)} />
  {:else if weather}

    <!-- Current -->
    <Card>
      <div class="flex flex-col items-center py-4 gap-2">
        <span class="text-6xl">{getWeatherEmoji(weather.current.weather_code)}</span>
        <div class="text-5xl font-bold text-gray-900">{formatTemp(weather.current.temperature_2m)}</div>
        <p class="text-gray-500">{getWeatherDescription(weather.current.weather_code)}</p>
        <p class="text-sm text-gray-400">Ощущается как {formatTemp(weather.current.apparent_temperature)}</p>
      </div>
      <div class="border-t border-gray-50 mt-2 pt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-gray-400 mb-1">Влажность</p>
          <p class="font-semibold text-gray-800">{weather.current.relative_humidity_2m}%</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-1">Ветер</p>
          <p class="font-semibold text-gray-800">{Math.round(weather.current.wind_speed_10m)} км/ч</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-1">Состояние</p>
          <p class="font-semibold text-gray-800">{weather.current.is_day ? 'День' : 'Ночь'}</p>
        </div>
      </div>
    </Card>

    <!-- 7-day -->
    <Card>
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">7 дней</p>
      <div class="flex flex-col divide-y divide-gray-50">
        {#each weather.daily.time as day, i (day)}
          <div class="flex items-center gap-3 py-3">
            <span class="text-xl w-8">{getWeatherEmoji(weather.daily.weather_code[i])}</span>
            <span class="text-sm text-gray-600 flex-1">{formatDay(day)}</span>
            <div class="flex items-center gap-2 text-sm">
              <span class="font-semibold text-gray-800">{formatTemp(weather.daily.temperature_2m_max[i])}</span>
              <span class="text-gray-400">{formatTemp(weather.daily.temperature_2m_min[i])}</span>
            </div>
            {#if weather.daily.precipitation_probability_max[i] > 0}
              <span class="text-xs text-blue-500 w-10 text-right">{weather.daily.precipitation_probability_max[i]}%</span>
            {/if}
          </div>
        {/each}
      </div>
    </Card>

  {/if}
</div>
