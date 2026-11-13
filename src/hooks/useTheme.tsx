import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'onspree-theme';

function initial(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage blocked — fall back to the system setting */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'light', toggle: () => {} });
export const useTheme = () => useContext(Ctx);

/**
 * Night-mode state. The choice is remembered per browser (localStorage, a
 * strictly functional preference — no consent needed); without a saved
 * choice the system light/dark setting is followed. index.html applies
 * the theme before first paint to avoid a flash.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) || initial());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0B0F12' : '#F3F2E8');
  }, [theme]);

  // Follow the OS setting until the visitor picks a theme explicitly.
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => {
      try {
        if (localStorage.getItem(KEY)) return;
      } catch {
        /* ignore */
      }
      setTheme(mql.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', on);
    return () => mql.removeEventListener('change', on);
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('theme-switching');
      window.setTimeout(() => root.classList.remove('theme-switching'), 500);
    }
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}
