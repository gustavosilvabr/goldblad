-- Primeiro remover todas as políticas de INSERT existentes
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Appointments insertable by anyone" ON public.appointments;
DROP POLICY IF EXISTS "Public can create appointments" ON public.appointments;

-- Criar política simples de INSERT que funciona para anon
CREATE POLICY "Public insert appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (true);

-- Verificar appointment_services também
DROP POLICY IF EXISTS "Anyone can insert appointment services" ON public.appointment_services;
DROP POLICY IF EXISTS "Appointment services insertable by anyone" ON public.appointment_services;

CREATE POLICY "Public insert appointment services" 
ON public.appointment_services 
FOR INSERT 
WITH CHECK (true);

-- Forçar reload do schema do PostgREST
NOTIFY pgrst, 'reload schema';