export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export type Status = 
  | 'triage'
  | 'in_progress'
  | 'waiting_user'
  | 'escalated'
  | 'resolved'
  | 'closed';

export type Category = 
  | 'Identity & Access'
  | 'Endpoint & Hardware'
  | 'Network & VPN'
  | 'Cloud Infrastructure'
  | 'Security Incident'
  | 'Dev & Tooling';

export type UserRole = 'agent' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarInitials: string;
}

export interface DeviceTelemetry {
  hostname: string;
  os: string;
  serialNumber: string;
  mdmStatus: 'Compliant' | 'Enforced' | 'Attention Required';
  ipAddress: string;
  location: string;
}

export interface TicketComment {
  id: string;
  author: {
    name: string;
    email: string;
    role: 'requester' | 'agent' | 'system';
  };
  timestamp: string;
  content: string;
  isInternal: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  category: Category;
  requester: {
    name: string;
    email: string;
    department: string;
    avatarInitials: string;
  };
  assignee: {
    name: string;
    email: string;
    tier: 'Tier 1 Support' | 'Tier 2 Systems' | 'Tier 3 Infrastructure' | 'SecOps';
  } | null;
  createdAt: string;
  updatedAt: string;
  slaTargetMinutes: number;
  slaRemainingMinutes: number;
  tags: string[];
  device: DeviceTelemetry;
  comments: TicketComment[];
  resolutionNotes?: string;
}

export type QueueId = 
  | 'all_open'
  | 'my_assigned'
  | 'p1_critical'
  | 'sla_risk'
  | 'identity_iam'
  | 'security'
  | 'resolved';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  undoAction?: () => void;
}
