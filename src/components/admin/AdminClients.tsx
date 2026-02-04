import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Loader2, Search, User, Phone, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// # GESTÃO DE CLIENTES
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

export function AdminClients() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* # TÍTULO */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gradient-gold">
          Clientes
        </h1>
        <p className="text-muted-foreground">
          Histórico e informações dos clientes
        </p>
      </div>

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <th className="text-right p-4 font-medium text-foreground hidden md:table-cell">Última Visita</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{client.name}</p>
                          <p className="text-sm text-muted-foreground md:hidden">
                            {client.phone}
                          </p>
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
                    <td className="p-4 text-right text-muted-foreground hidden md:table-cell">
                      {client.last_visit_at
                        ? format(new Date(client.last_visit_at), "dd/MM/yyyy", { locale: ptBR })
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
