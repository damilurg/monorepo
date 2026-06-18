import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { PortalOverview } from './PortalOverview.js';
import { ModuleSlide, MODULE_DATA } from './ModuleSlide.js';

export interface PortalSlideshowProps {
  lang?: 'ru' | 'en';
}

const MODULE_ORDER = ['exchange', 'blog', 'content', 'weather', 'cars', 'maps'] as const;

// Durations (frames at 30fps)
const INTRO_DURATION = 180; // 6s
const SLIDE_DURATION = 120; // 4s each
// Total: 180 + 6*120 = 900 frames = 30s

export const PortalSlideshow: React.FC<PortalSlideshowProps> = ({ lang = 'ru' }) => {
  return (
    <AbsoluteFill style={{ background: '#0f172a' }}>
      {/* Intro */}
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <PortalOverview lang={lang} />
      </Sequence>

      {/* Module slides */}
      {MODULE_ORDER.map((moduleId, i) => {
        const moduleData = MODULE_DATA[moduleId];
        if (!moduleData) return null;
        return (
          <Sequence
            key={moduleId}
            from={INTRO_DURATION + i * SLIDE_DURATION}
            durationInFrames={SLIDE_DURATION}
          >
            <ModuleSlide
              module={moduleData}
              lang={lang}
              index={i}
              total={MODULE_ORDER.length}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
