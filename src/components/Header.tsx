import React from 'react';
import { 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  LifeBuoy
} from 'lucide-react';
import { UserAccount } from '../types/ticket';

interface HeaderProps {
  currentUser: UserAccount;
  onOpenAccountModal: () => void;
  onOpenNewModal: () => void;
  onOpenCommandPalette: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  openTicketsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAccountModal,
  onOpenNewModal,
  onOpenCommandPalette,
  isDarkMode,
  onToggleTheme,
  openTicketsCount
}) => {
  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-panel)] px-6 flex items-center justify-between select-none shrink-0 z-20">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-bold">
          <LifeBuoy className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
            Helpdesk
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-normal">
            {openTicketsCount}&nbsp;open tickets
          </p>
        </div>
      </div>

      {/* Center Search / Command Palette trigger */}
      <div className="flex-1 max-w-md mx-6 hidden sm:block">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full h-10 px-3.5 rounded-lg bg-[var(--bg-page)] border border-[var(--border-color)] hover:border-[var(--text-secondary)] text-sm text-[var(--text-secondary)] flex items-center justify-between transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Search tickets or press Command K"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
            <span>Search tickets, people, or tags…</span>
          </div>
          <kbd className="px-2 py-0.5 text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-md">
            ⌘&nbsp;K
          </kbd>
        </button>
      </div>

      {/* Right Actions & User Account */}
      <div className="flex items-center gap-3">
        {/* User Account Button */}
        <button
          type="button"
          onClick={onOpenAccountModal}
          className="h-10 px-3 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-hover)] text-left flex items-center gap-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={`Logged in as ${currentUser.name}. Click to switch user account`}
        >
          <div className="w-6 h-6 rounded-full bg-[var(--avatar-bg)] text-[var(--avatar-text)] font-semibold flex items-center justify-center text-xs">
            {currentUser.avatarInitials}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-medium text-[var(--text-primary)] leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] leading-tight">
              {currentUser.role === 'agent' ? 'IT Staff' : 'User'}
            </div>
          </div>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="h-10 w-10 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        {/* New Ticket */}
        <button
          type="button"
          onClick={onOpenNewModal}
          className="h-10 px-4 rounded-lg bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 font-medium text-sm flex items-center gap-2 transition-opacity focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
          aria-label="Create new ticket"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          <span>New Ticket</span>
        </button>
      </div>
    </header>
  );
};
