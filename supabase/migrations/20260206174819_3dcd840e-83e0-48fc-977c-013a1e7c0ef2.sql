-- Create a secure public booking function to avoid exposing appointments table to anon inserts/selects
-- This function validates inputs and writes appointment + services atomically.

CREATE OR REPLACE FUNCTION public.create_public_appointment(
  p_client_name text,
  p_client_phone text,
  p_barber_id uuid,
  p_appointment_date date,
  p_appointment_time time,
  p_total_price numeric,
  p_service_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_appointment_id uuid;
  v_item jsonb;
BEGIN
  -- Basic validation (server-side)
  p_client_name := btrim(coalesce(p_client_name, ''));
  IF length(p_client_name) < 2 OR length(p_client_name) > 100 THEN
    RAISE EXCEPTION 'Invalid client name';
  END IF;

  IF p_client_phone IS NULL OR NOT (p_client_phone ~ '^[0-9]{10,11}$') THEN
    RAISE EXCEPTION 'Invalid phone';
  END IF;

  IF p_appointment_date IS NULL OR p_appointment_time IS NULL THEN
    RAISE EXCEPTION 'Invalid date/time';
  END IF;

  IF p_total_price IS NULL OR p_total_price < 0 THEN
    RAISE EXCEPTION 'Invalid total';
  END IF;

  IF p_service_items IS NULL OR jsonb_typeof(p_service_items) <> 'array' OR jsonb_array_length(p_service_items) = 0 THEN
    RAISE EXCEPTION 'No services';
  END IF;

  INSERT INTO public.appointments (
    client_id,
    client_name,
    client_phone,
    barber_id,
    appointment_date,
    appointment_time,
    total_price,
    status
  ) VALUES (
    NULL,
    p_client_name,
    p_client_phone,
    p_barber_id,
    p_appointment_date,
    p_appointment_time,
    p_total_price,
    'pending'
  )
  RETURNING id INTO v_appointment_id;

  -- Insert services
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_service_items)
  LOOP
    INSERT INTO public.appointment_services (
      appointment_id,
      service_id,
      service_name,
      price
    ) VALUES (
      v_appointment_id,
      NULLIF((v_item->>'service_id')::uuid, NULL),
      coalesce(v_item->>'service_name',''),
      coalesce((v_item->>'price')::numeric, 0)
    );
  END LOOP;

  RETURN v_appointment_id;
END;
$$;

-- Allow public (anon/authenticated) to call the function
GRANT EXECUTE ON FUNCTION public.create_public_appointment(text, text, uuid, date, time, numeric, jsonb) TO anon;
GRANT EXECUTE ON FUNCTION public.create_public_appointment(text, text, uuid, date, time, numeric, jsonb) TO authenticated;

-- Lock down direct table access for public booking tables (keep admin policies intact)
REVOKE INSERT, SELECT ON public.appointments FROM anon, authenticated;
REVOKE INSERT, SELECT ON public.appointment_services FROM anon, authenticated;

-- Remove permissive public insert policies if present
DROP POLICY IF EXISTS "Public insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Appointments insertable by anyone" ON public.appointments;

DROP POLICY IF EXISTS "Public insert appointment services" ON public.appointment_services;
DROP POLICY IF EXISTS "Anyone can insert appointment services" ON public.appointment_services;
DROP POLICY IF EXISTS "Appointment services insertable by anyone" ON public.appointment_services;

-- Reload API schema
NOTIFY pgrst, 'reload schema';