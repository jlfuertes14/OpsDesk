import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, RotateCcw, X } from 'lucide-react';
import { ToastMessage } from '../types/ticket';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />;
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />;
            case 'error':
              return <XCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />;
            case 'info':
            default:
              return <Info className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />;
          }
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto p-3 bg-[var(--bg-surface)] border border-[var(--border-contrast)] rounded-xs shadow-xl flex items-start justify-between gap-3 text-xs text-[var(--text-primary)] animate-fadeIn"
            role="status"
          >
            <div className="flex items-start gap-2.5">
              {getIcon()}
              <div>
                <div className="font-medium text-[var(--text-primary)]">{toast.title}</div>
                {toast.description && (
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{toast.description}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {toast.undoAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.undoAction?.();
                    onDismiss(toast.id);
                  }}
                  className="h-6 px-2 text-[11px] font-mono text-blue-400 hover:text-blue-300 border border-blue-900/60 bg-blue-950/30 rounded-xs flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <RotateCcw className="w-2.5 h-2.5" aria-hidden="true" />
                  <span>Undo</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="h-6 w-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center rounded-xs focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Dismiss notification"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
