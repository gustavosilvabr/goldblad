import { motion } from "framer-motion";
import { Scissors, Check, Sparkles, Crown, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// # SEÇÃO DE PLANOS DE ASSINATURA - SUPER CHAMATIVA
interface Subscription {
  id: string;
  name: string;
  price: number;
  description?: string;
  benefits?: string[];
  is_featured?: boolean;
}

interface SubscriptionsProps {
  subscriptions?: Subscription[];
  whatsapp?: string;
}

const defaultSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Plano Corte Vitalício",
    price: 100,
    description: "Cortes ilimitados todo mês",
    benefits: [
      "Cortes ilimitados",
      "Agendamento prioritário",
      "Desconto em produtos",
      "Sobrancelha grátis",
      "Sem fila de espera",
    ],
    is_featured: true,
  },
];

export function Subscriptions({
  subscriptions = defaultSubscriptions,
  whatsapp = "5561992030064",
}: SubscriptionsProps) {
  const handleSubscribe = (plan: Subscription) => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no ${plan.name} por R$ ${plan.price.toFixed(2)}/mês. Poderia me passar mais informações?`
    );
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

  const featuredPlan = subscriptions.find((s) => s.is_featured) || subscriptions[0];

  return (
    <section id="planos" className="py-20 md:py-32 relative overflow-hidden">
      {/* # BACKGROUND ESPECIAL CHAMATIVO */}
      <div className="absolute inset-0 bg-background" />
      
      {/* # GRADIENTES DE LUZ ANIMADOS */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_50%,_hsla(43,74%,49%,0.15)_0%,_transparent_70%)]"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/10 blur-[100px]"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* # PARTÍCULAS BRILHANTES */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO MEGA CHAMATIVO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 border border-primary/30 mb-6"
            animate={{
              boxShadow: [
                "0 0 20px hsla(43,74%,49%,0.3)",
                "0 0 40px hsla(43,74%,49%,0.5)",
                "0 0 20px hsla(43,74%,49%,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Crown className="h-5 w-5 text-primary" />
            <span className="text-primary font-bold uppercase tracking-wider">Oferta Exclusiva</span>
            <Sparkles className="h-5 w-5 text-primary" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4">
            <motion.span
              className="text-gradient-gold inline-block"
              animate={{
                textShadow: [
                  "0 0 30px hsla(43,74%,49%,0.4)",
                  "0 0 60px hsla(43,74%,49%,0.6)",
                  "0 0 30px hsla(43,74%,49%,0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Corte Ilimitado
            </motion.span>
          </h2>
          
          <motion.p
            className="text-xl md:text-2xl text-foreground/80"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Por apenas
          </motion.p>
        </motion.div>

        {/* # CARD DO PLANO PRINCIPAL */}
        {featuredPlan && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-lg mx-auto"
          >
            <motion.div
              className="relative bg-card rounded-3xl border-2 border-primary/50 p-8 md:p-10 overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 30px hsla(43,74%,49%,0.2)",
                  "0 0 60px hsla(43,74%,49%,0.4)",
                  "0 0 30px hsla(43,74%,49%,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* # EFEITO DE BRILHO */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />

              {/* # ÍCONE CROWN */}
              <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-gold-lg">
                  <Crown className="h-6 w-6 text-primary-foreground" />
                </div>
              </motion.div>

              <div className="text-center pt-4">
                {/* # NOME DO PLANO */}
                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                  {featuredPlan.name}
                </h3>
                
                {featuredPlan.description && (
                  <p className="text-muted-foreground mb-6">{featuredPlan.description}</p>
                )}

                {/* # PREÇO MEGA DESTAQUE */}
                <motion.div
                  className="mb-8"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl text-muted-foreground">R$</span>
                    <motion.span
                      className="text-7xl md:text-8xl font-display font-bold text-gradient-gold"
                      animate={{
                        textShadow: [
                          "0 0 20px hsla(43,74%,49%,0.5)",
                          "0 0 40px hsla(43,74%,49%,0.8)",
                          "0 0 20px hsla(43,74%,49%,0.5)",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {featuredPlan.price.toFixed(0)}
                    </motion.span>
                    <span className="text-2xl text-muted-foreground">/mês</span>
                  </div>
                </motion.div>

                {/* # BENEFÍCIOS */}
                {featuredPlan.benefits && featuredPlan.benefits.length > 0 && (
                  <div className="space-y-4 mb-8 text-left">
                    {featuredPlan.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-foreground">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* # BOTÃO CTA */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="hero"
                    size="xl"
                    className="w-full relative overflow-hidden group"
                    onClick={() => handleSubscribe(featuredPlan)}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <Zap className="mr-2 h-5 w-5" />
                    Quero Assinar Agora
                  </Button>
                </motion.div>

                {/* # URGÊNCIA */}
                <motion.p
                  className="mt-4 text-sm text-primary flex items-center justify-center gap-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Star className="h-4 w-4" />
                  Vagas Limitadas
                  <Star className="h-4 w-4" />
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* # OUTROS PLANOS (se houver) */}
        {subscriptions.filter((s) => !s.is_featured).length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions
              .filter((s) => !s.is_featured)
              .map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-gold"
                >
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  )}

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-4xl font-bold text-primary">
                      {plan.price.toFixed(0)}
                    </span>
                    <span className="text-sm text-muted-foreground">/mês</span>
                  </div>

                  {plan.benefits && (
                    <ul className="space-y-2 mb-6">
                      {plan.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                          <Check className="h-4 w-4 text-primary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSubscribe(plan)}
                  >
                    <Scissors className="mr-2 h-4 w-4" />
                    Assinar
                  </Button>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
