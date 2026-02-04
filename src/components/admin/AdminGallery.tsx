import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Save, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// # GESTÃO DA GALERIA
interface GalleryItem {
  id: string;
  title?: string;
  image_url: string;
  is_active: boolean;
}

export function AdminGallery() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    image_url: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.image_url.trim()) {
      toast({
        title: "Erro",
        description: "URL da imagem é obrigatória",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("gallery").insert({
        title: form.title || null,
        image_url: form.image_url,
        display_order: items.length,
      });

      if (error) throw error;

      toast({
        title: "Imagem adicionada",
        description: "A imagem foi adicionada à galeria.",
      });

      setIsDialogOpen(false);
      setForm({ title: "", image_url: "" });
      fetchGallery();
    } catch (error) {
      console.error("Error saving image:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: GalleryItem) => {
    try {
      const { error } = await supabase
        .from("gallery")
        .update({ is_active: !item.is_active })
        .eq("id", item.id);

      if (error) throw error;

      fetchGallery();
      toast({
        title: item.is_active ? "Imagem ocultada" : "Imagem exibida",
      });
    } catch (error) {
      console.error("Error toggling image:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;

    try {
      const { error } = await supabase.from("gallery").delete().eq("id", id);

      if (error) throw error;

      fetchGallery();
      toast({
        title: "Imagem excluída",
        description: "A imagem foi removida da galeria.",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a imagem.",
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
            Galeria
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie as fotos da galeria
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Imagem
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Adicionar Imagem
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Título (opcional)
                </label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Corte Moderno"
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  URL da Imagem *
                </label>
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-secondary border-border"
                />
              </div>

              {form.image_url && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              )}

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

      {/* # GRID DE IMAGENS */}
      {items.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma imagem na galeria</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-xl overflow-hidden border ${
                item.is_active ? "border-border" : "border-destructive/50"
              }`}
            >
              <div className="aspect-square">
                <img
                  src={item.image_url}
                  alt={item.title || "Galeria"}
                  className={`w-full h-full object-cover ${
                    !item.is_active && "opacity-50"
                  }`}
                />
              </div>

              {/* # OVERLAY */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                {item.title && (
                  <p className="text-white font-medium text-center text-sm">
                    {item.title}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={item.is_active ? "secondary" : "default"}
                    onClick={() => handleToggleActive(item)}
                  >
                    {item.is_active ? "Ocultar" : "Exibir"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* # INDICADOR DE INATIVO */}
              {!item.is_active && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-destructive/80 text-destructive-foreground text-xs rounded">
                  Oculto
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
