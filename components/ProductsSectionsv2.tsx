"use client";

import { Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface Categoria {
  id: string;
  nombre: string;
}

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  estado: boolean;
  color: string | null;
  imagenUrl?: string;
  categorias?: Categoria[];
}

interface ProductsSectionsv2Props {
  products: Producto[];
  loading: boolean;
  addToCart: (product: Producto) => void;
  setSelectedProduct: (
    product: Producto,
  ) => void;
}

export default function ProductsSectionsv2({
  products,
  loading,
  addToCart,
  setSelectedProduct,
}: ProductsSectionsv2Props) {
  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div
          className="
            h-16
            w-16
            animate-spin
            rounded-full
            border-4
            border-violet-200
            border-t-fuchsia-500
          "
        />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div
        className="
          flex
          h-[300px]
          items-center
          justify-center
          rounded-3xl
          border
          border-violet-100
          bg-violet-50
        "
      >
        <div className="text-center">
          <h3 className="text-2xl font-black text-violet-900">
            No se encontraron productos
          </h3>

          <p className="mt-2 text-violet-500">
            Intenta cambiar los filtros o la búsqueda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3

        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-4
        xl:grid-cols-4
      "
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="
            group
            overflow-hidden
            rounded-3xl
            border
            border-violet-100
            bg-white
            shadow-md
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-2xl
          "
        >
          {/* IMAGEN */}

          <div
            onClick={() =>
              setSelectedProduct(product)
            }
            className="
              relative
              cursor-pointer
              overflow-hidden

              h-32
              sm:h-40
              md:h-52
              lg:h-60

              bg-gradient-to-br
              from-violet-100
              via-pink-50
              to-fuchsia-100
            "
          >
            <img
              src={
                product.imagenUrl ||
                "/placeholder.png"
              }
              alt={product.nombre}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-110
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-black/0
                transition-all
                duration-500
                group-hover:bg-black/20
              "
            />

            <div
              className="
                absolute
                inset-0
                hidden
                items-center
                justify-center
                opacity-0
                transition-all
                duration-500
                group-hover:flex
                group-hover:opacity-100
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white/90
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-violet-700
                  shadow-xl
                  backdrop-blur-xl
                "
              >
                <Eye className="h-4 w-4" />
                Ver
              </div>
            </div>
          </div>

          {/* CONTENIDO */}

          <div
            className="
              p-3
              md:p-5
            "
          >
            <div className="mb-2">
              <span
                className="
                  inline-block
                  rounded-full
                  bg-violet-100
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  text-violet-700

                  md:px-3
                  md:text-xs
                "
              >
                {product.categorias?.[0]
                  ?.nombre ||
                  "Sin categoría"}
              </span>
            </div>

            <h3
              className="
                line-clamp-2
                font-black
                text-violet-950

                text-sm
                md:text-lg
              "
            >
              {product.nombre}
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-violet-500

                md:text-sm
              "
            >
              Tamaño:{" "}
              {product.color || "N/A"}
            </p>

            <div
              className="
                mt-3
                flex
                flex-col
                gap-2

                md:mt-5
              "
            >
              <div
                className="
                  text-center
                  font-black
                  text-fuchsia-600

                  text-lg
                  md:text-3xl
                "
              >
                {formatCurrency(
                  Number(product.precio),
                )}
              </div>

              <Button
                onClick={() =>
                  addToCart(product)
                }
                className="
                  h-9
                  w-full
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-500
                  text-xs
                  font-bold
                  text-white
                  transition-all
                  hover:scale-[1.02]

                  md:h-11
                  md:rounded-2xl
                  md:text-sm
                "
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Comprar
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedProduct(
                    product,
                  )
                }
                className="
                  h-9
                  w-full
                  rounded-xl
                  border-violet-200
                  text-xs
                  font-bold
                  text-violet-700

                  md:h-11
                  md:rounded-2xl
                  md:text-sm
                "
              >
                <Eye className="mr-2 h-4 w-4" />
                Detalle
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

