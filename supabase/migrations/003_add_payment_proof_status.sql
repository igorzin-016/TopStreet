-- Status usado quando o piloto conclui o envio do comprovante PIX.
alter type public.status_inscricao add value if not exists 'comprovante_enviado';
alter type public.status_inscricao add value if not exists 'aprovado';
alter type public.status_inscricao add value if not exists 'rejeitado';
