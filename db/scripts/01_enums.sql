-- INGFO: ENUM untuk peran user, prioritas tiket, status tiket, dan keputusan approval. 🧩
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
CREATE TYPE public.user_role AS ENUM ('employee', 'head', 'admin');
END IF;
END $$;


DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority') THEN
CREATE TYPE public.priority AS ENUM ('P1', 'P2', 'P3', 'P4');
END IF;
END $$;


DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
CREATE TYPE public.ticket_status AS ENUM (
'open', 'waiting_approval', 'approved', 'rejected', 'in_progress', 'resolved', 'closed'
);
END IF;
END $$;


DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_decision') THEN
CREATE TYPE public.approval_decision AS ENUM ('approved', 'rejected');
END IF;
END $$;