import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

// # CONFIGURAÇÕES DO ADMIN
export function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    business_name: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    email: "",
    address: "",
    gps_lat: "",
    gps_lng: "",
    opening_hour: "09:00",
    closing_hour: "20:00",
    reminder_enabled: true,
    reminder_days: 15,
    reminder_message: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (data) {
        setSettings({
          business_name: data.business_name || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          email: data.email || "",
          address: data.address || "",
          gps_lat: data.gps_lat?.toString() || "",
          gps_lng: data.gps_lng?.toString() || "",
          opening_hour: data.opening_hour?.slice(0, 5) || "09:00",
          closing_hour: data.closing_hour?.slice(0, 5) || "20:00",
          reminder_enabled: data.reminder_enabled ?? true,
          reminder_days: data.reminder_days || 15,
          reminder_message: data.reminder_message || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("settings")
        .update({
          business_name: settings.business_name,
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          instagram: settings.instagram,
          email: settings.email,
          address: settings.address,
          gps_lat: settings.gps_lat ? parseFloat(settings.gps_lat) : null,
          gps_lng: settings.gps_lng ? parseFloat(settings.gps_lng) : null,
          opening_hour: settings.opening_hour,
          closing_hour: settings.closing_hour,
          reminder_enabled: settings.reminder_enabled,
          reminder_days: settings.reminder_days,
          reminder_message: settings.reminder_message,
        })
        .eq("id", (await supabase.from("settings").select("id").limit(1).single()).data?.id);

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "As alterações foram aplicadas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
    <div className="space-y-6">
      {/* # TÍTULO */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient-gold">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da barbearia
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar
        </Button>
      </div>

      {/* # INFORMAÇÕES GERAIS */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h2 className="text-xl font-display font-semibold text-foreground">
          Informações Gerais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome da Barbearia
            </label>
            <Input
              value={settings.business_name}
              onChange={(e) =>
                setSettings({ ...settings, business_name: e.target.value })
              }
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Telefone
            </label>
            <Input
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              WhatsApp (apenas números)
            </label>
            <Input
              value={settings.whatsapp}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp: e.target.value })
              }
              placeholder="5561992030064"
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Instagram
            </label>
            <Input
              value={settings.instagram}
              onChange={(e) =>
                setSettings({ ...settings, instagram: e.target.value })
              }
              placeholder="@gold_blad_barbearia"
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Endereço
            </label>
            <Input
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Latitude (GPS)
            </label>
            <Input
              value={settings.gps_lat}
              onChange={(e) =>
                setSettings({ ...settings, gps_lat: e.target.value })
              }
              placeholder="-15.7942"
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Longitude (GPS)
            </label>
            <Input
              value={settings.gps_lng}
              onChange={(e) =>
                setSettings({ ...settings, gps_lng: e.target.value })
              }
              placeholder="-47.8822"
              className="bg-secondary border-border"
            />
          </div>
        </div>
      </div>

      {/* # HORÁRIO DE FUNCIONAMENTO */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h2 className="text-xl font-display font-semibold text-foreground">
          Horário de Funcionamento
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Abertura
            </label>
            <Input
              type="time"
              value={settings.opening_hour}
              onChange={(e) =>
                setSettings({ ...settings, opening_hour: e.target.value })
              }
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Fechamento
            </label>
            <Input
              type="time"
              value={settings.closing_hour}
              onChange={(e) =>
                setSettings({ ...settings, closing_hour: e.target.value })
              }
              className="bg-secondary border-border"
            />
          </div>
        </div>
      </div>

      {/* # LEMBRETE AUTOMÁTICO */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h2 className="text-xl font-display font-semibold text-foreground">
          Lembrete Automático (WhatsApp)
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Ativar lembretes</p>
            <p className="text-sm text-muted-foreground">
              Enviar mensagem automática após {settings.reminder_days} dias
            </p>
          </div>
          <Switch
            checked={settings.reminder_enabled}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, reminder_enabled: checked })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Dias após última visita
          </label>
          <Input
            type="number"
            value={settings.reminder_days}
            onChange={(e) =>
              setSettings({
                ...settings,
                reminder_days: parseInt(e.target.value) || 15,
              })
            }
            className="bg-secondary border-border w-32"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Mensagem do lembrete
          </label>
          <Textarea
            value={settings.reminder_message}
            onChange={(e) =>
              setSettings({ ...settings, reminder_message: e.target.value })
            }
            placeholder="Use {NOME} para incluir o nome do cliente"
            className="bg-secondary border-border min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use {"{NOME}"} para incluir o nome do cliente na mensagem
          </p>
        </div>
      </div>
    </div>
  );
}
