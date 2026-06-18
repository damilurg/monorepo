<script lang="ts">
  import type { PageData } from './$types';
  import { PageHeader, Card, Input, EmptyState } from '@repo/shared/ui';
  import { goto } from '$app/navigation';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let vinInput = $state('');

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

  <EmptyState title="Введите VIN" description="Введите 17-значный VIN для получения информации об автомобиле" icon="🚗" />

</div>
