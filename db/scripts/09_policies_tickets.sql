-- INGFO: RLS untuk tickets. Prinsip: pembuat/assignee/head/admin boleh lihat; aturan khusus untuk insert/update/delete. 🎫


DROP POLICY IF EXISTS "tickets: select visible" ON public.tickets;
DROP POLICY IF EXISTS "tickets: insert create" ON public.tickets;
DROP POLICY IF EXISTS "tickets: update by roles" ON public.tickets;
DROP POLICY IF EXISTS "tickets: delete admin" ON public.tickets;


-- SELECT: visibilitas umum
CREATE POLICY "tickets: select visible"
ON public.tickets FOR SELECT
USING ( is_ticket_visible_row(created_by, assignee_id, department_id, deleted_at) );


-- INSERT: user membuat tiket sebagai dirinya; dept harus cocok (atau admin)
CREATE POLICY "tickets: insert create"
ON public.tickets FOR INSERT
WITH CHECK ( can_create_ticket(department_id, created_by) );

-- UPDATE: longgar per RLS (kolom dibatasi di aplikasi). Peran yang boleh: pembuat, assignee, head, admin.
CREATE POLICY "tickets: update by roles"
ON public.tickets FOR UPDATE
USING (
is_ticket_visible_row(created_by, assignee_id, department_id, deleted_at)
)
WITH CHECK (
is_ticket_visible_row(created_by, assignee_id, department_id, deleted_at)
);


-- DELETE: hanya admin (dan akan berubah jadi soft delete oleh trigger)
CREATE POLICY "tickets: delete admin"
ON public.tickets FOR DELETE
USING ( is_admin() );