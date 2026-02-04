import { Scissors, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// # FOOTER
interface FooterProps {
  businessName?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  address?: string;
}

export function Footer({
  businessName = "Gold Blade Barbearia",
  phone = "(61) 99203-0064",
  email = "contato@goldblade.com",
  instagram = "@gold_blad_barbearia",
  address = "Brasília, DF",
}: FooterProps) {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* # LOGO E DESCRIÇÃO */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="font-display text-xl text-gradient-gold uppercase tracking-wider">
                {businessName}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Estilo e precisão em cada corte. A melhor experiência em barbearia da região.
            </p>
          </div>

          {/* # CONTATO */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 uppercase">
              Contato
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Instagram className="h-4 w-4" />
                  {instagram}
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                {address}
              </li>
            </ul>
          </div>

          {/* # LINKS */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 uppercase">
              Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#servicos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#equipe" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Equipe
                </a>
              </li>
              <li>
                <a href="#galeria" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Galeria
                </a>
              </li>
              <li>
                <a href="#agendar" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Agendar
                </a>
              </li>
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Área Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* # COPYRIGHT */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {businessName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
