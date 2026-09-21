import React from 'react';
import { 
  Check, 
  ChevronRight, 
  Inbox
} from 'lucide-react';
import { Ticket, Priority, Status } from '../types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketIds: Set<string>;
  activeTicketId: string | null;
  onSelectTicket: (ticket: Ticket) => void;
  onToggleCheck: (ticketId: string, e: React.MouseEvent) => void;
  focusedIndex: number;
  onOpenNewTicket?: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicketIds,
  activeTicketId,
  onSelectTicket,
  onToggleCheck,
  focusedIndex,
  onOpenNewTicket
}) => {
  if (tickets.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16 text-center select-none">
        <div className="w-12 h-12 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] flex items-center justify-center text-[var(--text-muted)] mb-4">
          <Inbox className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-medium text-[var(--text-primary)]">No tickets yet</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-sm mb-4">
          Get started by dispatching your first support ticket or service request.
        </p>
        {onOpenNewTicket && (
          <button
            type="button"
            onClick={onOpenNewTicket}
            className="h-10 px-4 rounded-lg bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-medium text-sm transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
          >
            Create Your First Ticket
          </button>
        )}
      </div>
    );
  }

  const renderPriority = (p: Priority) => {
    switch (p) {
      case 'P1':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--badge-urgent-text)]">
            <span className="w-2 h-2 rounded-full bg-rose-500" aria-hidden="true" />
            <span>Urgent</span>
          </span>
        );
      case 'P2':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--badge-amber-text)]">
            <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
            <span>High</span>
          </span>
        );
      case 'P3':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-neutral-400" aria-hidden="true" />
            <span>Medium</span>
          </span>
        );
      case 'P4':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span>Low</span>
          </span>
        );
    }
  };

  const renderStatus = (s: Status) => {
    switch (s) {
      case 'triage':
        return <span className="text-xs text-[var(--text-secondary)]">Open</span>;
      case 'in_progress':
        return <span className="text-xs text-blue-500 font-medium">In Progress</span>;
      case 'waiting_user':
        return <span className="text-xs text-[var(--text-muted)]">Waiting on user</span>;
      case 'escalated':
        return <span className="text-xs text-orange-500 font-medium">Escalated</span>;
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--badge-success-text)] font-medium">
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Resolved</span>
          </span>
        );
      case 'closed':
        return <span className="text-xs text-[var(--text-muted)]">Closed</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto" role="feed" aria-label="Tickets list">
      <div className="divide-y divide-[var(--border-color)]">
        {tickets.map((ticket, index) => {
          const isChecked = selectedTicketIds.has(ticket.id);
          const isActive = activeTicketId === ticket.id;
          const isFocused = focusedIndex === index;

          return (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTicket(ticket);
                }
              }}
              tabIndex={0}
              role="article"
              aria-selected={isActive}
              className={`group flex items-center justify-between px-6 py-4 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive 
                  ? 'bg-[var(--highlight-row)] border-l-4 border-l-blue-500 pl-5' 
                  : isFocused
                  ? 'bg-[var(--bg-hover)]'
                  : 'hover:bg-[var(--bg-hover)] bg-transparent'
              }`}
            >
              {/* Left Side: Checkbox, ID, Title & Meta */}
              <div className="flex items-start gap-4 min-w-0 flex-1 pr-6">
                {/* Checkbox */}
                <div 
                  className="pt-1 flex items-center" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onToggleCheck(ticket.id, e as unknown as React.MouseEvent)}
                    aria-label={`Select ticket ${ticket.id}`}
                    className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-panel)] text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs text-[var(--text-muted)] font-medium">
                      {ticket.id}
                    </span>
                    {renderPriority(ticket.priority)}
                    <span className="text-xs text-[var(--text-muted)]">·</span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {ticket.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-medium text-[var(--text-primary)] leading-snug group-hover:text-blue-500 transition-colors truncate">
                    {ticket.title}
                  </h2>

                  {/* Requester & Subtitle */}
                  <p className="text-sm text-[var(--text-muted)] truncate">
                    {ticket.requester.name} ({ticket.requester.department})
                  </p>
                </div>
              </div>

              {/* Right Side: Status & Arrow */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  {renderStatus(ticket.status)}
                  <div className="text-xs text-[var(--text-muted)] font-mono tabular-nums mt-0.5">
                    {ticket.slaRemainingMinutes > 0 && ticket.status !== 'resolved' ? (
                      <span>{ticket.slaRemainingMinutes}m SLA</span>
                    ) : ticket.status === 'resolved' ? (
                      <span className="text-[var(--badge-success-text)] font-medium">Done</span>
                    ) : (
                      <span className="text-[var(--badge-urgent-text)] font-medium">Overdue</span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors hidden sm:block" aria-hidden="true" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
