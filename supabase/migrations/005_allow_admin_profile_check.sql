-- Permite que um usuário autenticado leia apenas o próprio perfil.
-- Isso é necessário para as políticas de pilotos/admin_actions reconhecerem
-- corretamente o administrador logado.
alter table public.admin_profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_profiles'
      and policyname = 'users can read own admin profile'
  ) then
    create policy "users can read own admin profile"
      on public.admin_profiles
      for select to authenticated
      using (user_id = auth.uid());
  end if;
end $$;
