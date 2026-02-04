import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock
} from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// # DASHBOARD DO ADMIN
export function AdminDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    monthAppointments: 0,
    totalClients: 0,
    monthRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date();
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      // # Agendamentos de hoje
      const { count: todayCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .gte("appointment_date", format(todayStart, "yyyy-MM-dd"))
        .lte("appointment_date", format(todayEnd, "yyyy-MM-dd"));

      // # Agendamentos do mês
      const { data: monthAppointments, count: monthCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact" })
        .gte("appointment_date", format(monthStart, "yyyy-MM-dd"))
        .lte("appointment_date", format(monthEnd, "yyyy-MM-dd"));

      // # Total de clientes
      const { count: clientsCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

      // # Faturamento do mês
      const monthRevenue = monthAppointments?.reduce(
        (acc, app) => acc + (Number(app.total_price) || 0), 
        0
      ) || 0;

      // # Últimos agendamentos
      const { data: recent } = await supabase
        .from("appointments")
        .select("*, barbers(name)")
        .order("created_at", { ascending: false })
        .limit(5);

      // # Dados para o gráfico (últimos 7 dias)
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = format(date, "yyyy-MM-dd");

        const dayAppointments = monthAppointments?.filter(
          (app) => app.appointment_date === dateStr
        ) || [];

        chartData.push({
          date: format(date, "EEE", { locale: ptBR }),
          agendamentos: dayAppointments.length,
          faturamento: dayAppointments.reduce(
            (acc, app) => acc + (Number(app.total_price) || 0),
            0
          ),
        });
      }

      setStats({
        todayAppointments: todayCount || 0,
        monthAppointments: monthCount || 0,
        totalClients: clientsCount || 0,
        monthRevenue,
      });
      setRecentAppointments(recent || []);
      setChartData(chartData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6 min-w-0 overflow-hidden">
      {/* # TÍTULO */}
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gradient-gold break-words">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Bem-vindo ao painel administrativo
        </p>
      </div>

      {/* # CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hoje</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.todayAppointments}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Este Mês</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.monthAppointments}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clientes</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalClients}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faturamento</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.monthRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* # GRÁFICO */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display font-semibold text-foreground mb-6">
          Últimos 7 Dias
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar 
                dataKey="agendamentos" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* # ÚLTIMOS AGENDAMENTOS */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display font-semibold text-foreground mb-6">
          Últimos Agendamentos
        </h2>
        
        {recentAppointments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum agendamento encontrado
          </p>
        ) : (
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">
                      {appointment.client_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(appointment.appointment_date), "dd/MM/yyyy")} às {appointment.appointment_time?.slice(0, 5)}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-primary">
                    {formatCurrency(Number(appointment.total_price) || 0)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                    {appointment.barbers?.name || "Sem barbeiro"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
