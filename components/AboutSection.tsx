import { Heart, Award, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const values = [
  {
    icon: Heart,
    label: "Hecho con Amor",
    desc: "Cada molde es diseñado con pasión y dedicación",
    color: "text-rose-500 bg-rose-50",
  },
  {
    icon: Award,
    label: "Alta Calidad",
    desc: "Materiales premium que duran años",
    color: "text-amber-500 bg-amber-50",
  },
  {
    icon: Users,
    label: "Comunidad",
    desc: "Más de 2,000 artistas confían en nosotros",
    color: "text-violet-500 bg-violet-50",
  },
  {
    icon: Sparkles,
    label: "Innovación",
    desc: "Nuevos diseños cada temporada",
    color: "text-teal-500 bg-teal-50",
  },
];

const highlights = [
  "Más de 5 años de experiencia en el sector",
  "Diseños exclusivos y originales",
  "Materiales aptos para alimentos certificados",
  "Envíos a toda Colombia",
  "Garantía de satisfacción al 100%",
  "Soporte personalizado para cada cliente",
];

export default function AboutSection() {
  return (
    <section
      id="quien-soy"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fdf2f8 0%, #f5f3ff 50%, #ecfdf5 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-16 left-8 text-6xl animate-float opacity-20 select-none">
        🎨
      </div>
      <div
        className="absolute bottom-16 right-8 text-5xl animate-float opacity-20 select-none"
        style={{ animationDelay: "1.5s" }}
      >
        🌸
      </div>
      <div
        className="absolute top-1/2 left-1/3 text-4xl animate-float opacity-10 select-none"
        style={{ animationDelay: "0.8s" }}
      >
        ✨
      </div>

      <div className="container mx-auto px-4">
        {/* Label */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-600 text-sm font-semibold mb-4">
            💜 Sobre Mí
          </div>
          <h2
            className="text-4xl md:text-5xl font-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            La Persona Detrás de{" "}
            <span className="text-gradient">Alexa Insumos</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
          {/* Visual */}
          <div className="relative flex justify-center">
            {/* Avatar / illustration */}
            {/* FOTO FUNDADORA */}
            <div className="relative flex justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                {/* Fondos decorativos */}
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-brand-magenta via-brand-violet to-brand-sky opacity-20 rotate-6" />

                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-brand-amber to-brand-coral opacity-20 -rotate-6" />

                {/* Foto */}
                <div className="relative h-full w-full overflow-hidden rounded-[32px] border-4 border-white bg-white shadow-2xl">
                  <Image
                    src="/photos/mine.jpeg"
                    alt="Alexa - Fundadora de Alexa Insumos"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Badge experiencia */}
                <div
                  className="
        absolute
        -top-4
        -right-4
        rounded-2xl
        border
        border-pink-100
        bg-white
        p-4
        shadow-xl
      "
                >
                  <div className="text-2xl">🏆</div>

                  <div className="mt-1 text-xs font-bold text-foreground">
                    +5 años
                  </div>
                </div>

                {/* Badge clientes */}
                <div
                  className="
        absolute
        -bottom-4
        -left-4
        rounded-2xl
        border
        border-violet-100
        bg-white
        p-4
        shadow-xl
      "
                >
                  <div className="text-2xl">💝</div>

                  <div className="mt-1 text-xs font-bold text-foreground">
                    2K+ clientes
                  </div>
                </div>

                {/* Etiqueta */}
                <div
                  className="
        absolute
        left-1/2
        -translate-x-1/2
        -bottom-10
        rounded-full
        bg-white
        px-5
        py-2
        shadow-lg
        border
      "
                >
                  <p
                    className="font-bold text-violet-700"
                    style={{
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Creadora & Fundadora
                  </p>

                  <p className="text-xs text-muted-foreground text-center">
                    Alexa Insumos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <h3
              className="text-3xl font-black mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hola, soy <span className="text-gradient">Alexa</span> 👋
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Soy artesana y apasionada de la repostería creativa. Hace más de
              5 años decidí transformar mi amor por los moldes en un negocio
              que ayuda a miles de personas a crear momentos mágicos e
              irrepetibles.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Cada molde en nuestra tienda es seleccionado o diseñado por mí,
              con materiales de la más alta calidad, pensando siempre en
              facilitarte el trabajo y ayudarte a lograr resultados increíbles
              en casa.
            </p>

            {/* Highlights */}
            <ul className="space-y-2 mb-8">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{h}</span>
                </li>
              ))}
            </ul>

            {/* <div className="flex gap-3 flex-wrap">
              <Button>Ver Mis Productos</Button>
              <Button variant="outline">Contáctame</Button>
            </div> */}
          </div>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
          {values.map((v) => (
            <div
              key={v.label}
              className="bg-white rounded-2xl p-5 text-center shadow-sm border border-white hover:shadow-md transition-shadow group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
              >
                <v.icon className="w-6 h-6" />
              </div>
              <div className="font-bold text-sm mb-1">{v.label}</div>
              <div className="text-xs text-muted-foreground">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
