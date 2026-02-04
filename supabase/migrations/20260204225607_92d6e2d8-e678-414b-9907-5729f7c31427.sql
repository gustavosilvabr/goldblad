-- Criar bucket para arquivos da barbearia
INSERT INTO storage.buckets (id, name, public)
VALUES ('barbershop', 'barbershop', true)
ON CONFLICT (id) DO NOTHING;

-- Política para visualização pública
CREATE POLICY "Logos são públicas"
ON storage.objects
FOR SELECT
USING (bucket_id = 'barbershop');

-- Política para upload por admins autenticados
CREATE POLICY "Admins podem fazer upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'barbershop' AND auth.role() = 'authenticated');

-- Política para atualização por admins
CREATE POLICY "Admins podem atualizar"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'barbershop' AND auth.role() = 'authenticated');

-- Política para deleção por admins
CREATE POLICY "Admins podem deletar"
ON storage.objects
FOR DELETE
USING (bucket_id = 'barbershop' AND auth.role() = 'authenticated');