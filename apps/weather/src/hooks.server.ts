import { type Handle } from '@sveltejs/kit';
import { getFeatureFlagsFromEnv, getRenderModesFromEnv } from '@repo/shared/feature-flags';
import { readOverrides } from '@repo/flags-store';
import { env } from '$env/dynamic/public';

const MODULE_ID = 'weather' as const;

export const handle: Handle = async ({ event, resolve }) => {
  const envFlags = getFeatureFlagsFromEnv(env);
  const envModes = getRenderModesFromEnv(env);
  const overrides = readOverrides();
  const override = overrides[MODULE_ID];
  event.locals.featureEnabled = override?.enabled ?? envFlags[MODULE_ID];
  event.locals.renderMode = override?.renderMode ?? envModes[MODULE_ID];
  return resolve(event);
};
