import { Scissors, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// # HERO SECTION COM EFEITOS OTIMIZADOS - Usa CSS animations (GPU) ao invés de JS
interface HeroProps {
  businessName?: string;
  tagline?: string;
  backgroundUrl?: string;
}

// # PARTÍCULAS DOURADAS - Usando CSS puro para performance
function GoldParticles() {
  // # Reduzido para 15 partículas (antes eram 50)
  const particles = Array.from({ length: 15 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <div
          key={i}
          className="particle absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${100 + Math.random() * 20}%`,
          }}
        />
      ))}
    </div>
  );
}

// # LINHAS ANIMADAS - CSS puro
function AnimatedLines() {
  return (
    <>
      {/* # LINHAS HORIZONTAIS */}
      <div className="absolute top-1/4 left-0 w-40 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-slide-right" />
      <div 
        className="absolute top-3/4 right-0 w-32 h-px bg-gradient-to-l from-transparent via-primary/50 to-transparent animate-slide-left"
        style={{ animationDelay: "2s" }}
      />
    </>
  );
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
      {/* # BACKGROUND COM GRADIENTES ANIMADOS VIA CSS */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[hsl(43,30%,8%)]">
        {backgroundUrl && (
          <img
            src={backgroundUrl}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        )}
        
        {/* # GRADIENTE PULSANTE - CSS animation */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_50%_30%,_hsla(43,74%,49%,0.2)_0%,_transparent_70%)] animate-pulse-glow" />
        
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_400px_600px_at_70%_60%,_hsla(43,74%,49%,0.1)_0%,_transparent_60%)] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* # PARTÍCULAS DOURADAS */}
      <GoldParticles />

      {/* # LINHAS ANIMADAS */}
      <AnimatedLines />

      {/* # CÍRCULOS DECORATIVOS ROTATIVOS - CSS animation */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full border border-primary/10 animate-rotate-slow" />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full border border-primary/5 animate-rotate-slow-reverse" />

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

        {/* # ÍCONE COM PULSO - CSS animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full glass-gold relative"
        >
          {/* # Anéis pulsantes via CSS */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-pulse-ring" />
          <div 
            className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-ring"
            style={{ animationDelay: "0.3s" }}
          />
          <Scissors className="h-12 w-12 md:h-14 md:w-14 text-primary" />
        </motion.div>

        {/* # TÍTULO PRINCIPAL COM GLOW */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold mb-4"
        >
          <span className="text-gradient-gold inline-block animate-text-glow">
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

        {/* # CTA COM SHIMMER */}
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
              {/* # Shimmer via CSS */}
              <span className="absolute inset-0 animate-shimmer" />
              <Scissors className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate">Agende seu corte</span>
            </Button>
          </div>
        </motion.div>

        {/* # STATS COM PULSO SUAVE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex justify-center gap-8 md:gap-16"
        >
          {[
            { value: "500+", label: "Clientes", delay: "0s" },
            { value: "5★", label: "Avaliação", delay: "0.3s" },
            { value: "3+", label: "Anos", delay: "0.6s" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <p 
                className="text-2xl md:text-3xl font-bold text-primary animate-stat-pulse"
                style={{ animationDelay: stat.delay }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* # INDICADOR DE SCROLL */}
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
