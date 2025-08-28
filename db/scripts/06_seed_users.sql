-- INGFO: Set user & role awal untuk uji RLS. Jalankan SETIAP kali setelah membuat user baru via Auth Dashboard. 🧪
-- Ganti email di bawah sesuai user yang kamu buat.

-- 1) Jadikan profil kamu sebagai ADMIN bootstrap (ID dari laporanmu)
UPDATE public.profiles
SET role = 'admin', updated_at = now()
WHERE id = '121d18c5-d0d9-479f-af24-43cf8f916d5f';

-- 2) Set HEAD (kepala divisi) → Engineering
WITH head_user AS (
SELECT id FROM auth.users WHERE email = 'head@officeflow.test'
)
UPDATE public.profiles p
SET role = 'head',
department_id = (SELECT id FROM public.departments WHERE name = 'Engineering'),
updated_at = now()
FROM head_user hu
WHERE p.id = hu.id;

-- 3) Set EMPLOYEE (karyawan biasa) → Engineering (contoh)
WITH emp_user AS (
SELECT id FROM auth.users WHERE email = 'employee@officeflow.test'
)
UPDATE public.profiles p
SET role = 'employee',
department_id = (SELECT id FROM public.departments WHERE name = 'Engineering'),
updated_at = now()
FROM emp_user eu
WHERE p.id = eu.id;