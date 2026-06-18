import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

export interface ModuleData {
  icon: string;
  colorFrom: string;
  colorTo: string;
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
  featuresRu: string[];
  featuresEn: string[];
  api: string;
  route: string;
}

export interface ModuleSlideProps {
  module: ModuleData;
  lang?: 'ru' | 'en';
  index?: number;
  total?: number;
}

export const MODULE_DATA: Record<string, ModuleData> = {
  exchange: {
    icon: '💱',
    colorFrom: '#059669',
    colorTo: '#0d9488',
    titleRu: 'Обменник',
    titleEn: 'Exchange',
    descRu: 'Курсы валют и конвертация в реальном времени',
    descEn: 'Real-time currency rates and conversion',
    featuresRu: ['Список 30+ валют', 'Выбор базовой валюты', 'SSR загрузка данных'],
    featuresEn: ['30+ currencies list', 'Base currency selector', 'SSR data loading'],
    api: 'api.frankfurter.dev',
    route: '/exchange',
  },
  blog: {
    icon: '📝',
    colorFrom: '#7c3aed',
    colorTo: '#6d28d9',
    titleRu: 'Блог',
    titleEn: 'Blog',
    descRu: 'Статьи, публикации и детальные страницы постов',
    descEn: 'Articles, publications and detailed post pages',
    featuresRu: ['Список публикаций', 'Детальная страница', 'SSR рендеринг'],
    featuresEn: ['Post listing', 'Detail page /blog/[id]', 'Full SSR rendering'],
    api: 'jsonplaceholder.typicode.com',
    route: '/blog',
  },
  content: {
    icon: '💡',
    colorFrom: '#d97706',
    colorTo: '#b45309',
    titleRu: 'Контент',
    titleEn: 'Content',
    descRu: 'Цитаты и вдохновляющий контент с поиском',
    descEn: 'Quotes and inspiring content with search',
    featuresRu: ['Генерация контента', 'Поиск по тексту', 'SSR + пагинация'],
    featuresEn: ['Content delivery', 'Full-text search', 'SSR + pagination'],
    api: 'dummyjson.com',
    route: '/content',
  },
  weather: {
    icon: '🌤',
    colorFrom: '#2563eb',
    colorTo: '#1d4ed8',
    titleRu: 'Погода',
    titleEn: 'Weather',
    descRu: 'Текущая погода и прогноз для любого города',
    descEn: 'Current weather and forecast for any city',
    featuresRu: ['Текущие условия', '7-дневный прогноз', 'Смена города'],
    featuresEn: ['Current conditions', '7-day forecast', 'City switcher'],
    api: 'api.open-meteo.com',
    route: '/weather',
  },
  cars: {
    icon: '🚗',
    colorFrom: '#dc2626',
    colorTo: '#b91c1c',
    titleRu: 'Авто',
    titleEn: 'Cars',
    descRu: 'VIN-декодер — узнайте всё об автомобиле',
    descEn: 'VIN decoder — find out everything about a vehicle',
    featuresRu: ['Поиск по VIN', 'Марка и модель', 'Год и двигатель'],
    featuresEn: ['VIN lookup', 'Make & model', 'Year & engine'],
    api: 'vpic.nhtsa.dot.gov',
    route: '/cars',
  },
  maps: {
    icon: '🗺️',
    colorFrom: '#16a34a',
    colorTo: '#15803d',
    titleRu: 'Карты',
    titleEn: 'Maps',
    descRu: 'Интерактивные карты OSM с маркерами и поиском',
    descEn: 'Interactive OSM maps with markers and search',
    featuresRu: ['OpenStreetMap', 'Маркеры мест', 'Поиск локаций'],
    featuresEn: ['OpenStreetMap tiles', 'Place markers', 'Location search'],
    api: 'OpenStreetMap / Nominatim',
    route: '/maps',
  },
};

export const ModuleSlide: React.FC<ModuleSlideProps> = ({
  module,
  lang = 'ru',
  index = 0,
  total = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const title = lang === 'ru' ? module.titleRu : module.titleEn;
  const desc = lang === 'ru' ? module.descRu : module.descEn;
  const features = lang === 'ru' ? module.featuresRu : module.featuresEn;
  const apiLabel = lang === 'ru' ? 'API' : 'API';
  const routeLabel = lang === 'ru' ? 'Маршрут' : 'Route';

  const iconScale = spring({ frame, fps, config: { damping: 10, stiffness: 80, mass: 1 } });
  const contentOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: 'clamp' });
  const contentX = interpolate(frame, [10, 35], [60, 0], { extrapolateRight: 'clamp' });

  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill
      style={{
        background: '#0f172a',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {/* Left accent panel */}
      <div
        style={{
          width: 480,
          background: `linear-gradient(160deg, ${module.colorFrom}, ${module.colorTo})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: 60,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 140,
            transform: `scale(${iconScale})`,
            lineHeight: 1,
          }}
        >
          {module.icon}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 36, fontWeight: 700, textAlign: 'center' }}>
          {title}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, textAlign: 'center', lineHeight: 1.5 }}>
          {module.route}
        </div>
      </div>

      {/* Right content panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 80px 80px 72px',
          opacity: contentOpacity,
          transform: `translateX(${contentX}px)`,
        }}
      >
        <p style={{ color: '#94a3b8', fontSize: 30, lineHeight: 1.6, margin: '0 0 52px 0' }}>
          {desc}
        </p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 52 }}>
          {features.map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: module.colorFrom,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#e2e8f0', fontSize: 26 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Meta badges */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '10px 20px',
              color: '#94a3b8',
              fontSize: 18,
            }}
          >
            <span style={{ color: '#64748b', marginRight: 8 }}>{apiLabel}:</span>
            <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{module.api}</span>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '10px 20px',
              color: '#94a3b8',
              fontSize: 18,
            }}
          >
            <span style={{ color: '#64748b', marginRight: 8 }}>{routeLabel}:</span>
            <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{module.route}</span>
          </div>
        </div>
      </div>

      {/* Slide counter */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 48,
          color: 'rgba(255,255,255,0.3)',
          fontSize: 22,
          fontFamily: 'monospace',
        }}
      >
        {index + 1} / {total}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 4,
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${module.colorFrom}, ${module.colorTo})`,
        }}
      />
    </AbsoluteFill>
  );
};
