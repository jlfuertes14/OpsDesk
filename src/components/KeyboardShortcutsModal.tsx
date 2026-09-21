import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'j / k', desc: 'Navigate down / up the incident triage list' },
    { key: 'Enter / Space', desc: 'Inspect highlighted incident details in side pane' },
    { key: 'x', desc: 'Toggle checkbox selection on highlighted incident' },
    { key: 'e', desc: 'Quick-resolve highlighted incident' },
    { key: 'N', desc: 'Dispatch new incident ticket' },
    { key: '⌘ K / Ctrl+K', desc: 'Open command palette & global search' },
    { key: '?', desc: 'Display this keyboard shortcuts cheatsheet' },
    { key: 'Esc', desc: 'Close open modal, inspection drawer, or clear search' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs contain-overscroll"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-contrast)] rounded-xs shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-11 border-b border-[var(--border-hairline)] px-4 flex items-center justify-between bg-[var(--bg-elevated)]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <h2 id="shortcuts-modal-title" className="text-xs uppercase font-mono tracking-wider font-semibold text-[var(--text-primary)]">
              Keyboard Shortcuts Cheatsheet
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-6 w-6 rounded-xs border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close shortcuts modal"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 divide-y divide-[var(--border-hairline)]">
          {shortcuts.map((s) => (
            <div key={s.key} className="py-2 flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)]">{s.desc}</span>
              <kbd className="px-2 py-0.5 text-[11px] font-mono font-medium text-[var(--text-primary)] bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded-xs shrink-0 ml-3">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-[var(--border-hairline)] bg-[var(--bg-root)] text-center text-[11px] font-mono text-[var(--text-muted)]">
          Press <kbd className="px-1 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xs">Esc</kbd> anytime to dismiss
        </div>
      </div>
    </div>
  );
};
