-- 1. Criar função segura para verificar disponibilidade (sem expor dados pessoais)
CREATE OR REPLACE FUNCTION public.get_booked_slots()
RETURNS TABLE (
  appointment_date date,
  appointment_time time,
  barber_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    a.appointment_date,
    a.appointment_time,
    a.barber_id
  FROM public.appointments a
  WHERE a.status IN ('pending', 'confirmed')
$$;

-- 2. Remover política permissiva que expõe dados pessoais
DROP POLICY IF EXISTS "Appointments readable by anyone for availability" ON public.appointments;

-- 3. Criar política mais restritiva - anônimos NÃO podem ler appointments diretamente
-- Os admins continuam podendo ler tudo através da política existente "Appointments readable by admin"