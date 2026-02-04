import { Scissors, Sparkles, Star } from "lucide-react";

// # SEÇÃO DE SERVIÇOS
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
  { id: "1", name: "Corte", price: 35, duration_minutes: 30 },
  { id: "2", name: "Sobrancelha", price: 15, duration_minutes: 15 },
  { id: "3", name: "Corte + Sobrancelha", price: 45, duration_minutes: 40 },
  { id: "4", name: "Progressiva", price: 80, duration_minutes: 60, is_additional: true },
  { id: "5", name: "Pintura", price: 50, duration_minutes: 45, is_additional: true },
  { id: "6", name: "Minoxidil", price: 40, duration_minutes: 15, is_additional: true },
];

export function Services({ services = defaultServices }: ServicesProps) {
  const mainServices = services.filter(s => !s.is_additional);
  const additionalServices = services.filter(s => s.is_additional);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <section id="servicos" className="py-20 md:py-32 relative overflow-hidden">
      {/* # BACKGROUND */}
      <div className="absolute inset-0 bg-card" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(43,74%,49%,0.05)_0%,_transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nossos Serviços
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
            O Que Oferecemos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Serviços premium com os melhores profissionais da região
          </p>
        </div>

        {/* # SERVIÇOS PRINCIPAIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {mainServices.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-secondary/50 rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-gold animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* # ÍCONE */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Scissors className="h-7 w-7 text-primary" />
              </div>

              {/* # NOME */}
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                {service.name}
              </h3>

              {/* # DURAÇÃO */}
              <p className="text-muted-foreground text-sm mb-4">
                {service.duration_minutes} minutos
              </p>

              {/* # PREÇO */}
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(service.price)}
                </span>
              </div>

              {/* # HOVER EFFECT */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* # SERVIÇOS ADICIONAIS */}
        {additionalServices.length > 0 && (
          <>
            <h3 className="text-2xl font-display font-semibold text-center text-foreground mb-8">
              <Sparkles className="inline-block h-6 w-6 text-primary mr-2" />
              Serviços Adicionais
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalServices.map((service, index) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between bg-secondary/30 rounded-xl p-4 border border-border hover:border-primary/30 transition-all animate-fade-in"
                  style={{ animationDelay: `${(mainServices.length + index) * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-primary/60" />
                    <div>
                      <span className="font-medium text-foreground">{service.name}</span>
                      <p className="text-xs text-muted-foreground">{service.duration_minutes} min</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
