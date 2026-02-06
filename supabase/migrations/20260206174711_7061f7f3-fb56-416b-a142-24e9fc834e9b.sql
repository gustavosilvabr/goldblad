-- Conceder permissões de INSERT para a role anon nas tabelas de agendamento
GRANT INSERT ON public.appointments TO anon;
GRANT INSERT ON public.appointments TO authenticated;

GRANT INSERT ON public.appointment_services TO anon;
GRANT INSERT ON public.appointment_services TO authenticated;

-- Também precisamos permitir SELECT para usar RETURNING
GRANT SELECT ON public.appointments TO anon;
GRANT SELECT ON public.appointments TO authenticated;

GRANT SELECT ON public.appointment_services TO anon;
GRANT SELECT ON public.appointment_services TO authenticated;

-- Notificar PostgREST para recarregar o schema
NOTIFY pgrst, 'reload schema';