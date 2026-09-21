import { Ticket, UserAccount } from '../types/ticket';

// Initial tickets starts completely empty for production website hosting
export const INITIAL_TICKETS: Ticket[] = [];

export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-john-lester',
    name: 'John Lester Fuertes',
    email: 'john.fuertes@company.com',
    role: 'agent',
    department: 'IT Administration',
    avatarInitials: 'JF'
  }
];

export const CANNED_RESPONSES = [
  {
    id: 'can-1',
    title: 'Password / MFA Reset Instructions',
    body: 'We have initiated a temporary access reset for your account. Please check your recovery email and complete authentication within 15 minutes.'
  },
  {
    id: 'can-2',
    title: 'Network / VPN Troubleshooting',
    body: 'Please disconnect and reconnect to the corporate gateway. If connection issues persist, restart your network adapter.'
  },
  {
    id: 'can-3',
    title: 'Hardware Assessment & Replacement',
    body: 'Your replacement device is being prepared. You can pick it up at the IT Support Desk or confirm your remote delivery address.'
  }
];
