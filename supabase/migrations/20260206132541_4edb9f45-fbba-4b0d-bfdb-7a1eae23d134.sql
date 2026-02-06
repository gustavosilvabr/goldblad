-- # Criar bucket para fotos dos barbeiros
INSERT INTO storage.buckets (id, name, public)
VALUES ('barber-photos', 'barber-photos', true)
ON CONFLICT (id) DO NOTHING;

-- # Política para permitir upload por admins autenticados
CREATE POLICY "Admins can upload barber photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'barber-photos');

-- # Política para permitir update por admins autenticados
CREATE POLICY "Admins can update barber photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'barber-photos');

-- # Política para permitir delete por admins autenticados
CREATE POLICY "Admins can delete barber photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'barber-photos');

-- # Política para permitir leitura pública
CREATE POLICY "Barber photos are public"
ON storage.objects
FOR SELECT
USING (bucket_id = 'barber-photos');