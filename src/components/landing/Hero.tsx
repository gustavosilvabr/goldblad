import { Scissors, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// # HERO SECTION PREMIUM - Altere textos e imagem de fundo aqui
interface HeroProps {
  businessName?: string;
  tagline?: string;
  backgroundUrl?: string;
}

// # COMPONENTE DE PARTÍCULAS DOURADAS
function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [null, Math.random() * -200 - 100],
            opacity: [null, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

// # LINHAS ANIMADAS DE LUXO
function AnimatedLines() {
  return (
    <>
      {/* # LINHAS HORIZONTAIS */}
      <motion.div
        className="absolute top-1/4 left-0 w-40 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{ x: ["-100%", "400%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-3/4 right-0 w-32 h-px bg-gradient-to-l from-transparent via-primary/50 to-transparent"
        animate={{ x: ["100%", "-400%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
      />
      
      {/* # LINHAS VERTICAIS */}
      <motion.div
        className="absolute left-1/4 top-0 w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        animate={{ y: ["-100%", "800%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 1 }}
      />
      <motion.div
        className="absolute right-1/3 top-0 w-px h-16 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        animate={{ y: ["-100%", "800%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 3 }}
      />
    </>
  );
}

export function Hero({
  businessName = "Gold Blade",
  tagline = "Estilo e precisão em cada corte",
  backgroundUrl,
}: HeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToBooking = () => {
    const element = document.getElementById("agendar");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* # BACKGROUND ANIMADO ESTILO GALÁXIA */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[hsl(43,30%,8%)]">
        {backgroundUrl && (
          <img
            src={backgroundUrl}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        )}
        
        {/* # GRADIENTES RADIANTES ANIMADOS */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_50%_30%,_hsla(43,74%,49%,0.2)_0%,_transparent_70%)]"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_400px_600px_at_70%_60%,_hsla(43,74%,49%,0.1)_0%,_transparent_60%)]"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* # EFEITO SPOTLIGHT QUE SEGUE O MOUSE */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,_hsla(43,74%,49%,0.08)_0%,_transparent_70%)]"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
      </div>

      {/* # PARTÍCULAS DOURADAS */}
      <GoldParticles />

      {/* # LINHAS ANIMADAS */}
      <AnimatedLines />

      {/* # CÍRCULOS DECORATIVOS DE FUNDO */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full border border-primary/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 rounded-full border border-primary/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

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

        {/* # ÍCONE ANIMADO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full glass-gold relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
          />
          <Scissors className="h-12 w-12 md:h-14 md:w-14 text-primary" />
        </motion.div>

        {/* # TÍTULO PRINCIPAL */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold mb-4"
        >
          <motion.span
            className="text-gradient-gold inline-block"
            animate={{
              textShadow: [
                "0 0 20px hsla(43,74%,49%,0.3)",
                "0 0 40px hsla(43,74%,49%,0.5)",
                "0 0 20px hsla(43,74%,49%,0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {businessName}
          </motion.span>
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="hero"
              size="xl"
              onClick={scrollToBooking}
              className="relative overflow-hidden group"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <Scissors className="mr-2 h-5 w-5" />
              Agende seu corte em segundos
            </Button>
          </motion.div>
        </motion.div>

        {/* # STATS PREMIUM */}
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
              <motion.p
                className="text-2xl md:text-3xl font-bold text-primary"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* # INDICADOR DE SCROLL */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1, duration: 0.6 },
            y: { delay: 1, duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-8 w-8 text-primary/60" />
        </motion.div>
      </div>
    </section>
  );
}
