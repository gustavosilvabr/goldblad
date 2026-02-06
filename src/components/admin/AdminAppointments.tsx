import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Calendar, 
  Clock, 
  Phone, 
  User,
  Check,
  X,
  Search,
  Edit,
  Trash2,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// # GESTÃO COMPLETA DE AGENDAMENTOS
interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  total_price: number;
  barber_id?: string;
  notes?: string;
  barbers?: { name: string } | null;
  appointment_services?: { service_name: string; price: number }[];
}

interface Barber {
  id: string;
  name: string;
}

export function AdminAppointments() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<string>("");  // Sem filtro de data por padrão
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // # MODAL DE EDIÇÃO
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState({
    client_name: "",
    client_phone: "",
    appointment_date: "",
    appointment_time: "",
    barber_id: "",
    total_price: "",
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
    fetchBarbers();
    
    // # REALTIME - Atualiza automaticamente quando agendamentos mudam
    const channel = supabase
      .channel('admin-appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterDate, filterStatus]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("appointments")
        .select("*, barbers(name), appointment_services(service_name, price)")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (filterDate) {
        query = query.eq("appointment_date", filterDate);
      }

      if (filterStatus && filterStatus !== "all") {
        query = query.eq("status", filterStatus as "pending" | "confirmed" | "completed" | "cancelled");
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

  const fetchBarbers = async () => {
    try {
      const { data } = await supabase
        .from("barbers")
        .select("id, name")
        .eq("is_active", true);
      setBarbers(data || []);
    } catch (error) {
      console.error("Error fetching barbers:", error);
    }
  };

  // # ATUALIZAR STATUS
  const handleUpdateStatus = async (id: string, status: "pending" | "confirmed" | "completed" | "cancelled") => {
    try {
      // # SE CONCLUÍDO, USAR FUNÇÃO SEGURA QUE CRIA/ATUALIZA CLIENTE
      if (status === "completed") {
        const appointment = appointments.find((a) => a.id === id);
        if (appointment) {
          const phoneClean = appointment.client_phone.replace(/\D/g, "");
          
          // Usar função RPC segura que valida inputs e atualiza cliente
          const { error } = await supabase.rpc("complete_appointment_and_update_client", {
            p_appointment_id: id,
            p_client_name: appointment.client_name,
            p_client_phone: phoneClean,
            p_total_price: Number(appointment.total_price || 0),
          });

          if (error) throw error;
        }
      } else {
        // Para outros status, apenas atualizar diretamente
        const { error } = await supabase
          .from("appointments")
          .update({ status })
          .eq("id", id);

        if (error) throw error;
      }

      fetchAppointments();
      toast({
        title: "Status atualizado",
        description: `Agendamento ${getStatusLabel(status).toLowerCase()}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  // # ABRIR MODAL DE EDIÇÃO
  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setEditForm({
      client_name: appointment.client_name,
      client_phone: appointment.client_phone,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time?.slice(0, 5) || "",
      barber_id: appointment.barber_id || "",
      total_price: String(appointment.total_price || 0),
      notes: appointment.notes || "",
    });
    setEditDialogOpen(true);
  };

  // # SALVAR EDIÇÃO
  const handleSaveEdit = async () => {
    if (!editingAppointment) return;
    
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          client_name: editForm.client_name,
          client_phone: editForm.client_phone.replace(/\D/g, ""),
          appointment_date: editForm.appointment_date,
          appointment_time: editForm.appointment_time,
          barber_id: editForm.barber_id || null,
          total_price: parseFloat(editForm.total_price) || 0,
          notes: editForm.notes,
        })
        .eq("id", editingAppointment.id);

      if (error) throw error;

      toast({ title: "Agendamento atualizado!" });
      setEditDialogOpen(false);
      setEditingAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  // # EXCLUIR AGENDAMENTO
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;

    try {
      // Primeiro excluir serviços relacionados
      await supabase.from("appointment_services").delete().eq("appointment_id", id);
      await supabase.from("appointment_products").delete().eq("appointment_id", id);
      
      // Depois excluir o agendamento
      const { error } = await supabase.from("appointments").delete().eq("id", id);

      if (error) throw error;

      toast({ title: "Agendamento excluído!" });
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  // # ENVIAR WHATSAPP
  const sendWhatsApp = (appointment: Appointment) => {
    const message = encodeURIComponent(
      `Olá ${appointment.client_name.split(" ")[0]}! Seu agendamento está confirmado ✅\n\n` +
      `📅 Data: ${format(new Date(appointment.appointment_date + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })}\n` +
      `🕐 Horário: ${appointment.appointment_time?.slice(0, 5)}\n` +
      `💵 Valor: R$ ${Number(appointment.total_price).toFixed(2)}\n\n` +
      `Te aguardamos! 💇‍♂️👋`
    );
    window.open(`https://wa.me/55${appointment.client_phone.replace(/\D/g, "")}?text=${message}`, "_blank");
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
        return "bg-yellow-500/20 text-yellow-500";
      case "confirmed":
        return "bg-blue-500/20 text-blue-500";
      case "completed":
        return "bg-green-500/20 text-green-500";
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

  // # ESTATÍSTICAS DO DIA
  const todayStats = {
    total: filteredAppointments.length,
    pending: filteredAppointments.filter((a) => a.status === "pending").length,
    confirmed: filteredAppointments.filter((a) => a.status === "confirmed").length,
    completed: filteredAppointments.filter((a) => a.status === "completed").length,
    revenue: filteredAppointments
      .filter((a) => a.status !== "cancelled")
      .reduce((acc, a) => acc + (Number(a.total_price) || 0), 0),
  };

  return (
    <div className="space-y-6 min-w-0 overflow-hidden">
      {/* # TÍTULO */}
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gradient-gold break-words">
          Agendamentos
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Gerencie os agendamentos da barbearia
        </p>
      </div>

      {/* # ESTATÍSTICAS DO DIA */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-foreground">{todayStats.total}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-500">{todayStats.pending}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Confirmados</p>
          <p className="text-2xl font-bold text-blue-500">{todayStats.confirmed}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Concluídos</p>
          <p className="text-2xl font-bold text-green-500">{todayStats.completed}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-muted-foreground">Faturamento</p>
          <p className="text-xl font-bold text-primary">{formatPrice(todayStats.revenue)}</p>
        </div>
      </div>

      {/* # FILTROS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="bg-secondary border-border pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-secondary border-border w-auto"
          />
          {filterDate && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFilterDate("")}
              title="Limpar filtro de data"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
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
            Nenhum agendamento encontrado
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-card rounded-xl border border-border p-4 md:p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* # INFO DO CLIENTE */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">
                        {appointment.client_name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" />
                      {appointment.client_phone}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                      <span className="flex items-center gap-1 text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        {format(new Date(appointment.appointment_date + "T12:00:00"), "dd/MM", { locale: ptBR })}
                      </span>
                      <span className="flex items-center gap-1 text-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        {appointment.appointment_time?.slice(0, 5)}
                      </span>
                      {appointment.barbers?.name && (
                        <span className="text-muted-foreground">
                          {appointment.barbers.name}
                        </span>
                      )}
                    </div>
                    {/* Serviços */}
                    {appointment.appointment_services && appointment.appointment_services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {appointment.appointment_services.map((service, idx) => (
                          <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {service.service_name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* # AÇÕES */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className="font-bold text-primary text-lg">
                    {formatPrice(Number(appointment.total_price) || 0)}
                  </span>

                  <div className="flex gap-1 flex-wrap">
                    {appointment.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-500 border-green-500/50 hover:bg-green-500 hover:text-white"
                          onClick={() => handleUpdateStatus(appointment.id, "confirmed")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/50 hover:bg-destructive hover:text-white"
                          onClick={() => handleUpdateStatus(appointment.id, "cancelled")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
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

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => sendWhatsApp(appointment)}
                      title="Enviar WhatsApp"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(appointment)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(appointment.id)}
                      title="Excluir"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* # MODAL DE EDIÇÃO */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nome do Cliente</label>
              <Input
                value={editForm.client_name}
                onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Telefone</label>
              <Input
                value={editForm.client_phone}
                onChange={(e) => setEditForm({ ...editForm, client_phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Data</label>
                <Input
                  type="date"
                  value={editForm.appointment_date}
                  onChange={(e) => setEditForm({ ...editForm, appointment_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Horário</label>
                <Input
                  type="time"
                  value={editForm.appointment_time}
                  onChange={(e) => setEditForm({ ...editForm, appointment_time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Barbeiro</label>
              <Select
                value={editForm.barber_id}
                onValueChange={(v) => setEditForm({ ...editForm, barber_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {barbers.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Valor (R$)</label>
              <Input
                type="number"
                step="0.01"
                value={editForm.total_price}
                onChange={(e) => setEditForm({ ...editForm, total_price: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Observações</label>
              <Input
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Notas adicionais..."
              />
            </div>
            <Button onClick={handleSaveEdit} className="w-full">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
