"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import {
  ArrowDown,
  ChevronRight,
  Sparkles,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const API_PRODUCTOS =
  "https://proyectosnet-001-site1.jtempurl.com/api/productos";

interface Categoria {
  id: string;
  nombre: string;
}

interface Producto {
  categorias?: Categoria[];
}

export default function HeroCarousel() {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(API_PRODUCTOS, {
          cache: "no-store",
        });

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const all = products.flatMap(
      (product) =>
        product.categorias?.map((c) => c.nombre) || [],
    );

    const unique = Array.from(new Set(all));

    return unique.sort((a, b) => {
      if (a.toLowerCase() === "hombres") return -1;
      if (b.toLowerCase() === "hombres") return 1;

      return a.localeCompare(b);
    });
  }, [products]);

  const selectCategory = (category: string) => {
    window.dispatchEvent(
      new CustomEvent("select-category", {
        detail: category,
      }),
    );
  };

  return (
<section
  id="inicio"
  className="
    relative
    overflow-hidden
    bg-[#f4eaff]  
    pt-28
  "
>
      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -top-32
            -left-20
            h-125
            w-125
            rounded-full
            bg-violet-200/40
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            top-0
            right-0
            h-112.5
            w-112.5
            rounded-full
            bg-fuchsia-200/40
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-1/2
            h-87.5
            w-87.5
            -translate-x-1/2
            rounded-full
            bg-purple-200/40
            blur-[120px]
          "
        />
      </div>

      <div
        className="
          container
          relative
          z-10
          mx-auto
          px-4
          pb-24
        "
      >
        <div
          className="
            mx-auto
            max-w-6xl
            text-center
          "
        >
          {/* LOGO */}

          <div className="mb-12 flex justify-center">
            <div
              className="
                rounded-[40px]
                border
                border-white/70
                bg-white/80
                p-6
                backdrop-blur-xl
                shadow-[0_20px_60px_rgba(124,58,237,0.12)]
              "
            >
              <Image
                src="/logo.png"
                alt="Alexa Insumos"
                width={320}
                height={180}
                priority
                className="
                  h-auto
                  w-60
                  object-contain

                  md:w-[320px]
                "
              />
            </div>
          </div>

          {/* BADGE */}

          <div className="mb-8 flex justify-center">
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-violet-200
                bg-white/80
                px-5
                py-2
                text-sm
                font-semibold
                text-violet-700
                backdrop-blur-xl
                shadow-lg
              "
            >
              <Sparkles size={15} />
              Catálogo Oficial Alexa Insumos
            </span>
          </div>

          {/* TITULO */}

          <h1
            className="
              mx-auto
              max-w-5xl
              text-5xl
              font-black
              leading-tight
              text-slate-800

              md:text-7xl
            "
          >
            Encuentra el

            <span
              className="
                block
                bg-linear-to-r
                from-violet-600
                via-fuchsia-500
                to-purple-500
                bg-clip-text
                text-transparent
              "
            >
              regalo perfecto
            </span>

            para cada ocasión
          </h1>

          {/* SUBTITULO */}

          <p
            className="
              mx-auto
              mt-8
              max-w-3xl
              text-lg
              leading-relaxed
              text-slate-600

              md:text-xl
            "
          >
            Descubre cientos de productos cuidadosamente
            seleccionados para sorprender, celebrar y crear
            momentos inolvidables.
          </p>

          {/* CATEGORIAS */}

          <div
            className="
              mt-14
              flex
              flex-wrap
              justify-center
              gap-3
            "
          >
            {!loading &&
              categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    selectCategory(category)
                  }
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-violet-200
                    bg-white/80
                    px-5
                    py-3
                    font-semibold
                    text-slate-700
                    backdrop-blur-xl
                    shadow-md
                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-violet-400
                    hover:bg-white
                    hover:text-violet-700
                    hover:shadow-xl
                  "
                >
                  <Tag size={16} />

                  {category}

                  <ChevronRight
                    size={16}
                    className="
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </button>
              ))}
          </div>

          {/* CTA */}

          <div
            className="
              mt-14
              flex
              justify-center
            "
          >
            <a href="#productos">
              <Button
                size="lg"
                className="
                  h-16
                  rounded-full
                  bg-linear-to-r
                  from-violet-600
                  to-fuchsia-500
                  px-12
                  text-lg
                  font-black
                  text-white
                  shadow-[0_20px_40px_rgba(168,85,247,0.35)]
                  transition-all
                  hover:scale-105
                "
              >
                Ver catálogo
              </Button>
            </a>
          </div>

          {/* ESTADISTICAS */}

          <div
            className="
              mx-auto
              mt-20
              grid
              max-w-4xl
              grid-cols-2
              gap-4

              md:grid-cols-4
            "
          >
            {[
              {
                value: "2000+",
                label: "Clientes",
              },
              {
                value: "100%",
                label: "Calidad",
              },
              {
                value: "5+",
                label: "Años",
              },
              {
                value: "Colombia",
                label: "Envíos",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="
                  rounded-3xl
                  border
                  border-violet-100
                  bg-white/70
                  p-5
                  text-center
                  backdrop-blur-xl
                  shadow-lg
                "
              >
                <div
                  className="
                    text-3xl
                    font-black
                    text-violet-700
                  "
                >
                  {item.value}
                </div>

                <div
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}

      <div
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          text-violet-500
        "
      >
        <ArrowDown
          className="
            animate-bounce
          "
        />
      </div>
    </section>
  );
}