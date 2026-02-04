import { Instagram, User } from "lucide-react";

// # SEÇÃO DA EQUIPE
interface Barber {
  id: string;
  name: string;
  photo_url?: string;
  instagram?: string;
  bio?: string;
}

interface TeamProps {
  barbers?: Barber[];
}

const defaultBarbers: Barber[] = [
  { id: "1", name: "Carlos Silva", instagram: "@carlos_barber" },
  { id: "2", name: "João Pedro", instagram: "@joao_cuts" },
  { id: "3", name: "Lucas Mendes", instagram: "@lucas_blade" },
];

export function Team({ barbers = defaultBarbers }: TeamProps) {
  return (
    <section id="equipe" className="py-20 md:py-32 relative overflow-hidden">
      {/* # BACKGROUND */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsla(43,74%,49%,0.08)_0%,_transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nossa Equipe
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
            Profissionais de Elite
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Barbeiros experientes e apaixonados pelo que fazem
          </p>
        </div>

        {/* # GRID DE BARBEIROS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {barbers.map((barber, index) => (
            <div
              key={barber.id}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* # CARD */}
              <div className="relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-gold">
                {/* # FOTO */}
                <div className="aspect-[3/4] relative overflow-hidden bg-secondary">
                  {barber.photo_url ? (
                    <img
                      src={barber.photo_url}
                      alt={barber.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                      <User className="h-24 w-24 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {/* # OVERLAY GRADIENT */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>

                {/* # INFO */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-1">
                    {barber.name}
                  </h3>
                  
                  {barber.bio && (
                    <p className="text-sm text-muted-foreground mb-3">{barber.bio}</p>
                  )}

                  {barber.instagram && (
                    <a
                      href={`https://instagram.com/${barber.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                    >
                      <Instagram className="h-4 w-4" />
                      {barber.instagram}
                    </a>
                  )}
                </div>

                {/* # DECORAÇÃO */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
