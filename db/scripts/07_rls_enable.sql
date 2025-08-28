-- INGFO: Aktifkan RLS dan default deny. 🔒
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- (Opsional) Paksa owner juga kena RLS
-- ALTER TABLE public.tickets FORCE ROW LEVEL SECURITY;