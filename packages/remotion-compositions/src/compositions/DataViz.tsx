import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface BarData {
  label: string;
  value: number;
  color: string;
}

const DATA: BarData[] = [
  { label: 'Q1', value: 65, color: '#6366f1' },
  { label: 'Q2', value: 80, color: '#8b5cf6' },
  { label: 'Q3', value: 55, color: '#a78bfa' },
  { label: 'Q4', value: 95, color: '#c4b5fd' },
];

export const DataViz: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            color: 'white',
            fontSize: 48,
            marginBottom: 48,
            fontWeight: 700,
          }}
        >
          Quarterly Results
        </h2>
        <div
          style={{
            display: 'flex',
            gap: 32,
            alignItems: 'flex-end',
            height: 200,
          }}
        >
          {DATA.map((bar, i) => {
            const delay = i * 10;
            const heightPercent = interpolate(
              frame,
              [delay, delay + 30],
              [0, bar.value],
              { extrapolateRight: 'clamp' }
            );
            const opacity = interpolate(
              frame,
              [delay, delay + 20],
              [0, 1],
              { extrapolateRight: 'clamp' }
            );
            return (
              <div
                key={bar.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  opacity,
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: `${heightPercent * 2}px`,
                    background: bar.color,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                  }}
                />
                <span
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 18,
                  }}
                >
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
