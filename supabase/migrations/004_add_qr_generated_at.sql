alter table public.pilotos
  add column if not exists qr_gerado_em timestamptz;
