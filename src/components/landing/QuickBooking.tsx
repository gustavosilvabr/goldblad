import { motion } from "framer-motion";
import { Calendar, Scissors, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// # SEÇÃO DE AGENDAMENTO RÁPIDO - Logo após o Hero para maior visibilidade
export function QuickBooking() {
  const scrollToBooking = () => {
    const element = document.getElementById("agendar");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background com gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      {/* Decoração */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Card Principal */}
          <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden">
            {/* Brilho decorativo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
              {/* Conteúdo Texto */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                >
                  <Sparkles className="h-4 w-4" />
                  Agendamento Fácil
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-3"
                >
                  Agende em{" "}
                  <span className="text-gradient-gold">Segundos</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground text-base md:text-lg mb-6 max-w-md mx-auto lg:mx-0"
                >
                  Escolha seu barbeiro, serviço e horário em poucos cliques. 
                  Rápido, fácil e sem complicação.
                </motion.p>

                {/* Badges de Benefícios */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6"
                >
                  {[
                    { icon: Calendar, text: "Escolha a data" },
                    { icon: Scissors, text: "Selecione o serviço" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border"
                    >
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">{item.text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex-shrink-0"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={scrollToBooking}
                    className="relative overflow-hidden group px-8 py-6 text-lg"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                    <Calendar className="mr-2 h-5 w-5" />
                    Agendar Agora
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>

                <p className="text-center text-sm text-muted-foreground mt-3">
                  ✓ Sem taxa de agendamento
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
