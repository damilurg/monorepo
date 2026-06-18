<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  onMount(() => {
    if (!browser) return;
    // SwaggerUIBundle is loaded from CDN via svelte:head script
    const win = window as unknown as { SwaggerUIBundle: (config: Record<string, unknown>) => void };
    if (win.SwaggerUIBundle) {
      win.SwaggerUIBundle({
        url: '/api-docs/openapi.json',
        dom_id: '#swagger-ui',
        presets: [win.SwaggerUIBundle.presets?.['apis'], win.SwaggerUIBundle.SwaggerUIStandalonePreset],
        layout: 'BaseLayout',
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
      });
    }
  });
</script>

<svelte:head>
  <title>API Docs — Automotive Portal</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js"></script>
</svelte:head>

<!-- Dark wrapper matching monorepo style -->
<div class="min-h-screen bg-slate-950">
  <!-- Header -->
  <div class="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <a href="/" class="text-slate-400 hover:text-white transition-colors text-sm">← Главная</a>
      <span class="text-slate-600">/</span>
      <span class="font-bold text-white">API Documentation</span>
    </div>
    <div class="flex items-center gap-2 text-xs text-slate-500">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      OpenAPI 3.0
    </div>
  </div>

  <!-- Swagger UI container -->
  <!-- Override swagger dark theme via inline styles in svelte:head -->
  <div id="swagger-ui" class="swagger-container"></div>
</div>

<style>
  /* Override Swagger UI colors for dark theme */
  :global(.swagger-container .swagger-ui) {
    background: #020617; /* slate-950 */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  :global(.swagger-container .swagger-ui .topbar) { display: none; }
  :global(.swagger-container .swagger-ui .scheme-container) {
    background: #0f172a;
    box-shadow: none;
    border-bottom: 1px solid #1e293b;
  }
  :global(.swagger-container .swagger-ui .info) { margin: 24px 0; }
  :global(.swagger-container .swagger-ui .info .title) { color: #f1f5f9; }
  :global(.swagger-container .swagger-ui .info p, .swagger-container .swagger-ui .info li) { color: #94a3b8; }
  :global(.swagger-container .swagger-ui .opblock-tag) {
    color: #e2e8f0;
    border-bottom: 1px solid #1e293b;
  }
  :global(.swagger-container .swagger-ui section.models) { border: 1px solid #1e293b; }
  :global(.swagger-container .swagger-ui section.models h4) { color: #e2e8f0; }
  :global(.swagger-container .swagger-ui .opblock .opblock-summary-operation-id,
          .swagger-container .swagger-ui .opblock .opblock-summary-path,
          .swagger-container .swagger-ui .opblock .opblock-summary-path__deprecated) {
    color: #f1f5f9;
  }
  :global(.swagger-container .swagger-ui .opblock-description-wrapper p,
          .swagger-container .swagger-ui .opblock-external-docs-wrapper p,
          .swagger-container .swagger-ui .opblock-title_normal p) {
    color: #94a3b8;
  }
  :global(.swagger-container .swagger-ui table tbody tr td) { color: #cbd5e1; }
  :global(.swagger-container .swagger-ui .response-col_status) { color: #94a3b8; }
  :global(.swagger-container .swagger-ui .parameter__name) { color: #e2e8f0; }
  :global(.swagger-container .swagger-ui label) { color: #94a3b8; }
  :global(.swagger-container .swagger-ui input[type=text],
          .swagger-container .swagger-ui textarea,
          .swagger-container .swagger-ui select) {
    background: #1e293b;
    color: #f1f5f9;
    border: 1px solid #334155;
  }
  :global(.swagger-container .swagger-ui .model-box) {
    background: #0f172a;
  }
  :global(.swagger-container .swagger-ui .model .property.primitive) { color: #94a3b8; }
  :global(.swagger-container) { padding-bottom: 48px; }
</style>
