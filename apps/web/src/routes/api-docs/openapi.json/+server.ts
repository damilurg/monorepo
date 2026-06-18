import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
  // Use the request origin so docs always point to the current deployment.
  // Falls back to ORIGIN env var (set by SvelteKit adapter-node), then localhost for dev.
  const origin = url.origin !== 'null' ? url.origin : (process.env.ORIGIN ?? 'http://localhost:5173');

  const spec = {
    openapi: '3.0.3',
    info: {
      title: 'Automotive Portal — API Documentation',
      description: `Complete API reference for all services used in the Automotive Portal monorepo.

Includes:
- **Internal proxy routes** served by SvelteKit +server.ts endpoints
- **External APIs** consumed by the portal (documented for transparency)

All internal routes are served from \`${origin}\`. External APIs are third-party services.

> **Note:** External API paths (prefixed with \`https://\`) are listed for documentation purposes only. The "Try it out" button will not work for them due to cross-origin restrictions — use the linked external docs or a tool like curl instead.`,
      version: '1.0.0',
      contact: { name: 'Portal Team' },
    },
    servers: [
      { url: origin, description: 'Portal (current deployment)' },
    ],
    tags: [
      { name: 'Exchange', description: 'Currency exchange rates and conversion' },
      { name: 'Weather', description: 'Weather forecast and city data' },
      { name: 'Cars', description: 'Vehicle information and VIN decoding' },
      { name: 'Maps', description: 'Geocoding and location search' },
      { name: 'Blog', description: 'Blog posts (JSONPlaceholder)' },
      { name: 'Content', description: 'Quotes and content (DummyJSON)' },
      { name: 'Admin', description: 'Feature flag management' },
      { name: 'External — Frankfurter', description: 'External: frankfurter.dev exchange rate API' },
      { name: 'External — Open-Meteo', description: 'External: open-meteo.com weather API' },
      { name: 'External — NHTSA', description: 'External: vpic.nhtsa.dot.gov vehicle API' },
      { name: 'External — Nominatim', description: 'External: nominatim.openstreetmap.org geocoding' },
      { name: 'External — JSONPlaceholder', description: 'External: jsonplaceholder.typicode.com' },
      { name: 'External — DummyJSON', description: 'External: dummyjson.com quotes' },
      { name: 'External — REST Countries', description: 'External: restcountries.com' },
      { name: 'External — CoinCap', description: 'External: api.coincap.io crypto market data' },
    ],
    paths: {
      // ── INTERNAL PROXY ROUTES ──────────────────────────────────────────

      '/exchange': {
        get: {
          tags: ['Exchange'],
          summary: 'Get latest exchange rates',
          description: 'Proxies Frankfurter API. Returns latest rates with EUR as base currency.',
          parameters: [
            {
              name: 'base',
              in: 'query',
              description: 'Base currency code (e.g. USD, EUR, GBP)',
              schema: { type: 'string', default: 'EUR', example: 'USD' },
            },
          ],
          responses: {
            '200': {
              description: 'Exchange rates response',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ExchangeRatesDTO' },
                },
              },
            },
            '403': { description: 'Feature disabled (exchange flag is off)' },
            '500': { description: 'Upstream API error' },
          },
        },
      },

      '/weather/api': {
        get: {
          tags: ['Weather'],
          summary: 'Get weather forecast',
          description: 'Proxies Open-Meteo API. Returns hourly and daily forecast.',
          parameters: [
            { name: 'latitude', in: 'query', required: true, schema: { type: 'number', example: 55.7558 } },
            { name: 'longitude', in: 'query', required: true, schema: { type: 'number', example: 37.6173 } },
          ],
          responses: {
            '200': {
              description: 'Weather forecast',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/WeatherDTO' },
                },
              },
            },
            '403': { description: 'Feature disabled' },
          },
        },
      },

      '/cars': {
        get: {
          tags: ['Cars'],
          summary: 'Decode VIN number',
          description: 'Proxies NHTSA vPIC API to decode a Vehicle Identification Number.',
          parameters: [
            { name: 'vin', in: 'query', required: true, schema: { type: 'string', example: '1HGCM82633A004352' }, description: '17-character VIN' },
          ],
          responses: {
            '200': {
              description: 'Decoded vehicle information',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CarDTO' },
                },
              },
            },
            '400': { description: 'Invalid VIN format' },
            '403': { description: 'Feature disabled' },
          },
        },
      },

      '/maps': {
        get: {
          tags: ['Maps'],
          summary: 'Geocode address',
          description: 'Proxies Nominatim (OpenStreetMap) to geocode an address string.',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'Moscow, Russia' }, description: 'Search query' },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 5 } },
          ],
          responses: {
            '200': {
              description: 'Geocoding results',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/LocationDTO' },
                  },
                },
              },
            },
            '403': { description: 'Feature disabled' },
          },
        },
      },

      '/blog': {
        get: {
          tags: ['Blog'],
          summary: 'List blog posts',
          description: 'Returns paginated blog posts from JSONPlaceholder.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            '200': {
              description: 'Blog posts list',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/BlogPostDTO' } },
                },
              },
            },
          },
        },
      },

      '/blog/{id}': {
        get: {
          tags: ['Blog'],
          summary: 'Get blog post by ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } },
          ],
          responses: {
            '200': {
              description: 'Single blog post',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/BlogPostDTO' } } },
            },
            '404': { description: 'Post not found' },
          },
        },
      },

      '/content': {
        get: {
          tags: ['Content'],
          summary: 'Get quotes',
          description: 'Returns quotes from DummyJSON with optional search.',
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search query' },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'skip', in: 'query', schema: { type: 'integer', default: 0 } },
          ],
          responses: {
            '200': {
              description: 'Quotes list',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/QuotesResponseDTO' } } },
            },
          },
        },
      },

      '/admin/api/flags': {
        get: {
          tags: ['Admin'],
          summary: 'Get all feature flags',
          description: 'Returns current state of all feature flags and render modes.',
          responses: {
            '200': {
              description: 'Feature flags',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/FeatureFlagsDTO' } } },
            },
          },
        },
        patch: {
          tags: ['Admin'],
          summary: 'Update feature flag',
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FlagPatchRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Flag updated' },
            '400': { description: 'Invalid request' },
          },
        },
      },

      // ── EXTERNAL API DOCUMENTATION ─────────────────────────────────────

      'https://api.frankfurter.dev/v1/latest': {
        get: {
          tags: ['External — Frankfurter'],
          summary: 'Latest exchange rates',
          description: 'Free currency API. No authentication required. Rate limit: none officially.\n\n> **Try it out is disabled for external URLs** due to browser cross-origin restrictions. Use curl or the linked docs.',
          externalDocs: { url: 'https://api.frankfurter.dev', description: 'Frankfurter API Docs' },
          parameters: [
            { name: 'base', in: 'query', schema: { type: 'string', example: 'EUR' } },
            { name: 'symbols', in: 'query', schema: { type: 'string', example: 'USD,GBP,JPY' } },
          ],
          responses: {
            '200': {
              description: 'Exchange rates',
              content: {
                'application/json': {
                  example: { amount: 1, base: 'EUR', date: '2024-01-15', rates: { USD: 1.0962, GBP: 0.8598 } },
                },
              },
            },
          },
        },
      },

      'https://api.open-meteo.com/v1/forecast': {
        get: {
          tags: ['External — Open-Meteo'],
          summary: 'Weather forecast',
          description: 'Free weather API based on open-source models. No key required.\n\n> **Try it out is disabled for external URLs** due to browser cross-origin restrictions.',
          externalDocs: { url: 'https://open-meteo.com/en/docs', description: 'Open-Meteo Docs' },
          parameters: [
            { name: 'latitude', in: 'query', required: true, schema: { type: 'number', example: 55.7558 } },
            { name: 'longitude', in: 'query', required: true, schema: { type: 'number', example: 37.6173 } },
            { name: 'hourly', in: 'query', schema: { type: 'string', example: 'temperature_2m,weathercode' } },
            { name: 'daily', in: 'query', schema: { type: 'string', example: 'temperature_2m_max,temperature_2m_min' } },
            { name: 'timezone', in: 'query', schema: { type: 'string', example: 'auto' } },
          ],
          responses: {
            '200': { description: 'Forecast data with hourly/daily arrays' },
          },
        },
      },

      'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{vin}': {
        get: {
          tags: ['External — NHTSA'],
          summary: 'Decode VIN (NHTSA vPIC)',
          description: 'Free US government vehicle database. No key required.\n\n> **Try it out is disabled for external URLs** due to browser cross-origin restrictions.',
          externalDocs: { url: 'https://vpic.nhtsa.dot.gov/api/', description: 'NHTSA vPIC API' },
          parameters: [
            { name: 'vin', in: 'path', required: true, schema: { type: 'string', example: '1HGCM82633A004352' } },
            { name: 'format', in: 'query', schema: { type: 'string', default: 'json' } },
          ],
          responses: {
            '200': {
              description: 'Decoded vehicle data (Results array with Variable/Value pairs)',
            },
          },
        },
      },

      'https://nominatim.openstreetmap.org/search': {
        get: {
          tags: ['External — Nominatim'],
          summary: 'Geocode address',
          description: 'Free geocoding by OpenStreetMap. Fair use: max 1 req/sec, set User-Agent.\n\n> **Try it out is disabled for external URLs** due to browser cross-origin restrictions.',
          externalDocs: { url: 'https://nominatim.org/release-docs/develop/api/Search/', description: 'Nominatim Docs' },
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'Berlin, Germany' } },
            { name: 'format', in: 'query', schema: { type: 'string', default: 'json' } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 5 } },
            { name: 'addressdetails', in: 'query', schema: { type: 'integer', enum: [0, 1] } },
          ],
          responses: {
            '200': {
              description: 'Array of matching locations with lat/lon',
              content: {
                'application/json': {
                  example: [{ lat: '52.5170365', lon: '13.3888599', display_name: 'Berlin, Germany' }],
                },
              },
            },
          },
        },
      },

      'https://jsonplaceholder.typicode.com/posts': {
        get: {
          tags: ['External — JSONPlaceholder'],
          summary: 'List posts',
          description: 'Free fake REST API for testing. Always returns the same 100 posts.\n\n> **Try it out is disabled for external URLs** due to browser cross-origin restrictions.',
          externalDocs: { url: 'https://jsonplaceholder.typicode.com', description: 'JSONPlaceholder' },
          responses: {
            '200': {
              description: '100 fake blog posts',
              content: {
                'application/json': {
                  example: [{ userId: 1, id: 1, title: 'sunt aut facere...', body: '...' }],
                },
              },
            },
          },
        },
      },

      'https://dummyjson.com/quotes': {
        get: {
          tags: ['External — DummyJSON'],
          summary: 'Get quotes',
          description: 'Free fake data API. Returns inspirational quotes.\n\n> **Try it out is disabled for external URLs** due to browser cross-origin restrictions.',
          externalDocs: { url: 'https://dummyjson.com/docs/quotes', description: 'DummyJSON Quotes API' },
          parameters: [
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 30 } },
            { name: 'skip', in: 'query', schema: { type: 'integer', default: 0 } },
          ],
          responses: {
            '200': {
              description: 'Quotes list',
              content: {
                'application/json': {
                  example: { quotes: [{ id: 1, quote: 'Life is...', author: 'Someone' }], total: 100 },
                },
              },
            },
          },
        },
      },

      'https://restcountries.com/v3.1/all': {
        get: {
          tags: ['External — REST Countries'],
          summary: 'Get all countries',
          description: 'Free countries data API. Returns 250 countries with detailed info.\n\n> **Try it out is disabled for external URLs** due to browser cross-origin restrictions.',
          externalDocs: { url: 'https://restcountries.com', description: 'REST Countries API' },
          parameters: [
            { name: 'fields', in: 'query', schema: { type: 'string', example: 'name,population,region,flags' }, description: 'Comma-separated field filter' },
          ],
          responses: {
            '200': {
              description: 'Array of country objects',
            },
          },
        },
      },

      'https://api.coingecko.com/api/v3/coins/markets': {
        get: {
          tags: ['External — CoinGecko'],
          summary: 'Crypto market data',
          description: 'Free tier: 30 calls/min, no API key needed. Returns market data for top coins.\n\n> **Try it out is disabled for external URLs** due to browser cross-origin restrictions.',
          externalDocs: { url: 'https://docs.coingecko.com', description: 'CoinGecko API Docs' },
          parameters: [
            { name: 'vs_currency', in: 'query', required: true, schema: { type: 'string', example: 'usd' } },
            { name: 'order', in: 'query', schema: { type: 'string', default: 'market_cap_desc' } },
            { name: 'per_page', in: 'query', schema: { type: 'integer', default: 10, maximum: 250 } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          ],
          responses: {
            '200': {
              description: 'Array of coin market data',
              content: {
                'application/json': {
                  example: [{
                    id: 'bitcoin', symbol: 'btc', name: 'Bitcoin',
                    current_price: 45000, price_change_percentage_24h: 2.5,
                    market_cap: 880000000000,
                  }],
                },
              },
            },
            '429': { description: 'Rate limit exceeded' },
          },
        },
      },
    },

    components: {
      schemas: {
        ExchangeRatesDTO: {
          type: 'object',
          properties: {
            base: { type: 'string', example: 'EUR' },
            date: { type: 'string', format: 'date', example: '2024-01-15' },
            rates: {
              type: 'object',
              additionalProperties: { type: 'number' },
              example: { USD: 1.0962, GBP: 0.8598, JPY: 161.02 },
            },
          },
        },
        WeatherDTO: {
          type: 'object',
          properties: {
            city: { type: 'string', example: 'Moscow' },
            current: {
              type: 'object',
              properties: {
                temperature: { type: 'number', example: 5.2 },
                windspeed: { type: 'number', example: 12.4 },
                weathercode: { type: 'integer', example: 3 },
              },
            },
            hourly: {
              type: 'object',
              properties: {
                time: { type: 'array', items: { type: 'string' } },
                temperature_2m: { type: 'array', items: { type: 'number' } },
              },
            },
          },
        },
        CarDTO: {
          type: 'object',
          properties: {
            vin: { type: 'string', example: '1HGCM82633A004352' },
            make: { type: 'string', example: 'Honda' },
            model: { type: 'string', example: 'Accord' },
            year: { type: 'integer', example: 2003 },
            engineDisplacement: { type: 'string', example: '2.4' },
            fuelType: { type: 'string', example: 'Gasoline' },
            bodyClass: { type: 'string', example: 'Sedan/Saloon' },
            driveType: { type: 'string', example: 'FWD/Front-Wheel Drive' },
          },
        },
        LocationDTO: {
          type: 'object',
          properties: {
            lat: { type: 'number', example: 55.7558 },
            lon: { type: 'number', example: 37.6173 },
            displayName: { type: 'string', example: 'Moscow, Russia' },
            type: { type: 'string', example: 'city' },
          },
        },
        BlogPostDTO: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Post title' },
            body: { type: 'string', example: 'Post content...' },
          },
        },
        QuotesResponseDTO: {
          type: 'object',
          properties: {
            quotes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  quote: { type: 'string' },
                  author: { type: 'string' },
                },
              },
            },
            total: { type: 'integer' },
            skip: { type: 'integer' },
            limit: { type: 'integer' },
          },
        },
        FeatureFlagsDTO: {
          type: 'object',
          properties: {
            modules: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'exchange' },
                  enabled: { type: 'boolean' },
                  renderMode: { type: 'string', enum: ['ssr', 'spa'] },
                  runtimeEnabled: { type: 'boolean' },
                  runtimeRenderMode: { type: 'string' },
                  overrideEnabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        FlagPatchRequest: {
          type: 'object',
          properties: {
            module: { type: 'string', example: 'exchange' },
            field: { type: 'string', enum: ['enabled', 'renderMode'] },
            value: { oneOf: [{ type: 'boolean' }, { type: 'string' }] },
          },
        },
      },
    },
  };

  return json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
