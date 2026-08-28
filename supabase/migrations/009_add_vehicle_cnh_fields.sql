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
