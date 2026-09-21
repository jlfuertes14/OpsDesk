import { createClient } from '@supabase/supabase-js';
import { Ticket, TicketComment, UserAccount, Status, Priority } from '../types/ticket';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qunqprgjxsuyvcugtzmr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// ==========================================
// Profiles (Users & Staff)
// ==========================================
export async function getProfiles(): Promise<UserAccount[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) return [];
    return data.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      department: p.department,
      avatarInitials: p.avatar_initials
    }));
  } catch (err) {
    console.warn('Supabase getProfiles failed, falling back to local:', err);
    return [];
  }
}

export async function saveProfile(account: Omit<UserAccount, 'id' | 'avatarInitials'>): Promise<UserAccount | null> {
  const avatarInitials = account.name.slice(0, 2).toUpperCase();
  if (!isSupabaseConfigured) {
    return {
      ...account,
      id: 'local-' + Math.random().toString(36).substring(2, 9),
      avatarInitials
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        name: account.name,
        email: account.email,
        role: account.role,
        department: account.department,
        avatar_initials: avatarInitials
      })
      .select()
      .single();

    if (error || !data) {
      console.warn('Failed to insert profile in Supabase:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      avatarInitials: data.avatar_initials
    };
  } catch (err) {
    console.warn('saveProfile error:', err);
    return null;
  }
}

// ==========================================
// Tickets API
// ==========================================
export async function getTickets(): Promise<Ticket[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('tickets')
      .select('*, ticket_comments(*)')
      .order('created_at', { ascending: false });

    if (ticketsError || !ticketsData) return [];

    return ticketsData.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      category: t.category,
      requester: t.requester,
      assignee: t.assignee,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      slaTargetMinutes: t.sla_target_minutes,
      slaRemainingMinutes: t.sla_remaining_minutes,
      tags: t.tags || [],
      device: t.device || {},
      resolutionNotes: t.resolution_notes,
      comments: (t.ticket_comments || []).map((c: any) => ({
        id: c.id,
        author: c.author,
        timestamp: c.created_at,
        content: c.content,
        isInternal: c.is_internal
      }))
    }));
  } catch (err) {
    console.warn('Supabase getTickets failed:', err);
    return [];
  }
}

export async function insertTicket(ticket: Ticket): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('tickets')
      .insert({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        requester: ticket.requester,
        assignee: ticket.assignee,
        sla_target_minutes: ticket.slaTargetMinutes,
        sla_remaining_minutes: ticket.slaRemainingMinutes,
        tags: ticket.tags,
        device: ticket.device,
        resolution_notes: ticket.resolutionNotes,
        created_at: ticket.createdAt,
        updated_at: ticket.updatedAt
      });

    if (error) {
      console.warn('Error inserting ticket into Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('insertTicket error:', err);
    return false;
  }
}

export async function updateTicketStatusDb(ticketId: string, status: Status): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ticketId);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function updateTicketPriorityDb(ticketId: string, priority: Priority): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ priority, updated_at: new Date().toISOString() })
      .eq('id', ticketId);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function assignTicketDb(ticketId: string, assignee: Ticket['assignee']): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        assignee,
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function insertCommentDb(ticketId: string, comment: TicketComment): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('ticket_comments')
      .insert({
        id: comment.id,
        ticket_id: ticketId,
        author: comment.author,
        content: comment.content,
        is_internal: comment.isInternal,
        created_at: comment.timestamp
      });
    return !error;
  } catch (err) {
    return false;
  }
}
