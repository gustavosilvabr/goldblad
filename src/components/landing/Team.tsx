import { Instagram, User, Star, Scissors } from "lucide-react";
import { motion } from "framer-motion";

// # SEÇÃO DA EQUIPE PREMIUM
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
  { id: "1", name: "Carlos Silva", instagram: "@carlos_barber", bio: "Especialista em degradê" },
  { id: "2", name: "João Pedro", instagram: "@joao_cuts", bio: "Mestre em cortes clássicos" },
  { id: "3", name: "Lucas Mendes", instagram: "@lucas_blade", bio: "Expert em barbas" },
];

export function Team({ barbers = defaultBarbers }: TeamProps) {
  return (
    <section id="equipe" className="py-20 md:py-32 relative overflow-hidden">
      {/* # BACKGROUND */}
      <div className="absolute inset-0 bg-background" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsla(43,74%,49%,0.1)_0%,_transparent_50%)]"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* # DECORAÇÃO */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 rounded-full border border-primary/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-24 h-24 rounded-full border border-primary/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

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
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Scissors className="h-4 w-4" />
            Nossa Equipe
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient-gold mb-4">
            Profissionais de Elite
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Barbeiros experientes e apaixonados pelo que fazem
          </p>
        </motion.div>

        {/* # GRID DE BARBEIROS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {barbers.map((barber, index) => (
            <motion.div
              key={barber.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group"
            >
              {/* # CARD */}
              <div className="relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500">
                {/* # FOTO */}
                <div className="aspect-[3/4] relative overflow-hidden bg-secondary">
                  {barber.photo_url ? (
                    <img
                      src={barber.photo_url}
                      alt={barber.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary via-muted to-secondary">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <User className="h-24 w-24 text-muted-foreground/30" />
                      </motion.div>
                    </div>
                  )}
                  
                  {/* # OVERLAY GRADIENT */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                  {/* # GLOW EFFECT */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>

                {/* # INFO */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* # RATING */}
                  <motion.div
                    className="flex items-center gap-1 mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                      >
                        <Star className="h-4 w-4 fill-primary text-primary" />
                      </motion.div>
                    ))}
                  </motion.div>

                  <h3 className="text-xl font-display font-semibold text-foreground mb-1">
                    {barber.name}
                  </h3>
                  
                  {barber.bio && (
                    <p className="text-sm text-muted-foreground mb-3">{barber.bio}</p>
                  )}

                  {barber.instagram && (
                    <motion.a
                      href={`https://instagram.com/${barber.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm group/link"
                      whileHover={{ x: 4 }}
                    >
                      <Instagram className="h-4 w-4" />
                      {barber.instagram}
                      <motion.span
                        className="opacity-0 group-hover/link:opacity-100 transition-opacity"
                        initial={{ x: -5 }}
                        whileHover={{ x: 0 }}
                      >
                        →
                      </motion.span>
                    </motion.a>
                  )}
                </div>

                {/* # DECORAÇÃO HOVER */}
                <motion.div
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1, rotate: 180 }}
                >
                  <Scissors className="h-5 w-5 text-primary" />
                </motion.div>

                {/* # BORDA BRILHANTE */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: "inset 0 0 0 2px hsla(43,74%,49%,0.3)",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
