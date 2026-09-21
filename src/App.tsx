import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { QueueSidebar } from './components/QueueSidebar';
import { FilterBar } from './components/FilterBar';
import { TicketList } from './components/TicketList';
import { TicketDetailPane } from './components/TicketDetailPane';
import { NewTicketModal } from './components/NewTicketModal';
import { CommandPalette } from './components/CommandPalette';
import { AccountModal } from './components/AccountModal';
import { ToastContainer } from './components/ToastContainer';
import { INITIAL_TICKETS, DEFAULT_ACCOUNTS } from './data/mockTickets';
import { Ticket, QueueId, Priority, Status, ToastMessage, UserAccount } from './types/ticket';

export const App: React.FC = () => {
  // Accounts State: defaults to John Lester Fuertes
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('opsdesk_accounts_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_ACCOUNTS;
      }
    }
    return DEFAULT_ACCOUNTS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('opsdesk_current_user_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_ACCOUNTS[0];
      }
    }
    return DEFAULT_ACCOUNTS[0];
  });

  // Tickets State (starts completely empty, zero mock entries)
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('opsdesk_production_tickets_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TICKETS;
      }
    }
    return INITIAL_TICKETS;
  });

  const [activeQueue, setActiveQueue] = useState<QueueId>('all_open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'ALL'>('ALL');
  const [selectedTicketIds, setSelectedTicketIds] = useState<Set<string>>(new Set());
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist accounts & tickets
  useEffect(() => {
    localStorage.setItem('opsdesk_accounts_v4', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('opsdesk_current_user_v4', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('opsdesk_production_tickets_v4', JSON.stringify(tickets));
  }, [tickets]);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDarkMode]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Queue Counts calculation
  const queueCounts = useMemo(() => {
    const open = tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed');
    const myCount = currentUser.role === 'agent'
      ? open.filter((t) => t.assignee?.email === currentUser.email).length
      : open.filter((t) => t.requester.email === currentUser.email).length;

    return {
      all_open: open.length,
      my_assigned: myCount,
      p1_critical: open.filter((t) => t.priority === 'P1').length,
      sla_risk: open.filter((t) => t.slaRemainingMinutes <= 60 && t.slaRemainingMinutes > 0).length,
      identity_iam: open.filter((t) => t.category === 'Identity & Access').length,
      security: open.filter((t) => t.category === 'Security Incident').length,
      resolved: tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length
    };
  }, [tickets, currentUser]);

  // Filtered Tickets
  const visibleTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Queue filtering
      if (activeQueue === 'all_open' && (ticket.status === 'resolved' || ticket.status === 'closed')) return false;
      
      if (activeQueue === 'my_assigned') {
        if (currentUser.role === 'agent' && ticket.assignee?.email !== currentUser.email) return false;
        if (currentUser.role === 'user' && ticket.requester.email !== currentUser.email) return false;
      }

      if (activeQueue === 'p1_critical' && ticket.priority !== 'P1') return false;
      if (activeQueue === 'resolved' && ticket.status !== 'resolved' && ticket.status !== 'closed') return false;

      // Priority filter
      if (selectedPriority !== 'ALL' && ticket.priority !== selectedPriority) return false;

      // Status filter
      if (selectedStatus !== 'ALL' && ticket.status !== selectedStatus) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = ticket.id.toLowerCase().includes(q);
        const matchesTitle = ticket.title.toLowerCase().includes(q);
        const matchesRequester = ticket.requester.name.toLowerCase().includes(q) || ticket.requester.email.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesRequester) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, activeQueue, selectedPriority, selectedStatus, searchQuery, currentUser]);

  const activeTicket = useMemo(() => {
    return tickets.find((t) => t.id === activeTicketId) || null;
  }, [tickets, activeTicketId]);

  // Account Management
  const handleSelectAccount = (account: UserAccount) => {
    setCurrentUser(account);
    addToast({
      type: 'info',
      title: 'Switched User Profile',
      description: `Active as ${account.name} (${account.role === 'agent' ? 'IT Staff' : 'User'})`
    });
  };

  const handleCreateAccount = (data: Omit<UserAccount, 'id' | 'avatarInitials'>) => {
    const newAccount: UserAccount = {
      ...data,
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      avatarInitials: data.name.slice(0, 2).toUpperCase()
    };

    setAccounts((prev) => [...prev, newAccount]);
    setCurrentUser(newAccount);
    addToast({
      type: 'success',
      title: 'Profile Created',
      description: `Logged in as ${newAccount.name}`
    });
  };

  // Ticket Operations
  const handleCreateTicket = (
    newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'slaRemainingMinutes' | 'comments'>
  ) => {
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `INC-${nextNum}`;

    const newTicket: Ticket = {
      ...newTicketData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaRemainingMinutes: newTicketData.slaTargetMinutes,
      comments: []
    };

    setTickets((prev) => [newTicket, ...prev]);
    setActiveTicketId(newId);
    addToast({
      type: 'success',
      title: `Ticket ${newId} Created`,
      description: `Target SLA: ${newTicketData.slaTargetMinutes}m`
    });
  };

  const handleUpdateStatus = (ticketId: string, newStatus: Status) => {
    const previousTickets = [...tickets];
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
    );

    addToast({
      type: 'info',
      title: `Ticket Updated`,
      description: `Status changed to ${newStatus}`,
      undoAction: () => setTickets(previousTickets)
    });
  };

  const handleUpdatePriority = (ticketId: string, newPriority: Priority) => {
    const previousTickets = [...tickets];
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, priority: newPriority, updatedAt: new Date().toISOString() } : t))
    );

    addToast({
      type: 'info',
      title: `Priority Updated`,
      description: `Changed to ${newPriority}`,
      undoAction: () => setTickets(previousTickets)
    });
  };

  const handleAssignToMe = (ticketId: string) => {
    const previousTickets = [...tickets];
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: t.status === 'triage' ? 'in_progress' : t.status,
              assignee: {
                name: currentUser.name,
                email: currentUser.email,
                tier: 'Tier 1 Support'
              },
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );

    addToast({
      type: 'success',
      title: 'Ticket Assigned',
      description: `Assigned to ${currentUser.name}`,
      undoAction: () => setTickets(previousTickets)
    });
  };

  const handleAddComment = (ticketId: string, content: string, isInternal: boolean) => {
    const newComment = {
      id: 'c-' + Math.random().toString(36).substring(2, 9),
      author: {
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role === 'agent' ? ('agent' as const) : ('requester' as const)
      },
      timestamp: new Date().toISOString(),
      content,
      isInternal
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          comments: [...t.comments, newComment]
        };
      })
    );

    addToast({
      type: 'success',
      title: isInternal ? 'Internal Note Saved' : 'Reply Sent',
      description: `Logged by ${currentUser.name}`
    });
  };

  // Bulk Operations
  const handleToggleCheck = (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTicketIds((prev) => {
      const next = new Set(prev);
      if (next.has(ticketId)) {
        next.delete(ticketId);
      } else {
        next.add(ticketId);
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedTicketIds(new Set());
  };

  const handleBulkResolve = () => {
    const prev = [...tickets];
    setTickets((all) =>
      all.map((t) =>
        selectedTicketIds.has(t.id)
          ? {
              ...t,
              status: 'resolved',
              resolutionNotes: `Resolved by ${currentUser.name}.`
            }
          : t
      )
    );
    addToast({
      type: 'success',
      title: `Bulk Resolved`,
      description: `${selectedTicketIds.size} tickets marked as resolved`,
      undoAction: () => setTickets(prev)
    });
    setSelectedTicketIds(new Set());
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (isInput || isNewModalOpen || isCommandPaletteOpen || isAccountModalOpen) {
        return;
      }

      if (e.key === 'Escape') {
        if (activeTicketId) {
          setActiveTicketId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewModalOpen, isCommandPaletteOpen, isAccountModalOpen, activeTicketId]);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] antialiased overflow-hidden">
      {/* Top Header with Account Switcher */}
      <Header
        currentUser={currentUser}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        openTicketsCount={queueCounts.all_open}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Queue Navigation */}
        <QueueSidebar
          activeQueue={activeQueue}
          onSelectQueue={(q) => {
            setActiveQueue(q);
            setFocusedIndex(0);
          }}
          counts={queueCounts}
          currentUser={currentUser}
        />

        {/* Center: List & Filter Region */}
        <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg-page)]">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedCount={selectedTicketIds.size}
            totalVisibleCount={visibleTickets.length}
            onClearSelection={handleClearSelection}
            onBulkResolve={handleBulkResolve}
          />

          <TicketList
            tickets={visibleTickets}
            selectedTicketIds={selectedTicketIds}
            activeTicketId={activeTicketId}
            onSelectTicket={(ticket) => setActiveTicketId(ticket.id)}
            onToggleCheck={handleToggleCheck}
            focusedIndex={focusedIndex}
            onOpenNewTicket={() => setIsNewModalOpen(true)}
          />
        </main>

        {/* Right: Clean Ticket Detail Pane */}
        {activeTicket && (
          <TicketDetailPane
            ticket={activeTicket}
            currentUser={currentUser}
            onClose={() => setActiveTicketId(null)}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePriority={handleUpdatePriority}
            onAddComment={handleAddComment}
            onAssignToMe={handleAssignToMe}
          />
        )}
      </div>

      {/* Modals */}
      <NewTicketModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        currentUser={currentUser}
        onCreateTicket={handleCreateTicket}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        currentUser={currentUser}
        accounts={accounts}
        onSelectAccount={handleSelectAccount}
        onCreateAccount={handleCreateAccount}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tickets={tickets}
        onSelectTicket={(t) => {
          setActiveTicketId(t.id);
          setActiveQueue('all_open');
        }}
        onOpenNewTicket={() => setIsNewModalOpen(true)}
        onSelectQueue={(q) => setActiveQueue(q)}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        isDarkMode={isDarkMode}
      />

      {/* Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
