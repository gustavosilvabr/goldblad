import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Save, Scissors } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// # GESTÃO DE SERVIÇOS
interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  description?: string;
  is_active: boolean;
  is_additional: boolean;
}

export function AdminServices() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration_minutes: "30",
    description: "",
    is_additional: false,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setForm({
        name: service.name,
        price: service.price.toString(),
        duration_minutes: service.duration_minutes.toString(),
        description: service.description || "",
        is_additional: service.is_additional,
      });
    } else {
      setEditingService(null);
      setForm({
        name: "",
        price: "",
        duration_minutes: "30",
        description: "",
        is_additional: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast({
        title: "Erro",
        description: "Nome e preço são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        const { error } = await supabase
          .from("services")
          .update({
            name: form.name,
            price: parseFloat(form.price),
            duration_minutes: parseInt(form.duration_minutes),
            description: form.description || null,
            is_additional: form.is_additional,
          })
          .eq("id", editingService.id);

        if (error) throw error;

        toast({
          title: "Serviço atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        const { error } = await supabase.from("services").insert({
          name: form.name,
          price: parseFloat(form.price),
          duration_minutes: parseInt(form.duration_minutes),
          description: form.description || null,
          is_additional: form.is_additional,
          display_order: services.length,
        });

        if (error) throw error;

        toast({
          title: "Serviço adicionado",
          description: "O novo serviço foi cadastrado com sucesso.",
        });
      }

      setIsDialogOpen(false);
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ is_active: !service.is_active })
        .eq("id", service.id);

      if (error) throw error;

      fetchServices();
      toast({
        title: service.is_active ? "Serviço desativado" : "Serviço ativado",
      });
    } catch (error) {
      console.error("Error toggling service:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) throw error;

      fetchServices();
      toast({
        title: "Serviço excluído",
        description: "O serviço foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o serviço.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const mainServices = services.filter((s) => !s.is_additional);
  const additionalServices = services.filter((s) => s.is_additional);

  return (
    <div className="space-y-6 min-w-0 overflow-hidden">
      {/* # TÍTULO */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gradient-gold break-words">
            Serviços
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie os serviços oferecidos
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {editingService ? "Editar Serviço" : "Novo Serviço"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome *
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preço (R$) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Duração (min)
                  </label>
                  <Input
                    type="number"
                    value={form.duration_minutes}
                    onChange={(e) =>
                      setForm({ ...form, duration_minutes: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descrição
                </label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="bg-secondary border-border"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-foreground">Serviço adicional</p>
                  <p className="text-sm text-muted-foreground">
                    Exibir como extra no agendamento
                  </p>
                </div>
                <Switch
                  checked={form.is_additional}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, is_additional: checked })
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* # SERVIÇOS PRINCIPAIS */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Serviços Principais
        </h2>

        {mainServices.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhum serviço principal cadastrado
          </p>
        ) : (
          <div className="space-y-2">
            {mainServices.map((service) => (
              <div
                key={service.id}
                className={`flex items-center justify-between p-4 bg-secondary/50 rounded-lg ${
                  !service.is_active && "opacity-50"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3 min-w-0 flex-1">
                  <Scissors className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.duration_minutes} min
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-bold text-primary whitespace-nowrap">
                    {formatPrice(service.price)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDialog(service)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(service)}
                  >
                    {service.is_active ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* # SERVIÇOS ADICIONAIS */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Serviços Adicionais
        </h2>

        {additionalServices.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhum serviço adicional cadastrado
          </p>
        ) : (
          <div className="space-y-2">
            {additionalServices.map((service) => (
              <div
                key={service.id}
                className={`flex items-center justify-between p-4 bg-secondary/50 rounded-lg ${
                  !service.is_active && "opacity-50"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3 min-w-0 flex-1">
                  <Scissors className="h-5 w-5 text-primary/60 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.duration_minutes} min
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-bold text-primary whitespace-nowrap">
                    {formatPrice(service.price)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDialog(service)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(service)}
                  >
                    {service.is_active ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
