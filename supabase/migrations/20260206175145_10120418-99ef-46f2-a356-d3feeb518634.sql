DROP POLICY IF EXISTS "Appointment products insertable by anyone" ON public.appointment_products;
NOTIFY pgrst, 'reload schema';