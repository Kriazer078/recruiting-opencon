import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';
import type { NextStepContent } from '../../homepage/data/flows';
import './next-step.css';

const Ctx = createContext<(content: NextStepContent) => void>(() => {});

/** Screens that are not built yet open this sheet: it states the next step from the TZ scenario. Nothing is submitted. */
export function NextStepProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<NextStepContent | null>(null);
  const open = useCallback((c: NextStepContent) => setContent(c), []);

  return (
    <Ctx.Provider value={open}>
      {children}
      <Dialog.Root open={content !== null} onOpenChange={(v) => !v && setContent(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="ns-overlay" />
          <Dialog.Content className="ns">
            <div className="ns__head">
              <Dialog.Title className="ns__title">{content?.title}</Dialog.Title>
              <Dialog.Close className="ns__close" aria-label="Закрыть">
                <X size={20} strokeWidth={1.75} aria-hidden="true" />
              </Dialog.Close>
            </div>
            {content?.steps && (
              <ol className="ns__steps">
                {content.steps.map((s, i) => (
                  <li key={s}>
                    <span className="num" aria-hidden="true">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
            <Dialog.Description className="ns__text">{content?.text}</Dialog.Description>
            <Dialog.Close className="btn btn--ink ns__ok">Понятно</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Ctx.Provider>
  );
}

export const useNextStep = () => useContext(Ctx);
