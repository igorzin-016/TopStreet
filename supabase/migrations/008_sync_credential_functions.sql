alter type public.status_inscricao add value if not exists 'pagamento_aprovado';
alter type public.status_inscricao add value if not exists 'credenciamento_liberado';
alter table public.pilotos add column if not exists qr_gerado_em timestamptz;
alter table public.pilotos add column if not exists checkin_by uuid references auth.users(id);

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
declare v_piloto public.pilotos;
begin
  if not exists (select 1 from public.admin_profiles where user_id = auth.uid() and role = 'admin') then
    raise exception 'Sem permissao para analisar pagamentos';
  end if;
  update public.pilotos
  set status = case when p_approved then 'credenciamento_liberado'::status_inscricao else 'rejeitado'::status_inscricao end,
      payment_reviewed_at = now(), payment_reviewed_by = auth.uid(),
      payment_rejection_reason = case when p_approved then null else nullif(trim(p_reason), '') end,
      updated_at = now()
  where id = p_piloto_id and status = 'comprovante_enviado'::status_inscricao
  returning * into v_piloto;
  if not found then raise exception 'Inscricao nao encontrada ou ja analisada'; end if;
  insert into public.admin_actions (admin_user_id, piloto_id, action, reason)
  values (auth.uid(), p_piloto_id, case when p_approved then 'pagamento_aprovado' else 'pagamento_rejeitado' end, p_reason);
  return v_piloto;
end;
$$;

create or replace function public.consume_checkin(p_token_hash text, p_fiscal_id uuid)
returns table (nome text, veiculo text, categoria text, checkin_em timestamptz)
language plpgsql security definer set search_path = public
as $$
declare v_piloto public.pilotos;
begin
  update public.pilotos p
  set status_checkin = true, data_checkin = now(), checkin_by = p_fiscal_id, updated_at = now()
  from public.eventos e
  where p.evento_id = e.id and p.qr_token_hash = p_token_hash
    and p.status = 'credenciamento_liberado'::status_inscricao
    and p.status_checkin = false and e.ativo = true
  returning p.* into v_piloto;
  if not found then return; end if;
  insert into public.checkins (piloto_id, fiscal_id) values (v_piloto.id, p_fiscal_id);
  return query select v_piloto.nome_completo, v_piloto.veiculo, v_piloto.categoria, v_piloto.data_checkin;
end;
$$;

revoke all on function public.review_payment(uuid, boolean, text) from public;
grant execute on function public.review_payment(uuid, boolean, text) to authenticated;
revoke all on function public.consume_checkin(text, uuid) from public;
grant execute on function public.consume_checkin(text, uuid) to service_role;
