/**
 * React player mounting helper — .tsx file so @vitejs/plugin-react
 * processes it and injects the HMR preamble correctly.
 *
 * Compositions are loaded via dynamic import() INSIDE this function so that
 * Vite's React Fast Refresh module graph is built correctly. Static imports of
 * composition files from a module that is itself dynamically imported causes
 * TDZ and preamble errors because HMR boundaries break.
 */
import { createRoot } from 'react-dom/client';
import React from 'react';
import { Player } from '@remotion/player';

type Lang = 'ru' | 'en';

export interface CompositionMeta {
  id: string;
  group: 'portal' | 'modules' | 'classic';
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  moduleKey?: string;
}

type AnyComp = React.ComponentType<Record<string, unknown>>;

export async function mountReactPlayer(
  container: HTMLElement,
  comp: CompositionMeta,
  lang: Lang,
): Promise<{ unmount: () => void }> {
  let component: AnyComp;
  let inputProps: Record<string, unknown> = {};

  // Dynamic imports inside .tsx → React plugin handles preamble injection
  // and HMR boundaries correctly for each composition file.
  if (comp.id === 'HelloWorld') {
    const { HelloWorld } = await import('@repo/remotion-compositions/src/compositions/HelloWorld.js');
    component = HelloWorld as AnyComp;

  } else if (comp.id === 'DataViz') {
    const { DataViz } = await import('@repo/remotion-compositions/src/compositions/DataViz.js');
    component = DataViz as AnyComp;

  } else if (comp.id === 'PortalOverview') {
    const { PortalOverview } = await import('@repo/remotion-compositions/src/compositions/PortalOverview.js');
    component = PortalOverview as AnyComp;
    inputProps = { lang };

  } else if (comp.id === 'PortalSlideshow') {
    const { PortalSlideshow } = await import('@repo/remotion-compositions/src/compositions/PortalSlideshow.js');
    component = PortalSlideshow as AnyComp;
    inputProps = { lang };

  } else if (comp.group === 'modules' && comp.moduleKey) {
    const { ModuleSlide, MODULE_DATA } = await import('@repo/remotion-compositions/src/compositions/ModuleSlide.js');
    component = ModuleSlide as AnyComp;
    inputProps = { module: MODULE_DATA[comp.moduleKey], lang, index: 0, total: 1 };

  } else {
    throw new Error(`Unknown composition: ${comp.id}`);
  }

  if (!container.isConnected) throw new Error('container detached');

  const root = createRoot(container);
  root.render(
    React.createElement(Player, {
      component,
      inputProps,
      durationInFrames: comp.durationInFrames,
      fps: comp.fps,
      compositionWidth: comp.width,
      compositionHeight: comp.height,
      style: { width: '100%', borderRadius: '12px' },
      controls: true,
      autoPlay: true,
      loop: true,
    }),
  );
  return root;
}
