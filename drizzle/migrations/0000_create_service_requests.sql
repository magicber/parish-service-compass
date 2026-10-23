CREATE TABLE public.service_requests (
  id uuid primary key default gen_random_uuid(),
  service_type text not null check (service_type in ('baptism','wedding','funeral','blessing','first_communion','confirmation','mass_intention')),
  full_name text not null,
  email text not null,
  phone text,
  preferred_date date,
  notes text,
  status text not null default 'pending' check (status in ('pending','approved','completed','declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE ON public.service_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a service request"
  ON public.service_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Parish dashboard can view service requests"
  ON public.service_requests FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Parish dashboard can update service requests"
  ON public.service_requests FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

INSERT INTO public.service_requests (service_type, full_name, email, phone, preferred_date, notes, status) VALUES
  ('baptism', 'Maria Santos', 'maria.santos@example.com', '+63 917 555 0143', '2026-11-08', 'First child, godparents confirmed.', 'pending'),
  ('wedding', 'James & Liza Cruz', 'james.cruz@example.com', '+63 918 555 0921', '2026-12-12', 'Both baptized Catholic; pre-cana seminar requested.', 'approved'),
  ('funeral', 'Family of Roberto Reyes', 'reyes.family@example.com', '+63 906 555 0774', '2026-10-26', 'Wake at the family home, interment at Holy Cross.', 'pending'),
  ('blessing', 'Ana Domingo', 'ana.domingo@example.com', '+63 915 555 0388', '2026-11-01', 'House blessing in San Roque village.', 'completed'),
  ('first_communion', 'Grace Lim', 'grace.lim@example.com', '+63 917 555 0655', '2026-11-15', 'Child is 9 years old, enrolled in catechism.', 'approved'),
  ('mass_intention', 'Pedro Bautista', 'pedro.bautista@example.com', null, '2026-10-25', 'Thanksgiving mass for a recovered family member.', 'declined');