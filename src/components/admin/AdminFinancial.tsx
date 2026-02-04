import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  Trash2,
  Edit,
  Users,
  Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

// # PAINEL FINANCEIRO COMPLETO
export function AdminFinancial() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  
  // # DADOS FINANCEIROS
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [profit, setProfit] = useState(0);
  const [barberStats, setBarberStats] = useState<any[]>([]);
  const [serviceStats, setServiceStats] = useState<any[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<any[]>([]);
  
  // # MODAL DE DESPESA
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [expenseForm, setExpenseForm] = useState({
    name: "",
    amount: "",
    expense_date: format(new Date(), "yyyy-MM-dd"),
    expense_type: "variable",
    category: "other",
  });

  useEffect(() => {
    fetchFinancialData();
  }, [selectedMonth]);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const [year, month] = selectedMonth.split("-").map(Number);
      const monthStart = startOfMonth(new Date(year, month - 1));
      const monthEnd = endOfMonth(new Date(year, month - 1));
      const monthStartStr = format(monthStart, "yyyy-MM-dd");
      const monthEndStr = format(monthEnd, "yyyy-MM-dd");

      // # FATURAMENTO DO MÊS
      const { data: appointments } = await supabase
        .from("appointments")
        .select("*, barbers(name)")
        .gte("appointment_date", monthStartStr)
        .lte("appointment_date", monthEndStr)
        .in("status", ["confirmed", "completed"]);

      const monthRevenue = appointments?.reduce(
        (acc, app) => acc + (Number(app.total_price) || 0),
        0
      ) || 0;

      // # DESPESAS DO MÊS
      const { data: expensesData } = await supabase
        .from("expenses")
        .select("*")
        .gte("expense_date", monthStartStr)
        .lte("expense_date", monthEndStr)
        .order("expense_date", { ascending: false });

      const monthExpenses = expensesData?.reduce(
        (acc, exp) => acc + (Number(exp.amount) || 0),
        0
      ) || 0;

      // # ESTATÍSTICAS POR BARBEIRO
      const barberMap: Record<string, { name: string; revenue: number; count: number }> = {};
      appointments?.forEach((app) => {
        const barberId = app.barber_id || "none";
        const barberName = app.barbers?.name || "Sem barbeiro";
        if (!barberMap[barberId]) {
          barberMap[barberId] = { name: barberName, revenue: 0, count: 0 };
        }
        barberMap[barberId].revenue += Number(app.total_price) || 0;
        barberMap[barberId].count += 1;
      });

      // # FATURAMENTO DIÁRIO
      const dailyMap: Record<string, number> = {};
      appointments?.forEach((app) => {
        const date = app.appointment_date;
        dailyMap[date] = (dailyMap[date] || 0) + (Number(app.total_price) || 0);
      });

      const dailyData = Object.entries(dailyMap)
        .map(([date, value]) => ({
          date: format(new Date(date), "dd/MM"),
          faturamento: value,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // # ESTATÍSTICAS POR SERVIÇO
      const { data: appointmentServices } = await supabase
        .from("appointment_services")
        .select("*, appointments!inner(appointment_date, status)")
        .gte("appointments.appointment_date", monthStartStr)
        .lte("appointments.appointment_date", monthEndStr);

      const serviceMap: Record<string, { name: string; revenue: number; count: number }> = {};
      appointmentServices?.forEach((as) => {
        const name = as.service_name;
        if (!serviceMap[name]) {
          serviceMap[name] = { name, revenue: 0, count: 0 };
        }
        serviceMap[name].revenue += Number(as.price) || 0;
        serviceMap[name].count += 1;
      });

      setRevenue(monthRevenue);
      setExpenses(expensesData || []);
      setTotalExpenses(monthExpenses);
      setProfit(monthRevenue - monthExpenses);
      setBarberStats(Object.values(barberMap));
      setServiceStats(Object.values(serviceMap));
      setDailyRevenue(dailyData);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  // # SALVAR DESPESA
  const handleSaveExpense = async () => {
    try {
      const expenseData = {
        name: expenseForm.name,
        amount: parseFloat(expenseForm.amount),
        expense_date: expenseForm.expense_date,
        expense_type: expenseForm.expense_type,
        category: expenseForm.category,
      };

      if (editingExpense) {
        await supabase
          .from("expenses")
          .update(expenseData)
          .eq("id", editingExpense.id);
        toast({ title: "Despesa atualizada!" });
      } else {
        await supabase.from("expenses").insert(expenseData);
        toast({ title: "Despesa adicionada!" });
      }

      setExpenseDialogOpen(false);
      setEditingExpense(null);
      setExpenseForm({
        name: "",
        amount: "",
        expense_date: format(new Date(), "yyyy-MM-dd"),
        expense_type: "variable",
        category: "other",
      });
      fetchFinancialData();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast({ title: "Erro ao salvar despesa", variant: "destructive" });
    }
  };

  // # EXCLUIR DESPESA
  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Excluir esta despesa?")) return;
    try {
      await supabase.from("expenses").delete().eq("id", id);
      toast({ title: "Despesa excluída!" });
      fetchFinancialData();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // # EDITAR DESPESA
  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setExpenseForm({
      name: expense.name,
      amount: String(expense.amount),
      expense_date: expense.expense_date,
      expense_type: expense.expense_type,
      category: expense.category || "other",
    });
    setExpenseDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // # GERAR MESES PARA SELEÇÃO
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy", { locale: ptBR }),
    };
  });

  const COLORS = ["hsl(43, 74%, 49%)", "hsl(43, 60%, 40%)", "hsl(43, 50%, 30%)", "hsl(0, 0%, 45%)", "hsl(0, 0%, 35%)"];

  const categoryLabels: Record<string, string> = {
    rent: "Aluguel",
    water: "Água",
    electricity: "Luz",
    internet: "Internet",
    maintenance: "Manutenção",
    other: "Outros",
  };

  return (
    <div className="space-y-6 min-w-0 overflow-hidden">
      {/* # TÍTULO E SELETOR DE MÊS */}
      <div className="flex flex-wrap justify-between items-start sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gradient-gold break-words">
            Financeiro
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Controle de faturamento, custos e lucro
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full sm:w-48 flex-shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* # CARDS DE RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faturamento</p>
              <p className="text-2xl font-bold text-green-500">
                {formatCurrency(revenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Despesas</p>
              <p className="text-2xl font-bold text-red-500">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${profit >= 0 ? "bg-primary/10" : "bg-red-500/10"}`}>
              <PiggyBank className={`h-6 w-6 ${profit >= 0 ? "text-primary" : "text-red-500"}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucro</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? "text-primary" : "text-red-500"}`}>
                {formatCurrency(profit)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Margem</p>
              <p className="text-2xl font-bold text-foreground">
                {revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* # GRÁFICO DE FATURAMENTO DIÁRIO */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display font-semibold text-foreground mb-6">
          Faturamento Diário
        </h2>
        <div className="h-[300px]">
          {dailyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Faturamento"]}
                />
                <Bar dataKey="faturamento" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Sem dados para este período
            </div>
          )}
        </div>
      </div>

      {/* # GRID: BARBEIROS E SERVIÇOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* # FATURAMENTO POR BARBEIRO */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-display font-semibold text-foreground">
              Por Barbeiro
            </h2>
          </div>
          {barberStats.length > 0 ? (
            <div className="space-y-4">
              {barberStats.map((barber, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{barber.name}</p>
                    <p className="text-sm text-muted-foreground">{barber.count} atendimentos</p>
                  </div>
                  <p className="font-bold text-primary">{formatCurrency(barber.revenue)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Sem atendimentos neste período
            </p>
          )}
        </div>

        {/* # SERVIÇOS MAIS VENDIDOS */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Scissors className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-display font-semibold text-foreground">
              Serviços Mais Vendidos
            </h2>
          </div>
          {serviceStats.length > 0 ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceStats}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {serviceStats.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Sem vendas neste período
            </p>
          )}
        </div>
      </div>

      {/* # DESPESAS */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-display font-semibold text-foreground">
              Despesas do Mês
            </h2>
          </div>
          <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingExpense(null);
                  setExpenseForm({
                    name: "",
                    amount: "",
                    expense_date: format(new Date(), "yyyy-MM-dd"),
                    expense_type: "variable",
                    category: "other",
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingExpense ? "Editar Despesa" : "Nova Despesa"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nome</label>
                  <Input
                    value={expenseForm.name}
                    onChange={(e) => setExpenseForm({ ...expenseForm, name: e.target.value })}
                    placeholder="Ex: Aluguel, Luz, Água..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Valor (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Data</label>
                  <Input
                    type="date"
                    value={expenseForm.expense_date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Tipo</label>
                  <Select
                    value={expenseForm.expense_type}
                    onValueChange={(v) => setExpenseForm({ ...expenseForm, expense_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixo</SelectItem>
                      <SelectItem value="variable">Variável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Categoria</label>
                  <Select
                    value={expenseForm.category}
                    onValueChange={(v) => setExpenseForm({ ...expenseForm, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Aluguel</SelectItem>
                      <SelectItem value="water">Água</SelectItem>
                      <SelectItem value="electricity">Luz</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                      <SelectItem value="maintenance">Manutenção</SelectItem>
                      <SelectItem value="other">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveExpense} className="w-full">
                  {editingExpense ? "Salvar Alterações" : "Adicionar Despesa"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {expenses.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma despesa cadastrada neste mês
          </p>
        ) : (
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-foreground">{expense.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {categoryLabels[expense.category] || expense.category} •{" "}
                      {format(new Date(expense.expense_date), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-red-500">
                    -{formatCurrency(Number(expense.amount))}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditExpense(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
