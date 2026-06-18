import { json, error } from '@sveltejs/kit';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import type { RequestHandler } from './$types';

interface RenderRequest {
  compositionId: string;
  props: Record<string, unknown>;
}

/**
 * Resolve @remotion/renderer from either:
 *   1. apps/web/node_modules (after yarn install picks it up)
 *   2. packages/remotion-compositions/node_modules (already present in monorepo)
 *
 * This avoids a hard import failure when the dep hasn't been hoisted yet.
 */
function resolveRenderer() {
  // Standard resolution — works after `yarn install`
  try {
    return import('@remotion/renderer');
  } catch {
    // Fallback: load from the workspace package that already has it installed
    const thisFile = fileURLToPath(import.meta.url);
    const workspaceRenderer = resolve(
      dirname(thisFile),
      '../../../../../../../packages/remotion-compositions/node_modules/@remotion/renderer/dist/index.js'
    );
    if (existsSync(workspaceRenderer)) {
      const req = createRequire(thisFile);
      return Promise.resolve(req(workspaceRenderer)) as ReturnType<typeof import('@remotion/renderer')>;
    }
    throw new Error('@remotion/renderer not found. Run: yarn install');
  }
}

export const POST: RequestHandler = async ({ request }) => {
  const { compositionId, props } = (await request.json()) as RenderRequest;

  if (!compositionId) {
    throw error(400, 'compositionId is required');
  }

  // Ensure output directory exists
  mkdirSync('out', { recursive: true });

  try {
    const { renderMedia, selectComposition, bundle } = await resolveRenderer();

    // Entry point for the compositions package
    const entryPoint = fileURLToPath(
      new URL(
        '../../../../../../../packages/remotion-compositions/src/index.ts',
        import.meta.url
      )
    );

    const bundleLocation = await bundle({ entryPoint });

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: props,
    });

    const outputPath = `out/${compositionId}.mp4`;

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: props,
    });

    return json({ success: true, path: outputPath });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[remotion/render]', msg);

    // Surface a helpful message depending on the failure cause
    if (msg.includes('ffmpeg') || msg.includes('FFmpeg')) {
      throw error(503, 'ffmpeg not found. Install it: brew install ffmpeg  or  apt install ffmpeg');
    }
    if (msg.includes('not found') || msg.includes('Cannot find')) {
      throw error(503, 'Run `yarn install` to install @remotion/renderer, then restart the dev server.');
    }

    throw error(500, `Render failed: ${msg}`);
  }
};
