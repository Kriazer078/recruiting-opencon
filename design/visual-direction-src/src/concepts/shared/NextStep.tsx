import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';
import type { NextStepContent } from '../../homepage/data/flows';

const Ctx = createContext<(content: NextStepContent) => void>(() => {});

/**
 * Same behaviour as on homepage v1: actions that lead to unbuilt screens explain the next step
 * instead of being dead links. Styling comes from the active direction's tokens (--dlg-*).
 */
export function NextStepProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<NextStepContent | null>(null);
  const open = useCallback((c: NextStepContent) => setContent(c), []);

  return (
    <Ctx.Provider value={open}>
      {children}
      <Dialog.Root open={content !== null} onOpenChange={(v) => !v && setContent(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="c-dialog-overlay" />
          <Dialog.Content className="c-dialog">
            <div className="c-dialog__head">
              <Dialog.Title className="c-dialog__title">{content?.title}</Dialog.Title>
              <Dialog.Close className="c-dialog__close" aria-label="Закрыть">
                <X size={20} aria-hidden="true" />
              </Dialog.Close>
            </div>
            {content?.steps && (
              <ol className="c-dialog__steps">
                {content.steps.map((s, i) => (
                  <li key={s}>
                    <span aria-hidden="true">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
            <Dialog.Description className="c-dialog__text">{content?.text}</Dialog.Description>
            <div className="c-dialog__actions">
              <Dialog.Close className="c-dialog__ok">Понятно</Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Ctx.Provider>
  );
}

export const useNextStep = () => useContext(Ctx);
