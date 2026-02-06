-- # CORREÇÃO DE SEGURANÇA 1: Remover política permissiva de UPDATE em clients
DROP POLICY IF EXISTS "Clients updatable for visits" ON public.clients;

-- # CORREÇÃO DE SEGURANÇA 2: Remover política permissiva de INSERT em clients
-- O cliente será criado/atualizado apenas pelo admin quando marcar como concluído
DROP POLICY IF EXISTS "Clients insertable by anyone" ON public.clients;

-- # CORREÇÃO DE SEGURANÇA 3: Criar função segura para criar/atualizar cliente após agendamento concluído
-- Esta função só pode ser chamada por admins e atualiza estatísticas do cliente
CREATE OR REPLACE FUNCTION public.complete_appointment_and_update_client(
  p_appointment_id UUID,
  p_client_name TEXT,
  p_client_phone TEXT,
  p_total_price NUMERIC
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client_id UUID;
BEGIN
  -- Verificar se é admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin role required';
  END IF;

  -- Validar inputs
  IF length(p_client_name) < 2 OR length(p_client_name) > 100 THEN
    RAISE EXCEPTION 'Invalid client name length';
  END IF;

  IF NOT (p_client_phone ~ '^[0-9]{10,11}$') THEN
    RAISE EXCEPTION 'Invalid phone format';
  END IF;

  -- Upsert cliente (criar se não existe, atualizar se existe)
  INSERT INTO clients (phone, name, total_visits, total_spent, last_visit_at)
  VALUES (p_client_phone, p_client_name, 1, COALESCE(p_total_price, 0), NOW())
  ON CONFLICT (phone) DO UPDATE SET
    name = EXCLUDED.name,
    total_visits = COALESCE(clients.total_visits, 0) + 1,
    total_spent = COALESCE(clients.total_spent, 0) + COALESCE(p_total_price, 0),
    last_visit_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO v_client_id;

  -- Atualizar o agendamento com o ID do cliente
  UPDATE appointments
  SET client_id = v_client_id, status = 'completed', updated_at = NOW()
  WHERE id = p_appointment_id;

  RETURN v_client_id;
END;
$$;

-- # CORREÇÃO DE SEGURANÇA 4: Adicionar constraints de validação nas tabelas

-- Appointments: validar dados de entrada
ALTER TABLE appointments
  DROP CONSTRAINT IF EXISTS client_name_length,
  DROP CONSTRAINT IF EXISTS client_phone_format,
  DROP CONSTRAINT IF EXISTS total_price_positive;

ALTER TABLE appointments
  ADD CONSTRAINT client_name_length CHECK (length(client_name) >= 2 AND length(client_name) <= 100),
  ADD CONSTRAINT client_phone_format CHECK (client_phone ~ '^[0-9]{10,11}$'),
  ADD CONSTRAINT total_price_positive CHECK (total_price IS NULL OR total_price >= 0);

-- Clients: validar dados de entrada
ALTER TABLE clients
  DROP CONSTRAINT IF EXISTS client_name_check,
  DROP CONSTRAINT IF EXISTS client_phone_check,
  DROP CONSTRAINT IF EXISTS email_format_check;

ALTER TABLE clients
  ADD CONSTRAINT client_name_check CHECK (length(name) >= 2 AND length(name) <= 100),
  ADD CONSTRAINT client_phone_check CHECK (phone ~ '^[0-9]{10,11}$'),
  ADD CONSTRAINT email_format_check CHECK (email IS NULL OR email ~ '^[^@]+@[^@]+\.[^@]+$');

-- Services: validar preços
ALTER TABLE services
  DROP CONSTRAINT IF EXISTS service_price_positive,
  DROP CONSTRAINT IF EXISTS service_duration_positive;

ALTER TABLE services
  ADD CONSTRAINT service_price_positive CHECK (price >= 0),
  ADD CONSTRAINT service_duration_positive CHECK (duration_minutes IS NULL OR duration_minutes > 0);

-- Garantir constraint UNIQUE no telefone do cliente
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_phone_key;
ALTER TABLE clients ADD CONSTRAINT clients_phone_key UNIQUE (phone);