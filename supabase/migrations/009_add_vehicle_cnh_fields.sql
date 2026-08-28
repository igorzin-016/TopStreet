alter table public.pilotos
  add column if not exists marca text,
  add column if not exists modelo text,
  add column if not exists placa text,
  add column if not exists sem_placa boolean not null default false,
  add column if not exists cnh_path text,
  add column if not exists cnh_filename text,
  add column if not exists cnh_mime_type text,
  add column if not exists cnh_size integer,
  add column if not exists cnh_uploaded_at timestamptz;

insert into storage.buckets (id, name, public)
values ('documentos-pilotos', 'documentos-pilotos', false)
on conflict (id) do update set public = false;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'admins read pilot documents') then
    create policy "admins read pilot documents"
      on storage.objects for select to authenticated
      using (bucket_id = 'documentos-pilotos' and exists (select 1 from public.admin_profiles where user_id = auth.uid()));
  end if;
end $$;
