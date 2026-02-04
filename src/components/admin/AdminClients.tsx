import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Loader2, 
  Search, 
  User, 
  Phone, 
  Calendar, 
  DollarSign,
  MessageSquare,
  History,
  X,
  Scissors,
  Clock
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// # GESTÃO DE CLIENTES COM HISTÓRICO COMPLETO
interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  total_visits: number;
  total_spent: number;
  last_visit_at?: string;
  created_at: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  total_price: number;
  barbers?: { name: string };
  appointment_services?: { service_name: string; price: number }[];
}

export function AdminClients() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientHistory, setClientHistory] = useState<Appointment[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchClients();
    fetchSettings();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from("settings")
        .select("reminder_enabled, reminder_days, reminder_message, whatsapp")
        .limit(1)
        .maybeSingle();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  // # BUSCAR HISTÓRICO DO CLIENTE
  const fetchClientHistory = async (client: Client) => {
    setSelectedClient(client);
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          barbers(name),
          appointment_services(service_name, price)
        `)
        .eq("client_phone", client.phone)
        .order("appointment_date", { ascending: false })
        .order("appointment_time", { ascending: false });

      if (error) throw error;
      setClientHistory(data || []);
    } catch (error) {
      console.error("Error fetching client history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // # ENVIAR MENSAGEM WHATSAPP
  const sendWhatsAppReminder = (client: Client) => {
    const message = settings?.reminder_message || 
      "Olá {NOME}! ✂️💈 Já faz um tempo desde seu último corte. Que tal agendar novamente?";
    const personalizedMessage = message.replace("{NOME}", client.name.split(" ")[0]);
    const phoneClean = client.phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${phoneClean}?text=${encodeURIComponent(personalizedMessage)}`, "_blank");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // # VERIFICAR SE CLIENTE PRECISA DE LEMBRETE
  const needsReminder = (client: Client) => {
    if (!client.last_visit_at || !settings?.reminder_enabled) return false;
    const days = differenceInDays(new Date(), new Date(client.last_visit_at));
    return days >= (settings?.reminder_days || 15);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  // # CLIENTES QUE PRECISAM DE LEMBRETE
  const clientsNeedingReminder = clients.filter(needsReminder);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-500 bg-green-500/10";
      case "completed":
        return "text-primary bg-primary/10";
      case "cancelled":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-secondary";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 min-w-0 overflow-hidden">
      {/* # TÍTULO */}
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gradient-gold break-words">
          Clientes
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Histórico completo e informações dos clientes
        </p>
      </div>

      {/* # ALERTA DE LEMBRETES */}
      {clientsNeedingReminder.length > 0 && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <p className="font-medium text-foreground">
              {clientsNeedingReminder.length} cliente(s) precisam de lembrete
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Estes clientes não visitam há mais de {settings?.reminder_days || 15} dias.
          </p>
        </div>
      )}

      {/* # BUSCA */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou telefone..."
          className="bg-secondary border-border pl-10"
        />
      </div>

      {/* # ESTATÍSTICAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total de Clientes</p>
          <p className="text-2xl font-bold text-foreground">{clients.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total de Visitas</p>
          <p className="text-2xl font-bold text-foreground">
            {clients.reduce((acc, c) => acc + c.total_visits, 0)}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Faturamento Total</p>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(clients.reduce((acc, c) => acc + Number(c.total_spent), 0))}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Precisam Lembrete</p>
          <p className="text-2xl font-bold text-primary">
            {clientsNeedingReminder.length}
          </p>
        </div>
      </div>

      {/* # LISTA DE CLIENTES */}
      {filteredClients.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Cliente</th>
                  <th className="text-left p-4 font-medium text-foreground hidden md:table-cell">Telefone</th>
                  <th className="text-center p-4 font-medium text-foreground">Visitas</th>
                  <th className="text-right p-4 font-medium text-foreground">Total Gasto</th>
                  <th className="text-right p-4 font-medium text-foreground hidden lg:table-cell">Última Visita</th>
                  <th className="text-center p-4 font-medium text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const showReminder = needsReminder(client);
                  return (
                    <tr key={client.id} className={`border-t border-border ${showReminder ? "bg-primary/5" : ""}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${showReminder ? "bg-primary/20" : "bg-primary/10"}`}>
                            <span className="text-primary font-bold">
                              {client.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{client.name}</p>
                            <p className="text-sm text-muted-foreground md:hidden">
                              {client.phone}
                            </p>
                            {showReminder && (
                              <span className="text-xs text-primary">Precisa de lembrete</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {client.phone}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                          {client.total_visits}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-primary">
                        {formatPrice(Number(client.total_spent))}
                      </td>
                      <td className="p-4 text-right text-muted-foreground hidden lg:table-cell">
                        {client.last_visit_at
                          ? format(new Date(client.last_visit_at), "dd/MM/yyyy", { locale: ptBR })
                          : "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => fetchClientHistory(client)}
                            title="Ver histórico"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => sendWhatsAppReminder(client)}
                            title="Enviar WhatsApp"
                            className={showReminder ? "text-primary" : ""}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* # MODAL DE HISTÓRICO */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground">{selectedClient?.name}</p>
                <p className="text-sm text-muted-foreground font-normal">
                  {selectedClient?.phone}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* # RESUMO DO CLIENTE */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{selectedClient?.total_visits || 0}</p>
              <p className="text-xs text-muted-foreground">Visitas</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{formatPrice(Number(selectedClient?.total_spent) || 0)}</p>
              <p className="text-xs text-muted-foreground">Total Gasto</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">
                {selectedClient?.last_visit_at
                  ? differenceInDays(new Date(), new Date(selectedClient.last_visit_at))
                  : "-"}
              </p>
              <p className="text-xs text-muted-foreground">Dias desde visita</p>
            </div>
          </div>

          {/* # HISTÓRICO DE AGENDAMENTOS */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Histórico de Agendamentos</h3>
            
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : clientHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum agendamento encontrado
              </p>
            ) : (
              clientHistory.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-secondary/30 rounded-lg p-4 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {format(new Date(appointment.appointment_date), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                      <span className="text-muted-foreground">
                        {appointment.appointment_time?.slice(0, 5)}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status || "pending")}`}>
                      {getStatusLabel(appointment.status || "pending")}
                    </span>
                  </div>
                  
                  {/* Serviços */}
                  {appointment.appointment_services && appointment.appointment_services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {appointment.appointment_services.map((service, idx) => (
                        <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {service.service_name}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {appointment.barbers?.name || "Sem barbeiro"}
                    </span>
                    <span className="font-bold text-primary">
                      {formatPrice(Number(appointment.total_price) || 0)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* # BOTÃO DE WHATSAPP */}
          {selectedClient && (
            <Button
              variant="whatsapp"
              className="w-full mt-4"
              onClick={() => sendWhatsAppReminder(selectedClient)}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Enviar Mensagem WhatsApp
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
