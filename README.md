# OfficeFlow

Full Functioning Web App untuk manajemen permintaan kantor (ticketing), approval, dan SLA.
Target: Top-20 SDI IBM × Hacktiv8.

## Status

- Planning & setup repo (Step 1/20).
- App scaffolding Next.js dimulai di Step 2.

## Tujuan

- Menyediakan workflow tiket (Employee → Head → Admin IT) dengan RBAC.
- Dashboard SLA & audit log.

## Tech (rencana)

- Next.js + TypeScript + Tailwind + shadcn/ui
- Supabase (Auth + Postgres + RLS)
- TanStack Query, React Hook Form + Zod
- Replicate + IBM Granite (dev-time & AI opsional in-app)
- Deploy: Vercel

## Struktur langkah (20x @5%)

Lihat dokumen “Pre-Step Summary” & Checkpoint tiap langkah di repo/docs (atau folder `ai/` untuk log AI).

## Development

- `npm run dev` — jalankan dev server pada http://localhost:3000
- `npm run lint` — cek kualitas kode
- `npm run format` — format otomatis oleh Prettier

## Tech stack (Frontend)

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- ESLint (next/core-web-vitals + prettier)

## Supabase & ENV

- Buat project di Supabase (region Singapore, plan Free)
- Simpan kredensial di `.env.local` (jangan commit):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-only)
- Helpers:
- `lib/supabase-client.ts` → client anon (browser)
- `lib/supabase-admin.ts` → service role (server-only)
- Diagnostic route: `/api/diag` untuk verifikasi koneksi (sementara).
