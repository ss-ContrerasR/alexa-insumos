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
import ProductCard from "@/components/ProductCard";
import { cn, formatCurrency } from "@/lib/utils";

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

  fechaCreacion?: string;
  fechaActualizacion?: string;

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

  const [category, setCategory] = useState("Todos");

  const [cartOpen, setCartOpen] = useState(false);

  const [cart, setCart] = useState<CartProduct[]>([]);

  // LOAD PRODUCTS

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_PRODUCTOS);

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

  // LOAD CART

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // UPDATE CART

  const refreshCart = () => {
    const storedCart = localStorage.getItem("cart");

    setCart(storedCart ? JSON.parse(storedCart) : []);
  };

  // REMOVE PRODUCT

  const removeFromCart = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);

    setCart(updated);

    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // CLEAR CART

  const clearCart = () => {
    setCart([]);

    localStorage.removeItem("cart");
  };

  // WHATSAPP BUY

  const handleBuyWhatsApp = () => {
    if (cart.length === 0) return;

    let message = "¡Hola, me gustaría comprar estos productos!%0A%0A";

    cart.forEach((item, index) => {
      message += `🛍️ Producto ${index + 1}%0A`;

      message += `📌 Nombre: ${item.name}%0A`;

      message += `💰 Precio: ${formatCurrency(item.price)}%0A`;

      if (item.image) {
        message += `🖼️ Imagen: ${window.location.origin}${item.image}%0A`;
      }

      message += `%0A`;
    });

    const total = cart.reduce((acc, item) => acc + item.price, 0);

    message += `%0A💵 Total: ${formatCurrency(total)}`;

    const whatsappUrl = `https://wa.me/573203009633?text=${message}`;

    window.open(whatsappUrl, "_blank");
  };

  // CATEGORIES FROM API

  const categories = useMemo(() => {
    const allCategories = products.flatMap(
      (product) => product.categorias?.map((c) => c.nombre) || [],
    );

    return ["Todos", ...Array.from(new Set(allCategories))];
  }, [products]);

  // FILTER PRODUCTS

  const filtered = products.filter((p) => {
    const matchSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.color?.toLowerCase().includes(search.toLowerCase());

    const matchCat =
      category === "Todos" ||
      p.categorias?.some((cat) => cat.nombre === category);

    return matchSearch && matchCat;
  });

  // PAGINATION

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

  const paginated = filtered.slice(
    (page - 1) * PRODUCTS_PER_PAGE,

    page * PRODUCTS_PER_PAGE,
  );

  const handleCategory = (cat: string) => {
    setCategory(cat);

    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    setPage(1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      {/* CART BUTTON */}

      <button
        onClick={() => setCartOpen(true)}
        className="
          fixed
          bottom-6
          right-6
          z-[90]
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
          shadow-[0_20px_40px_rgba(168,85,247,0.35)]
          transition-all
          hover:scale-110
        "
      >
        <ShoppingCart className="h-7 w-7" />

        {cart.length > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-rose-500
              text-xs
              font-black
              text-white
            "
          >
            {cart.length}
          </span>
        )}
      </button>

      {/* SIDEBAR */}

      <div
        className={cn(
          "fixed right-0 top-0 z-[100] h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-in-out",
          cartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* HEADER */}

        {/* SIDEBAR */}

        <div
          className={cn(
            "fixed right-0 top-0 z-[100] flex h-screen w-full max-w-md flex-col overflow-hidden bg-white shadow-[0_20px_80px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-in-out",
            cartOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* HEADER */}

          <div
            className="
      flex
      items-center
      justify-between
      border-b
      border-violet-100
      bg-gradient-to-r
      from-violet-50
      to-pink-50
      px-6
      py-5
    "
          >
            <div>
              <h3
                className="
          text-2xl
          font-black
          text-violet-950
        "
              >
                Mi carrito
              </h3>

              <p className="text-sm text-violet-500">
                {cart.length} productos agregados
              </p>
            </div>

            <button
              onClick={() => setCartOpen(false)}
              className="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        bg-white
        text-violet-700
        shadow-md
        transition-all
        hover:scale-105
      "
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* CONTENT */}

          <div
            className="
      flex-1
      overflow-y-auto
      px-5
      py-5
    "
          >
            {cart.length === 0 ? (
              <div
                className="
          flex
          h-full
          flex-col
          items-center
          justify-center
          text-center
        "
              >
                <div
                  className="
            mb-5
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-violet-100
          "
                >
                  <ShoppingCart className="h-10 w-10 text-violet-500" />
                </div>

                <h4
                  className="
            text-2xl
            font-black
            text-violet-950
          "
                >
                  Tu carrito está vacío
                </h4>

                <p className="mt-3 max-w-xs text-violet-500">
                  Agrega productos para comenzar tu compra.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="
              flex
              gap-4
              rounded-[28px]
              border
              border-violet-100
              bg-gradient-to-r
              from-violet-50/70
              to-pink-50/70
              p-4
            "
                  >
                    {/* IMAGE */}

                    <div
                      className="
                relative
                h-24
                w-24
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-md
              "
                    >
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="
                  h-full
                  w-full
                  object-cover
                "
                      />
                    </div>

                    {/* INFO */}

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4
                          className="
                    line-clamp-2
                    text-sm
                    font-black
                    text-violet-950
                  "
                        >
                          {item.name}
                        </h4>

                        <p
                          className="
                    mt-2
                    text-xl
                    font-black
                    text-fuchsia-600
                  "
                        >
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="
                  mt-3
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-rose-500
                  transition-all
                  hover:text-rose-600
                "
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER */}

          {cart.length > 0 && (
            <div
              className="
        sticky
        bottom-0
        border-t
        border-violet-100
        bg-white
        p-5
        shadow-[0_-10px_30px_rgba(0,0,0,0.06)]
      "
            >
              {/* TOTAL */}

              <div
                className="
          mb-5
          flex
          items-center
          justify-between
        "
              >
                <span
                  className="
            text-lg
            font-bold
            text-violet-950
          "
                >
                  Total
                </span>

                <span
                  className="
            text-3xl
            font-black
            text-fuchsia-600
          "
                >
                  {formatCurrency(
                    cart.reduce((acc, item) => acc + item.price, 0),
                  )}
                </span>
              </div>

              {/* BUTTONS */}

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    if (cart.length === 0) return;

                    const total = cart.reduce(
                      (acc, item) => acc + item.price,
                      0,
                    );

                    const productsText = cart
                      .map(
                        (item, index) => `
----------------------------

PRODUCTO ${index + 1}

Nombre:
${item.name}

Precio:
${formatCurrency(item.price)}

Imagen:
${item.image ? `${window.location.origin}${item.image}` : "Sin imagen"}
`,
                      )
                      .join("\n");

                    const message = encodeURIComponent(`
Hola,

Me gustaría comprar los siguientes productos:

${productsText}

----------------------------

TOTAL:
${formatCurrency(total)}

Muchas gracias.
`);

                    window.open(
                      `https://wa.me/573203009633?text=${message}`,
                      "_blank",
                    );
                  }}
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
            shadow-[0_15px_35px_rgba(34,197,94,0.25)]
            transition-all
            hover:scale-[1.01]
            hover:from-emerald-600
            hover:to-green-600
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
            hover:bg-rose-50
          "
                >
                  Vaciar carrito
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}

        {cart.length > 0 && (
          <div
            className="
              border-t
              border-violet-100
              bg-white
              p-5
            "
          >
            {/* TOTAL */}

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  text-lg
                  font-bold
                  text-violet-950
                "
              >
                Total
              </span>

              <span
                className="
                  text-2xl
                  font-black
                  text-fuchsia-600
                "
              >
                {formatCurrency(
                  cart.reduce((acc, item) => acc + item.price, 0),
                )}
              </span>
            </div>

            {/* BUTTONS */}

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
                  shadow-xl
                  hover:from-emerald-600
                  hover:to-green-600
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
                  hover:bg-rose-50
                "
              >
                Vaciar carrito
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY */}

      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          className="
            fixed
            inset-0
            z-[99]
            bg-black/40
            backdrop-blur-sm
          "
        />
      )}

      {/* PRODUCTS SECTION */}

      <section
        id="productos"
        className="
          relative
          overflow-hidden
          bg-white
          py-24
        "
      >
        {/* Decorative bg */}

        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-brand-magenta via-brand-violet to-brand-sky" />

        <div className="absolute -right-48 -top-48 h-96 w-96 blob bg-pink-50 opacity-80" />

        <div className="absolute -bottom-48 -left-48 h-96 w-96 blob bg-violet-50 opacity-80" />

        <div className="container relative z-10 mx-auto px-4">
          {/* Header */}

          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-brand-magenta">
              🎨 Nuestra Colección
            </div>

            <h2
              className="mb-4 text-4xl font-black md:text-5xl"
              style={{
                fontFamily: "var(--font-display)",
              }}
            >
              Moldes para <span className="text-gradient">Cada Ocasión</span>
            </h2>

            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Más de 500 diseños únicos esperan por ti.
            </p>
          </div>

          {/* Search + Filter */}

          <div className="mb-8 flex flex-col gap-4 md:flex-row">
            {/* SEARCH */}

            <div className="relative mx-auto max-w-md flex-1 md:mx-0">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Buscar moldes..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="
                  w-full
                  rounded-full
                  border-2
                  border-pink-100
                  bg-pink-50/50
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  transition-colors
                  focus:border-brand-magenta
                  focus:outline-none
                "
              />
            </div>

            {/* FILTERS */}

            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <SlidersHorizontal className="hidden h-4 w-4 text-muted-foreground md:block" />

              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                    category === cat
                      ? "bg-gradient-to-r from-brand-magenta to-brand-violet text-white border-transparent shadow-md"
                      : "border-pink-100 bg-white text-muted-foreground hover:border-brand-magenta hover:text-brand-magenta",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}

          <p className="mb-6 text-center text-sm text-muted-foreground md:text-left">
            Mostrando{" "}
            <span className="font-semibold text-foreground">
              {paginated.length}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            productos
          </p>

          {/* LOADING */}

          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-pink-200 border-t-brand-magenta" />
            </div>
          ) : (
            <>
              {/* GRID */}

              {paginated.length > 0 ? (
                <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {paginated.map((product) => (
                    <ProductCard
                      key={product.id}
                      refreshCart={refreshCart}
                      product={{
                        id: Number(product.id),

                        name: product.nombre,

                        category:
                          product.categorias?.[0]?.nombre || "Sin categoría",

                        description: `
Color: ${product.color || "N/A"}
• Estado: ${product.estado ? "Activo" : "Inactivo"}
• Categorías: ${
                          product.categorias?.map((c) => c.nombre).join(", ") ||
                          "Sin categoría"
                        }
`,

                        price: Number(product.precio),

                        image: product.imagenUrl || "/placeholder.png",

                        emoji: "🎨",

                        colors: ["from-violet-100", "to-pink-100"],
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <div className="mb-4 text-6xl">🔍</div>

                  <h3 className="mb-2 text-xl font-bold">
                    No encontramos resultados
                  </h3>

                  <p className="text-muted-foreground">
                    Intenta con otro término de búsqueda o categoría
                  </p>
                </div>
              )}

              {/* Pagination */}

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={cn(
                        "h-10 w-10 rounded-full text-sm font-semibold transition-all",
                        n === page
                          ? "page-active scale-110 shadow-lg"
                          : "border border-pink-100 bg-white text-muted-foreground hover:border-brand-magenta hover:text-brand-magenta",
                      )}
                    >
                      {n}
                    </button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="gap-1"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
