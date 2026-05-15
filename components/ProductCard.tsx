"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

import { useState } from "react";

interface ProductCardProps {
  product: Product;

  refreshCart?: () => void;
}

interface CartProduct {
  id: number;

  name: string;

  price: number;

  image?: string;
}

export default function ProductCard({
  product,
  refreshCart,
}: ProductCardProps) {
  const [added, setAdded] =
    useState(false);

  // ADD PRODUCT

  const handleAddToCart = () => {
    const storedCart =
      localStorage.getItem("cart");

    const currentCart: CartProduct[] =
      storedCart
        ? JSON.parse(storedCart)
        : [];

    const alreadyExists =
      currentCart.some(
        (item) => item.id === product.id
      );

    if (!alreadyExists) {
      const updatedCart = [
        ...currentCart,

        {
          id: product.id,

          name: product.name,

          price: product.price,

          image: product.image,
        },
      ];

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      // REFRESH SIDEBAR CART

      refreshCart?.();
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <Card
      className="
        group
        overflow-hidden
        rounded-[32px]
        border-0
        bg-white
        shadow-md
        transition-all
        duration-500
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >
      {/* IMAGE AREA */}

      <div
        className="
          relative
          h-64
          overflow-hidden
          bg-gradient-to-br
          from-violet-100
          via-pink-50
          to-fuchsia-100
        "
      >
        {/* IMAGE */}

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-110
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-7xl
            "
          >
            {product.emoji}
          </div>
        )}

        {/* OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/20
            via-transparent
            to-transparent
          "
        />

        {/* CATEGORY */}

        <div className="absolute bottom-4 left-4 z-20">
          <span
            className="
              rounded-full
              bg-white/90
              px-4
              py-2
              text-xs
              font-bold
              text-violet-700
              shadow-lg
              backdrop-blur-md
            "
          >
            {product.category}
          </span>
        </div>

        {/* BADGE */}

        {product.badge && (
          <div className="absolute left-4 top-4 z-20">
            <Badge
              className="
                border-0
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-500
                px-4
                py-1.5
                text-white
                shadow-xl
              "
            >
              {product.badge}
            </Badge>
          </div>
        )}
      </div>

      {/* CONTENT */}

      <CardContent className="space-y-5 p-6">
        {/* NAME */}

        <div>
          <h3
            className="
              text-xl
              font-black
              leading-tight
              text-violet-950
              transition-colors
              group-hover:text-fuchsia-600
            "
          >
            {product.name}
          </h3>
        </div>

        {/* DESCRIPTION */}

        <p
          className="
            line-clamp-3
            text-sm
            leading-relaxed
            text-violet-500
          "
        >
          {product.description}
        </p>

        {/* PRICE */}

        <div
          className="
            text-3xl
            font-black
            text-fuchsia-600
          "
        >
          {formatCurrency(
            product.price
          )}
        </div>

        {/* BUTTON */}

        <Button
          size="sm"
          onClick={handleAddToCart}
          className={`
            h-12
            w-full
            rounded-2xl
            text-sm
            font-bold
            transition-all
            ${
              added
                ? "bg-emerald-500 hover:bg-emerald-500"
                : " hover:from-violet-700 hover:to-fuchsia-600"
            }
          `}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />

          {added
            ? "Agregado al carrito ✓"
            : "Agregar al carrito"}
        </Button>
      </CardContent>
    </Card>
  );
}