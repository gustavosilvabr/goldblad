// # AUTOMAÇÃO WHATSAPP - LEMBRETE 15 DIAS
// Esta função envia lembretes automáticos para clientes que não visitam há 15+ dias
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // # CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // # BUSCAR CONFIGURAÇÕES
    const { data: settings } = await supabase
      .from("settings")
      .select("reminder_enabled, reminder_days, reminder_message, whatsapp")
      .limit(1)
      .single();

    if (!settings?.reminder_enabled) {
      return new Response(
        JSON.stringify({ success: false, message: "Lembretes desativados" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const reminderDays = settings.reminder_days || 15;
    const reminderMessage = settings.reminder_message || 
      "Olá {NOME}! ✂️💈 Já faz um tempo desde seu último corte. Que tal agendar novamente?";

    // # CALCULAR DATA LIMITE
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - reminderDays);

    // # BUSCAR CLIENTES PARA LEMBRETE
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("id, name, phone, last_visit_at")
      .not("last_visit_at", "is", null)
      .lte("last_visit_at", limitDate.toISOString());

    if (clientsError) {
      throw clientsError;
    }

    if (!clients || clients.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "Nenhum cliente para lembrete", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // # PREPARAR MENSAGENS (não envia de fato, apenas gera os links)
    // Nota: Para envio real automático, precisaria de integração com WhatsApp Business API
    const reminders = clients.map((client) => {
      const personalizedMessage = reminderMessage
        .replace("{NOME}", client.name.split(" ")[0]);

      const whatsappLink = `https://wa.me/55${client.phone.replace(/\D/g, "")}?text=${encodeURIComponent(personalizedMessage)}`;

      return {
        client_id: client.id,
        client_name: client.name,
        client_phone: client.phone,
        last_visit: client.last_visit_at,
        message: personalizedMessage,
        whatsapp_link: whatsappLink,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `${reminders.length} clientes precisam de lembrete`,
        reminders,
        settings: {
          reminder_days: reminderDays,
          reminder_enabled: settings.reminder_enabled,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
