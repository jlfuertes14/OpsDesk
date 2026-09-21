import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Priority, Category, Ticket, UserAccount } from '../types/ticket';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onCreateTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'slaRemainingMinutes' | 'comments'>) => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateTicket
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Endpoint & Hardware');
  const [priority, setPriority] = useState<Priority>('P3');
  const [description, setDescription] = useState('');
  const [requesterName, setRequesterName] = useState(currentUser.name);
  const [requesterEmail, setRequesterEmail] = useState(currentUser.email);

  useEffect(() => {
    if (isOpen) {
      setRequesterName(currentUser.name);
      setRequesterEmail(currentUser.email);
    }
  }, [isOpen, currentUser]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !requesterName.trim() || !description.trim()) {
      return;
    }

    const slaMap: Record<Priority, number> = {
      P1: 60,
      P2: 180,
      P3: 480,
      P4: 1440
    };

    onCreateTicket({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'triage',
      slaTargetMinutes: slaMap[priority],
      tags: ['General'],
      requester: {
        name: requesterName.trim(),
        email: requesterEmail.trim() || currentUser.email,
        department: currentUser.department || 'General Staff',
        avatarInitials: requesterName.slice(0, 2).toUpperCase()
      },
      assignee: null,
      device: {
        hostname: 'WORKSTATION-' + Math.floor(100 + Math.random() * 900),
        os: 'macOS / Windows',
        serialNumber: 'SN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        mdmStatus: 'Compliant',
        ipAddress: '10.42.0.100',
        location: 'HQ'
      }
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-ticket-title"
    >
      <div 
        className="w-full max-w-xl bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="h-16 border-b border-[var(--border-color)] px-6 flex items-center justify-between shrink-0">
          <h2 id="new-ticket-title" className="text-base font-semibold text-[var(--text-primary)]">
            Create New Ticket
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="incident-title" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Subject *
            </label>
            <input
              id="incident-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cannot connect to VPN from home…"
              className="w-full h-11 px-3.5 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          {/* Requester Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="requester-name" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Requester Name *
              </label>
              <input
                id="requester-name"
                type="text"
                required
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="e.g. Alex Rivers…"
                className="w-full h-11 px-3.5 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="requester-email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Email Address
              </label>
              <input
                id="requester-email"
                type="email"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                placeholder="alex@acme.corp…"
                className="w-full h-11 px-3.5 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="incident-priority" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Priority
              </label>
              <select
                id="incident-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full h-11 px-3 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                <option value="P1">Urgent (P1)</option>
                <option value="P2">High (P2)</option>
                <option value="P3">Medium (P3)</option>
                <option value="P4">Low (P4)</option>
              </select>
            </div>

            <div>
              <label htmlFor="incident-category" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Category
              </label>
              <select
                id="incident-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full h-11 px-3 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                <option value="Endpoint & Hardware">Hardware &amp; Laptop</option>
                <option value="Identity & Access">Access &amp; Login</option>
                <option value="Network & VPN">Network &amp; VPN</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="Dev & Tooling">Software &amp; Tools</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="incident-description" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Description *
            </label>
            <textarea
              id="incident-description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What seems to be the problem? Include any error messages or steps you tried…"
              className="w-full p-3.5 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 text-sm font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-xl hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
