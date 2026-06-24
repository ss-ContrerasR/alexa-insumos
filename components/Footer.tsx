import { Sparkles, Instagram, Facebook, Phone, Mail, MapPin, Heart } from "lucide-react";

const links = {
  tienda: [
    { label: "Todos los productos", href: "#productos" },
    { label: "Novedades", href: "#productos" },
    { label: "Más vendidos", href: "#productos" },
    { label: "Ofertas", href: "#productos" },
  ],
  info: [
    { label: "Sobre Mí", href: "#quien-soy" },
    { label: "Cómo comprar", href: "#" },
    // { label: "Envíos y devoluciones", href: "#" },
    // { label: "Preguntas frecuentes", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-gray-950 text-white relative overflow-hidden"
    >
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-magenta via-brand-violet to-brand-sky" />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 blob bg-pink-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 blob bg-violet-900/20 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-magenta to-brand-violet flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="text-gradient">Alexa {" "}</span>Insumos
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Transformamos tus momentos especiales con moldes únicos de alta calidad. Hecho con amor para creadores apasionados.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { Icon: Instagram, color: "hover:bg-pink-600", label: "Instagram" },
                { Icon: Facebook, color: "hover:bg-blue-600", label: "Facebook" },
              ].map(({ Icon, color, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-all hover:scale-110 ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
              {/* WhatsApp */}
              <a
                href="https://wa.me/573227680702"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-all hover:scale-110 hover:bg-green-600"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h4
              className="font-bold text-white mb-5 text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Tienda
            </h4>
            <ul className="space-y-3">
              {links.tienda.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-gray-400 text-sm hover:text-brand-magenta transition-colors hover:translate-x-1 inline-block"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4
              className="font-bold text-white mb-5 text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Información
            </h4>
            <ul className="space-y-3">
              {links.info.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-gray-400 text-sm hover:text-brand-magenta transition-colors hover:translate-x-1 inline-block"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-bold text-white mb-5 text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contáctame
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-brand-magenta" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">WhatsApp</div>
                  <a href="https://wa.me/573227680702" className="text-sm text-gray-300 hover:text-white transition-colors">
                    +57 3142651558
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-brand-violet" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Email</div>
                  <a href="mailto:hola@moldearte.co" className="text-sm text-gray-300 hover:text-white transition-colors">
                    alexandrapatinovivas@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-brand-mint" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Ubicación</div>
                  <span className="text-sm text-gray-300">Colombia 🇨🇴</span>
                </div>
              </li>
            </ul>

            {/* Newsletter mini */}
            {/* <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 mb-3 font-medium">
                📬 Recibe novedades y ofertas
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-magenta transition-colors"
                />
                <button className="px-3 py-2 rounded-xl bg-gradient-to-r from-brand-magenta to-brand-violet text-white text-xs font-semibold hover:scale-105 transition-transform">
                  ✓
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white">
          <p>
            © {new Date().getFullYear()} AlexaInsumos. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5">
            Hecho por:{" "}
            {/* <Heart className="w-3.5 h-3.5 fill-brand-magenta text-brand-magenta" />{" "} */}
            Ing Sergio Contreras
          </p>
          <p>
            Contacto: 3203009633
          </p>
          {/* <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
