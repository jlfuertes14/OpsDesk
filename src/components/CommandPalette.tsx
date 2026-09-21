import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  Inbox,
  ArrowRight,
  LifeBuoy
} from 'lucide-react';
import { Ticket, QueueId } from '../types/ticket';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onOpenNewTicket: () => void;
  onSelectQueue: (queue: QueueId) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tickets,
  onSelectTicket,
  onOpenNewTicket,
  onSelectQueue,
  onToggleTheme,
  isDarkMode
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = allItems[selectedIndex];
        if (selected) {
          selected.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const ticketItems = tickets
    .filter((t) => 
      t.id.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.requester.name.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((t) => ({
      id: `ticket-${t.id}`,
      type: 'Ticket',
      title: t.title,
      subtitle: `${t.id} · ${t.requester.name}`,
      icon: LifeBuoy,
      action: () => {
        onSelectTicket(t);
        onClose();
      }
    }));

  const systemActions = [
    {
      id: 'action-new',
      type: 'Action',
      title: 'Create New Ticket',
      subtitle: 'Open new ticket dialog',
      icon: Plus,
      action: () => {
        onClose();
        onOpenNewTicket();
      }
    },
    {
      id: 'action-inbox',
      type: 'View',
      title: 'Go to Inbox',
      subtitle: 'View all open tickets',
      icon: Inbox,
      action: () => {
        onSelectQueue('all_open');
        onClose();
      }
    },
    {
      id: 'action-theme',
      type: 'Theme',
      title: isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      subtitle: 'Toggle theme appearance',
      icon: isDarkMode ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      }
    }
  ].filter((a) => !q || a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q));

  const allItems = [...ticketItems, ...systemActions];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Search and command menu"
      >
        {/* Search input field */}
        <div className="h-14 border-b border-[var(--border-color)] px-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tickets, people, or commands…"
            className="flex-1 bg-transparent text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none"
            spellCheck={false}
          />
          <kbd className="px-2 py-0.5 text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-page)] border border-[var(--border-color)] rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[var(--border-color)]">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">
              No matching tickets or commands found.
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isSelected
                      ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className="w-4 h-4 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                    <div className="truncate">
                      <div className="font-medium text-[var(--text-primary)] truncate">{item.title}</div>
                      <div className="text-xs text-[var(--text-muted)] truncate">{item.subtitle}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 ml-2" aria-hidden="true" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
