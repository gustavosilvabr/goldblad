import { Star, Quote } from "lucide-react";

// # SEÇÃO DE AVALIAÇÕES
interface Review {
  id: string;
  client_name: string;
  rating: number;
  comment?: string;
}

interface ReviewsProps {
  reviews?: Review[];
}

const defaultReviews: Review[] = [
  { id: "1", client_name: "Carlos Silva", rating: 5, comment: "Melhor barbearia da região! Atendimento impecável e ambiente muito agradável." },
  { id: "2", client_name: "João Pedro", rating: 5, comment: "Corte perfeito, ambiente top. Super recomendo para quem busca qualidade!" },
  { id: "3", client_name: "Lucas Mendes", rating: 5, comment: "Profissionais excelentes, voltarei sempre! Serviço de primeira." },
  { id: "4", client_name: "Rafael Costa", rating: 5, comment: "Atendimento nota 10, ambiente muito confortável e ótimos profissionais." },
];

export function Reviews({ reviews = defaultReviews }: ReviewsProps) {
  return (
    <section id="avaliacoes" className="py-20 md:py-32 relative overflow-hidden">
      {/* # BACKGROUND */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(43,74%,49%,0.05)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Avaliações
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
            O Que Dizem Sobre Nós
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A satisfação dos nossos clientes é nossa maior conquista
          </p>
        </div>

        {/* # GRID DE AVALIAÇÕES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="relative bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* # ÍCONE DE CITAÇÃO */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />

              {/* # ESTRELAS */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating ? "text-primary fill-primary" : "text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* # COMENTÁRIO */}
              {review.comment && (
                <p className="text-foreground/90 mb-6 leading-relaxed">
                  "{review.comment}"
                </p>
              )}

              {/* # AUTOR */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {review.client_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{review.client_name}</p>
                  <p className="text-xs text-muted-foreground">Cliente verificado</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* # ESTATÍSTICAS */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="text-4xl font-display font-bold text-primary mb-2">500+</div>
            <p className="text-sm text-muted-foreground">Clientes Satisfeitos</p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="text-4xl font-display font-bold text-primary mb-2">5.0</div>
            <p className="text-sm text-muted-foreground">Avaliação Média</p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="text-4xl font-display font-bold text-primary mb-2">3+</div>
            <p className="text-sm text-muted-foreground">Anos de Experiência</p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="text-4xl font-display font-bold text-primary mb-2">100%</div>
            <p className="text-sm text-muted-foreground">Satisfação</p>
          </div>
        </div>
      </div>
    </section>
  );
}
