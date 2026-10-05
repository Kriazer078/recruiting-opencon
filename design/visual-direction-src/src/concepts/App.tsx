import { useCallback, useEffect, useState } from 'react';
import type { Role } from '../homepage/data/content';
import { NextStepProvider } from './shared/NextStep';
import { directions, type DirectionId } from './shared/directions';
import { Portal } from './portal/Portal';
import { Guide } from './guide/Guide';
import { Scenes } from './scenes/Scenes';

function readParams(): { direction: DirectionId; role: Role } {
  const p = new URLSearchParams(window.location.search);
  const d = p.get('d');
  return {
    direction: directions.some((x) => x.id === d) ? (d as DirectionId) : 'portal',
    role: p.get('role') === 'hotel' ? 'hotel' : 'candidate',
  };
}

function writeParams(direction: DirectionId, role: Role) {
  const p = new URLSearchParams(window.location.search);
  p.set('d', direction);
  if (role === 'hotel') p.set('role', 'hotel');
  else p.delete('role');
  window.history.replaceState(null, '', `${window.location.pathname}?${p.toString()}`);
}

export function App() {
  const [{ direction, role }, setState] = useState(readParams);

  useEffect(() => {
    document.documentElement.dataset.direction = direction;
    writeParams(direction, role);
  }, [direction, role]);

  const changeRole = useCallback((next: Role) => setState((s) => ({ ...s, role: next })), []);
  const changeDirection = (next: DirectionId) => {
    setState((s) => ({ ...s, direction: next }));
    window.scrollTo({ top: 0 });
  };

  const current = directions.find((d) => d.id === direction) ?? directions[0]!;

  return (
    <NextStepProvider>
      <nav className="compare-bar" aria-label="Сравнение направлений главной">
        <p className="compare-bar__title">
          Направления главной 2.0 <span>· для сравнения, не утверждены</span>
        </p>
        <ol className="compare-bar__list">
          {directions.map((d, i) => (
            <li key={d.id}>
              <a
                href={`?d=${d.id}`}
                aria-current={d.id === direction ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  changeDirection(d.id);
                }}
              >
                <span aria-hidden="true">{i + 1}</span> {d.name}
              </a>
            </li>
          ))}
        </ol>
        <p className="compare-bar__model">{current.model}</p>
      </nav>
      <div className={`concept concept--${direction}`} key={direction}>
        {direction === 'portal' && <Portal role={role} onRoleChange={changeRole} />}
        {direction === 'guide' && <Guide role={role} onRoleChange={changeRole} />}
        {direction === 'scenes' && <Scenes role={role} onRoleChange={changeRole} />}
      </div>
    </NextStepProvider>
  );
}
