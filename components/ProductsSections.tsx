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
  Package,
  Tag,
  BadgeDollarSign,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
  categorias?: Categoria[];
}

interface CartProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export default function ProductsSection() {
  const [products, setProducts] =
    useState<Producto[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("Todos");

  const [cartOpen, setCartOpen] =
    useState(false);

  const [cart, setCart] =
    useState<CartProduct[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState<Producto | null>(null);

  // LOAD PRODUCTS

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          API_PRODUCTOS,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Error cargando productos",
          );
        }

        const data =
          await response.json();

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
    const storedCart =
      localStorage.getItem("cart");

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // REFRESH CART

  const refreshCart = () => {
    const storedCart =
      localStorage.getItem("cart");

    setCart(
      storedCart
        ? JSON.parse(storedCart)
        : [],
    );
  };

  // ADD TO CART

  const addToCart = (
    product: Producto,
  ) => {
    const storedCart =
      localStorage.getItem("cart");

    const currentCart =
      storedCart
        ? JSON.parse(storedCart)
        : [];

    const exists =
      currentCart.some(
        (item: CartProduct) =>
          item.id ===
          Number(product.id),
      );

    if (exists) {
      setCartOpen(true);
      return;
    }

    const updated = [
      ...currentCart,
      {
        id: Number(product.id),

        name: product.nombre,

        price: Number(
          product.precio,
        ),

        image:
          product.imagenUrl,
      },
    ];

    localStorage.setItem(
      "cart",
      JSON.stringify(updated),
    );

    refreshCart();

    setCartOpen(true);
  };

  // REMOVE

  const removeFromCart = (
    id: number,
  ) => {
    const updated = cart.filter(
      (item) => item.id !== id,
    );

    setCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated),
    );
  };

  // CLEAR CART

  const clearCart = () => {
    setCart([]);

    localStorage.removeItem("cart");
  };

  // WHATSAPP

  const handleBuyWhatsApp = () => {
    if (cart.length === 0) return;

    const total = cart.reduce(
      (acc, item) =>
        acc + item.price,
      0,
    );

    const productsText = cart
      .map(
        (item, index) => `
━━━━━━━━━━━━━━━━━━

PRODUCTO ${index + 1}

🛍️ ${item.name}

💰 ${formatCurrency(item.price)}

🖼️ ${item.image || "Sin imagen"}
`,
      )
      .join("\n");

    const message =
      encodeURIComponent(`
Hola,

Me gustaría comprar los siguientes productos:

${productsText}

━━━━━━━━━━━━━━━━━━

TOTAL:
${formatCurrency(total)}

Muchas gracias.
`);

    window.open(
      `https://wa.me/573142651558?text=${message}`,
      "_blank",
    );
  };

  // CATEGORIES

  const categories = useMemo(() => {
    const allCategories =
      products.flatMap(
        (product) =>
          product.categorias?.map(
            (c) => c.nombre,
          ) || [],
      );

    return [
      "Todos",
      ...Array.from(
        new Set(allCategories),
      ),
    ];
  }, [products]);

  // FILTER

  const filtered = products.filter(
    (p) => {
      const matchSearch =
        p.nombre
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          );

      const matchCategory =
        category === "Todos" ||
        p.categorias?.some(
          (cat) =>
            cat.nombre ===
            category,
        );

      return (
        matchSearch &&
        matchCategory
      );
    },
  );

  // PAGINATION

  const totalPages =
    Math.ceil(
      filtered.length /
        PRODUCTS_PER_PAGE,
    );

  const paginated =
    filtered.slice(
      (page - 1) *
        PRODUCTS_PER_PAGE,
      page *
        PRODUCTS_PER_PAGE,
    );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  );

  return (
    <>
      {/* PRODUCT MODAL */}

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
              max-w-6xl
              overflow-y-auto
              rounded-[32px]
              bg-white
              shadow-[0_20px_80px_rgba(0,0,0,0.35)]
            "
          >
            {/* CLOSE */}

            <button
              onClick={() =>
                setSelectedProduct(null)
              }
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
                transition-all
                hover:scale-110
              "
            >
              <X className="h-5 w-5 text-violet-900" />
            </button>

            <div className="grid lg:grid-cols-2">
              {/* IMAGE */}

              <div
                className="
                  relative
                  min-h-[350px]
                  bg-gradient-to-br
                  from-violet-100
                  via-pink-50
                  to-fuchsia-100
                "
              >
                <img
                  src={
                    selectedProduct.imagenUrl ||
                    "/placeholder.png"
                  }
                  alt={
                    selectedProduct.nombre
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>

              {/* CONTENT */}

              <div className="flex flex-col justify-between p-6 md:p-10">
                <div>
                  <div
                    className="
                      mb-4
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-violet-100
                      px-4
                      py-2
                      text-sm
                      font-bold
                      text-violet-700
                    "
                  >
                    <Eye className="h-4 w-4" />
                    Vista detallada
                  </div>

                  <h2
                    className="
                      text-3xl
                      font-black
                      leading-tight
                      text-violet-950
                      md:text-5xl
                    "
                  >
                    {
                      selectedProduct.nombre
                    }
                  </h2>

                  <div
                    className="
                      mt-5
                      text-5xl
                      font-black
                      text-fuchsia-600
                    "
                  >
                    {formatCurrency(
                      Number(
                        selectedProduct.precio,
                      ),
                    )}
                  </div>

                  {/* DETAILS */}

                  <div className="mt-10 space-y-5">
                    {/* STATUS */}

                    <div
                      className="
                        flex
                        items-start
                        gap-4
                        rounded-3xl
                        border
                        border-violet-100
                        bg-violet-50
                        p-5
                      "
                    >
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          bg-violet-200
                        "
                      >
                        <Package className="h-6 w-6 text-violet-900" />
                      </div>

                      <div>
                        <h4 className="font-black text-violet-950">
                          Estado
                        </h4>

                        <p className="mt-1 text-sm text-violet-600">
                          {selectedProduct.estado
                            ? "Disponible"
                            : "No disponible"}
                        </p>
                      </div>
                    </div>

                    {/* CATEGORY */}

                    <div
                      className="
                        flex
                        items-start
                        gap-4
                        rounded-3xl
                        border
                        border-pink-100
                        bg-pink-50
                        p-5
                      "
                    >
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          bg-pink-200
                        "
                      >
                        <Tag className="h-6 w-6 text-pink-900" />
                      </div>

                      <div>
                        <h4 className="font-black text-violet-950">
                          Categorías
                        </h4>

                        <p className="mt-1 text-sm text-violet-600">
                          {selectedProduct.categorias
                            ?.map(
                              (c) =>
                                c.nombre,
                            )
                            .join(", ") ||
                            "Sin categoría"}
                        </p>
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div
                      className="
                        flex
                        items-start
                        gap-4
                        rounded-3xl
                        border
                        border-fuchsia-100
                        bg-fuchsia-50
                        p-5
                      "
                    >
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          bg-fuchsia-200
                        "
                      >
                        <BadgeDollarSign className="h-6 w-6 text-fuchsia-900" />
                      </div>

                      <div>
                        <h4 className="font-black text-violet-950">
                          Detalles
                        </h4>

                        <p className="mt-1 text-sm text-violet-600">
                          Tamaño:{" "}
                          {selectedProduct.color ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BUTTON */}

                <Button
                  onClick={() =>
                    addToCart(
                      selectedProduct,
                    )
                  }
                  className="
                    mt-10
                    h-14
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-fuchsia-500
                    text-lg
                    font-bold
                    text-white
                    shadow-[0_20px_40px_rgba(168,85,247,0.35)]
                    transition-all
                    hover:scale-[1.01]
                  "
                >
                  <ShoppingCart className="mr-3 h-5 w-5" />
                  Agregar al carrito
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART BUTTON */}

      <button
        onClick={() =>
          setCartOpen(true)
        }
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

      {/* CART SIDEBAR */}

      <div
        className={cn(
          "fixed right-0 top-0 z-[100] flex h-screen w-full max-w-md flex-col overflow-hidden bg-white shadow-[0_20px_80px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-in-out",
          cartOpen
            ? "translate-x-0"
            : "translate-x-full",
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
            onClick={() =>
              setCartOpen(false)
            }
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

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingCart className="mb-4 h-14 w-14 text-violet-300" />

              <h4 className="text-xl font-black text-violet-950">
                Tu carrito está vacío
              </h4>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="
                    flex
                    gap-4
                    rounded-3xl
                    border
                    border-violet-100
                    bg-violet-50/60
                    p-4
                  "
                >
                  <div className="h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-md">
                    <img
                      src={
                        item.image ||
                        "/placeholder.png"
                      }
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="line-clamp-2 text-sm font-black text-violet-950">
                        {item.name}
                      </h4>

                      <p className="mt-2 text-xl font-black text-fuchsia-600">
                        {formatCurrency(
                          item.price,
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item.id,
                        )
                      }
                      className="
                        mt-3
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-rose-500
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
          <div className="border-t border-violet-100 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-lg font-bold text-violet-950">
                Total
              </span>

              <span className="text-3xl font-black text-fuchsia-600">
                {formatCurrency(
                  cart.reduce(
                    (acc, item) =>
                      acc + item.price,
                    0,
                  ),
                )}
              </span>
            </div>

            <div className="space-y-3">
              <Button
                onClick={
                  handleBuyWhatsApp
                }
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
          </div>
        )}
      </div>

      {/* OVERLAY */}

      {cartOpen && (
        <div
          onClick={() =>
            setCartOpen(false)
          }
          className="
            fixed
            inset-0
            z-[99]
            bg-black/40
            backdrop-blur-sm
          "
        />
      )}

      {/* SECTION */}

      <section
        id="productos"
        className="
          relative
          overflow-hidden
          bg-white
          py-24
        "
      >
        <div className="container relative z-10 mx-auto px-4">
          {/* HEADER */}

          <div className="mb-12 text-center">
            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-pink-50
                px-4
                py-2
                text-sm
                font-semibold
                text-brand-magenta
              "
            >
              🎨 Nuestra Colección
            </div>

            <h2
              className="
                mb-4
                text-4xl
                font-black
                md:text-5xl
              "
            >
              Moldes para{" "}
              <span className="text-gradient">
                Cada Ocasión
              </span>
            </h2>

            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Más de 500 diseños únicos esperan por ti.
            </p>
          </div>

          {/* SEARCH */}

          <div className="mb-8 flex flex-col gap-4 md:flex-row">
            <div className="relative mx-auto max-w-md flex-1 md:mx-0">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value,
                  )
                }
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
    onClick={() => {
      setCategory(cat);

      setPage(1);
    }}
    className={cn(
      `
        relative
        overflow-hidden
        rounded-full
        border
        px-5
        py-2.5
        text-sm
        font-bold
        transition-all
        duration-300
        backdrop-blur-xl
        hover:scale-105
        hover:shadow-xl
      `,
      category === cat
        ? `
            border-transparent
            bg-gradient-to-r
            from-violet-600
            via-fuchsia-500
            to-pink-500
            text-white
            shadow-[0_10px_30px_rgba(168,85,247,0.45)]
          `
        : `
            border-violet-200
            bg-white
            text-violet-700
            hover:border-fuchsia-300
            hover:bg-violet-50
            hover:text-fuchsia-600
          `,
    )}
  >
    <span className="relative z-10">
      {cat}
    </span>

    {category === cat && (
      <div
        className="
          absolute
          inset-0
          animate-pulse
          bg-white/10
        "
      />
    )}
  </button>
))}
            </div>
          </div>

          {/* PRODUCTS */}

          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-pink-200 border-t-brand-magenta" />
            </div>
          ) : (
            <>
              <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginated.map(
                  (product) => (
                    <div
                      key={product.id}
                      className="
                        group
                        overflow-hidden
                        rounded-[30px]
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
                      {/* IMAGE */}

                      <div
                        onClick={() =>
                          setSelectedProduct(
                            product,
                          )
                        }
                        className="
                          relative
                          h-64
                          cursor-pointer
                          overflow-hidden
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
                          alt={
                            product.nombre
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-110
                          "
                        />

                        {/* OVERLAY */}

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

                        {/* VIEW BUTTON */}

                        <div
                          className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            opacity-0
                            transition-all
                            duration-500
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
                              px-5
                              py-3
                              font-bold
                              text-violet-700
                              shadow-xl
                              backdrop-blur-xl
                            "
                          >
                            <Eye className="h-5 w-5" />
                            Ver producto
                          </div>
                        </div>
                      </div>

                      {/* CONTENT */}

                      <div className="p-5">
                        <div className="mb-2">
                          <span
                            className="
                              rounded-full
                              bg-violet-100
                              px-3
                              py-1
                              text-xs
                              font-bold
                              text-violet-700
                            "
                          >
                            {product
                              .categorias?.[0]
                              ?.nombre ||
                              "Sin categoría"}
                          </span>
                        </div>

                        <h3 className="line-clamp-2 text-xl font-black text-violet-950">
                          {product.nombre}
                        </h3>

                        <p className="mt-2 text-sm text-violet-500">
                          Tamaño:{" "}
                          {product.color ||
                            "N/A"}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-4">
                          <div className="text-3xl font-black text-fuchsia-600">
                            {formatCurrency(
                              Number(
                                product.precio,
                              ),
                            )}
                          </div>

                          <Button
                            onClick={() =>
                              addToCart(
                                product,
                              )
                            }
                            className="
                              h-11
                              rounded-2xl
                              bg-gradient-to-r
                              from-violet-600
                              to-fuchsia-500
                              px-5
                              text-white
                            "
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Comprar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* PAGINATION */}

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) =>
                        Math.max(
                          1,
                          p - 1,
                        ),
                      )
                    }
                    disabled={page === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  {pageNumbers.map(
                    (n) => (
                      <button
                        key={n}
                        onClick={() =>
                          setPage(n)
                        }
                        className={cn(
                          "h-10 w-10 rounded-full text-sm font-semibold transition-all",
                          n === page
                            ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg"
                            : "border border-pink-100 bg-white text-muted-foreground hover:border-brand-magenta hover:text-brand-magenta",
                        )}
                      >
                        {n}
                      </button>
                    ),
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          totalPages,
                          p + 1,
                        ),
                      )
                    }
                    disabled={
                      page === totalPages
                    }
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