-- Adicionar campo para configuração do tamanho do logo
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS logo_size TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS logo_size_custom INTEGER DEFAULT NULL;

-- logo_size pode ser: 'small', 'medium', 'large', 'custom'
-- logo_size_custom é usado apenas quando logo_size = 'custom' (em pixels)