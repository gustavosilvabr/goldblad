import { useState } from "react";
import { Menu, X, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// # HEADER - Altere logo_url e nome da barbearia aqui ou via painel admin
interface HeaderProps {
  businessName?: string;
  logoUrl?: string;
  whatsapp?: string;
}

export function Header({ 
  businessName = "Gold Blade", 
  logoUrl,
  whatsapp = "5561992030064"
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const whatsappUrl = `https://wa.me/${whatsapp}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* # LOGO */}
          <Link to="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={businessName} className="h-10 md:h-12 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <Scissors className="h-8 w-8 text-primary" />
                <span className="font-display text-xl md:text-2xl text-gradient-gold uppercase tracking-wider">
                  {businessName}
                </span>
              </div>
            )}
          </Link>

          {/* # NAVEGAÇÃO DESKTOP */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection("servicos")}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection("equipe")}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Equipe
            </button>
            <button 
              onClick={() => scrollToSection("galeria")}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Galeria
            </button>
            <button 
              onClick={() => scrollToSection("avaliacoes")}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Avaliações
            </button>
          </nav>

          {/* # BOTÕES DE AÇÃO */}
          <div className="hidden md:flex items-center gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="sm">
                WhatsApp
              </Button>
            </a>
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => scrollToSection("agendar")}
            >
              Agendar Agora
            </Button>
          </div>

          {/* # MENU MOBILE */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* # MENU MOBILE EXPANDIDO */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <button 
              onClick={() => scrollToSection("servicos")}
              className="text-left py-2 text-foreground/80 hover:text-primary transition-colors"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection("equipe")}
              className="text-left py-2 text-foreground/80 hover:text-primary transition-colors"
            >
              Equipe
            </button>
            <button 
              onClick={() => scrollToSection("galeria")}
              className="text-left py-2 text-foreground/80 hover:text-primary transition-colors"
            >
              Galeria
            </button>
            <button 
              onClick={() => scrollToSection("avaliacoes")}
              className="text-left py-2 text-foreground/80 hover:text-primary transition-colors"
            >
              Avaliações
            </button>
            <div className="flex gap-2 pt-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="whatsapp" className="w-full">
                  WhatsApp
                </Button>
              </a>
              <Button 
                variant="hero" 
                className="flex-1"
                onClick={() => scrollToSection("agendar")}
              >
                Agendar
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
