/**
 * Tiny hash router. Page routes start with "#/" (works on GitHub Pages
 * without server rewrites); plain anchors like "#services" stay on the
 * landing page and scroll to that section.
 */
import { useEffect, useState } from 'react';

export type LegalPage = 'privacy' | 'imprint' | 'terms' | 'legal' | 'trademarks';
export type Route =
  | { name: 'home'; anchor?: string }
  | { name: 'join' }
  | { name: 'login'; who?: 'rider' | 'business' }
  | { name: 'legal'; page: LegalPage };

const LEGAL: LegalPage[] = ['privacy', 'imprint', 'terms', 'legal', 'trademarks'];

export function parseHash(hash: string): Route {
  if (!hash.startsWith('#/')) return { name: 'home', anchor: hash.slice(1) || undefined };
  const [a, b] = hash.slice(2).split('/');
  if (a === 'join') return { name: 'join' };
  if (a === 'login') return { name: 'login', who: b === 'rider' || b === 'business' ? b : undefined };
  if ((LEGAL as string[]).includes(a)) return { name: 'legal', page: a as LegalPage };
  return { name: 'home' };
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const routeKey = (r: Route) => (r.name === 'home' ? 'home' : r.name === 'legal' ? `legal-${r.page}` : r.name === 'login' ? `login-${r.who ?? ''}` : r.name);
