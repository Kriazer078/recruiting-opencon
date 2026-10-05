import { useCallback, useEffect, useRef, useState } from 'react';
import type { Role } from './data/site';
import type { Region } from './data/vacancies';
import { NextStepProvider } from './components/NextStep';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
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

export function App() {
  const [role, setRole] = useState<Role>(initialRole);
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
    try {
      const p = new URLSearchParams(window.location.search);
      if (r === 'hotel') p.set('role', 'hotel');
      else p.delete('role');
      const q = p.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${q ? `?${q}` : ''}${window.location.hash}`);
    } catch {
      // sandboxed frames may refuse history changes
    }
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
    </NextStepProvider>
  );
}
