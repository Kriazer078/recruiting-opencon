import { ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { flows, useNextStep } from '../components/NextStep';
import './partners.css';

const partnerFacts = [
  { term: 'Свой код', text: 'Кандидат указывает его при регистрации; код может покрыть месяц размещения анкеты.' },
  { term: 'Свой логотип', text: 'Отель видит на анкете, от кого пришёл кандидат.' },
  { term: 'Свои собеседования', text: 'Переводите на встречах своих кандидатов и получайте отчёт по выездам.' },
];

export function PartnersBand() {
  const openNext = useNextStep();
  return (
    <section id="partners" className="partners" aria-labelledby="partners-title">
      <div className="container partners__grid">
        <div className="partners__intro">
          <h2 id="partners-title" className="t-h2">
            Агентствам и партнёрам
          </h2>
          <p className="t-body t-muted">
            Ведите своих кандидатов на платформе. Чужие анкеты, документы и комнаты партнёру недоступны.
          </p>
          <Button variant="secondary" icon={<ArrowRight size={18} />} onClick={() => openNext(flows.partner)}>
            Стать партнёром
          </Button>
        </div>
        <dl className="partners__facts">
          {partnerFacts.map((f) => (
            <div key={f.term}>
              <dt className="t-h3">{f.term}</dt>
              <dd className="t-small t-muted">{f.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
