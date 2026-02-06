-- Remover política existente de INSERT para appointments
DROP POLICY IF EXISTS "Appointments insertable by anyone" ON public.appointments;

-- Criar nova política de INSERT que permite usuários anônimos criarem agendamentos
CREATE POLICY "Anyone can create appointments" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Também precisamos garantir que appointment_services permita INSERT anônimo
DROP POLICY IF EXISTS "Allow insert appointment services" ON public.appointment_services;

CREATE POLICY "Anyone can insert appointment services" 
ON public.appointment_services 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);