import { json, error } from '@sveltejs/kit';
import { setModuleOverride, resetModuleOverride, resetAllOverrides } from '@repo/flags-store';
import type { ModuleId, RenderMode } from '@repo/flags-store';
import type { RequestHandler } from './$types';

const MODULE_IDS: ModuleId[] = [
  'exchange', 'blog', 'content', 'weather', 'cars', 'maps',
  'admin', 'bank', 'devtools', 'reports', 'remotion',
];

interface PatchBody {
  action: 'set' | 'reset' | 'reset-all';
  moduleId?: ModuleId;
  enabled?: boolean;
  renderMode?: RenderMode;
}

export const PATCH: RequestHandler = async ({ request, locals }) => {
  if (!locals.isAuthenticated) error(401, { message: 'Unauthorized' });

  const body = await request.json() as PatchBody;

  if (body.action === 'reset-all') {
    resetAllOverrides();
    return json({ ok: true });
  }

  if (!body.moduleId || !MODULE_IDS.includes(body.moduleId)) {
    error(400, { message: 'Invalid moduleId' });
  }

  if (body.action === 'reset') {
    resetModuleOverride(body.moduleId);
    return json({ ok: true });
  }

  if (body.action === 'set') {
    const patch: { enabled?: boolean; renderMode?: RenderMode } = {};
    if (typeof body.enabled === 'boolean') patch.enabled = body.enabled;
    if (body.renderMode === 'ssr' || body.renderMode === 'spa') patch.renderMode = body.renderMode;
    setModuleOverride(body.moduleId, patch);
    return json({ ok: true });
  }

  error(400, { message: 'Unknown action' });
};
