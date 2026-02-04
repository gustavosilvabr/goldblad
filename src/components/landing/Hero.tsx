import { Scissors, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// # HERO SECTION - Altere textos e imagem de fundo aqui
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
      {/* # BACKGROUND COM GRADIENTES */}
      <div className="absolute inset-0 bg-gradient-hero">
        {backgroundUrl && (
          <img
            src={backgroundUrl}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        )}
        {/* # EFEITOS VISUAIS */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(43,74%,49%,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsla(43,74%,49%,0.1)_0%,_transparent_40%)]" />
        
        {/* # LINHAS DECORATIVAS */}
        <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-1/3 right-0 w-48 h-px bg-gradient-to-l from-transparent via-primary/30 to-transparent" />
      </div>

      {/* # CONTEÚDO */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* # ÍCONE ANIMADO */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full glass-gold animate-pulse-gold">
          <Scissors className="h-10 w-10 md:h-12 md:w-12 text-primary" />
        </div>

        {/* # TÍTULO PRINCIPAL */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-4 animate-fade-in-up">
          <span className="text-gradient-gold">{businessName}</span>
        </h1>

        {/* # SUBTÍTULO */}
        <p className="text-xl md:text-2xl text-foreground/80 mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {tagline}
        </p>

        {/* # BARBEARIA */}
        <p className="text-lg md:text-xl font-display text-primary/80 tracking-[0.3em] mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          BARBEARIA
        </p>

        {/* # CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button
            variant="hero"
            size="xl"
            onClick={scrollToBooking}
            className="animate-pulse-gold"
          >
            <Scissors className="mr-2 h-5 w-5" />
            Agende seu corte em segundos
          </Button>
        </div>

        {/* # INDICADOR DE SCROLL */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-primary/60" />
        </div>
      </div>
    </section>
  );
}
