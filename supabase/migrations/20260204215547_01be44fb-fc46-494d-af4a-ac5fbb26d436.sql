-- # TABELA DE CUSTOS DA BARBEARIA
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expense_type TEXT NOT NULL DEFAULT 'variable', -- 'fixed' or 'variable'
  category TEXT, -- 'rent', 'water', 'electricity', 'internet', 'maintenance', 'other'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Expenses editable by admin"
  ON public.expenses FOR ALL
  USING (is_admin());

CREATE POLICY "Expenses readable by admin"
  ON public.expenses FOR SELECT
  USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- # TABELA DE METAS MENSAIS
CREATE TABLE public.monthly_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month_year TEXT NOT NULL, -- format: '2025-02'
  revenue_goal NUMERIC NOT NULL DEFAULT 0,
  subscribers_goal INTEGER NOT NULL DEFAULT 0,
  appointments_goal INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month_year)
);

-- Enable RLS
ALTER TABLE public.monthly_goals ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Monthly goals editable by admin"
  ON public.monthly_goals FOR ALL
  USING (is_admin());

CREATE POLICY "Monthly goals readable by admin"
  ON public.monthly_goals FOR SELECT
  USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_monthly_goals_updated_at
  BEFORE UPDATE ON public.monthly_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();