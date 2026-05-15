"use client";

import { useState } from "react";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Inicio", href: "#inicio" },
    { label: "Productos", href: "#productos" },
    { label: "Quién Soy", href: "#quien-soy" },
    { label: "Contacto", href: "#footer" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-magenta to-brand-violet flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-gradient">Alexa {" "}</span>
            <span className="text-foreground">Insumos</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-brand-magenta transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-magenta to-brand-violet rounded-full transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            className="relative p-2 rounded-full hover:bg-pink-50 transition-colors"
            aria-label="Carrito"
          >
            <ShoppingBag className="w-5 h-5 text-brand-magenta" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-amber rounded-full text-[10px] font-bold text-white flex items-center justify-center">
              0
            </span>
          </button>
          <Button size="sm" className="hidden md:flex">
            Comprar Ahora
          </Button>
          <button
            className="md:hidden p-2 rounded-full hover:bg-pink-50"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-pink-100 px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-muted-foreground hover:text-brand-magenta transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Button size="sm" className="w-full mt-2">
            Comprar Ahora
          </Button>
        </div>
      )}
    </nav>
  );
}
