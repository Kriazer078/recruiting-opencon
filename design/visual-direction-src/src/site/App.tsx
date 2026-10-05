import { useCallback, useEffect, useRef, useState } from 'react';
import type { Role } from './data/site';
import type { Region } from './data/vacancies';
import { NextStepProvider } from './components/NextStep';
import { Header } from './components/Header';
import { DEFAULT_HERO, Hero, HeroVariantBar, isHeroVariant, type HeroVariant } from './components/Hero';
import { Vacancies } from './components/Vacancies';
import { Browse, Employers, Faq, How, NewsAds, Partners } from './components/Sections';
import { Footer } from './components/Footer';

function initialRole(): Role {
  try {
    return new URLSearchParams(window.location.search).get('role') === 'hotel' ? 'hotel' : 'candidate';
  } catch {
    return 'candidate';
  }
}

function readParam(name: string) {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

function setParam(name: string, value: string | null) {
  try {
    const p = new URLSearchParams(window.location.search);
    if (value === null) p.delete(name);
    else p.set(name, value);
    const q = p.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${q ? `?${q}` : ''}${window.location.hash}`);
  } catch {
    // sandboxed frames may refuse history changes
  }
}

export function App() {
  const [role, setRole] = useState<Role>(initialRole);
  const [variant, setVariant] = useState<HeroVariant>(() => {
    const v = readParam('hero');
    return isHeroVariant(v) ? v : DEFAULT_HERO;
  });
  // the comparison bar is a review tool: visible only when the address asks for it
  const [comparing] = useState(() => readParam('hero') !== null || readParam('compare') === '1');
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState<{ query: string; region: Region | 'all' }>({ query: '', region: 'all' });
  const [compact, setCompact] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const vacRef = useRef<HTMLElement>(null);

  // the compact header search appears once the hero search leaves the screen
  useEffect(() => {
    const el = searchRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setCompact(!e?.isIntersecting), { rootMargin: '-72px 0px 0px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const changeRole = useCallback((r: Role) => {
    setRole(r);
    setParam('role', r === 'hotel' ? 'hotel' : null);
  }, []);

  const changeVariant = useCallback((v: HeroVariant) => {
    setVariant(v);
    setParam('hero', v);
  }, []);

  const toVacancies = () => {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    vacRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  };

  const runSearch = (q = draft, region = filter.region) => {
    setFilter({ query: q, region });
    toVacancies();
  };

  const pick = (query: string, region: Region | 'all') => {
    setDraft(query);
    setFilter({ query, region });
  };

  return (
    <NextStepProvider>
      <a className="skip" href="#main">Перейти к содержанию</a>
      <div id="top" />
      <Header
        role={role}
        onRole={changeRole}
        compact={compact}
        query={draft}
        onQuery={setDraft}
        onSearch={() => runSearch()}
      />
      <main id="main">
        <Hero
          ref={searchRef}
          variant={variant}
          role={role}
          onRole={changeRole}
          query={draft}
          onQuery={setDraft}
          region={filter.region}
          onRegion={(region) => setFilter((f) => ({ ...f, region }))}
          onSearch={(q) => runSearch(q ?? draft)}
        />
        <Vacancies ref={vacRef} role={role} query={filter.query} region={filter.region} onFilter={pick} />
        <Browse onPick={pick} />
        <How />
        <Employers />
        <NewsAds />
        <Faq />
        <Partners />
      </main>
      <Footer onRole={changeRole} />
      {comparing && <HeroVariantBar value={variant} onChange={changeVariant} />}
    </NextStepProvider>
  );
}
