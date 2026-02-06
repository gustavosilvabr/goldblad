import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, User, Phone, Scissors, Check, MessageSquare, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfToday, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// # FORMULÁRIO DE AGENDAMENTO COM SALVAMENTO NO BANCO
interface Barber {
  id: string;
  name: string;
  photo_url?: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

interface BookingFormProps {
  barbers?: Barber[];
  services?: Service[];
  whatsapp?: string;
  openingHour?: string;
  closingHour?: string;
}

const defaultBarbers: Barber[] = [
  { id: "1", name: "Carlos Silva" },
  { id: "2", name: "João Pedro" },
  { id: "3", name: "Lucas Mendes" },
];

const defaultServices: Service[] = [
  { id: "1", name: "Corte", price: 35, duration_minutes: 30 },
  { id: "2", name: "Sobrancelha", price: 15, duration_minutes: 15 },
  { id: "3", name: "Corte + Sobrancelha", price: 45, duration_minutes: 40 },
  { id: "4", name: "Progressiva", price: 80, duration_minutes: 60 },
  { id: "5", name: "Pintura", price: 50, duration_minutes: 45 },
];

// # HORÁRIOS DISPONÍVEIS
const generateTimeSlots = (openingHour = "09:00", closingHour = "20:00") => {
  const slots: string[] = [];
  const [openH] = openingHour.split(":").map(Number);
  const [closeH] = closingHour.split(":").map(Number);
  
  for (let h = openH; h < closeH; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
    slots.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return slots;
};

const stepTitles = [
  { title: "Seus Dados", icon: User },
  { title: "Barbeiro", icon: Scissors },
  { title: "Serviços", icon: Scissors },
  { title: "Data e Hora", icon: CalendarIcon },
];

export function BookingForm({
  barbers = defaultBarbers,
  services = defaultServices,
  whatsapp = "5561992030064",
  openingHour = "09:00",
  closingHour = "20:00",
}: BookingFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // # HORÁRIOS BLOQUEADOS E AGENDADOS
  const [blockedSlots, setBlockedSlots] = useState<{ date: string; time?: string; barber_id?: string }[]>([]);
  const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string; barber_id?: string }[]>([]);

  const timeSlots = generateTimeSlots(openingHour, closingHour);

  // # BUSCAR HORÁRIOS OCUPADOS (usando função segura que não expõe dados pessoais)
  useEffect(() => {
    const fetchBlockedSlots = async () => {
      try {
        // Buscar datas bloqueadas
        const { data: blocked } = await supabase
          .from("blocked_dates")
          .select("blocked_date, blocked_time, is_full_day, barber_id");

        // Buscar agendamentos existentes usando função RPC segura (não expõe dados pessoais)
        const { data: bookedSlotsData, error } = await supabase
          .rpc("get_booked_slots");

        if (error) {
          console.error("Error fetching booked slots:", error);
        }

        if (blocked) {
          setBlockedSlots(
            blocked.map((b) => ({
              date: b.blocked_date,
              time: b.is_full_day ? undefined : b.blocked_time || undefined,
              barber_id: b.barber_id || undefined,
            }))
          );
        }

        if (bookedSlotsData) {
          setBookedSlots(
            bookedSlotsData.map((a: { appointment_date: string; appointment_time: string; barber_id: string | null }) => ({
              date: a.appointment_date,
              time: a.appointment_time,
              barber_id: a.barber_id || undefined,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchBlockedSlots();
  }, []);

  // # FORMATAR TELEFONE
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // # VERIFICAR SE HORÁRIO ESTÁ DISPONÍVEL
  const isSlotAvailable = (date: Date, time: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    // Verificar se está bloqueado (para o barbeiro selecionado ou bloqueio geral)
    const isBlocked = blockedSlots.some(
      (slot) => 
        slot.date === dateStr && 
        (!slot.time || slot.time === time) &&
        (!slot.barber_id || slot.barber_id === selectedBarber || selectedBarber === "any")
    );
    
    // Verificar se já está agendado para o barbeiro selecionado
    const isBooked = bookedSlots.some((slot) => {
      if (slot.date !== dateStr || slot.time !== time) return false;
      
      // Se o usuário escolheu "qualquer barbeiro", verifica todos os slots
      if (selectedBarber === "any") {
        // Se todos os barbeiros estão ocupados nesse horário, bloqueia
        const barbersWithSlot = bookedSlots.filter(
          (s) => s.date === dateStr && s.time === time
        );
        // Se há menos agendamentos que barbeiros, ainda há disponibilidade
        return barbersWithSlot.length >= barbers.length;
      }
      
      // Se escolheu barbeiro específico, verifica apenas para ele
      return slot.barber_id === selectedBarber;
    });

    // Verificar se é horário passado (para hoje)
    const now = new Date();
    if (format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")) {
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date(date);
      slotTime.setHours(hours, minutes, 0, 0);
      if (slotTime <= now) return false;
    }

    return !isBlocked && !isBooked;
  };

  // # CALCULAR TOTAL
  const calculateTotal = () => {
    return services
      .filter((s) => selectedServices.includes(s.id))
      .reduce((acc, s) => acc + s.price, 0);
  };

  // # TOGGLE SERVIÇO
  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // # SALVAR E ENVIAR PARA WHATSAPP
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    
    try {
      const phoneClean = phone.replace(/\D/g, "");
      const total = calculateTotal();
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      // # 1. VERIFICAR SE CLIENTE EXISTE (apenas para referência)
      let clientId: string | null = null;
      
      const { data: existingClient } = await supabase
        .from("clients")
        .select("id")
        .eq("phone", phoneClean)
        .maybeSingle();

      if (existingClient) {
        clientId = existingClient.id;
      }
      // NOTA: O cliente só será criado/atualizado quando o agendamento for CONCLUÍDO

      // # 2. CRIAR AGENDAMENTO
      const barberId = selectedBarber === "any" ? null : selectedBarber;
      
      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          client_id: clientId,
          client_name: name,
          client_phone: phoneClean,
          barber_id: barberId,
          appointment_date: dateStr,
          appointment_time: selectedTime,
          total_price: total,
          status: "pending",
        })
        .select("id")
        .single();

      if (appointmentError) throw appointmentError;

      // # 3. SALVAR SERVIÇOS DO AGENDAMENTO
      if (appointment) {
        const serviceRecords = selectedServices.map((serviceId) => {
          const service = services.find((s) => s.id === serviceId);
          return {
            appointment_id: appointment.id,
            service_id: serviceId,
            service_name: service?.name || "",
            price: service?.price || 0,
          };
        });

        await supabase.from("appointment_services").insert(serviceRecords);
      }

      // # 4. REDIRECIONAR PARA WHATSAPP
      const barberName = selectedBarber === "any" 
        ? "Qualquer barbeiro disponível"
        : barbers.find((b) => b.id === selectedBarber)?.name || "";
      
      const serviceNames = services
        .filter((s) => selectedServices.includes(s.id))
        .map((s) => s.name)
        .join(", ");

      const dateFormatted = format(selectedDate, "dd/MM/yyyy (EEEE)", { locale: ptBR });

      const message = encodeURIComponent(
        `Olá! Meu nome é ${name}.\n` +
        `Gostaria de agendar:\n\n` +
        `👤 Barbeiro: ${barberName}\n` +
        `📅 Data: ${dateFormatted}\n` +
        `⏰ Horário: ${selectedTime}\n` +
        `✂️ Serviços: ${serviceNames}\n` +
        `💰 Total: R$ ${total.toFixed(2)}\n` +
        `📞 Telefone: ${phone}\n\n` +
        `Aguardo confirmação!`
      );

      toast({
        title: "Agendamento realizado!",
        description: "Você será redirecionado para o WhatsApp.",
      });

      // Pequeno delay para mostrar o toast
      setTimeout(() => {
        window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
        
        // Resetar formulário
        setStep(1);
        setName("");
        setPhone("");
        setSelectedBarber(null);
        setSelectedServices([]);
        setSelectedDate(null);
        setSelectedTime(null);
      }, 500);

    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Erro ao agendar",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // # VALIDAÇÃO
  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 10;
      case 2:
        return selectedBarber !== null;
      case 3:
        return selectedServices.length > 0;
      case 4:
        return selectedDate !== null && selectedTime !== null;
      default:
        return false;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <section id="agendar" className="py-16 md:py-24 relative overflow-hidden">
      {/* # BACKGROUND SÓLIDO */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <CalendarIcon className="h-4 w-4" />
            Agendamento Rápido
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gradient-gold mb-3">
            Agende Seu Horário
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Em poucos cliques você garante seu horário
          </p>
        </motion.div>

        {/* # INDICADOR DE PASSOS */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-1 md:gap-2 bg-card rounded-full px-3 py-2 md:px-4 md:py-3 border border-border">
            {stepTitles.map((s, index) => {
              const stepNum = index + 1;
              const Icon = s.icon;
              return (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full transition-all ${
                      step >= stepNum
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step > stepNum ? (
                      <Check className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <Icon className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                    <span className="hidden sm:inline text-xs md:text-sm font-medium">{s.title}</span>
                  </div>
                  {stepNum < 4 && (
                    <ChevronRight className={`h-3 w-3 md:h-4 md:w-4 mx-0.5 md:mx-1 ${step > stepNum ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* # FORMULÁRIO */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl md:rounded-3xl border border-border p-5 md:p-8 shadow-xl relative overflow-hidden">
            {/* # DECORAÇÃO SUTIL */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            {/* # STEP 1: DADOS DO CLIENTE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-foreground">
                      Seus Dados
                    </h3>
                    <p className="text-sm text-muted-foreground">Preencha suas informações</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Seu Nome
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Digite seu nome completo"
                      className="bg-secondary/50 border-border h-12 text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        placeholder="(00) 00000-0000"
                        className="bg-secondary/50 border-border h-12 text-lg pl-12"
                        maxLength={15}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* # STEP 2: ESCOLHER BARBEIRO */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scissors className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-foreground">
                      Escolha o Barbeiro
                    </h3>
                    <p className="text-sm text-muted-foreground">Selecione seu preferido</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedBarber("any")}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      selectedBarber === "any"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground">Qualquer barbeiro</p>
                    <p className="text-sm text-muted-foreground">O primeiro disponível</p>
                  </motion.button>

                  {barbers.map((barber, index) => (
                    <motion.button
                      key={barber.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBarber(barber.id)}
                      className={`p-5 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                        selectedBarber === barber.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {barber.photo_url ? (
                          <img
                            src={barber.photo_url}
                            alt={barber.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <p className="font-semibold text-foreground">{barber.name}</p>
                      </div>
                      {selectedBarber === barber.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* # STEP 3: ESCOLHER SERVIÇOS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scissors className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-foreground">
                      Escolha os Serviços
                    </h3>
                    <p className="text-sm text-muted-foreground">Selecione um ou mais</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {services.map((service, index) => (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleService(service.id)}
                      className={`p-5 rounded-xl border-2 flex justify-between items-center transition-all ${
                        selectedServices.includes(service.id)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-semibold text-foreground">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.duration_minutes} min</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-primary">{formatPrice(service.price)}</span>
                        {selectedServices.includes(service.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {selectedServices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t border-border flex justify-between items-center bg-secondary/30 rounded-xl p-4"
                  >
                    <span className="text-foreground font-medium">Total:</span>
                    <motion.span
                      key={calculateTotal()}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold text-primary"
                    >
                      {formatPrice(calculateTotal())}
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* # STEP 4: ESCOLHER DATA E HORÁRIO */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-display font-semibold text-foreground">
                      Data e Horário
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Quando você deseja vir?</p>
                  </div>
                </div>

                {/* # LAYOUT RESPONSIVO: CALENDÁRIO + HORÁRIOS */}
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* # CALENDÁRIO COMPLETO */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      Escolha o dia
                    </p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-secondary/30 rounded-2xl p-2 sm:p-4 border border-border flex justify-center"
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={(date) => {
                          setSelectedDate(date || null);
                          setSelectedTime(null);
                        }}
                        disabled={(date) => isBefore(date, startOfToday())}
                        locale={ptBR}
                        className="pointer-events-auto w-full"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                          month: "space-y-4 w-full",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-base sm:text-lg font-semibold text-foreground",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-8 w-8 sm:h-9 sm:w-9 bg-primary/10 hover:bg-primary/20 rounded-lg p-0 text-primary hover:text-primary transition-colors",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse",
                          head_row: "flex w-full",
                          head_cell: "text-muted-foreground rounded-md w-full font-medium text-xs sm:text-sm py-2",
                          row: "flex w-full mt-1 sm:mt-2",
                          cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1 aspect-square",
                          day: "h-full w-full p-0 font-medium rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center text-sm sm:text-base",
                          day_range_end: "day-range-end",
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-gold",
                          day_today: "bg-accent text-accent-foreground font-bold ring-2 ring-primary/50",
                          day_outside: "day-outside text-muted-foreground opacity-30",
                          day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent",
                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible",
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* # HORÁRIOS */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Escolha o horário
                    </p>
                    
                    {selectedDate ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-secondary/30 rounded-2xl p-3 sm:p-4 border border-border"
                      >
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 text-center">
                          {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {timeSlots.map((time, index) => {
                            const available = isSlotAvailable(selectedDate, time);
                            return (
                              <motion.button
                                key={time}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.02 }}
                                whileHover={available ? { scale: 1.05 } : {}}
                                whileTap={available ? { scale: 0.95 } : {}}
                                onClick={() => available && setSelectedTime(time)}
                                disabled={!available}
                                className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                                  selectedTime === time
                                    ? "bg-primary text-primary-foreground shadow-gold"
                                    : available
                                    ? "bg-card text-foreground hover:bg-primary/20 border border-border"
                                    : "bg-destructive/10 text-destructive/50 line-through cursor-not-allowed"
                                }`}
                              >
                                {time}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-secondary/30 rounded-2xl p-6 sm:p-8 border border-border flex flex-col items-center justify-center min-h-[200px] lg:min-h-[300px]"
                      >
                        <CalendarIcon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-sm sm:text-base text-muted-foreground text-center">
                          Selecione uma data no calendário para ver os horários disponíveis
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* # RESUMO DA SELEÇÃO */}
                {selectedDate && selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/10 rounded-xl p-3 sm:p-4 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <span className="text-foreground font-medium">
                        {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <span className="text-foreground font-medium">{selectedTime}</span>
                    </div>
                    <span className="text-primary font-bold text-sm sm:text-base">
                      {formatPrice(calculateTotal())}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* # NAVEGAÇÃO */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 mt-10 px-2">
              {step > 1 && (
                <Button
                  variant="outline"
                  className="h-12 w-full sm:w-auto sm:min-w-[140px]"
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                >
                  Voltar
                </Button>
              )}

              {step < 4 ? (
                <Button
                  variant="hero"
                  className="h-12 w-full sm:w-auto sm:min-w-[140px] relative overflow-hidden"
                  disabled={!canProceed()}
                  onClick={() => setStep(step + 1)}
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  />
                  Continuar
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="whatsapp"
                  className="h-12 w-full sm:w-auto sm:min-w-[200px] px-4"
                  disabled={!canProceed() || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin flex-shrink-0" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>Confirmar WhatsApp</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
