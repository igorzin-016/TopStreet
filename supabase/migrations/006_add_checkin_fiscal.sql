alter table public.pilotos
  add column if not exists checkin_by uuid references auth.users(id);
