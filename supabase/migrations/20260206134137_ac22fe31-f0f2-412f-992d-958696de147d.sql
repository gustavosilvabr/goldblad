-- # CORREÇÃO DE SEGURANÇA 5: Restringir políticas de INSERT nas tabelas de agendamento
-- Essas políticas precisam permitir INSERT anônimo para o fluxo de agendamento funcionar,
-- mas agora temos constraints de validação no banco que protegem contra dados inválidos.

-- Adicionar constraint de validação na tabela appointment_services
ALTER TABLE appointment_services
  DROP CONSTRAINT IF EXISTS service_price_positive;

ALTER TABLE appointment_services
  ADD CONSTRAINT service_price_positive CHECK (price >= 0);

-- Adicionar constraint de validação na tabela appointment_products
ALTER TABLE appointment_products
  DROP CONSTRAINT IF EXISTS product_price_positive,
  DROP CONSTRAINT IF EXISTS quantity_positive;

ALTER TABLE appointment_products
  ADD CONSTRAINT product_price_positive CHECK (price >= 0),
  ADD CONSTRAINT quantity_positive CHECK (quantity IS NULL OR quantity > 0);