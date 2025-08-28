-- INGFO: RLS untuk profiles. Prinsip: user lihat dirinya; head lihat departemennya; admin lihat semua. 👥


-- Hapus policy lama bila ada (idempoten)
DROP POLICY IF EXISTS "profiles: read self" ON public.profiles;
DROP POLICY IF EXISTS "profiles: read head dept" ON public.profiles;
DROP POLICY IF EXISTS "profiles: read admin all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: update self" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin all" ON public.profiles;


-- SELECT
CREATE POLICY "profiles: read self"
ON public.profiles FOR SELECT
USING ( id = auth.uid() AND deleted_at IS NULL );


CREATE POLICY "profiles: read head dept"
ON public.profiles FOR SELECT
USING ( is_head_for(department_id) AND deleted_at IS NULL );


CREATE POLICY "profiles: read admin all"
ON public.profiles FOR SELECT
USING ( is_admin() AND deleted_at IS NULL );

-- UPDATE: user boleh update datanya sendiri (bukan role/department). Kita cek via fungsi definer
CREATE OR REPLACE FUNCTION public.can_update_own_profile(p_id uuid, p_role public.user_role, p_dept uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE cur_role public.user_role; cur_dept uuid;
BEGIN
IF p_id <> auth.uid() THEN RETURN FALSE; END IF;
SELECT role, department_id INTO cur_role, cur_dept FROM public.profiles WHERE id = auth.uid();
RETURN (p_role = cur_role AND (p_dept IS NOT DISTINCT FROM cur_dept));
END; $$;


GRANT EXECUTE ON FUNCTION public.can_update_own_profile(uuid, public.user_role, uuid) TO public;

CREATE POLICY "profiles: update self"
ON public.profiles FOR UPDATE
USING ( id = auth.uid() AND deleted_at IS NULL )
WITH CHECK ( can_update_own_profile(id, role, department_id) AND deleted_at IS NULL );


-- ADMIN full control
CREATE POLICY "profiles: admin all"
ON public.profiles FOR ALL
USING ( is_admin() )
WITH CHECK ( is_admin() );