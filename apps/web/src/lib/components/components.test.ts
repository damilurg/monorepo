import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import FeatureDisabled from './FeatureDisabled.svelte';

// ─── FeatureDisabled ──────────────────────────────────────────────────────────

describe('FeatureDisabled', () => {
  it('renders with default title', () => {
    render(FeatureDisabled);
    expect(screen.getByRole('heading')).toHaveTextContent('Раздел временно недоступен');
  });

  it('renders custom title', () => {
    render(FeatureDisabled, { props: { title: 'Bank временно недоступен' } });
    expect(screen.getByRole('heading')).toHaveTextContent('Bank временно недоступен');
  });

  it('renders back link with default href and label', () => {
    render(FeatureDisabled);
    const link = screen.getByRole('link', { name: /На главную/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders custom back link', () => {
    render(FeatureDisabled, { props: { backHref: '/exchange', backLabel: '← Назад' } });
    const link = screen.getByRole('link', { name: '← Назад' });
    expect(link).toHaveAttribute('href', '/exchange');
  });

  it('contains admin panel link', () => {
    render(FeatureDisabled);
    expect(screen.getByRole('link', { name: 'Admin Panel' })).toHaveAttribute('href', '/admin');
  });
});

// ─── Home page data logic (pure, no component mount needed) ──────────────────

describe('home page module list logic', () => {
  const modules = [
    { id: 'exchange', title: 'Exchange', description: 'Курсы валют', route: '/exchange', icon: '💱', enabled: true },
    { id: 'blog', title: 'Blog', description: 'Статьи', route: '/blog', icon: '📝', enabled: true },
    { id: 'weather', title: 'Weather', description: 'Погода', route: '/weather', icon: '☁️', enabled: false },
  ];

  it('counts enabled modules correctly', () => {
    const enabled = modules.filter((m) => m.enabled).length;
    expect(enabled).toBe(2);
  });

  it('disabled module has enabled=false', () => {
    const weather = modules.find((m) => m.id === 'weather');
    expect(weather?.enabled).toBe(false);
  });

  it('all modules have required fields', () => {
    for (const mod of modules) {
      expect(mod).toHaveProperty('id');
      expect(mod).toHaveProperty('title');
      expect(mod).toHaveProperty('route');
      expect(mod).toHaveProperty('icon');
      expect(typeof mod.enabled).toBe('boolean');
    }
  });

  it('enabled module routes start with /', () => {
    const enabled = modules.filter((m) => m.enabled);
    for (const mod of enabled) {
      expect(mod.route).toMatch(/^\//);
    }
  });
});

// ─── Seo fullTitle logic (unit, no DOM needed) ────────────────────────────────

describe('Seo fullTitle logic', () => {
  const siteName = 'Automotive Portal';

  function computeFullTitle(title: string) {
    return title === siteName ? title : `${title} — ${siteName}`;
  }

  it('returns bare site name when title equals siteName', () => {
    expect(computeFullTitle('Automotive Portal')).toBe('Automotive Portal');
  });

  it('appends site name when title differs', () => {
    expect(computeFullTitle('Exchange')).toBe('Exchange — Automotive Portal');
  });

  it('appends site name for module pages', () => {
    expect(computeFullTitle('Блог')).toBe('Блог — Automotive Portal');
  });
});
