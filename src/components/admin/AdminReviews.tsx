import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Save, Star, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// # GESTÃO DE AVALIAÇÕES
interface Review {
  id: string;
  client_name: string;
  rating: number;
  comment?: string;
  is_visible: boolean;
}

export function AdminReviews() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    client_name: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Buscar todas as avaliações (admin pode ver todas)
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.client_name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do cliente é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        client_name: form.client_name,
        rating: form.rating,
        comment: form.comment || null,
        is_visible: true,
      });

      if (error) throw error;

      toast({
        title: "Avaliação adicionada",
        description: "A avaliação foi cadastrada com sucesso.",
      });

      setIsDialogOpen(false);
      setForm({ client_name: "", rating: 5, comment: "" });
      fetchReviews();
    } catch (error) {
      console.error("Error saving review:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisible = async (review: Review) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_visible: !review.is_visible })
        .eq("id", review.id);

      if (error) throw error;

      fetchReviews();
      toast({
        title: review.is_visible ? "Avaliação ocultada" : "Avaliação visível",
      });
    } catch (error) {
      console.error("Error toggling review:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return;

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) throw error;

      fetchReviews();
      toast({
        title: "Avaliação excluída",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a avaliação.",
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
            Avaliações
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie as avaliações exibidas no site
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Avaliação
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Adicionar Avaliação
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome do Cliente *
                </label>
                <Input
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Avaliação
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= form.rating
                            ? "text-primary fill-primary"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Comentário
                </label>
                <Textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="bg-secondary border-border"
                  rows={3}
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

      {/* # LISTA DE AVALIAÇÕES */}
      {reviews.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma avaliação cadastrada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`bg-card rounded-xl border p-6 ${
                review.is_visible ? "border-border" : "border-muted opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* # ESTRELAS */}
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? "text-primary fill-primary"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {/* # COMENTÁRIO */}
                  {review.comment && (
                    <p className="text-foreground mb-4">"{review.comment}"</p>
                  )}

                  {/* # AUTOR */}
                  <p className="font-semibold text-foreground">
                    {review.client_name}
                  </p>

                  {!review.is_visible && (
                    <span className="inline-block mt-2 px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                      Oculto no site
                    </span>
                  )}
                </div>

                {/* # AÇÕES */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleVisible(review)}
                  >
                    {review.is_visible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
