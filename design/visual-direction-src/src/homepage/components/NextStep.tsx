import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';
import { Button } from './Button';
import type { NextStepContent } from '../data/flows';
import './next-step.css';

export { flows, type NextStepContent } from '../data/flows';

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
