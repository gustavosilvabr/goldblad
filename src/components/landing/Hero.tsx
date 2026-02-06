import { Scissors, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// # HERO SECTION OTIMIZADA PARA MOBILE - Animações reduzidas para melhor performance
interface HeroProps {
  businessName?: string;
  tagline?: string;
  backgroundUrl?: string;
}

export function Hero({
  businessName = "Gold Blade",
  tagline = "Estilo e precisão em cada corte",
  backgroundUrl,
}: HeroProps) {
  const scrollToBooking = () => {
    const element = document.getElementById("agendar");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* # BACKGROUND SIMPLIFICADO - Sem animações pesadas */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[hsl(43,30%,8%)]">
        {backgroundUrl && (
          <img
            src={backgroundUrl}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        )}
        
        {/* # GRADIENTE ESTÁTICO - Sem animação */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_50%_30%,_hsla(43,74%,49%,0.15)_0%,_transparent_70%)]" />
      </div>

      {/* # CÍRCULO DECORATIVO ESTÁTICO */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full border border-primary/10" />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full border border-primary/5" />

      {/* # CONTEÚDO */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* # BADGE PREMIUM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Experiência Premium</span>
        </motion.div>

        {/* # ÍCONE SIMPLES */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full glass-gold relative"
        >
          <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
          <Scissors className="h-12 w-12 md:h-14 md:w-14 text-primary" />
        </motion.div>

        {/* # TÍTULO PRINCIPAL */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold mb-4"
        >
          <span className="text-gradient-gold inline-block">
            {businessName}
          </span>
        </motion.h1>

        {/* # SUBTÍTULO */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl lg:text-3xl text-foreground/80 mb-4"
        >
          {tagline}
        </motion.p>

        {/* # BARBEARIA */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl font-display text-primary/80 tracking-[0.4em] mb-12"
        >
          BARBEARIA
        </motion.p>

        {/* # CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <div className="w-[90%] max-w-sm mx-auto">
            <Button
              variant="hero"
              size="xl"
              onClick={scrollToBooking}
              className="relative overflow-hidden group w-full py-4 px-6"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <Scissors className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate">Agende seu corte</span>
            </Button>
          </div>
        </motion.div>

        {/* # STATS - Sem animações repetitivas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex justify-center gap-8 md:gap-16"
        >
          {[
            { value: "500+", label: "Clientes" },
            { value: "5★", label: "Avaliação" },
            { value: "3+", label: "Anos" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* # INDICADOR DE SCROLL - Animação CSS simples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="h-8 w-8 text-primary/60" />
        </motion.div>
      </div>
    </section>
  );
}
