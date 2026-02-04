import { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone, Scissors, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";

// # FORMULÁRIO DE AGENDAMENTO
interface Barber {
  id: string;
  name: string;
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
  blockedSlots?: { date: string; time?: string }[];
  bookedSlots?: { date: string; time: string }[];
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

export function BookingForm({
  barbers = defaultBarbers,
  services = defaultServices,
  whatsapp = "5561992030064",
  openingHour = "09:00",
  closingHour = "20:00",
  blockedSlots = [],
  bookedSlots = [],
}: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeSlots = generateTimeSlots(openingHour, closingHour);

  // # GERAR PRÓXIMOS 14 DIAS
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

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
    
    // Verifica se está bloqueado
    const isBlocked = blockedSlots.some(
      (slot) => slot.date === dateStr && (!slot.time || slot.time === time)
    );
    
    // Verifica se já está reservado
    const isBooked = bookedSlots.some(
      (slot) => slot.date === dateStr && slot.time === time
    );

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

  // # ENVIAR PARA WHATSAPP
  const sendToWhatsApp = () => {
    const barberName = selectedBarber === "any" 
      ? "Qualquer barbeiro disponível"
      : barbers.find((b) => b.id === selectedBarber)?.name || "";
    
    const serviceNames = services
      .filter((s) => selectedServices.includes(s.id))
      .map((s) => s.name)
      .join(", ");

    const dateFormatted = selectedDate 
      ? format(selectedDate, "dd/MM/yyyy (EEEE)", { locale: ptBR })
      : "";

    const message = encodeURIComponent(
      `Olá, meu nome é ${name}.\n` +
      `Gostaria de agendar:\n\n` +
      `👤 Barbeiro: ${barberName}\n` +
      `📅 Data: ${dateFormatted}\n` +
      `⏰ Horário: ${selectedTime}\n` +
      `✂️ Serviços: ${serviceNames}\n` +
      `💰 Total: R$ ${calculateTotal().toFixed(2)}\n` +
      `📞 Telefone: ${phone}\n\n` +
      `Está disponível?`
    );

    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
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
    <section id="agendar" className="py-20 md:py-32 relative overflow-hidden">
      {/* # BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(43,74%,49%,0.1)_0%,_transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Agendamento
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
            Agende Seu Horário
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Em poucos cliques você garante seu horário
          </p>
        </div>

        {/* # INDICADOR DE PASSOS */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2 md:gap-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-8 md:w-16 h-1 mx-1 rounded transition-colors ${
                      step > s ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* # FORMULÁRIO */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-elevated">
            {/* # STEP 1: DADOS DO CLIENTE */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Seus Dados
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Seu Nome
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Digite seu nome"
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        placeholder="(00) 00000-0000"
                        className="bg-secondary border-border pl-10"
                        maxLength={15}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* # STEP 2: ESCOLHER BARBEIRO */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Escolha o Barbeiro
                </h3>

                <div className="grid gap-3">
                  <button
                    onClick={() => setSelectedBarber("any")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedBarber === "any"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground">Qualquer barbeiro</p>
                    <p className="text-sm text-muted-foreground">O primeiro disponível</p>
                  </button>

                  {barbers.map((barber) => (
                    <button
                      key={barber.id}
                      onClick={() => setSelectedBarber(barber.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedBarber === barber.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-semibold text-foreground">{barber.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* # STEP 3: ESCOLHER SERVIÇOS */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-primary" />
                  Escolha os Serviços
                </h3>

                <div className="grid gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-4 rounded-xl border-2 flex justify-between items-center transition-all ${
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
                        <span className="font-bold text-primary">{formatPrice(service.price)}</span>
                        {selectedServices.includes(service.id) && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedServices.length > 0 && (
                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-foreground font-medium">Total:</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(calculateTotal())}</span>
                  </div>
                )}
              </div>
            )}

            {/* # STEP 4: ESCOLHER DATA E HORÁRIO */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Escolha Data e Horário
                </h3>

                {/* # DATAS */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Data</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                    {availableDates.map((date) => (
                      <button
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }}
                        className={`flex-shrink-0 p-3 rounded-xl border-2 min-w-[80px] transition-all ${
                          selectedDate?.toDateString() === date.toDateString()
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground uppercase">
                          {format(date, "EEE", { locale: ptBR })}
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {format(date, "dd")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(date, "MMM", { locale: ptBR })}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* # HORÁRIOS */}
                {selectedDate && (
                  <div className="animate-fade-in">
                    <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Horário
                    </p>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {timeSlots.map((time) => {
                        const available = isSlotAvailable(selectedDate, time);
                        return (
                          <button
                            key={time}
                            onClick={() => available && setSelectedTime(time)}
                            disabled={!available}
                            className={`p-2 rounded-lg text-sm font-medium transition-all ${
                              selectedTime === time
                                ? "bg-primary text-primary-foreground"
                                : available
                                ? "bg-secondary text-foreground hover:bg-primary/20"
                                : "bg-destructive/20 text-destructive line-through cursor-not-allowed"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* # NAVEGAÇÃO */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(step - 1)}
                >
                  Voltar
                </Button>
              )}

              {step < 4 ? (
                <Button
                  variant="hero"
                  className="flex-1"
                  disabled={!canProceed()}
                  onClick={() => setStep(step + 1)}
                >
                  Continuar
                </Button>
              ) : (
                <Button
                  variant="whatsapp"
                  className="flex-1"
                  disabled={!canProceed()}
                  onClick={sendToWhatsApp}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Confirmar no WhatsApp
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
