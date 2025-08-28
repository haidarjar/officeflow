-- INGFO: Indeks selektif untuk query umum.
CREATE INDEX IF NOT EXISTS idx_tickets_department ON public.tickets(department_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON public.tickets(assignee_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_status_pri ON public.tickets(status, priority) WHERE deleted_at IS NULL;


CREATE INDEX IF NOT EXISTS idx_approvals_ticket ON public.approvals(ticket_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_comments_ticket ON public.comments(ticket_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_ticket ON public.audit_logs(ticket_id, created_at DESC) WHERE deleted_at IS NULL;