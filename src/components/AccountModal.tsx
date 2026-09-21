import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { UserAccount, UserRole } from '../types/ticket';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  accounts: UserAccount[];
  onSelectAccount: (account: UserAccount) => void;
  onCreateAccount: (account: Omit<UserAccount, 'id' | 'avatarInitials'>) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accounts,
  onSelectAccount,
  onCreateAccount
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [department, setDepartment] = useState('Engineering');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onCreateAccount({
      name: name.trim(),
      email: email.trim(),
      role,
      department: department.trim()
    });

    setName('');
    setEmail('');
    setIsCreating(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-16 border-b border-[var(--border-color)] px-6 flex items-center justify-between shrink-0">
          <h2 id="account-modal-title" className="text-base font-semibold text-[var(--text-primary)]">
            {isCreating ? 'Create New Account' : 'Switch Account / Profile'}
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

        {/* Content */}
        {!isCreating ? (
          <div className="p-6 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Current Session
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-semibold flex items-center justify-center text-sm">
                  {currentUser.avatarInitials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {currentUser.email} · {currentUser.department}
                  </div>
                </div>
              </div>

              <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                currentUser.role === 'agent'
                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-color)]'
              }`}>
                {currentUser.role === 'agent' ? 'IT Staff' : 'User'}
              </span>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] pt-2">
              Available Profiles ({accounts.length})
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              {accounts.map((acc) => {
                const isCurrent = acc.id === currentUser.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      onSelectAccount(acc);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-500/5'
                        : 'border-[var(--border-color)] hover:bg-[var(--bg-hover)] bg-[var(--bg-panel)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--avatar-bg)] text-[var(--avatar-text)] font-medium flex items-center justify-center text-xs">
                        {acc.avatarInitials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">
                          {acc.name}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {acc.role === 'agent' ? 'IT Support Agent' : 'Employee'} · {acc.department}
                        </div>
                      </div>
                    </div>

                    {isCurrent && (
                      <Check className="w-4 h-4 text-blue-500" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="w-full h-11 border border-dashed border-[var(--border-color)] hover:border-[var(--text-secondary)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <UserPlus className="w-4 h-4" aria-hidden="true" />
                <span>Create New User Profile</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="p-6 space-y-4">
            <div>
              <label htmlFor="user-name-input" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Full Name *
              </label>
              <input
                id="user-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Smith…"
                className="w-full h-11 px-3.5 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="user-email-input" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Email Address *
              </label>
              <input
                id="user-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@company.com…"
                className="w-full h-11 px-3.5 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="user-role-select" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Account Role *
                </label>
                <select
                  id="user-role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-11 px-3 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                >
                  <option value="user">Regular Employee</option>
                  <option value="agent">IT Support Staff</option>
                </select>
              </div>

              <div>
                <label htmlFor="user-dept-input" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Department
                </label>
                <input
                  id="user-dept-input"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Sales, DevOps…"
                  className="w-full h-11 px-3.5 text-sm bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="h-10 px-4 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="h-10 px-5 text-sm font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-xl hover:opacity-90 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Save &amp; Switch
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
