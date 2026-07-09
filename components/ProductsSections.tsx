"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Weight,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";

const API_PRODUCTOS =
  "https://proyectosnet-001-site1.jtempurl.com/api/productos";

const PRODUCTS_PER_PAGE = 12;
const WHATSAPP_NUMBER = "573142651558";

interface Categoria {
  id: string;
  nombre: string;
}

interface ProductoImagen {
  id?: string | number;
  url: string;
  orden: number | string;
  esPrincipal: boolean;
}

interface Producto {
  id: string;
  nombre: string;
  precio: number | string;
  estado: boolean;
  color: string | null;
  imagenUrl?: string | null;
  categorias?: Categoria[];
  imagenes?: ProductoImagen[];
  pesos?: string[];
}

interface CartProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  pesos: string[];
  color?: string | null;
}

const getProductImages = (product: Producto) => {
  const imagesFromArray = Array.isArray(product.imagenes)
    ? product.imagenes
        .filter((image) => Boolean(image.url))
        .sort((a, b) => Number(a.orden ?? 0) - Number(b.orden ?? 0))
        .map((image) => image.url)
    : [];

  if (imagesFromArray.length > 0) {
    return imagesFromArray;
  }

  if (product.imagenUrl) {
    return [product.imagenUrl];
  }

  return ["/placeholder.png"];
};

const getPrincipalImage = (product: Producto) => {
  const principal = product.imagenes?.find((image) => image.esPrincipal);

  return (
    principal?.url ||
    getProductImages(product)[0] ||
    product.imagenUrl ||
    "/placeholder.png"
  );
};

const getProductWeights = (product: Producto) => {
  return Array.isArray(product.pesos)
    ? product.pesos.map((peso) => peso.trim()).filter(Boolean)
    : [];
};

const normalizeCartProduct = (item: CartProduct): CartProduct => {
  return {
    id: String(item.id),
    name: item.name,
    price: Number(item.price),
    image: item.image,
    pesos: Array.isArray(item.pesos) ? item.pesos : [],
    color: item.color ?? null,
  };
};

const getStoredCart = (): CartProduct[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = localStorage.getItem("cart");

    if (!storedCart) {
      return [];
    }

    const parsed = JSON.parse(storedCart);

    return Array.isArray(parsed) ? parsed.map(normalizeCartProduct) : [];
  } catch {
    return [];
  }
};

function ProductImageCarousel({
  product,
  className,
  imageClassName,
  heightClassName = "h-72",
}: {
  product: Producto;
  className?: string;
  imageClassName?: string;
  heightClassName?: string;
}) {
  const images = getProductImages(product);
  const [current, setCurrent] = useState(0);

  const hasMultipleImages = images.length > 1;
  const safeCurrent = Math.min(current, images.length - 1);
  const currentImage = images[safeCurrent] || "/placeholder.png";

  const goPrevious = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  

  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50",
        heightClassName,
        className,
      )}
    >
      <Image
        src={currentImage}
        alt={product.nombre}
        width={900}
        height={900}
        unoptimized
        className={cn(
          "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
          imageClassName,
        )}
      />

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrevious();
            }}
            className="
              absolute
              left-3
              top-1/2
              z-10
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/90
              text-violet-700
              shadow-lg
              backdrop-blur
              transition-all
              hover:scale-110
              hover:bg-white
            "
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className="
              absolute
              right-3
              top-1/2
              z-10
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/90
              text-violet-700
              shadow-lg
              backdrop-blur
              transition-all
              hover:scale-110
              hover:bg-white
            "
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrent(index);
                }}
                className={cn(
                  "h-2 rounded-full transition-all",
                  safeCurrent === index
                    ? "w-7 bg-white"
                    : "w-2 bg-white/60 hover:bg-white",
                )}
              />
            ))}
          </div>
        </>
      )}

      {hasMultipleImages && (
        <div
          className="
            absolute
            left-3
            top-3
            rounded-full
            bg-white/90
            px-3
            py-1
            text-xs
            font-black
            text-violet-700
            shadow-lg
            backdrop-blur
          "
        >
          {safeCurrent + 1}/{images.length}
        </div>
      )}
    </div>
  );
}

function ProductWeights({ pesos }: { pesos: string[] }) {
  if (!pesos.length) {
    return (
      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-500">
        Sin peso
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {pesos.map((peso) => (
        <span
          key={peso}
          className="
            inline-flex
            items-center
            gap-1
            rounded-full
            bg-violet-50
            px-3
            py-1
            text-xs
            font-bold
            text-violet-700
            ring-1
            ring-violet-100
          "
        >
          <Weight className="h-3 w-3" />
          {peso}
        </span>
      ))}
    </div>
  );
}

function ProductCard({
  product,
  addToCart,
  setSelectedProduct,
}: {
  product: Producto;
  addToCart: (product: Producto) => void;
  setSelectedProduct: (product: Producto) => void;
}) {
  const pesos = getProductWeights(product);
  const price = Number(product.precio);

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[32px]
        border
        border-white/70
        bg-white/85
        shadow-[0_18px_55px_rgba(168,85,247,0.12)]
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-[0_28px_80px_rgba(168,85,247,0.22)]
      "
    >
      <button
        type="button"
        onClick={() => setSelectedProduct(product)}
        className="block w-full text-left"
      >
        <ProductImageCarousel
          product={product}
          heightClassName="h-64 sm:h-72"
          className="rounded-b-[28px]"
        />
      </button>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-fuchsia-500">
              {product.categorias?.[0]?.nombre || "Producto"}
            </p>

            <button
              type="button"
              onClick={() => setSelectedProduct(product)}
              className="
                line-clamp-2
                text-left
                text-xl
                font-black
                leading-tight
                text-violet-950
                transition-colors
                hover:text-fuchsia-600
              "
            >
              {product.nombre}
            </button>
          </div>

          <button
            type="button"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-pink-50
              text-pink-500
              transition-all
              hover:scale-110
              hover:bg-pink-100
            "
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ProductWeights pesos={pesos} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-violet-400">Precio</p>
            <p className="text-2xl font-black text-fuchsia-600">
              {formatCurrency(price)}
            </p>
          </div>

          {product.color && (
            <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-bold text-fuchsia-700">
              {product.color}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectedProduct(product)}
            className="
              h-12
              rounded-2xl
              border-violet-200
              bg-white
              font-bold
              text-violet-700
              hover:bg-violet-50
            "
          >
            Ver más
          </Button>

          <Button
            type="button"
            onClick={() => addToCart(product)}
            disabled={!product.estado}
            className="
              h-12
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-fuchsia-500
              font-bold
              text-white
              shadow-[0_12px_30px_rgba(168,85,247,0.28)]
              hover:shadow-[0_18px_40px_rgba(168,85,247,0.38)]
            "
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartProduct[]>(getStoredCart);

  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(API_PRODUCTOS, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No fue posible cargar los productos");
      }

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setProducts([]);
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

  // useEffect(() => {
  //   const storedCart = localStorage.getItem("cart");

  //   if (storedCart) {
  //     try {
  //       const parsed = JSON.parse(storedCart);

  //       setCart(Array.isArray(parsed) ? parsed.map(normalizeCartProduct) : []);
  //     } catch {
  //       setCart([]);
  //     }
  //   }
  // }, []);

  const refreshCart = () => {
    const storedCart = localStorage.getItem("cart");

    if (!storedCart) {
      setCart([]);
      return;
    }

    try {
      const parsed = JSON.parse(storedCart);

      setCart(Array.isArray(parsed) ? parsed.map(normalizeCartProduct) : []);
    } catch {
      setCart([]);
    }
  };

  const addToCart = (product: Producto) => {
    const storedCart = localStorage.getItem("cart");

    let current: CartProduct[] = [];

    try {
      current = storedCart
        ? JSON.parse(storedCart).map(normalizeCartProduct)
        : [];
    } catch {
      current = [];
    }

    const exists = current.some((item) => item.id === String(product.id));

    if (!exists) {
      current.push({
        id: String(product.id),
        name: product.nombre,
        price: Number(product.precio),
        image: getPrincipalImage(product),
        pesos: getProductWeights(product),
        color: product.color,
      });

      localStorage.setItem("cart", JSON.stringify(current));
    }

    refreshCart();
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => {
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
      .map((item, index) => {
        const pesosText = item.pesos.length
          ? item.pesos.join(", ")
          : "No especificado";

        return `
━━━━━━━━━━━━━━━━━━

PRODUCTO ${index + 1}

🛍️ ${item.name}

💰 ${formatCurrency(item.price)}

⚖️ Peso: ${pesosText}

📏 Tamaño/Color: ${item.color || "No especificado"}

📷 ${item.image ?? ""}
`;
      })
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

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const categories = useMemo(() => {
    const all = products.flatMap(
      (product) => product.categorias?.map((cat) => cat.nombre) || [],
    );

    const uniqueCategories = Array.from(new Set(all));

    const orderedCategories = uniqueCategories.sort((a, b) => {
      if (a === "Hombres") return -1;
      if (b === "Hombres") return 1;

      return a.localeCompare(b);
    });

    return ["Todos", ...orderedCategories];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.nombre
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "Todos" ||
        product.categorias?.some(
          (cat) => cat.nombre.toLowerCase() === category.toLowerCase(),
        );

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

  const paginated = filtered.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE,
  );

  // useEffect(() => {
  //   setPage(1);
  // }, [search, category]);

  const selectedProductPesos = selectedProduct
    ? getProductWeights(selectedProduct)
    : [];

  return (
    <>
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="
          fixed
          bottom-5
          right-5
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
          shadow-[0_18px_45px_rgba(168,85,247,0.45)]
          transition-all
          hover:scale-110
          md:bottom-8
          md:right-8
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
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-red-500
              text-xs
              font-black
              ring-4
              ring-white
            "
          >
            {cart.length}
          </span>
        )}
      </button>

      {cartOpen && (
        <>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm"
          />

          <aside
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
            <div
              className="
                border-b
                border-violet-100
                bg-gradient-to-r
                from-violet-50
                to-pink-50
                p-5
              "
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-fuchsia-500">
                    Tu compra
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-violet-950">
                    Mi carrito
                  </h2>
                </div>

                <button
                  type="button"
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
                    hover:bg-violet-50
                  "
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                    <ShoppingBag className="h-10 w-10" />
                  </div>

                  <h3 className="text-xl font-black text-violet-950">
                    Tu carrito está vacío
                  </h3>

                  <p className="mt-2 max-w-xs text-sm text-violet-400">
                    Agrega productos para iniciar tu compra por WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="
                        rounded-[24px]
                        border
                        border-violet-100
                        bg-white
                        p-3
                        shadow-[0_12px_35px_rgba(168,85,247,0.08)]
                      "
                    >
                      <div className="flex gap-3">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-violet-50">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            width={160}
                            height={160}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 font-black text-violet-950">
                            {item.name}
                          </h3>

                          <p className="mt-1 font-black text-fuchsia-600">
                            {formatCurrency(item.price)}
                          </p>

                          <div className="mt-2">
                            <ProductWeights pesos={item.pesos} />
                          </div>

                          {item.color && (
                            <p className="mt-2 text-xs font-bold text-violet-400">
                              Tamaño/Color: {item.color}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-red-50
                            text-red-500
                            transition-all
                            hover:scale-105
                            hover:bg-red-100
                          "
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div
                className="
                  space-y-3
                  border-t
                  border-violet-100
                  bg-gradient-to-r
                  from-violet-50
                  to-pink-50
                  p-5
                "
              >
                <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                  <span className="font-bold text-violet-500">Total</span>

                  <span className="text-2xl font-black text-violet-950">
                    {formatCurrency(
                      cart.reduce((acc, item) => acc + item.price, 0),
                    )}
                  </span>
                </div>

                <Button
                  type="button"
                  onClick={handleBuyWhatsApp}
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-emerald-500
                    to-green-500
                    text-lg
                    font-black
                    text-white
                    shadow-[0_12px_35px_rgba(16,185,129,0.30)]
                  "
                >
                  Comprar por WhatsApp
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={clearCart}
                  className="
                    h-12
                    w-full
                    rounded-2xl
                    border-rose-200
                    bg-white
                    font-bold
                    text-rose-500
                    hover:bg-rose-50
                  "
                >
                  Vaciar carrito
                </Button>
              </div>
            )}
          </aside>
        </>
      )}

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
            p-3
            backdrop-blur-md
            sm:p-5
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
            <button
              type="button"
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
                text-violet-700
                shadow-lg
                transition-all
                hover:scale-105
                hover:bg-violet-50
              "
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <ProductImageCarousel
                product={selectedProduct}
                heightClassName="h-[360px] sm:h-[520px] lg:h-full"
                className="min-h-[360px] rounded-b-[32px] lg:rounded-r-[32px]"
              />

              <div className="p-6 sm:p-8 lg:p-10">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-violet-100
                    px-4
                    py-2
                    text-sm
                    font-black
                    text-violet-700
                  "
                >
                  <Sparkles className="h-4 w-4" />
                  {selectedProduct.categorias?.[0]?.nombre || "Sin categoría"}
                </span>

                <h2
                  className="
                    mt-5
                    text-3xl
                    font-black
                    leading-tight
                    text-violet-950
                    sm:text-4xl
                    lg:text-5xl
                  "
                >
                  {selectedProduct.nombre}
                </h2>

                <div className="mt-5 text-4xl font-black text-fuchsia-600">
                  {formatCurrency(Number(selectedProduct.precio))}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-violet-50 p-5">
                    <p className="mb-2 flex items-center gap-2 font-black text-violet-950">
                      <Package className="h-4 w-4 text-violet-500" />
                      Estado
                    </p>

                    <p className="font-bold text-violet-600">
                      {selectedProduct.estado ? "Disponible" : "No disponible"}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-pink-50 p-5">
                    <p className="mb-2 font-black text-violet-950">
                      Tamaño / Color
                    </p>

                    <p className="font-bold text-pink-600">
                      {selectedProduct.color || "No especificado"}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-fuchsia-50 p-5 sm:col-span-2">
                    <p className="mb-3 flex items-center gap-2 font-black text-violet-950">
                      <Weight className="h-4 w-4 text-fuchsia-500" />
                      Peso
                    </p>

                    <ProductWeights pesos={selectedProductPesos} />
                  </div>

                  <div className="rounded-3xl bg-violet-50 p-5 sm:col-span-2">
                    <p className="mb-2 font-black text-violet-950">
                      Categorías
                    </p>

                    <p className="font-bold text-violet-600">
                      {selectedProduct.categorias
                        ?.map((cat) => cat.nombre)
                        .join(", ") || "Sin categoría"}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => addToCart(selectedProduct)}
                  disabled={!selectedProduct.estado}
                  className="
                    mt-8
                    h-14
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-fuchsia-500
                    text-lg
                    font-black
                    text-white
                    shadow-[0_14px_40px_rgba(168,85,247,0.35)]
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

      <section
        id="productos"
        className="
          relative
          overflow-hidden
          bg-[radial-gradient(circle_at_top_left,rgba(216,180,254,0.35),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.25),transparent_30%),linear-gradient(to_bottom,#ffffff,#faf5ff,#fdf2f8)]
          py-16
          sm:py-20
          lg:py-24
        "
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-violet-100
                bg-white/80
                px-5
                py-2
                text-sm
                font-black
                text-fuchsia-600
                shadow-sm
                backdrop-blur
              "
            >
              <Sparkles className="h-4 w-4" />
              Catálogo
            </span>

            <h2
              className="
                mt-5
                text-4xl
                font-black
                tracking-tight
                text-violet-950
                sm:text-5xl
                lg:text-6xl
              "
            >
              Encuentra tus productos favoritos
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base text-violet-500 sm:text-lg">
              Explora el catálogo, revisa imágenes, pesos disponibles y compra
              directamente por WhatsApp.
            </p>
          </div>

          <div
            className="
              mb-8
              rounded-[32px]
              border
              border-white/70
              bg-white/75
              p-4
              shadow-[0_18px_55px_rgba(168,85,247,0.10)]
              backdrop-blur-xl
              sm:p-5
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400" />

                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Buscar producto..."
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-violet-100
                    bg-violet-50/60
                    pl-12
                    pr-4
                    font-semibold
                    text-violet-900
                    outline-none
                    transition-all
                    placeholder:text-violet-300
                    focus:border-fuchsia-300
                    focus:bg-white
                    focus:ring-4
                    focus:ring-fuchsia-100
                  "
                />
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-violet-50 px-4 py-3 text-sm font-bold text-violet-600">
                <SlidersHorizontal className="h-5 w-5" />
                {filtered.length} productos
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={cn(
                    "shrink-0 rounded-full px-5 py-2.5 text-sm font-black transition-all",
                    category === cat
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_10px_25px_rgba(168,85,247,0.30)]"
                      : "border border-violet-100 bg-white text-violet-700 hover:bg-violet-50",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    h-[440px]
                    animate-pulse
                    rounded-[32px]
                    bg-white/80
                    shadow-[0_18px_55px_rgba(168,85,247,0.08)]
                  "
                />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  setSelectedProduct={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[32px] bg-white/80 p-12 text-center shadow-[0_18px_55px_rgba(168,85,247,0.08)]">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                <Search className="h-10 w-10" />
              </div>

              <h3 className="text-2xl font-black text-violet-950">
                No encontramos productos
              </h3>

              <p className="mt-2 text-violet-400">
                Intenta cambiar la búsqueda o la categoría seleccionada.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="
                  h-12
                  rounded-2xl
                  border-violet-200
                  bg-white
                  px-4
                  text-violet-700
                  hover:bg-violet-50
                "
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <span
                className="
                  rounded-2xl
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-black
                  text-violet-700
                  shadow-sm
                "
              >
                Página {page} de {totalPages}
              </span>

              <Button
                type="button"
                variant="outline"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="
                  h-12
                  rounded-2xl
                  border-violet-200
                  bg-white
                  px-4
                  text-violet-700
                  hover:bg-violet-50
                "
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
