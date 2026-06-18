import React from 'react';
import { Composition } from 'remotion';
import { HelloWorld } from './compositions/HelloWorld.js';
import { DataViz } from './compositions/DataViz.js';
import { PortalOverview } from './compositions/PortalOverview.js';
import { ModuleSlide, MODULE_DATA } from './compositions/ModuleSlide.js';
import { PortalSlideshow } from './compositions/PortalSlideshow.js';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Original compositions */}
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Remotion x SvelteKit',
          subtitle: 'Video generation in your monorepo',
          bgColor: '#6366f1',
        }}
      />
      <Composition
        id="DataViz"
        component={DataViz}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* Portal Overview — 6s intro (ru) */}
      <Composition
        id="PortalOverview"
        component={PortalOverview}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ lang: 'ru' }}
      />
      {/* Portal Overview (en) */}
      <Composition
        id="PortalOverviewEn"
        component={PortalOverview}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ lang: 'en' }}
      />

      {/* Individual module slides (ru) */}
      {Object.entries(MODULE_DATA).map(([moduleId, moduleData]) => (
        <Composition
          key={`${moduleId}-ru`}
          id={`Module_${moduleId}_ru`}
          component={ModuleSlide}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ module: moduleData, lang: 'ru', index: 0, total: 1 }}
        />
      ))}

      {/* Individual module slides (en) */}
      {Object.entries(MODULE_DATA).map(([moduleId, moduleData]) => (
        <Composition
          key={`${moduleId}-en`}
          id={`Module_${moduleId}_en`}
          component={ModuleSlide}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ module: moduleData, lang: 'en', index: 0, total: 1 }}
        />
      ))}

      {/* Full slideshow — all modules (30s, ru) */}
      <Composition
        id="PortalSlideshow"
        component={PortalSlideshow}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ lang: 'ru' }}
      />
      {/* Full slideshow (en) */}
      <Composition
        id="PortalSlideshowEn"
        component={PortalSlideshow}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ lang: 'en' }}
      />
    </>
  );
};
