import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';
import { Button } from './Button';
import { range } from '../data/rules';
import './next-step.css';

export interface NextStepContent {
  title: string;
  steps?: string[];
  text: string;
}

const NextStepContext = createContext<(content: NextStepContent) => void>(() => {});

/**
 * Registration, login and other flows are not built yet. Instead of dead links,
 * actions open this dialog: it states what the next screen will be. No data is collected.
 */
export function NextStepProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<NextStepContent | null>(null);
  const open = useCallback((c: NextStepContent) => setContent(c), []);
  const value = useMemo(() => open, [open]);

  return (
    <NextStepContext.Provider value={value}>
      {children}
      <Dialog.Root open={content !== null} onOpenChange={(v) => !v && setContent(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog">
            <div className="dialog__head">
              <Dialog.Title className="t-h3">{content?.title}</Dialog.Title>
              <Dialog.Close className="dialog__close" aria-label="Закрыть">
                <X size={20} />
              </Dialog.Close>
            </div>
            {content?.steps && (
              <ol className="dialog__steps">
                {content.steps.map((s, i) => (
                  <li key={s}>
                    <span className="t-num" aria-hidden="true">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
            <Dialog.Description className="dialog__text t-small">{content?.text}</Dialog.Description>
            <div className="dialog__actions">
              <Dialog.Close asChild>
                <Button variant="quiet">Понятно</Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </NextStepContext.Provider>
  );
}

export const useNextStep = () => useContext(NextStepContext);

/** Shared flow descriptions, taken from the TZ scenarios. */
export const flows = {
  candidateSignup: {
    title: 'Создание анкеты',
    steps: [
      'Вход по номеру телефона с кодом или по ЭЦП',
      'Проверка живого лица',
      `Данные, опыт, языки и ${range(1, 3)} профессии`,
      `Четыре фото и видеопрезентация ${range(20, 40)} секунд`,
      'Документы, оплата месяца или код партнёра',
      'Проверка оператором и публикация',
    ],
    text: 'Экран регистрации — следующий этап проектирования. Эта версия главной не собирает данные.',
  },
  hotelSignup: {
    title: 'Регистрация отеля',
    steps: [
      'Сведения о компании и объекте',
      'Документы компании и ответственное лицо с правом подписи',
      'Проверка оператором Open Consulting',
      'Первая вакансия проходит модерацию',
      'Просмотр опубликованных анкет по вашим профессиям',
    ],
    text: 'Экран регистрации отеля — следующий этап проектирования. Эта версия главной не собирает данные.',
  },
  login: {
    title: 'Вход',
    text: 'Кандидат входит по телефону или ЭЦП, отель и партнёр — в свой кабинет. Экран входа проектируется следующим этапом.',
  },
  partner: {
    title: 'Партнёрский кабинет',
    steps: [
      'Заявка и проверка партнёра',
      'Собственный код и логотип',
      'Регистрация своих кандидатов',
      'Участие переводчиком в их собеседованиях',
      'Отчёты: анкеты, собеседования, выбранные отели, выезды',
    ],
    text: 'Форма заявки появится вместе с кабинетом партнёра.',
  },
  vacancy: {
    title: 'Карточка вакансии',
    text: 'Полная карточка вакансии и отклик — следующий экран. Откликнуться может кандидат с опубликованной анкетой, по одной из своих профессий.',
  },
  news: {
    title: 'Новость',
    text: 'Страница материала проектируется вместе с разделом новостей. Публикации ведёт оператор Open Consulting.',
  },
  language: {
    title: 'Язык интерфейса',
    text: 'Сайт будет на русском, казахском, турецком и английском. Переводы готовятся и проходят отдельное согласование.',
  },
  legal: {
    title: 'Документ',
    text: 'Юридический текст утверждает Open Consulting. Страница появится после согласования.',
  },
} satisfies Record<string, NextStepContent>;
