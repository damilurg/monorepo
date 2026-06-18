import type { PageServerLoad } from './$types';
import { getFeatureFlagsFromEnv, getRenderModesFromEnv } from '@repo/shared/feature-flags';
import { buildMapsPageData } from '$modules/maps/server/load.js';
import { env } from '$env/dynamic/public';

export const load: PageServerLoad = async ({ params, locals }) => {
  const flags = getFeatureFlagsFromEnv(env);
  const modes = getRenderModesFromEnv(env);

  const featureEnabled = locals.featureEnabled ?? flags.maps;
  const renderMode = locals.renderMode ?? modes.maps;

  if (!featureEnabled) {
    return { disabled: true as const };
  }

  if (renderMode === 'spa') {
    return {
      disabled: false as const,
      renderMode: 'spa' as const,
      lat: params.lat,
      lon: params.lon,
    };
  }

  const lat = parseFloat(params.lat);
  const lon = parseFloat(params.lon);
  const dto = buildMapsPageData(lat, lon);

  return {
    disabled: false as const,
    renderMode: 'ssr' as const,
    ...dto,
  };
};
