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

create table if not exists public.pilotos (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references public.eventos(id),
  nome_completo text not null,
  cpf text not null,
  veiculo text not null,
  numero_carro text,
  categoria text not null,
  whatsapp text,
  termos_aceitos boolean not null default false,
  status text not null default 'aguardando_pagamento' check (status in ('aguardando_pagamento', 'pagamento_enviado', 'aprovado', 'rejeitado')),
  qr_token_hash text unique,
  qr_gerado_em timestamptz,
  status_checkin boolean not null default false,
  data_checkin timestamptz,
  checkin_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  constraint pilotos_termos_check check (termos_aceitos = true)
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  piloto_id uuid not null unique references public.pilotos(id),
  fiscal_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists pilotos_evento_status_idx on public.pilotos(evento_id, status);
create index if not exists pilotos_qr_hash_idx on public.pilotos(qr_token_hash);

alter table public.eventos enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.pilotos enable row level security;
alter table public.checkins enable row level security;

create policy "public can submit pilot registration"
  on public.pilotos for insert to anon, authenticated
  with check (status = 'aguardando_pagamento' and status_checkin = false and qr_token_hash is null);

create policy "admins can read pilots"
  on public.pilotos for select to authenticated
  using (exists (select 1 from public.admin_profiles p where p.user_id = auth.uid()));

create policy "admins can read events"
  on public.eventos for select to authenticated
  using (exists (select 1 from public.admin_profiles p where p.user_id = auth.uid()));

create policy "admins can read checkins"
  on public.checkins for select to authenticated
  using (exists (select 1 from public.admin_profiles p where p.user_id = auth.uid()));

create or replace function public.consume_checkin(p_token_hash text, p_fiscal_id uuid)
returns table (nome text, veiculo text, categoria text, checkin_em timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_piloto public.pilotos;
begin
  update public.pilotos p
  set status_checkin = true, data_checkin = now(), checkin_by = p_fiscal_id
  from public.eventos e
  where p.evento_id = e.id
    and p.qr_token_hash = p_token_hash
    and p.status = 'aprovado'
    and p.status_checkin = false
    and e.ativo = true
  returning p.* into v_piloto;

  if not found then return; end if;

  insert into public.checkins (piloto_id, fiscal_id)
  values (v_piloto.id, p_fiscal_id);

  return query select v_piloto.nome_completo, v_piloto.veiculo, v_piloto.categoria, v_piloto.data_checkin;
end;
$$;

revoke all on function public.consume_checkin(text, uuid) from public;
grant execute on function public.consume_checkin(text, uuid) to service_role;
