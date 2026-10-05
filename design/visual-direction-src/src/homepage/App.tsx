import { useCallback, useState } from 'react';
import { NextStepProvider } from './components/NextStep';
import type { Role } from './data/content';
import { SiteHeader } from './sections/SiteHeader';
import { Hero } from './sections/Hero';
import { ProfileChapter } from './sections/ProfileChapter';
import { VacanciesChapter } from './sections/VacanciesChapter';
import { OnePlaceChapter } from './sections/OnePlaceChapter';
import { InterviewChapter } from './sections/InterviewChapter';
import { DocumentsChapter } from './sections/DocumentsChapter';
import { NewsAndAds } from './sections/NewsAndAds';
import { PartnersBand } from './sections/PartnersBand';
import { SiteFooter } from './sections/SiteFooter';

function initialRole(): Role {
  return new URLSearchParams(window.location.search).get('role') === 'hotel' ? 'hotel' : 'candidate';
}

export function App() {
  const [role, setRole] = useState<Role>(initialRole);

  const changeRole = useCallback((next: Role) => {
    setRole(next);
    const params = new URLSearchParams(window.location.search);
    if (next === 'hotel') params.set('role', 'hotel');
    else params.delete('role');
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  }, []);

  return (
    <NextStepProvider>
      <a className="skip-link" href="#main">
        Перейти к содержанию
      </a>
      <div id="top" />
      <SiteHeader role={role} onRoleChange={changeRole} />
      <main id="main">
        <Hero role={role} onRoleChange={changeRole} />
        <ProfileChapter />
        <VacanciesChapter />
        <OnePlaceChapter />
        <InterviewChapter />
        <DocumentsChapter />
        <NewsAndAds />
        <PartnersBand />
      </main>
      <SiteFooter onRoleChange={changeRole} />
    </NextStepProvider>
  );
}
