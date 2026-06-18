import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface RenderRequest {
  compositionId: string;
  props: Record<string, unknown>;
}

export const POST: RequestHandler = async ({ request }) => {
  const { compositionId, props } = (await request.json()) as RenderRequest;

  if (!compositionId) {
    throw error(400, 'compositionId is required');
  }

  // NOTE: @remotion/renderer requires ffmpeg installed on the server.
  // For production use, prefer Remotion Lambda for cloud rendering.
  // See: https://www.remotion.dev/docs/lambda
  try {
    const { renderMedia, selectComposition, bundle } = await import('@remotion/renderer');

    // Bundle the compositions package
    const bundleLocation = await bundle({
      entryPoint: '../../../packages/remotion-compositions/src/index.ts',
    });

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
    console.error('Render failed:', err);
    throw error(500, 'Rendering requires @remotion/renderer and ffmpeg. See /docs for details.');
  }
};
