"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";

import ProductsSectionsv2 from "./ProductsSectionsv2";

const API_PRODUCTOS =
  "https://catalogoapiv-001-site1.qtempurl.com/api/productos";

const PRODUCTS_PER_PAGE = 12;

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

interface CartProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Producto[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("Hombres");

  const [cartOpen, setCartOpen] = useState(false);

  const [cart, setCart] = useState<CartProduct[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

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

  useEffect(() => {
    const handleCategoryChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>;

      setCategory(customEvent.detail);

      setSearch("");

      setPage(1);

      requestAnimationFrame(() => {
        const section = document.getElementById("productos");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    };

    window.addEventListener("select-category", handleCategoryChange);

    return () => {
      window.removeEventListener("select-category", handleCategoryChange);
    };
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const refreshCart = () => {
    const storedCart = localStorage.getItem("cart");

    setCart(storedCart ? JSON.parse(storedCart) : []);
  };

  const addToCart = (product: Producto) => {
    const storedCart = localStorage.getItem("cart");

    const current = storedCart ? JSON.parse(storedCart) : [];

    const exists = current.some(
      (item: CartProduct) => item.id === Number(product.id),
    );

    if (!exists) {
      current.push({
        id: Number(product.id),
        name: product.nombre,
        price: Number(product.precio),
        image: product.imagenUrl,
      });

      localStorage.setItem("cart", JSON.stringify(current));
    }

    refreshCart();
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);

    setCart(updated);

    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const handleBuyWhatsApp = () => {
    if (!cart.length) return;

    const total = cart.reduce((acc, item) => acc + item.price, 0);

    const productsText = cart
      .map(
        (item, index) => `
━━━━━━━━━━━━━━━━━━

PRODUCTO ${index + 1}

🛍️ ${item.name}

💰 ${formatCurrency(item.price)}

📷 ${item.image ?? ""}
`,
      )
      .join("\n");

    const message = encodeURIComponent(`
Hola 👋

Me gustaría comprar los siguientes productos:

${productsText}

━━━━━━━━━━━━━━━━━━

💵 TOTAL:
${formatCurrency(total)}

Muchas gracias.
`);

    window.open(`https://wa.me/573142651558?text=${message}`, "_blank");
  };

  const categories = useMemo(() => {
    const all = products.flatMap(
      (p) => p.categorias?.map((c) => c.nombre) || [],
    );

    const uniqueCategories = Array.from(new Set(all));

    const orderedCategories = uniqueCategories.sort((a, b) => {
      if (a === "Hombres") return -1;
      if (b === "Hombres") return 1;
      return a.localeCompare(b);
    });

    return ["Todos", ...orderedCategories];
  }, [products]);

  const filtered = products.filter((product) => {
    const matchSearch = product.nombre
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "Todos" ||
      product.categorias?.some(
        (c) => c.nombre.toLowerCase() === category.toLowerCase(),
      );

    return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

  const paginated = filtered.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE,
  );

  return (
    <>
      {/* CARRITO */}

      <button
        onClick={() => setCartOpen(true)}
        className="
          fixed
          bottom-6
          right-6
          z-50
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-gradient-to-r
          from-violet-600
          to-fuchsia-500
          text-white
          shadow-xl
        "
      >
        <ShoppingCart />

        {cart.length > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-red-500
              text-xs
              font-bold
            "
          >
            {cart.length}
          </span>
        )}
      </button>

      {/* SIDEBAR */}

      {cartOpen && (
        <>
          <div
            onClick={() => setCartOpen(false)}
            className="
              fixed
              inset-0
              z-[99]
              bg-black/40
            "
          />

          <div
            className="
              fixed
              right-0
              top-0
              z-[100]
              flex
              h-screen
              w-full
              max-w-md
              flex-col
              bg-white
              shadow-2xl
            "
          >
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-black">Mi carrito</h2>

              <button onClick={() => setCartOpen(false)}>
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.map((item) => (
                <div key={item.id} className="mb-4 flex gap-3">
                  <img
                    src={item.image ?? "/placeholder.png"}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>

                    <p>{formatCurrency(item.price)}</p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="space-y-3">
                <Button
                  onClick={handleBuyWhatsApp}
                  className="
                  h-14
                  w-full
                  rounded-2xl
                  bg-gradient-to-r
                  from-emerald-500
                  to-green-500
                  text-lg
                  font-bold
                  text-white
                "
                >
                  Comprar por WhatsApp
                </Button>

                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="
                  h-12
                  w-full
                  rounded-2xl
                  border-rose-200
                  text-rose-500
                "
                >
                  Vaciar carrito
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      <section id="productos" className="py-24">
        {selectedProduct && (
          <div
            className="
      fixed
      inset-0
      z-[999]
      flex
      items-center
      justify-center
      bg-black/70
      p-4
      backdrop-blur-md
    "
          >
            <div
              className="
        relative
        max-h-[95vh]
        w-full
        max-w-5xl
        overflow-y-auto
        rounded-[32px]
        bg-white
        shadow-[0_20px_80px_rgba(0,0,0,0.35)]
      "
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="
          absolute
          right-4
          top-4
          z-20
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-lg
        "
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-2">
                <div
                  className="
            min-h-[350px]
            overflow-hidden
            bg-gradient-to-br
            from-violet-100
            via-pink-50
            to-fuchsia-100
          "
                >
                  <img
                    src={selectedProduct.imagenUrl || "/placeholder.png"}
                    alt={selectedProduct.nombre}
                    className="
              h-full
              w-full
              object-cover
            "
                  />
                </div>

                <div className="p-6 md:p-10">
                  <span
                    className="
              rounded-full
              bg-violet-100
              px-4
              py-2
              text-sm
              font-bold
              text-violet-700
            "
                  >
                    {selectedProduct.categorias?.[0]?.nombre || "Sin categoría"}
                  </span>

                  <h2
                    className="
              mt-4
              text-3xl
              font-black
              text-violet-950
              md:text-5xl
            "
                  >
                    {selectedProduct.nombre}
                  </h2>

                  <div
                    className="
              mt-5
              text-4xl
              font-black
              text-fuchsia-600
            "
                  >
                    {formatCurrency(Number(selectedProduct.precio))}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div
                      className="
                rounded-2xl
                bg-violet-50
                p-4
              "
                    >
                      <p className="font-bold">Estado</p>

                      <p>
                        {selectedProduct.estado
                          ? "Disponible"
                          : "No disponible"}
                      </p>
                    </div>

                    <div
                      className="
                rounded-2xl
                bg-pink-50
                p-4
              "
                    >
                      <p className="font-bold">Tamaño</p>

                      <p>{selectedProduct.color || "N/A"}</p>
                    </div>

                    <div
                      className="
                rounded-2xl
                bg-fuchsia-50
                p-4
              "
                    >
                      <p className="font-bold">Categorías</p>

                      <p>
                        {selectedProduct.categorias
                          ?.map((c) => c.nombre)
                          .join(", ") || "Sin categoría"}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => addToCart(selectedProduct)}
                    className="
              mt-8
              h-14
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-fuchsia-500
              text-lg
              font-bold
              text-white
            "
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Agregar al carrito
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="
                  w-full
                  rounded-full
                  border
                  py-3
                  pl-12
                  pr-4
                "
              />
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <SlidersHorizontal />

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={cn(
                  "rounded-full px-5 py-2 font-bold transition-all",
                  category === cat
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white"
                    : "border bg-white text-violet-700",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <ProductsSectionsv2
            products={paginated}
            loading={loading}
            addToCart={addToCart}
            setSelectedProduct={setSelectedProduct}
          />

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft />
              </Button>

              <span className="flex items-center px-4">
                {page} / {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
