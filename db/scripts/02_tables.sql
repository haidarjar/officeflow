-- INGFO: Pastikan fungsi UUID tersedia (gen_random_uuid). 🔑


-- INGFO: Tabel referensi departemen.
CREATE TABLE IF NOT EXISTS public.departments (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
name text UNIQUE NOT NULL,
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now(),
deleted_at timestamptz NULL
);


-- INGFO: Tabel profil user; id = auth.users.id
CREATE TABLE IF NOT EXISTS public.profiles (
id uuid PRIMARY KEY, -- FK ke auth.users.id
full_name text NOT NULL DEFAULT '',
role user_role NOT NULL DEFAULT 'employee',
department_id uuid NULL REFERENCES public.departments(id),
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now(),
deleted_at timestamptz NULL
);


-- INGFO: Tabel tickets (inti aplikasi)
CREATE TABLE IF NOT EXISTS public.tickets (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
title text NOT NULL,
description text NULL,
category text NULL,
priority priority NOT NULL DEFAULT 'P3',
status ticket_status NOT NULL DEFAULT 'open',
department_id uuid NULL REFERENCES public.departments(id),
created_by uuid NOT NULL REFERENCES public.profiles(id),
assignee_id uuid NULL REFERENCES public.profiles(id),
due_at timestamptz NULL,
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now(),
deleted_at timestamptz NULL
);


-- INGFO: Keputusan approval per ticket & approver
CREATE TABLE IF NOT EXISTS public.approvals (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
approver_id uuid NOT NULL REFERENCES public.profiles(id),
decision approval_decision NOT NULL,
note text NULL,
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now(),
deleted_at timestamptz NULL,
CONSTRAINT approvals_unique_per_approver UNIQUE (ticket_id, approver_id)
);

-- INGFO: Komentar di tiket
CREATE TABLE IF NOT EXISTS public.comments (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
author_id uuid NOT NULL REFERENCES public.profiles(id),
body text NOT NULL,
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now(),
deleted_at timestamptz NULL
);


-- INGFO: Audit log tindakan (buat catatan perubahan)
CREATE TABLE IF NOT EXISTS public.audit_logs (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
ticket_id uuid NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
actor_id uuid NULL REFERENCES public.profiles(id),
action text NOT NULL,
diff jsonb NULL,
created_at timestamptz NOT NULL DEFAULT now(),
deleted_at timestamptz NULL -- tetap ada untuk konsistensi filter, walau jarang dihapus
);