<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { PageHeader, Card, Input, Loader, ErrorState } from '@repo/shared/ui';
  import { getWeatherEmoji, getWeatherDescription } from '$modules/weather/model/types.js';
  import { formatApiError } from '@repo/shared';
  import type { WeatherData } from '$modules/weather/model/types.js';
  import { goto } from '$app/navigation';
  import { langStore } from '$lib/lang-store.svelte.js';

  const T = {
    ru: {
      title: 'Погода',
      loadingWeather: 'Загружаем погоду...',
      cityPlaceholder: 'Введите город...',
      search: 'Найти',
      feelsLike: 'Ощущается как',
      humidity: 'Влажность',
      wind: 'Ветер',
      condition: 'Состояние',
      day: 'День',
      night: 'Ночь',
      sevenDays: '7 дней',
      kmh: 'км/ч',
      back: 'На главную',
    },
    en: {
      title: 'Weather',
      loadingWeather: 'Loading weather...',
      cityPlaceholder: 'Enter city...',
      search: 'Search',
      feelsLike: 'Feels like',
      humidity: 'Humidity',
      wind: 'Wind',
      condition: 'Condition',
      day: 'Day',
      night: 'Night',
      sevenDays: '7 days',
      kmh: 'km/h',
      back: 'Home',
    },
  };
  const t = $derived(T[langStore.current]);

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
      const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);
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

  onMount(() => {
    if (data.renderMode === 'spa') {
      fetchWeather(data.city);
    }
  });

  let weather = $derived(data.renderMode === 'ssr' ? data.weather : spaWeather);
  let cityInput = $state(data.city);

  function searchCity() {
    if (!cityInput.trim()) return;
    if (data.renderMode === 'spa') {
      fetchWeather(cityInput.trim());
    } else {
      goto(`/weather?city=${encodeURIComponent(cityInput.trim())}`);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') searchCity();
  }

  const POPULAR_CITIES = ['Moscow', 'London', 'New York', 'Tokyo', 'Berlin', 'Paris'];

  function formatTemp(temp: number): string {
    return `${Math.round(temp)}°`;
  }

  function formatDay(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(langStore.current === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  let displayCity = $derived(data.renderMode === 'ssr' ? data.city : spaCity);
</script>

<svelte:head>
  <title>{t.title} — {displayCity} — Automotive Portal</title>
</svelte:head>

<PageHeader
  title={t.title}
  subtitle={weather ? `${weather.city}, ${weather.country}` : displayCity}
  backHref="/"
  backLabel={t.back}
/>

<div class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

  <!-- Search -->
  <div class="flex gap-2">
    <div class="flex-1">
      <Input placeholder={t.cityPlaceholder} bind:value={cityInput} onkeydown={handleKeydown} />
    </div>
    <button onclick={searchCity} class="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex-shrink-0">
      {t.search}
    </button>
  </div>

  <!-- Quick cities -->
  <div class="flex flex-wrap gap-2">
    {#each POPULAR_CITIES as city (city)}
      {#if data.renderMode === 'spa'}
        <button
          onclick={() => { cityInput = city; fetchWeather(city); }}
          class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            {displayCity === city ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >{city}</button>
      {:else}
        <a
          href="/weather?city={encodeURIComponent(city)}"
          class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            {displayCity === city ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >{city}</a>
      {/if}
    {/each}
  </div>

  {#if data.renderMode === 'spa' && spaLoading}
    <Loader text={t.loadingWeather} />
  {:else if spaError}
    <ErrorState message={spaError} onRetry={() => fetchWeather(cityInput)} />
  {:else if weather}

    <!-- Current -->
    <Card>
      <div class="flex flex-col items-center py-4 gap-2">
        <span class="text-6xl">{getWeatherEmoji(weather.current.weather_code)}</span>
        <div class="text-5xl font-bold text-gray-900">{formatTemp(weather.current.temperature_2m)}</div>
        <p class="text-gray-500">{getWeatherDescription(weather.current.weather_code)}</p>
        <p class="text-sm text-gray-400">{t.feelsLike} {formatTemp(weather.current.apparent_temperature)}</p>
      </div>
      <div class="border-t border-gray-50 mt-2 pt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-gray-400 mb-1">{t.humidity}</p>
          <p class="font-semibold text-gray-800">{weather.current.relative_humidity_2m}%</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-1">{t.wind}</p>
          <p class="font-semibold text-gray-800">{Math.round(weather.current.wind_speed_10m)} {t.kmh}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-1">{t.condition}</p>
          <p class="font-semibold text-gray-800">{weather.current.is_day ? t.day : t.night}</p>
        </div>
      </div>
    </Card>

    <!-- 7-day -->
    <Card>
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t.sevenDays}</p>
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
