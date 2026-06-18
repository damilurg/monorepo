<script lang="ts">
  import type { PageData } from './$types';
  import { PageHeader, Card, Input, ErrorState, Loader } from '@repo/shared/ui';
  import { formatApiError } from '@repo/shared';
  import type { VehicleInfo } from '$modules/cars/model/types.js';
  import { isValidVin } from '$modules/cars/model/types.js';
  import { goto } from '$app/navigation';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let spaVehicle = $state<VehicleInfo | null>(null);
  let spaLoading = $state(false);
  let spaError = $state('');

  async function fetchVin(vin: string) {
    spaLoading = true;
    spaError = '';
    spaVehicle = null;
    try {
      if (!isValidVin(vin)) {
        spaError = 'Некорректный VIN. Должен содержать 17 символов (A-Z, 0-9, без I, O, Q).';
        return;
      }
      const res = await fetch(`/vin/${encodeURIComponent(vin)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` })) as { message: string };
        throw new Error(err.message);
      }
      spaVehicle = await res.json() as VehicleInfo;
    } catch (e) {
      spaError = formatApiError(e);
    } finally {
      spaLoading = false;
    }
  }

  $effect(() => {
    if (data.renderMode === 'spa') {
      void fetchVin(data.vin);
    }
  });

  let vehicle = $derived(data.renderMode === 'ssr' ? data.vehicle : spaVehicle);
  let vehicleError = $derived(data.renderMode === 'ssr' ? data.error : spaError);

  let vinInput = $state(data.vin ?? '');

  function searchVin() {
    const vin = vinInput.trim().toUpperCase();
    if (!vin) return;
    goto(`/vin/${vin}`);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') searchVin();
  }

  const EXAMPLE_VINS = [
    { vin: '1HGBH41JXMN109186', label: 'Honda' },
    { vin: '2T1BURHE0JC043821', label: 'Toyota' },
    { vin: '1GNKVGED5BJ233023', label: 'Chevrolet' },
  ];

  interface VehicleField {
    label: string;
    value: string;
  }

  let vehicleFields = $derived<VehicleField[]>(
    vehicle
      ? [
          { label: 'Марка', value: vehicle.make },
          { label: 'Модель', value: vehicle.model },
          { label: 'Год', value: vehicle.year },
          { label: 'Тип кузова', value: vehicle.bodyClass },
          { label: 'Объём двигателя', value: vehicle.engineDisplacement ? vehicle.engineDisplacement + ' л' : '' },
          { label: 'Цилиндры', value: vehicle.engineCylinders },
          { label: 'Тип топлива', value: vehicle.fuelType },
          { label: 'Тип ТС', value: vehicle.vehicleType },
          { label: 'Привод', value: vehicle.driveType },
          { label: 'КПП', value: vehicle.transmissionStyle },
          { label: 'Дверей', value: vehicle.doors },
          { label: 'Производитель', value: vehicle.manufacturer },
          { label: 'Страна сборки', value: vehicle.plantCountry },
        ].filter((f) => f.value)
      : []
  );
</script>

<svelte:head>
  <title>Авто — VIN декодер — Automotive Portal</title>
</svelte:head>

<PageHeader title="VIN Декодер" subtitle="Узнайте всё об автомобиле" backHref="/" backLabel="На главную" />

<div class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

  <Card>
    <div class="flex flex-col gap-3">
      <Input
        label="VIN номер"
        placeholder="Например: 1HGBH41JXMN109186"
        bind:value={vinInput}
        hint="17 символов, латинские буквы и цифры"
        onkeydown={handleKeydown}
      />
      <button
        onclick={searchVin}
        disabled={vinInput.trim().length === 0}
        class="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Декодировать VIN
      </button>
    </div>
  </Card>

  <div>
    <p class="text-xs text-gray-400 mb-2 px-1">Примеры для теста:</p>
    <div class="flex flex-wrap gap-2">
      {#each EXAMPLE_VINS as example (example.vin)}
        <button
          onclick={() => { vinInput = example.vin; }}
          class="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
        >
          {example.label}
        </button>
      {/each}
    </div>
  </div>

  {#if data.renderMode === 'spa' && spaLoading}
    <Loader text="Декодируем VIN..." />
  {:else if vehicleError}
    <ErrorState title="Ошибка" message={vehicleError} />
  {:else if vehicle}

    <Card>
      <div class="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
        <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">🚗</div>
        <div>
          <h2 class="text-lg font-bold text-gray-900">{vehicle.make} {vehicle.model}</h2>
          <p class="text-sm text-gray-500">{vehicle.year} · VIN: {vehicle.vin}</p>
        </div>
      </div>
      <div class="flex flex-col divide-y divide-gray-50">
        {#each vehicleFields as field (field.label)}
          <div class="flex justify-between items-center py-2.5 gap-4">
            <span class="text-sm text-gray-500 flex-shrink-0">{field.label}</span>
            <span class="text-sm font-medium text-gray-800 text-right">{field.value}</span>
          </div>
        {/each}
      </div>
    </Card>

  {/if}
</div>
