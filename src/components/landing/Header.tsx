import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// # HEADER PREMIUM - Altere logo_url e nome da barbearia aqui ou via painel admin
interface HeaderProps {
  businessName?: string;
  logoUrl?: string;
  whatsapp?: string;
  logoSize?: "small" | "medium" | "large" | "custom";
  logoSizeCustom?: number | null;
}

export function Header({ 
  businessName = "Gold Blade", 
  logoUrl,
  whatsapp = "5561992030064",
  logoSize = "medium",
  logoSizeCustom,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const whatsappUrl = `https://wa.me/${whatsapp}`;

  const navItems = [
    { id: "servicos", label: "Serviços" },
    { id: "equipe", label: "Equipe" },
    { id: "galeria", label: "Galeria" },
    { id: "planos", label: "Planos" },
    { id: "avaliacoes", label: "Avaliações" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "glass border-b border-border/50" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* # LOGO */}
          <Link to="/" className="flex items-center gap-3 group py-2">
            {logoUrl ? (
              <motion.img 
                src={logoUrl} 
                alt={businessName}
                className="mr-2"
                style={{
                  height: logoSize === "custom" && logoSizeCustom 
                    ? `${Math.min(Math.max(logoSizeCustom, 24), 120)}px`
                    : logoSize === "small" ? "40px" 
                    : logoSize === "large" ? "72px" 
                    : "56px",
                  width: "auto"
                }}
                whileHover={{ scale: 1.05 }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Scissors className="h-9 w-9 text-primary" />
                <span className="font-display text-xl md:text-2xl text-gradient-gold uppercase tracking-wider">
                  {businessName}
                </span>
              </div>
            )}
          </Link>

          {/* # NAVEGAÇÃO DESKTOP */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className="relative text-foreground/80 hover:text-primary transition-colors font-medium group"
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </nav>

          {/* # BOTÕES DE AÇÃO */}
          <div className="hidden md:flex items-center gap-3">
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="whatsapp" size="sm">
                <Sparkles className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="hero" 
                size="sm"
                onClick={() => scrollToSection("agendar")}
                className="relative overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                Agendar Agora
              </Button>
            </motion.div>
          </div>

          {/* # MENU MOBILE */}
          <motion.button 
            className="lg:hidden text-foreground p-2 rounded-lg hover:bg-primary/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* # MENU MOBILE EXPANDIDO */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass border-t border-border/50 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left py-3 px-4 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all font-medium"
                >
                  {item.label}
                </motion.button>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-2 pt-4 border-t border-border/50"
              >
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
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
