import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface PortalOverviewProps {
  lang?: 'ru' | 'en';
}

const TRANSLATIONS = {
  ru: {
    badge: 'Automotive Portal',
    title: 'Всё в одном месте',
    subtitle: 'Единый портал для курсов валют, погоды, блога, VIN-декодера и многого другого',
    modules: [
      { icon: '💱', label: 'Обменник' },
      { icon: '📝', label: 'Блог' },
      { icon: '💡', label: 'Контент' },
      { icon: '🌤', label: 'Погода' },
      { icon: '🚗', label: 'Авто' },
      { icon: '🗺️', label: 'Карты' },
    ],
  },
  en: {
    badge: 'Automotive Portal',
    title: 'Everything in one place',
    subtitle: 'Unified portal for exchange rates, weather, blog, VIN decoder and much more',
    modules: [
      { icon: '💱', label: 'Exchange' },
      { icon: '📝', label: 'Blog' },
      { icon: '💡', label: 'Content' },
      { icon: '🌤', label: 'Weather' },
      { icon: '🚗', label: 'Cars' },
      { icon: '🗺️', label: 'Maps' },
    ],
  },
};

export const PortalOverview: React.FC<PortalOverviewProps> = ({ lang = 'ru' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = TRANSLATIONS[lang];

  const badgeOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const badgeY = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: 'clamp' });

  const titleOpacity = interpolate(frame, [15, 45], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [15, 45], [40, 0], { extrapolateRight: 'clamp' });

  const subtitleOpacity = interpolate(frame, [35, 65], [0, 1], { extrapolateRight: 'clamp' });

  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          top: -200,
          left: -200,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)',
          bottom: -100,
          right: -100,
        }}
      />

      {/* Badge */}
      <div
        style={{
          opacity: badgeOpacity,
          transform: `translateY(${badgeY}px)`,
          background: 'rgba(99,102,241,0.2)',
          border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: 9999,
          padding: '8px 24px',
          color: '#a5b4fc',
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: 32,
        }}
      >
        {t.badge}
      </div>

      {/* Title */}
      <h1
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          color: 'white',
          fontSize: 88,
          fontWeight: 900,
          margin: 0,
          textAlign: 'center',
          lineHeight: 1.1,
          textShadow: '0 4px 40px rgba(99,102,241,0.4)',
        }}
      >
        {t.title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          opacity: subtitleOpacity,
          color: 'rgba(148,163,184,0.9)',
          fontSize: 32,
          marginTop: 24,
          textAlign: 'center',
          maxWidth: 900,
          lineHeight: 1.5,
        }}
      >
        {t.subtitle}
      </p>

      {/* Module icons grid */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          marginTop: 72,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 1000,
        }}
      >
        {t.modules.map((mod, i) => {
          const delay = 70 + i * 10;
          const modScale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 100, mass: 0.8 },
          });
          const modOpacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <div
              key={mod.label}
              style={{
                opacity: modOpacity,
                transform: `scale(${modScale})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 24,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                }}
              >
                {mod.icon}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 20, fontWeight: 500 }}>
                {mod.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 4,
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #6366f1, #10b981)',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </AbsoluteFill>
  );
};
