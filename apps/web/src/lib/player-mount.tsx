/**
 * React player mounting helper — lives in a .tsx file so @vitejs/plugin-react
 * injects its HMR preamble correctly (the .svelte host file is not processed
 * by the React plugin, which causes the "can't detect preamble" error).
 */
import { createRoot } from 'react-dom/client';
import React from 'react';
import { Player } from '@remotion/player';
import { HelloWorld, DataViz, PortalOverview, ModuleSlide, PortalSlideshow, MODULE_DATA } from '@repo/remotion-compositions';

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

export function mountReactPlayer(
  container: HTMLElement,
  comp: CompositionMeta,
  lang: Lang,
): { unmount: () => void } {
  let component: AnyComp;
  let inputProps: Record<string, unknown> = {};

  switch (comp.id) {
    case 'HelloWorld':
      component = HelloWorld as AnyComp;
      break;
    case 'DataViz':
      component = DataViz as AnyComp;
      break;
    case 'PortalOverview':
      component = PortalOverview as AnyComp;
      inputProps = { lang };
      break;
    case 'PortalSlideshow':
      component = PortalSlideshow as AnyComp;
      inputProps = { lang };
      break;
    default:
      if (comp.group === 'modules' && comp.moduleKey) {
        component = ModuleSlide as AnyComp;
        inputProps = { module: MODULE_DATA[comp.moduleKey], lang, index: 0, total: 1 };
      } else {
        throw new Error(`Unknown composition: ${comp.id}`);
      }
  }

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
