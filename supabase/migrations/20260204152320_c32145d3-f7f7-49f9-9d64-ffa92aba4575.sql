-- ====================================================================
-- # GOLD BLADE BARBEARIA - Modelagem do Banco de Dados
-- ====================================================================

-- # Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- # Enum para status de agendamento
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- # Enum para roles de usuário
CREATE TYPE app_role AS ENUM ('admin', 'barber');

-- ====================================================================
-- # TABELA: settings (Configurações gerais da barbearia)
-- ====================================================================
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL DEFAULT 'Gold Blade Barbearia',
    logo_url TEXT,
    phone TEXT DEFAULT '61992030064',
    whatsapp TEXT DEFAULT '61992030064',
    instagram TEXT DEFAULT '@gold_blad_barbearia',
    email TEXT,
    address TEXT,
    gps_lat DECIMAL(10, 8),
    gps_lng DECIMAL(11, 8),
    opening_hour TIME DEFAULT '09:00',
    closing_hour TIME DEFAULT '20:00',
    working_days TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    reminder_enabled BOOLEAN DEFAULT true,
    reminder_days INTEGER DEFAULT 15,
    reminder_message TEXT DEFAULT 'Olá {NOME}! ✂️💈 Já faz um tempo desde seu último corte. Que tal agendar novamente?',
    theme_primary_color TEXT DEFAULT '#c9a227',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- # Inserir configuração padrão
INSERT INTO public.settings (business_name) VALUES ('Gold Blade Barbearia');

-- ====================================================================
-- # TABELA: user_roles (Roles de admin)
-- ====================================================================
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);

-- ====================================================================
-- # TABELA: barbers (Barbeiros)
-- ====================================================================
CREATE TABLE public.barbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    photo_url TEXT,
    phone TEXT,
    instagram TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- # TABELA: services (Serviços)
-- ====================================================================
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    is_additional BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- # Inserir serviços padrão
INSERT INTO public.services (name, price, duration_minutes, display_order) VALUES
('Corte', 35.00, 30, 1),
('Sobrancelha', 15.00, 15, 2),
('Corte + Sobrancelha', 45.00, 40, 3);

INSERT INTO public.services (name, price, duration_minutes, is_additional, display_order) VALUES
('Progressiva', 80.00, 60, true, 4),
('Pintura', 50.00, 45, true, 5),
('Minoxidil', 40.00, 15, true, 6);

-- ====================================================================
-- # TABELA: products (Produtos)
-- ====================================================================
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- # Inserir produtos padrão
INSERT INTO public.products (name, price, display_order) VALUES
('Pasta Modeladora', 35.00, 1),
('Shampoo', 25.00, 2),
('Pente', 15.00, 3);

-- ====================================================================
-- # TABELA: clients (Clientes)
-- ====================================================================
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    total_visits INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    last_visit_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- # TABELA: appointments (Agendamentos)
-- ====================================================================
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status appointment_status DEFAULT 'pending',
    total_price DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- # TABELA: appointment_services (Serviços do agendamento)
-- ====================================================================
CREATE TABLE public.appointment_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- # TABELA: appointment_products (Produtos vendidos no agendamento)
-- ====================================================================
CREATE TABLE public.appointment_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- # TABELA: gallery (Galeria de fotos)
-- ====================================================================
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    image_url TEXT NOT NULL,
    is_video BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- # TABELA: reviews (Avaliações)
-- ====================================================================
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    source TEXT DEFAULT 'manual',
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- # Inserir avaliações de exemplo
INSERT INTO public.reviews (client_name, rating, comment, is_visible) VALUES
('Carlos Silva', 5, 'Melhor barbearia da região! Atendimento impecável.', true),
('João Pedro', 5, 'Corte perfeito, ambiente top. Super recomendo!', true),
('Lucas Mendes', 5, 'Profissionais excelentes, voltarei sempre!', true);

-- ====================================================================
-- # TABELA: subscriptions (Planos de assinatura)
-- ====================================================================
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    benefits TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- # TABELA: blocked_dates (Datas/horários bloqueados)
-- ====================================================================
CREATE TABLE public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocked_date DATE NOT NULL,
    blocked_time TIME,
    barber_id UUID REFERENCES public.barbers(id) ON DELETE CASCADE,
    reason TEXT,
    is_full_day BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- # FUNÇÃO: has_role (Verificar role do usuário)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ====================================================================
-- # FUNÇÃO: is_admin (Verificar se é admin)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- ====================================================================
-- # TRIGGER: Atualizar updated_at
-- ====================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_barbers_updated_at BEFORE UPDATE ON public.barbers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ====================================================================
-- # RLS POLICIES
-- ====================================================================

-- Settings: leitura pública, escrita admin
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings readable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Settings editable by admin" ON public.settings FOR ALL USING (public.is_admin());

-- Barbers: leitura pública, escrita admin
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Barbers readable by everyone" ON public.barbers FOR SELECT USING (true);
CREATE POLICY "Barbers editable by admin" ON public.barbers FOR ALL USING (public.is_admin());

-- Services: leitura pública, escrita admin
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services readable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Services editable by admin" ON public.services FOR ALL USING (public.is_admin());

-- Products: leitura pública, escrita admin
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products readable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products editable by admin" ON public.products FOR ALL USING (public.is_admin());

-- Gallery: leitura pública, escrita admin
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery readable by everyone" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Gallery editable by admin" ON public.gallery FOR ALL USING (public.is_admin());

-- Reviews: leitura pública (visíveis), escrita admin
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visible reviews readable by everyone" ON public.reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "All reviews readable by admin" ON public.reviews FOR SELECT USING (public.is_admin());
CREATE POLICY "Reviews editable by admin" ON public.reviews FOR ALL USING (public.is_admin());

-- Subscriptions: leitura pública, escrita admin
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subscriptions readable by everyone" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Subscriptions editable by admin" ON public.subscriptions FOR ALL USING (public.is_admin());

-- Blocked dates: leitura pública, escrita admin
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blocked dates readable by everyone" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Blocked dates editable by admin" ON public.blocked_dates FOR ALL USING (public.is_admin());

-- Clients: leitura e escrita admin, inserção pública (para novos clientes)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients readable by admin" ON public.clients FOR SELECT USING (public.is_admin());
CREATE POLICY "Clients insertable by anyone" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Clients editable by admin" ON public.clients FOR UPDATE USING (public.is_admin());
CREATE POLICY "Clients deletable by admin" ON public.clients FOR DELETE USING (public.is_admin());

-- Appointments: leitura admin, inserção pública
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Appointments readable by admin" ON public.appointments FOR SELECT USING (public.is_admin());
CREATE POLICY "Appointments insertable by anyone" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Appointments editable by admin" ON public.appointments FOR UPDATE USING (public.is_admin());
CREATE POLICY "Appointments deletable by admin" ON public.appointments FOR DELETE USING (public.is_admin());

-- Appointment services: seguir appointment
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Appointment services readable by admin" ON public.appointment_services FOR SELECT USING (public.is_admin());
CREATE POLICY "Appointment services insertable by anyone" ON public.appointment_services FOR INSERT WITH CHECK (true);
CREATE POLICY "Appointment services editable by admin" ON public.appointment_services FOR ALL USING (public.is_admin());

-- Appointment products: seguir appointment
ALTER TABLE public.appointment_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Appointment products readable by admin" ON public.appointment_products FOR SELECT USING (public.is_admin());
CREATE POLICY "Appointment products insertable by anyone" ON public.appointment_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Appointment products editable by admin" ON public.appointment_products FOR ALL USING (public.is_admin());

-- User roles: admin only
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User roles readable by admin" ON public.user_roles FOR SELECT USING (public.is_admin() OR user_id = auth.uid());
CREATE POLICY "User roles editable by admin" ON public.user_roles FOR ALL USING (public.is_admin());