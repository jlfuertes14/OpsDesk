import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { Ticket, Status, Priority, UserAccount } from '../types/ticket';

interface TicketDetailPaneProps {
  ticket: Ticket;
  currentUser: UserAccount;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: Status) => void;
  onUpdatePriority: (ticketId: string, priority: Priority) => void;
  onAddComment: (ticketId: string, content: string, isInternal: boolean) => void;
  onAssignToMe: (ticketId: string) => void;
}

export const TicketDetailPane: React.FC<TicketDetailPaneProps> = ({
  ticket,
  currentUser,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  onAddComment,
  onAssignToMe
}) => {
  const isAgent = currentUser.role === 'agent';
  const [isInternal, setIsInternal] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddComment(ticket.id, replyText.trim(), isAgent && isInternal);
    setReplyText('');
  };

  // Filter comments: regular users never see internal notes
  const visibleComments = ticket.comments.filter((c) => isAgent || !c.isInternal);

  return (
    <aside 
      className="w-full lg:w-[560px] shrink-0 border-l border-[var(--border-color)] bg-[var(--bg-panel)] flex flex-col h-full z-30 select-none overflow-hidden"
      aria-label={`Ticket ${ticket.id} details`}
    >
      {/* Pane Header */}
      <div className="h-16 border-b border-[var(--border-color)] px-6 flex items-center justify-between bg-[var(--bg-panel)] shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-[var(--text-secondary)]">
            {ticket.id}
          </span>
          <span className="text-sm text-[var(--text-muted)]">
            {ticket.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {ticket.status !== 'resolved' ? (
            <button
              type="button"
              onClick={() => onUpdateStatus(ticket.id, 'resolved')}
              className="h-9 px-3.5 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 font-medium text-xs rounded-lg flex items-center gap-1.5 transition-opacity focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Resolve</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onUpdateStatus(ticket.id, 'in_progress')}
              className="h-9 px-3.5 border border-[var(--border-color)] bg-[var(--bg-page)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reopen</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close ticket pane"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Triage Controls (Visible to Agent, or simplified for User) */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-page)] px-6 py-3 flex items-center justify-between gap-4 shrink-0 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Status */}
          {isAgent ? (
            <select
              value={ticket.status}
              onChange={(e) => onUpdateStatus(ticket.id, e.target.value as Status)}
              aria-label="Ticket status"
              className="h-9 px-3 text-xs bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            >
              <option value="triage">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_user">Waiting on User</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          ) : (
            <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--bg-panel)] border border-[var(--border-color)]">
              Status: <span className="text-[var(--text-primary)] capitalize">{ticket.status.replace('_', ' ')}</span>
            </div>
          )}

          {/* Priority */}
          {isAgent && (
            <select
              value={ticket.priority}
              onChange={(e) => onUpdatePriority(ticket.id, e.target.value as Priority)}
              aria-label="Ticket priority"
              className="h-9 px-3 text-xs bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            >
              <option value="P1">Urgent (P1)</option>
              <option value="P2">High (P2)</option>
              <option value="P3">Medium (P3)</option>
              <option value="P4">Low (P4)</option>
            </select>
          )}
        </div>

        {/* Assignee */}
        <div>
          {!ticket.assignee ? (
            isAgent ? (
              <button
                type="button"
                onClick={() => onAssignToMe(ticket.id)}
                className="text-xs text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
              >
                <UserCheck className="w-4 h-4" aria-hidden="true" />
                <span>Assign to Me</span>
              </button>
            ) : (
              <span className="text-xs text-[var(--text-muted)] italic">Awaiting Agent Assignment</span>
            )
          ) : (
            <span className="text-xs text-[var(--text-muted)]">
              Assigned to <strong className="text-[var(--text-secondary)] font-medium">{ticket.assignee.name}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Title */}
        <div className="pt-1">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] leading-tight select-text">
            {ticket.title}
          </h2>
        </div>

        {/* Requester & Device Summary */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--avatar-bg)] text-[var(--avatar-text)] font-semibold flex items-center justify-center text-sm">
              {ticket.requester.avatarInitials}
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {ticket.requester.name}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {ticket.requester.department} · {ticket.requester.email}
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-[var(--text-muted)]">
            <div>{ticket.device.hostname}</div>
            <div>{ticket.device.os.split(' ')[0]}</div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Description
          </div>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed select-text whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {/* Resolution Note if resolved */}
        {ticket.resolutionNotes && (
          <div className="p-4 rounded-xl bg-[var(--badge-success-bg)] border border-[var(--badge-success-border)] text-[var(--badge-success-text)] space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider">
              Resolution Note
            </div>
            <p className="text-sm select-text text-[var(--text-primary)]">
              {ticket.resolutionNotes}
            </p>
          </div>
        )}

        {/* Conversation Thread */}
        <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Activity &amp; Messages ({visibleComments.length})
          </div>

          {visibleComments.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] py-4 text-center">
              No replies yet on this ticket.
            </p>
          ) : (
            <div className="space-y-3">
              {visibleComments.map((comment) => (
                <div 
                  key={comment.id}
                  className={`p-4 rounded-xl border text-sm leading-relaxed select-text ${
                    comment.isInternal
                      ? 'bg-[var(--badge-amber-bg)] border-[var(--badge-amber-border)] text-[var(--text-primary)]'
                      : 'bg-[var(--bg-page)] border-[var(--border-color)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {comment.author.name} {comment.isInternal && <span className="text-[var(--badge-amber-text)] ml-1.5 font-normal">(Internal Note)</span>}
                    </span>
                    <time className="text-[var(--text-muted)]">
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-[var(--text-secondary)]">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reply Footer */}
      <div className="border-t border-[var(--border-color)] bg-[var(--bg-panel)] p-4 shrink-0 space-y-3">
        {/* Tabs for Public vs Internal (only agents can write internal notes) */}
        {isAgent && (
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setIsInternal(false)}
              className={`pb-1 border-b-2 transition-colors ${
                !isInternal 
                  ? 'border-blue-500 text-[var(--text-primary)]' 
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Public Reply
            </button>
            <button
              type="button"
              onClick={() => setIsInternal(true)}
              className={`pb-1 border-b-2 transition-colors ${
                isInternal 
                  ? 'border-amber-500 text-[var(--badge-amber-text)]' 
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Internal Note (IT Only)
            </button>
          </div>
        )}

        <form onSubmit={handleSendComment} className="space-y-3">
          <label htmlFor="ticket-reply-input" className="sr-only">Reply to ticket</label>
          <textarea
            id="ticket-reply-input"
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={
              isAgent && isInternal
                ? "Write a private note for the IT team…"
                : "Write a reply to this ticket…"
            }
            className="w-full p-3 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">
              Posting as <strong className="text-[var(--text-secondary)]">{currentUser.name}</strong>
            </span>

            <button
              type="submit"
              disabled={!replyText.trim()}
              className="h-9 px-4 text-sm font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-opacity focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAgent && isInternal ? "Save Internal Note" : "Send Reply"}</span>
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
};
