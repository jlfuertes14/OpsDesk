import React from 'react';
import { 
  Inbox, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2,
  LucideIcon
} from 'lucide-react';
import { QueueId, UserAccount } from '../types/ticket';

interface QueueItem {
  id: QueueId;
  label: string;
  icon: LucideIcon;
  count: number;
}

interface QueueSidebarProps {
  activeQueue: QueueId;
  onSelectQueue: (queueId: QueueId) => void;
  counts: Record<QueueId, number>;
  currentUser: UserAccount;
}

export const QueueSidebar: React.FC<QueueSidebarProps> = ({
  activeQueue,
  onSelectQueue,
  counts,
  currentUser
}) => {
  const isAgent = currentUser.role === 'agent';

  const queues: QueueItem[] = [
    {
      id: 'all_open',
      label: isAgent ? 'Inbox' : 'All Open Tickets',
      icon: Inbox,
      count: counts.all_open
    },
    {
      id: 'my_assigned',
      label: isAgent ? 'Assigned to Me' : 'My Requests',
      icon: UserCheck,
      count: counts.my_assigned
    },
    ...(isAgent ? [{
      id: 'p1_critical' as QueueId,
      label: 'Urgent',
      icon: AlertCircle,
      count: counts.p1_critical
    }] : []),
    {
      id: 'resolved',
      label: 'Resolved',
      icon: CheckCircle2,
      count: counts.resolved
    }
  ];

  return (
    <aside 
      className="w-56 shrink-0 border-r border-[var(--border-color)] bg-[var(--bg-panel)] flex flex-col justify-between py-4 select-none"
      aria-label="Ticket Views"
    >
      <div className="space-y-1 px-3">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Views
        </div>

        <nav className="space-y-1" aria-label="Views Navigation">
          {queues.map((item) => {
            const Icon = item.icon;
            const isActive = activeQueue === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectQueue(item.id)}
                className={`w-full h-10 px-3 rounded-lg flex items-center justify-between text-sm transition-colors text-left focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? 'bg-[var(--bg-active)] text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </div>

                <span className="tabular-nums font-mono text-xs text-[var(--text-muted)]">
                  {item.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-5 text-xs text-[var(--text-muted)] space-y-0.5">
        <div>Role: <strong className="text-[var(--text-secondary)] font-medium">{isAgent ? 'IT Staff' : 'Employee'}</strong></div>
        <div className="truncate text-[11px]">{currentUser.email}</div>
      </div>
    </aside>
  );
};
