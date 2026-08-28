create extension if not exists pgcrypto;

create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  data_evento date not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'fiscal')),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  piloto_id uuid not null references public.pilotos(id) on delete cascade,
  action text not null,
  reason text,
  created_at timestamptz not null default now()
);

insert into public.eventos (nome, data_evento)
select 'Top Street - Taruma', '2026-09-26'
where not exists (
  select 1
  from public.eventos
  where data_evento = '2026-09-26'
);

-- Campos adicionais usados pelo cadastro, upload e análise do comprovante.
alter table public.pilotos add column if not exists protocolo text unique;
alter table public.pilotos add column if not exists resume_token_hash text unique;
alter table public.pilotos add column if not exists pix_key_used text;
alter table public.pilotos add column if not exists proof_path text;
alter table public.pilotos add column if not exists proof_filename text;
alter table public.pilotos add column if not exists proof_mime_type text;
alter table public.pilotos add column if not exists proof_size integer;
alter table public.pilotos add column if not exists proof_uploaded_at timestamptz;
alter table public.pilotos add column if not exists payment_reviewed_at timestamptz;
alter table public.pilotos add column if not exists payment_reviewed_by uuid references auth.users(id);
alter table public.pilotos add column if not exists payment_rejection_reason text;
alter table public.pilotos add column if not exists updated_at timestamptz not null default now();

-- Normaliza os status para o fluxo de pagamento atual.
alter table public.pilotos drop constraint if exists pilotos_status_check;
alter table public.pilotos add constraint pilotos_status_check
  check (status in ('aguardando_pagamento', 'comprovante_enviado', 'em_analise', 'pagamento_aprovado', 'pagamento_rejeitado', 'aprovado', 'rejeitado'));

alter table public.pilotos enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.admin_actions enable row level security;
alter table public.checkins enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'pilotos'
      and policyname = 'admins read pilots'
  ) then
    create policy "admins read pilots"
      on public.pilotos for select to authenticated
      using (exists (select 1 from public.admin_profiles a where a.user_id = auth.uid()));
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_actions'
      and policyname = 'admins read actions'
  ) then
    create policy "admins read actions"
      on public.admin_actions for select to authenticated
      using (exists (select 1 from public.admin_profiles a where a.user_id = auth.uid()));
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'checkins'
      and policyname = 'admins read checkins'
  ) then
    create policy "admins read checkins"
      on public.checkins for select to authenticated
      using (exists (select 1 from public.admin_profiles a where a.user_id = auth.uid()));
  end if;
end $$;

create or replace function public.review_payment(
  p_piloto_id uuid,
  p_approved boolean,
  p_reason text default null
)
returns public.pilotos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_piloto public.pilotos;
begin
  if not exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
      and role = 'admin'
  ) then
    raise exception 'Sem permissao para analisar pagamentos';
  end if;

  update public.pilotos
  set status = case when p_approved then 'aprovado' else 'rejeitado' end,
      payment_reviewed_at = now(),
      payment_reviewed_by = auth.uid(),
      payment_rejection_reason = case when p_approved then null else nullif(trim(p_reason), '') end,
      updated_at = now()
  where id = p_piloto_id
    and status = 'comprovante_enviado'
  returning * into v_piloto;

  if not found then
    raise exception 'Inscricao nao encontrada ou ja analisada';
  end if;

  insert into public.admin_actions (admin_user_id, piloto_id, action, reason)
  values (
    auth.uid(),
    p_piloto_id,
    case when p_approved then 'pagamento_aprovado' else 'pagamento_rejeitado' end,
    p_reason
  );

  return v_piloto;
end;
$$;

revoke all on function public.review_payment(uuid, boolean, text) from public;
grant execute on function public.review_payment(uuid, boolean, text) to authenticated;

insert into storage.buckets (id, name, public)
values ('comprovantes', 'comprovantes', false)
on conflict (id) do update set public = false;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'admins read payment proofs'
  ) then
    create policy "admins read payment proofs"
      on storage.objects for select to authenticated
      using (
        bucket_id = 'comprovantes'
        and exists (
          select 1
          from public.admin_profiles a
          where a.user_id = auth.uid()
        )
      );
  end if;
end $$;
