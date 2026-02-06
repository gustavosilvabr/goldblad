-- Fix RLS policies for appointments table - they need to be PERMISSIVE for admin access
-- Drop the restrictive policies
DROP POLICY IF EXISTS "Appointments readable by admin" ON public.appointments;
DROP POLICY IF EXISTS "Appointments editable by admin" ON public.appointments;
DROP POLICY IF EXISTS "Appointments deletable by admin" ON public.appointments;

-- Recreate as PERMISSIVE policies (default is PERMISSIVE)
CREATE POLICY "Appointments readable by admin"
ON public.appointments
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Appointments editable by admin"
ON public.appointments
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Appointments deletable by admin"
ON public.appointments
FOR DELETE
TO authenticated
USING (is_admin());

-- Fix appointment_services table too
DROP POLICY IF EXISTS "Appointment services readable by admin" ON public.appointment_services;
DROP POLICY IF EXISTS "Appointment services editable by admin" ON public.appointment_services;

CREATE POLICY "Appointment services readable by admin"
ON public.appointment_services
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Appointment services editable by admin"
ON public.appointment_services
FOR ALL
TO authenticated
USING (is_admin());

-- Fix appointment_products table too
DROP POLICY IF EXISTS "Appointment products readable by admin" ON public.appointment_products;
DROP POLICY IF EXISTS "Appointment products editable by admin" ON public.appointment_products;

CREATE POLICY "Appointment products readable by admin"
ON public.appointment_products
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Appointment products editable by admin"
ON public.appointment_products
FOR ALL
TO authenticated
USING (is_admin());

-- Force schema reload
NOTIFY pgrst, 'reload schema';