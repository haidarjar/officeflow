-- INGFO: Trigger updated_at (update otomatis saat row diubah). ⏱️
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
NEW.updated_at := now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Pasang untuk tabel yang punya updated_at
DROP TRIGGER IF EXISTS trg_departments_set_updated_at ON public.departments;
CREATE TRIGGER trg_departments_set_updated_at
BEFORE UPDATE ON public.departments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


DROP TRIGGER IF EXISTS trg_profiles_set_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


DROP TRIGGER IF EXISTS trg_tickets_set_updated_at ON public.tickets;
CREATE TRIGGER trg_tickets_set_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


DROP TRIGGER IF EXISTS trg_approvals_set_updated_at ON public.approvals;
CREATE TRIGGER trg_approvals_set_updated_at
BEFORE UPDATE ON public.approvals
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


DROP TRIGGER IF EXISTS trg_comments_set_updated_at ON public.comments;
CREATE TRIGGER trg_comments_set_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- INGFO: Soft delete universal (menggagalkan DELETE dan mengisi deleted_at). 🧽
-- (Hapus versi lama yang tidak memakai dynamic SQL agar tidak membingungkan)
DROP FUNCTION IF EXISTS public.soft_delete_row;


-- Pakai dynamic SQL + schema agar aman pada semua tabel di schema public
CREATE OR REPLACE FUNCTION public.soft_delete_row_dynamic()
RETURNS trigger AS $$
DECLARE
sql text;
BEGIN
sql := format('UPDATE %I.%I SET deleted_at = now() WHERE id = $1', TG_TABLE_SCHEMA, TG_TABLE_NAME);
EXECUTE sql USING OLD.id;
RETURN NULL; -- batalkan DELETE
END;
$$ LANGUAGE plpgsql;


-- Pasang BEFORE DELETE → soft delete pada tabel utama
DROP TRIGGER IF EXISTS trg_departments_soft_delete ON public.departments;
CREATE TRIGGER trg_departments_soft_delete
BEFORE DELETE ON public.departments
FOR EACH ROW EXECUTE FUNCTION public.soft_delete_row_dynamic();


DROP TRIGGER IF EXISTS trg_profiles_soft_delete ON public.profiles;
CREATE TRIGGER trg_profiles_soft_delete
BEFORE DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.soft_delete_row_dynamic();

DROP TRIGGER IF EXISTS trg_tickets_soft_delete ON public.tickets;
CREATE TRIGGER trg_tickets_soft_delete
BEFORE DELETE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.soft_delete_row_dynamic();


DROP TRIGGER IF EXISTS trg_approvals_soft_delete ON public.approvals;
CREATE TRIGGER trg_approvals_soft_delete
BEFORE DELETE ON public.approvals
FOR EACH ROW EXECUTE FUNCTION public.soft_delete_row_dynamic();


DROP TRIGGER IF EXISTS trg_comments_soft_delete ON public.comments;
CREATE TRIGGER trg_comments_soft_delete
BEFORE DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.soft_delete_row_dynamic();


DROP TRIGGER IF EXISTS trg_audit_logs_soft_delete ON public.audit_logs;
CREATE TRIGGER trg_audit_logs_soft_delete
BEFORE DELETE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.soft_delete_row_dynamic();

-- INGFO: Cascade soft delete anak-anak ketika ticket di-soft delete. 👪
CREATE OR REPLACE FUNCTION public.soft_delete_ticket_children()
RETURNS trigger AS $$
BEGIN
-- Jalankan hanya saat berubah dari NULL → NOT NULL
IF (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL) THEN
UPDATE public.comments SET deleted_at = now() WHERE ticket_id = NEW.id AND deleted_at IS NULL;
UPDATE public.approvals SET deleted_at = now() WHERE ticket_id = NEW.id AND deleted_at IS NULL;
UPDATE public.audit_logs SET deleted_at = now() WHERE ticket_id = NEW.id AND deleted_at IS NULL;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trg_tickets_soft_cascade ON public.tickets;
CREATE TRIGGER trg_tickets_soft_cascade
BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.soft_delete_ticket_children();

-- INGFO: Auto-profile — buat row di public.profiles setelah user baru dibuat di auth.users. 👤
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
-- Jika sudah ada (re-run aman), abaikan
INSERT INTO public.profiles (id, full_name, role, department_id)
VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->> 'full_name', ''), 'employee', NULL)
ON CONFLICT (id) DO NOTHING;
RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();