import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface HelloWorldProps {
  title?: string;
  subtitle?: string;
  bgColor?: string;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({
  title = 'Remotion x SvelteKit',
  subtitle = 'Video generation in your monorepo',
  bgColor = '#6366f1',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Title animation: slide up + fade in
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 30], [40, 0], { extrapolateRight: 'clamp' });

  // Subtitle: delayed entrance
  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleY = interpolate(frame, [20, 50], [30, 0], { extrapolateRight: 'clamp' });

  // Background pulse
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], { extrapolateRight: 'clamp' });

  // Progress bar
  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill
      style={{
        background: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Animated background circles */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          transform: `scale(${scale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          transform: `scale(${1 / scale})`,
        }}
      />

      {/* Title */}
      <h1
        style={{
          color: 'white',
          fontSize: 72,
          fontWeight: 900,
          margin: 0,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: 28,
          marginTop: 20,
          textAlign: 'center',
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        {subtitle}
      </p>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 6,
          width: `${progress * 100}%`,
          background: 'rgba(255,255,255,0.4)',
          borderRadius: '0 3px 3px 0',
        }}
      />

      {/* Frame counter (for debugging) */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          color: 'rgba(255,255,255,0.4)',
          fontSize: 14,
        }}
      >
        Frame {frame}/{durationInFrames}
      </div>
    </AbsoluteFill>
  );
};
