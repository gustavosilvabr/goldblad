-- Remover políticas existentes de INSERT para clients
DROP POLICY IF EXISTS "Clients insertable by anyone" ON public.clients;

-- Criar política PERMISSIVA para INSERT em clients
CREATE POLICY "Clients insertable by anyone" 
ON public.clients 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);