-- Create profile row automatically after user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
insert into public.profiles (id, full_name, role, department_id)
values (new.id, new.raw_user_meta_data->> 'full_name', 'employee', null);
return new;
end;
$$ language plpgsql security definer;


create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();