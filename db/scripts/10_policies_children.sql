- INGFO: RLS untuk approvals, comments, audit_logs. Akses mengikuti visibilitas tiket induk. 🌱


-- ========== approvals ==========
DROP POLICY IF EXISTS "approvals: select visible" ON public.approvals;
DROP POLICY IF EXISTS "approvals: insert by head" ON public.approvals;
DROP POLICY IF EXISTS "approvals: admin update" ON public.approvals;
DROP POLICY IF EXISTS "approvals: admin delete" ON public.approvals;


CREATE POLICY "approvals: select visible"
ON public.approvals FOR SELECT
USING ( is_ticket_visible_by_id(ticket_id) AND deleted_at IS NULL );


-- Hanya head departemen atau admin dari tiket tsb yang boleh memberi approval; approver_id harus dirinya sendiri
CREATE POLICY "approvals: insert by head"
ON public.approvals FOR INSERT
WITH CHECK ( can_approve_ticket(ticket_id, approver_id) );


CREATE POLICY "approvals: admin update"
ON public.approvals FOR UPDATE
USING ( is_admin() ) WITH CHECK ( is_admin() );


CREATE POLICY "approvals: admin delete"
ON public.approvals FOR DELETE
USING ( is_admin() );

-- ========== comments ==========
DROP POLICY IF EXISTS "comments: select visible" ON public.comments;
DROP POLICY IF EXISTS "comments: insert by actors" ON public.comments;
DROP POLICY IF EXISTS "comments: admin update" ON public.comments;
DROP POLICY IF EXISTS "comments: admin delete" ON public.comments;


CREATE POLICY "comments: select visible"
ON public.comments FOR SELECT
USING ( is_ticket_visible_by_id(ticket_id) AND deleted_at IS NULL );


-- Pembuat/assignee/head/admin boleh menulis komentar; author_id harus dirinya
CREATE POLICY "comments: insert by actors"
ON public.comments FOR INSERT
WITH CHECK (
author_id = auth.uid() AND (
is_ticket_visible_by_id(ticket_id) OR is_admin()
)
);


CREATE POLICY "comments: admin update"
ON public.comments FOR UPDATE
USING ( is_admin() ) WITH CHECK ( is_admin() );


CREATE POLICY "comments: admin delete"
ON public.comments FOR DELETE
USING ( is_admin() );

-- ========== audit_logs ==========
DROP POLICY IF EXISTS "audit_logs: select visible" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs: admin insert" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs: admin update" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs: admin delete" ON public.audit_logs;


CREATE POLICY "audit_logs: select visible"
ON public.audit_logs FOR SELECT
USING ( is_ticket_visible_by_id(ticket_id) AND deleted_at IS NULL );


CREATE POLICY "audit_logs: admin insert"
ON public.audit_logs FOR INSERT
WITH CHECK ( is_admin() );


CREATE POLICY "audit_logs: admin update"
ON public.audit_logs FOR UPDATE
USING ( is_admin() ) WITH CHECK ( is_admin() );


CREATE POLICY "audit_logs: admin delete"
ON public.audit_logs FOR DELETE
USING ( is_admin() );