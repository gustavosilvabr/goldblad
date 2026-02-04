import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, User, Phone, Scissors, Check, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfToday, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

// # FORMULÁRIO DE AGENDAMENTO PREMIUM
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
    
    const isBlocked = blockedSlots.some(
      (slot) => slot.date === dateStr && (!slot.time || slot.time === time)
    );
    
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
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[hsl(43,30%,6%)]" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(43,74%,49%,0.1)_0%,_transparent_50%)]"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* # DECORAÇÃO */}
      <motion.div
        className="absolute top-10 right-10 w-72 h-72 rounded-full border border-primary/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Calendar className="h-4 w-4" />
            Agendamento Rápido
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient-gold mb-4">
            Agende Seu Horário
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Em poucos cliques você garante seu horário
          </p>
        </motion.div>

        {/* # INDICADOR DE PASSOS PREMIUM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center gap-2 md:gap-4 bg-card/50 backdrop-blur-sm rounded-full px-4 py-3 border border-border">
            {stepTitles.map((s, index) => {
              const stepNum = index + 1;
              const Icon = s.icon;
              return (
                <div key={stepNum} className="flex items-center">
                  <motion.div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                      step >= stepNum
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                    animate={step === stepNum ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.5, repeat: step === stepNum ? Infinity : 0 }}
                  >
                    {step > stepNum ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    <span className="hidden md:inline text-sm font-medium">{s.title}</span>
                  </motion.div>
                  {stepNum < 4 && (
                    <ChevronRight className={`h-4 w-4 mx-1 ${step > stepNum ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* # FORMULÁRIO */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-card rounded-3xl border border-border p-6 md:p-10 overflow-hidden"
            style={{
              boxShadow: "0 20px 50px -10px hsla(0,0%,0%,0.5)",
            }}
          >
            {/* # GLOW */}
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/20 blur-[80px]"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

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
                      <p className="font-semibold text-foreground">{barber.name}</p>
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
            <motion.div
              className="flex gap-3 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {step > 1 && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={() => setStep(step - 1)}
                  >
                    Voltar
                  </Button>
                </motion.div>
              )}

              {step < 4 ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    variant="hero"
                    className="w-full h-12 relative overflow-hidden"
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
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    variant="whatsapp"
                    className="w-full h-12"
                    disabled={!canProceed()}
                    onClick={sendToWhatsApp}
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Confirmar no WhatsApp
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
