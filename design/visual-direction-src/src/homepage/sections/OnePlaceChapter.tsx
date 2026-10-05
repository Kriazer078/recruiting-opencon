import { useId, useReducer } from 'react';
import { BellRing, Check, RotateCcw } from 'lucide-react';
import { Chapter } from '../components/Chapter';
import { DemoTag } from '../components/Media';
import { SlotMeter } from '../components/Indicators';
import { Button } from '../components/Button';
import { demoOffers, type Offer } from '../data/process';
import { rules } from '../data/rules';
import { cx } from '../lib/cx';
import './one-place.css';

type OfferState = 'new' | 'approved' | 'chosen' | 'declined' | 'closed';

interface State {
  offers: Record<string, OfferState>;
  confirming: string | null;
  events: { id: number; hotel: string; text: string }[];
}

type Action =
  | { type: 'approve' | 'withdraw' | 'ask' | 'confirm'; id: string }
  | { type: 'cancel' | 'reset' };

const city = (o: Offer) => o.hotel.split(',')[0] ?? o.hotel;
const byId = (id: string) => demoOffers.find((o) => o.id === id)!;

const initial: State = {
  offers: Object.fromEntries(demoOffers.map((o) => [o.id, 'new' as OfferState])),
  confirming: null,
  events: [],
};

let eventSeq = 0;
function log(state: State, entries: { hotel: string; text: string }[]): State['events'] {
  return [...entries.map((e) => ({ ...e, id: ++eventSeq })), ...state.events].slice(0, 5);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'approve': {
      const used = Object.values(state.offers).filter((s) => s === 'approved').length;
      if (used >= rules.activeApprovals) return state; // BR-01: the fourth approval is not created
      const o = byId(action.id);
      return {
        ...state,
        offers: { ...state.offers, [action.id]: 'approved' },
        events: log(state, [
          { hotel: city(o), text: `Кандидат одобрил предложение. Собеседование — не раньше чем через ${rules.interviewMinLeadHours} часов.` },
        ]),
      };
    }
    case 'withdraw': {
      const o = byId(action.id);
      return {
        ...state,
        offers: { ...state.offers, [action.id]: 'new' },
        events: log(state, [{ hotel: city(o), text: 'Кандидат отозвал согласие. Слот освобождён.' }]),
      };
    }
    case 'ask':
      return { ...state, confirming: action.id };
    case 'cancel':
      return { ...state, confirming: null };
    case 'confirm': {
      // BR-02: one place; every other active offer is declined automatically
      const offers: State['offers'] = {};
      const entries: { hotel: string; text: string }[] = [];
      demoOffers.forEach((o) => {
        const s = state.offers[o.id];
        if (o.id === action.id) {
          offers[o.id] = 'chosen';
          entries.push({ hotel: city(o), text: 'Кандидат выбрал ваш отель. Подтвердите сотрудника или назначьте повтор.' });
        } else if (s === 'approved') {
          offers[o.id] = 'declined';
          entries.push({ hotel: city(o), text: 'Кандидат выбрал другое место. Отказ отправлен автоматически.' });
        } else {
          offers[o.id] = 'closed';
        }
      });
      return { offers, confirming: null, events: log(state, entries) };
    }
    case 'reset':
      return initial;
  }
}

export function OnePlaceChapter() {
  const [state, dispatch] = useReducer(reducer, initial);
  const fullNoteId = useId();
  const statuses = Object.values(state.offers);
  const used = statuses.filter((s) => s === 'approved').length;
  const chosen = statuses.includes('chosen');
  const full = used >= rules.activeApprovals && !chosen;
  const othersApproved = (id: string) => statuses.filter((s) => s === 'approved').length - (state.offers[id] === 'approved' ? 1 : 0);

  return (
    <Chapter
      id="one-place"
      title="Три согласия. Одно место."
      lead="Предложений может быть сколько угодно. Одобрить — то есть пойти на собеседование — можно не больше трёх одновременно. Подтвердить можно только один отель."
      sides={{
        candidate: `У каждого предложения есть срок — ${rules.offerLifetimeHours} часа. За ${rules.offerReminderHours} часов до конца придёт напоминание.`,
        hotel: 'Кандидат, который выбрал ваш отель, не может подтвердить второй. Остальным отелям система сама отправляет отказ.',
      }}
    >
      <div className="oneplace">
        <div className="oneplace__bar">
          <SlotMeter used={chosen ? 0 : used} />
          <DemoTag>Интерактивный пример</DemoTag>
        </div>

        <p id={fullNoteId} className={cx('oneplace__note t-small', full && 'is-full')} aria-live="polite">
          {chosen
            ? 'Место выбрано. Остальные предложения закрыты.'
            : full
              ? `Все ${rules.activeApprovals} слота заняты. Новый освободится, если вы отзовёте согласие, отель откажет или истекут ${rules.offerLifetimeHours} часа.`
              : 'Одобрите до трёх предложений. В примере считаем, что собеседования по ним уже прошли.'}
        </p>

        <ul className="offers">
          {demoOffers.map((o) => {
            const s = state.offers[o.id]!;
            const soon = o.hoursLeft <= rules.offerReminderHours;
            return (
              <li key={o.id} className={cx('offer', `offer--${s}`)}>
                <div className="offer__what">
                  <span className="offer__slot" aria-hidden="true" />
                  <p className="offer__role">{o.role}</p>
                  <p className="offer__hotel t-small">{o.hotel}</p>
                </div>
                <div className="offer__when t-small">
                  <span>{o.origin}</span>
                  {s === 'new' || s === 'approved' ? (
                    <span className={cx('t-num', soon && 'offer__soon')}>
                      {soon && <BellRing size={14} aria-hidden="true" />}
                      осталось {o.hoursLeft} ч из {rules.offerLifetimeHours}
                    </span>
                  ) : null}
                </div>
                <div className="offer__action">
                  {s === 'new' && (
                    <Button
                      variant="secondary"
                      disabled={full}
                      aria-describedby={full ? fullNoteId : undefined}
                      onClick={() => dispatch({ type: 'approve', id: o.id })}
                    >
                      Одобрить
                    </Button>
                  )}
                  {s === 'approved' && state.confirming !== o.id && (
                    <div className="offer__pair">
                      <button type="button" className="offer__text-btn" onClick={() => dispatch({ type: 'withdraw', id: o.id })}>
                        Отозвать
                      </button>
                      <Button onClick={() => dispatch({ type: 'ask', id: o.id })}>Выбрать это место</Button>
                    </div>
                  )}
                  {s === 'chosen' && (
                    <span className="offer__result offer__result--chosen">
                      <Check size={16} aria-hidden="true" /> Место выбрано
                    </span>
                  )}
                  {s === 'declined' && <span className="offer__result">Отказ отправлен</span>}
                  {s === 'closed' && <span className="offer__result">Предложение закрыто</span>}
                </div>

                {state.confirming === o.id && (
                  <div className="offer__confirm" role="alertdialog" aria-label="Подтверждение выбора места">
                    <p className="t-small">
                      <strong>Выбрать {city(o)}?</strong>{' '}
                      {othersApproved(o.id) > 0
                        ? `Ещё ${othersApproved(o.id)} ${othersApproved(o.id) === 1 ? 'отель получит' : 'отеля получат'} отказ. `
                        : ''}
                      Второе место подтвердить будет нельзя; отменить выбор может только оператор.
                    </p>
                    <div className="offer__pair">
                      <button type="button" className="offer__text-btn" onClick={() => dispatch({ type: 'cancel' })}>
                        Отмена
                      </button>
                      <Button autoFocus onClick={() => dispatch({ type: 'confirm', id: o.id })}>
                        Подтвердить выбор
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <section className="hotel-feed" aria-labelledby="hotel-feed-title">
          <div className="hotel-feed__head">
            <h3 id="hotel-feed-title" className="t-label">
              Что в это время получают отели
            </h3>
            {(state.events.length > 0 || chosen) && (
              <button type="button" className="offer__text-btn" onClick={() => dispatch({ type: 'reset' })}>
                <RotateCcw size={14} aria-hidden="true" /> Начать заново
              </button>
            )}
          </div>
          {state.events.length === 0 ? (
            <p className="hotel-feed__empty t-small">Одобрите предложение — здесь появится уведомление для отеля.</p>
          ) : (
            <ol className="hotel-feed__list" aria-live="polite">
              {state.events.map((e) => (
                <li key={e.id}>
                  <span className="hotel-feed__hotel">{e.hotel}</span>
                  <span className="t-small">{e.text}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </Chapter>
  );
}
