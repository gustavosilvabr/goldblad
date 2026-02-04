import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Calendar, 
  Clock, 
  Phone, 
  User,
  Check,
  X,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// # GESTÃO DE AGENDAMENTOS
interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  total_price: number;
  barbers?: { name: string } | null;
}

export function AdminAppointments() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    fetchAppointments();
  }, [filterDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("appointments")
        .select("*, barbers(name)")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (filterDate) {
        query = query.eq("appointment_date", filterDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: "pending" | "confirmed" | "completed" | "cancelled") => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      fetchAppointments();
      toast({
        title: "Status atualizado",
        description: `Agendamento marcado como ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/20 text-warning";
      case "confirmed":
        return "bg-info/20 text-info";
      case "completed":
        return "bg-success/20 text-success";
      case "cancelled":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "confirmed":
        return "Confirmado";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.client_phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* # TÍTULO */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gradient-gold">
          Agendamentos
        </h1>
        <p className="text-muted-foreground">
          Gerencie os agendamentos da barbearia
        </p>
      </div>

      {/* # FILTROS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="bg-secondary border-border pl-10"
          />
        </div>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-secondary border-border w-auto"
        />
      </div>

      {/* # LISTA DE AGENDAMENTOS */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Nenhum agendamento encontrado para esta data
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-card rounded-xl border border-border p-4 md:p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* # INFO DO CLIENTE */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {appointment.client_name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {appointment.client_phone}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        {format(new Date(appointment.appointment_date + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <span className="flex items-center gap-1 text-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        {appointment.appointment_time?.slice(0, 5)}
                      </span>
                    </div>
                    {appointment.barbers?.name && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Barbeiro: {appointment.barbers.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* # AÇÕES */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-lg">
                      {formatPrice(Number(appointment.total_price) || 0)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>

                  {appointment.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success border-success hover:bg-success hover:text-white"
                        onClick={() => handleUpdateStatus(appointment.id, "confirmed")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirmar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                        onClick={() => handleUpdateStatus(appointment.id, "cancelled")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  )}

                  {appointment.status === "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(appointment.id, "completed")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Concluir
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
