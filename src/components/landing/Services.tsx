import { motion } from "framer-motion";
import { Scissors, Sparkles, Star, Clock, Zap } from "lucide-react";

// # SEÇÃO DE SERVIÇOS PREMIUM
interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  description?: string;
  is_additional?: boolean;
}

interface ServicesProps {
  services?: Service[];
}

const defaultServices: Service[] = [
  { id: "1", name: "Corte", price: 35, duration_minutes: 30, description: "Corte moderno e personalizado" },
  { id: "2", name: "Sobrancelha", price: 15, duration_minutes: 15, description: "Design perfeito" },
  { id: "3", name: "Corte + Sobrancelha", price: 45, duration_minutes: 40, description: "Combo mais pedido" },
  { id: "4", name: "Progressiva", price: 80, duration_minutes: 60, is_additional: true, description: "Alisamento profissional" },
  { id: "5", name: "Pintura", price: 50, duration_minutes: 45, is_additional: true, description: "Coloração premium" },
  { id: "6", name: "Minoxidil", price: 40, duration_minutes: 15, is_additional: true, description: "Tratamento capilar" },
];

// # ÍCONES PARA SERVIÇOS
const serviceIcons: { [key: string]: typeof Scissors } = {
  "Corte": Scissors,
  "Sobrancelha": Sparkles,
  "Corte + Sobrancelha": Zap,
  default: Star,
};

export function Services({ services = defaultServices }: ServicesProps) {
  const mainServices = services.filter(s => !s.is_additional);
  const additionalServices = services.filter(s => s.is_additional);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getIcon = (name: string) => {
    return serviceIcons[name] || serviceIcons.default;
  };

  return (
    <section id="servicos" className="py-20 md:py-32 relative overflow-hidden">
      {/* # BACKGROUND */}
      <div className="absolute inset-0 bg-card" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(43,74%,49%,0.08)_0%,_transparent_70%)]"
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* # DECORAÇÃO */}
      <motion.div
        className="absolute top-10 right-10 w-64 h-64 rounded-full border border-primary/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            Nossos Serviços
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient-gold mb-4">
            O Que Oferecemos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Serviços premium com os melhores profissionais da região
          </p>
        </motion.div>

        {/* # SERVIÇOS PRINCIPAIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {mainServices.map((service, index) => {
            const Icon = getIcon(service.name);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group"
              >
                <div className="relative bg-secondary/50 rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-500 h-full">
                  {/* # GLOW NO HOVER */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  {/* # ÍCONE */}
                  <motion.div
                    className="relative w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                  >
                    <Icon className="h-8 w-8 text-primary" />
                    
                    {/* # PULSO */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-primary/30"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* # NOME */}
                  <h3 className="relative text-2xl font-display font-semibold text-foreground mb-2">
                    {service.name}
                  </h3>

                  {/* # DESCRIÇÃO */}
                  {service.description && (
                    <p className="relative text-muted-foreground text-sm mb-4">
                      {service.description}
                    </p>
                  )}

                  {/* # DURAÇÃO */}
                  <div className="relative flex items-center gap-2 text-muted-foreground text-sm mb-6">
                    <Clock className="h-4 w-4 text-primary/60" />
                    <span>{service.duration_minutes} minutos</span>
                  </div>

                  {/* # PREÇO */}
                  <motion.div
                    className="relative flex items-end gap-1"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <span className="text-4xl font-bold text-primary">
                      {formatPrice(service.price)}
                    </span>
                  </motion.div>

                  {/* # DECORAÇÃO CANTO */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="h-4 w-4 text-primary/40" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* # SERVIÇOS ADICIONAIS */}
        {additionalServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-display font-semibold text-center text-foreground mb-8 flex items-center justify-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.div>
              Serviços Adicionais
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.div>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-5 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-gold">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Star className="h-5 w-5 text-primary/60" />
                      </motion.div>
                      <div>
                        <span className="font-semibold text-foreground">{service.name}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {service.duration_minutes} min
                        </div>
                      </div>
                    </div>
                    <motion.span
                      className="font-bold text-lg text-primary"
                      whileHover={{ scale: 1.1 }}
                    >
                      {formatPrice(service.price)}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
