import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

// # SEÇÃO DE AVALIAÇÕES PREMIUM
interface Review {
  id: string;
  client_name: string;
  rating: number;
  comment?: string;
  source?: string;
}

interface ReviewsProps {
  reviews?: Review[];
}

const defaultReviews: Review[] = [
  { id: "1", client_name: "Rafael Costa", rating: 5, comment: "Melhor barbearia da região! Atendimento de primeira e corte perfeito.", source: "Google" },
  { id: "2", client_name: "Bruno Alves", rating: 5, comment: "Ambiente top, profissionais excelentes. Sempre saio satisfeito!", source: "Google" },
  { id: "3", client_name: "Pedro Henrique", rating: 5, comment: "Corte impecável, preço justo. Recomendo demais!", source: "Google" },
  { id: "4", client_name: "Lucas Martins", rating: 5, comment: "Experiência incrível! O atendimento é nota 10.", source: "Google" },
];

export function Reviews({ reviews = defaultReviews }: ReviewsProps) {
  return (
    <section id="avaliacoes" className="py-20 md:py-32 relative overflow-hidden">
      {/* # BACKGROUND */}
      <div className="absolute inset-0 bg-background" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(43,74%,49%,0.08)_0%,_transparent_60%)]"
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* # DECORAÇÃO */}
      <motion.div
        className="absolute top-10 left-10 text-primary/10"
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Quote className="h-32 w-32" />
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-primary/10"
        animate={{ rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      >
        <Quote className="h-24 w-24 rotate-180" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Star className="h-4 w-4 fill-primary" />
            Avaliações
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient-gold mb-4">
            O Que Dizem Nossos Clientes
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            A satisfação dos nossos clientes é nossa maior conquista
          </p>
        </motion.div>

        {/* # GRID DE AVALIAÇÕES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="relative bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-primary/50 transition-all duration-500 h-full">
                {/* # GLOW */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* # QUOTE ICON */}
                <motion.div
                  className="absolute top-4 right-4 text-primary/20"
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Quote className="h-8 w-8" />
                </motion.div>

                {/* # ESTRELAS */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* # COMENTÁRIO */}
                {review.comment && (
                  <p className="relative text-foreground/90 text-lg mb-6 leading-relaxed">
                    "{review.comment}"
                  </p>
                )}

                {/* # AUTOR */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-xl font-bold text-primary">
                        {review.client_name.charAt(0)}
                      </span>
                    </motion.div>
                    <div>
                      <p className="font-semibold text-foreground">{review.client_name}</p>
                      <p className="text-sm text-muted-foreground">Cliente verificado</p>
                    </div>
                  </div>

                  {review.source && (
                    <motion.span
                      className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground"
                      whileHover={{ scale: 1.05 }}
                    >
                      {review.source}
                    </motion.span>
                  )}
                </div>

                {/* # BORDA BRILHANTE */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 0 1px hsla(43,74%,49%,0.3)",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* # MÉDIA GERAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-card border border-border"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">5.0</span>
            <span className="text-muted-foreground">• {reviews.length}+ avaliações</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
