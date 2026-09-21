import React from 'react';
import { 
  Search, 
  CheckSquare, 
  CheckCircle, 
  X
} from 'lucide-react';
import { Priority, Status } from '../types/ticket';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriority: Priority | 'ALL';
  onPriorityChange: (priority: Priority | 'ALL') => void;
  selectedStatus: Status | 'ALL';
  onStatusChange: (status: Status | 'ALL') => void;
  selectedCount: number;
  totalVisibleCount: number;
  onClearSelection: () => void;
  onBulkResolve: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  selectedCount,
  totalVisibleCount,
  onClearSelection,
  onBulkResolve
}) => {
  return (
    <div className="border-b border-[var(--border-color)] bg-[var(--bg-panel)] px-6 py-3 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <label htmlFor="ticket-search-input" className="sr-only">
            Search tickets
          </label>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" aria-hidden="true" />
          <input
            id="ticket-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, requester, or ID…"
            className="w-full h-10 pl-9 pr-8 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-2 focus-visible:ring-blue-500"
            spellCheck={false}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Minimal Dropdowns */}
        <div className="flex items-center gap-2.5">
          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value as Priority | 'ALL')}
            aria-label="Filter by priority"
            className="h-10 px-3 bg-[var(--bg-page)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="P1">Urgent (P1)</option>
            <option value="P2">High (P2)</option>
            <option value="P3">Medium (P3)</option>
            <option value="P4">Low (P4)</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as Status | 'ALL')}
            aria-label="Filter by status"
            className="h-10 px-3 bg-[var(--bg-page)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="triage">New / Triage</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_user">Waiting on User</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Bulk action toolbar when tickets are checked */}
      {selectedCount > 0 && (
        <div 
          className="bg-[var(--bg-hover)] border border-[var(--border-color)] px-4 py-2 rounded-lg flex items-center justify-between"
          role="region"
          aria-label="Bulk actions toolbar"
        >
          <div className="flex items-center gap-2 text-sm">
            <CheckSquare className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <span className="font-semibold text-[var(--text-primary)] tabular-nums">
              {selectedCount}&nbsp;of&nbsp;{totalVisibleCount}
            </span>
            <span className="text-[var(--text-secondary)]">selected</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBulkResolve}
              className="h-8 px-3 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-medium text-xs rounded-md flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 hover:opacity-90"
            >
              <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Mark as Resolved</span>
            </button>

            <button
              type="button"
              onClick={onClearSelection}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
