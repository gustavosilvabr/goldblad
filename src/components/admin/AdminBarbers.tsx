import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X,
  User
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// # GESTÃO DE BARBEIROS
interface Barber {
  id: string;
  name: string;
  photo_url?: string;
  phone?: string;
  instagram?: string;
  bio?: string;
  is_active: boolean;
}

export function AdminBarbers() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    instagram: "",
    bio: "",
    photo_url: "",
  });

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from("barbers")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setBarbers(data || []);
    } catch (error) {
      console.error("Error fetching barbers:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (barber?: Barber) => {
    if (barber) {
      setEditingBarber(barber);
      setForm({
        name: barber.name,
        phone: barber.phone || "",
        instagram: barber.instagram || "",
        bio: barber.bio || "",
        photo_url: barber.photo_url || "",
      });
    } else {
      setEditingBarber(null);
      setForm({
        name: "",
        phone: "",
        instagram: "",
        bio: "",
        photo_url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editingBarber) {
        const { error } = await supabase
          .from("barbers")
          .update({
            name: form.name,
            phone: form.phone || null,
            instagram: form.instagram || null,
            bio: form.bio || null,
            photo_url: form.photo_url || null,
          })
          .eq("id", editingBarber.id);

        if (error) throw error;

        toast({
          title: "Barbeiro atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        const { error } = await supabase.from("barbers").insert({
          name: form.name,
          phone: form.phone || null,
          instagram: form.instagram || null,
          bio: form.bio || null,
          photo_url: form.photo_url || null,
          display_order: barbers.length,
        });

        if (error) throw error;

        toast({
          title: "Barbeiro adicionado",
          description: "O novo barbeiro foi cadastrado com sucesso.",
        });
      }

      setIsDialogOpen(false);
      fetchBarbers();
    } catch (error) {
      console.error("Error saving barber:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (barber: Barber) => {
    try {
      const { error } = await supabase
        .from("barbers")
        .update({ is_active: !barber.is_active })
        .eq("id", barber.id);

      if (error) throw error;

      fetchBarbers();
      toast({
        title: barber.is_active ? "Barbeiro desativado" : "Barbeiro ativado",
      });
    } catch (error) {
      console.error("Error toggling barber:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este barbeiro?")) return;

    try {
      const { error } = await supabase.from("barbers").delete().eq("id", id);

      if (error) throw error;

      fetchBarbers();
      toast({
        title: "Barbeiro excluído",
        description: "O barbeiro foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting barber:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o barbeiro.",
        variant: "destructive",
      });
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gradient-gold break-words">
            Equipe
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie os barbeiros da barbearia
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Barbeiro
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {editingBarber ? "Editar Barbeiro" : "Novo Barbeiro"}
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Telefone
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Instagram
                </label>
                <Input
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="@usuario"
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  URL da Foto
                </label>
                <Input
                  value={form.photo_url}
                  onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                <Input
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="bg-secondary border-border"
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

      {/* # LISTA DE BARBEIROS */}
      {barbers.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum barbeiro cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className={`bg-card rounded-xl border p-4 transition-all ${
                barber.is_active ? "border-border" : "border-destructive/50 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                  {barber.photo_url ? (
                    <img
                      src={barber.photo_url}
                      alt={barber.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {barber.name}
                  </h3>
                  {barber.instagram && (
                    <p className="text-sm text-primary">{barber.instagram}</p>
                  )}
                  {!barber.is_active && (
                    <span className="inline-block px-2 py-0.5 bg-destructive/20 text-destructive text-xs rounded mt-1">
                      Inativo
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openDialog(barber)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant={barber.is_active ? "secondary" : "default"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleActive(barber)}
                >
                  {barber.is_active ? "Desativar" : "Ativar"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(barber.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
