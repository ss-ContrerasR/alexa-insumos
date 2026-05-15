"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { carouselSlides } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 300);
    },
    [animating]
  );

  const prev = () => goTo((current - 1 + carouselSlides.length) % carouselSlides.length);
  const next = () => goTo((current + 1) % carouselSlides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  });

  const slide = carouselSlides[current];

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Animated background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-all duration-700",
          slide.gradient
        )}
        style={{ opacity: animating ? 0 : 1, transition: "opacity 0.4s" }}
      />
      <div className="absolute inset-0 bg-mesh opacity-50" />

      {/* Decorative blobs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 blob opacity-30 animate-float"
        style={{ background: `${slide.accent}40` }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-72 h-72 blob opacity-20 animate-float"
        style={{ background: `${slide.accent}60`, animationDelay: "1.5s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-48 h-48 blob opacity-15 animate-float"
        style={{ background: "#FFB34740", animationDelay: "0.8s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Emoji */}
          <div
            className="text-8xl mb-6 inline-block animate-float"
            style={{
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))",
              opacity: animating ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          >
            {slide.emoji}
          </div>

          {/* Category pill */}
          <div className="flex justify-center mb-6">
            <span className="px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm text-sm font-semibold text-gray-700 shadow-sm border border-white/80">
              ✨ Bienvenida a Alexa Insumos
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white"
            style={{
              fontFamily: "var(--font-display)",
              textShadow: "0 4px 24px rgba(0,0,0,0.15)",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(20px)" : "translateY(0)",
              transition: "all 0.4s ease",
              whiteSpace: "pre-line",
            }}
          >
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{
              textShadow: "0 2px 12px rgba(0,0,0,0.1)",
              opacity: animating ? 0 : 1,
              transition: "opacity 0.4s 0.1s",
            }}
          >
            {slide.subtitle}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#productos">
              <Button
                size="lg"
                className="bg-white text-gray-800 hover:bg-white/90 hover:scale-105 shadow-xl font-bold px-10 rounded-full"
              >
                {slide.cta} →
              </Button>
            </a>
            <a href="#quien-soy">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/80 bg-transparent text-white hover:bg-white/20 font-bold px-10 rounded-full"
              >
                Conoce Nuestra Historia
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center text-white hover:bg-white/50 transition-all hover:scale-110"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center text-white hover:bg-white/50 transition-all hover:scale-110"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {carouselSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "rounded-full transition-all duration-300",
              i === current
                ? "w-8 h-3 bg-white shadow-lg"
                : "w-3 h-3 bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-sm border-t border-white/30 py-4 px-4 z-20">
        <div className="container mx-auto flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { value: "500+", label: "Diseños" },
            { value: "2,000+", label: "Clientes Felices" },
            { value: "5★", label: "Calificación" },
            { value: "24h", label: "Envío Express" },
          ].map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <div className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>
                {stat.value}
              </div>
              <div className="text-xs font-medium opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
