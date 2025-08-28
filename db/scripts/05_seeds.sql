-- INGFO: Seed data minimal untuk departments. 🌱
INSERT INTO public.departments (id, name)
VALUES
(gen_random_uuid(), 'Engineering'),
(gen_random_uuid(), 'HR'),
(gen_random_uuid(), 'Finance')
ON CONFLICT (name) DO NOTHING;