-- INGFO: Fungsi bantu agar policy lebih ringkas & mudah dibaca. Semua SECURITY DEFINER + search_path=public. 🧠

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_role public.user_role;
BEGIN
SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid() AND deleted_at IS NULL;
RETURN COALESCE(v_role, 'employee');
END; $$;

CREATE OR REPLACE FUNCTION public.get_my_department_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_dept uuid;
BEGIN
SELECT department_id INTO v_dept FROM public.profiles WHERE id = auth.uid() AND deleted_at IS NULL;
RETURN v_dept; -- boleh NULL untuk admin global / belum set
END; $$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
RETURN get_my_role() = 'admin';
END; $$;

CREATE OR REPLACE FUNCTION public.is_head_for(p_dept uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
RETURN get_my_role() = 'head' AND get_my_department_id() IS NOT DISTINCT FROM p_dept;
END; $$;


CREATE OR REPLACE FUNCTION public.is_ticket_visible_row(p_created_by uuid, p_assignee uuid, p_dept uuid, p_deleted timestamptz)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
RETURN (p_deleted IS NULL) AND (
auth.uid() = p_created_by OR
auth.uid() IS NOT DISTINCT FROM p_assignee OR
is_head_for(p_dept) OR
is_admin()
);
END; $$;

CREATE OR REPLACE FUNCTION public.is_ticket_visible_by_id(p_ticket_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r RECORD;
BEGIN
SELECT created_by, assignee_id, department_id, deleted_at INTO r
FROM public.tickets WHERE id = p_ticket_id;
IF NOT FOUND THEN RETURN FALSE; END IF;
RETURN is_ticket_visible_row(r.created_by, r.assignee_id, r.department_id, r.deleted_at);
END; $$;

CREATE OR REPLACE FUNCTION public.can_create_ticket(p_dept uuid, p_created_by uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
RETURN (
p_created_by = auth.uid() AND (
is_admin() OR p_dept IS NULL OR p_dept IS NOT DISTINCT FROM get_my_department_id()
)
);
END; $$;


CREATE OR REPLACE FUNCTION public.can_approve_ticket(p_ticket_id uuid, p_approver uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r RECORD;
BEGIN
SELECT department_id INTO r FROM public.tickets WHERE id = p_ticket_id;
IF NOT FOUND THEN RETURN FALSE; END IF;
RETURN (
p_approver = auth.uid() AND ( is_admin() OR is_head_for(r.department_id) )
);
END; $$;

GRANT EXECUTE ON FUNCTION public.get_my_role TO public;
GRANT EXECUTE ON FUNCTION public.get_my_department_id TO public;
GRANT EXECUTE ON FUNCTION public.is_admin TO public;
GRANT EXECUTE ON FUNCTION public.is_head_for(uuid) TO public;
GRANT EXECUTE ON FUNCTION public.is_ticket_visible_row(uuid, uuid, uuid, timestamptz) TO public;
GRANT EXECUTE ON FUNCTION public.is_ticket_visible_by_id(uuid) TO public;
GRANT EXECUTE ON FUNCTION public.can_create_ticket(uuid, uuid) TO public;
GRANT EXECUTE ON FUNCTION public.can_approve_ticket(uuid, uuid) TO public;