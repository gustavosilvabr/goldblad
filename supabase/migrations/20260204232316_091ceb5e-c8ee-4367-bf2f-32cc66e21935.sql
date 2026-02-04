-- Remover políticas restritivas de INSERT
DROP POLICY IF EXISTS "Clients insertable by anyone" ON public.clients;
DROP POLICY IF EXISTS "Appointments insertable by anyone" ON public.appointments;
DROP POLICY IF EXISTS "Appointment services insertable by anyone" ON public.appointment_services;
DROP POLICY IF EXISTS "Appointment products insertable by anyone" ON public.appointment_products;

-- Criar políticas PERMISSIVAS para INSERT público
CREATE POLICY "Clients insertable by anyone" 
ON public.clients 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Appointments insertable by anyone" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Appointment services insertable by anyone" 
ON public.appointment_services 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Appointment products insertable by anyone" 
ON public.appointment_products 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Permitir SELECT para appointments (necessário para verificar disponibilidade)
DROP POLICY IF EXISTS "Appointments readable by anyone" ON public.appointments;
CREATE POLICY "Appointments readable by anyone for availability" 
ON public.appointments 
FOR SELECT 
USING (true);

-- Permitir SELECT para blocked_dates
DROP POLICY IF EXISTS "Blocked dates readable by everyone" ON public.blocked_dates;
CREATE POLICY "Blocked dates readable by everyone" 
ON public.blocked_dates 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Permitir UPDATE de clients para atualizar visitas
DROP POLICY IF EXISTS "Clients updatable by anyone" ON public.clients;
CREATE POLICY "Clients updatable for visits" 
ON public.clients 
FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);