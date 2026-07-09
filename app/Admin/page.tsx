"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CircleDollarSign,
  ImagePlus,
  LayoutGrid,
  Package,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface Categoria {
  id: string;
  nombre: string;
  fechaCreacion?: string;
  productos?: Producto[];
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
  precio: string;
  estado: boolean;
  color: string | null;
  imagenUrl?: string | null;
  categorias?: Categoria[];
  imagenes?: ProductoImagen[];
  pesos?: string[];
}

interface ProductoImagenForm {
  id?: string | number;
  file?: File;
  url: string;
  preview: string;
  orden: number;
  esPrincipal: boolean;
}

const API_BASE = "https://proyectosnet-001-site1.jtempurl.com/api";

const API_CATEGORIAS = `${API_BASE}/categorias`;
const API_PRODUCTOS = `${API_BASE}/productos`;

export default function CatalogoDashboardPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("categorias");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [openCategoria, setOpenCategoria] = useState(false);
  const [openProducto, setOpenProducto] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [deleteData, setDeleteData] = useState<{
    id: string;
    nombre: string;
    type: "producto" | "categoria";
  } | null>(null);

  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(
    null,
  );

  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  const [categoriaForm, setCategoriaForm] = useState({
    nombre: "",
  });

  const [productoForm, setProductoForm] = useState({
    nombre: "",
    precio: "",
    color: "",
    estado: true,
    categoriaIds: [] as string[],
    imagenes: [] as ProductoImagenForm[],
    pesosText: "",
  });

  const showToast = (
    title: string,
    description: string,
    variant: "success" | "error" = "success",
  ) => {
    if (variant === "success") {
      toast.success(title, { description });
    } else {
      toast.error(title, { description });
    }
  };

  const limpiarMensajeError = (errorText: string) => {
    if (!errorText) return "Ocurrió un error inesperado";

    try {
      const parsed = JSON.parse(errorText);

      if (parsed?.message && parsed?.errors) {
        return `${parsed.message} ${JSON.stringify(parsed.errors)}`;
      }

      if (parsed?.message) {
        return parsed.message;
      }

      return errorText;
    } catch {
      return errorText;
    }
  };

  const tieneIdImagen = (imagen: ProductoImagenForm) => {
    return (
      imagen.id !== undefined &&
      imagen.id !== null &&
      String(imagen.id).trim() !== ""
    );
  };

  const normalizarOrdenImagenes = (imagenes: ProductoImagenForm[]) => {
    const ordenadas = imagenes.map((imagen, index) => ({
      ...imagen,
      orden: index,
    }));

    if (ordenadas.length === 0) return ordenadas;

    const principalIndex = ordenadas.findIndex((imagen) => imagen.esPrincipal);

    if (principalIndex === -1) {
      return ordenadas.map((imagen, index) => ({
        ...imagen,
        esPrincipal: index === 0,
      }));
    }

    return ordenadas.map((imagen, index) => ({
      ...imagen,
      esPrincipal: index === principalIndex,
    }));
  };

  const obtenerImagenesProducto = (
    producto: Producto,
  ): ProductoImagenForm[] => {
    const imagenesDesdeApi = Array.isArray(producto.imagenes)
      ? producto.imagenes
      : [];

    if (imagenesDesdeApi.length > 0) {
      return normalizarOrdenImagenes(
        imagenesDesdeApi
          .filter((imagen) => Boolean(imagen.url))
          .sort((a, b) => Number(a.orden ?? 0) - Number(b.orden ?? 0))
          .map((imagen, index) => ({
            id: imagen.id,
            url: imagen.url,
            preview: imagen.url,
            orden: Number(imagen.orden ?? index),
            esPrincipal: Boolean(imagen.esPrincipal),
          })),
      );
    }

    if (producto.imagenUrl) {
      return [
        {
          url: producto.imagenUrl,
          preview: producto.imagenUrl,
          orden: 0,
          esPrincipal: true,
        },
      ];
    }

    return [];
  };

  const obtenerImagenPrincipal = (producto: Producto) => {
    const imagenPrincipal = producto.imagenes?.find(
      (imagen) => imagen.esPrincipal,
    );

    return (
      imagenPrincipal?.url ||
      producto.imagenes?.[0]?.url ||
      producto.imagenUrl ||
      "/placeholder.png"
    );
  };

  const obtenerPesosDesdeTexto = () => {
    return productoForm.pesosText
      .split(",")
      .map((peso) => peso.trim())
      .filter(Boolean);
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const [categoriasRes, productosRes] = await Promise.all([
        fetch(API_CATEGORIAS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }),

        fetch(API_PRODUCTOS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }),
      ]);

      if (!categoriasRes.ok) {
        throw new Error(`Categorias HTTP Error: ${categoriasRes.status}`);
      }

      if (!productosRes.ok) {
        throw new Error(`Productos HTTP Error: ${productosRes.status}`);
      }

      const categoriasData = await categoriasRes.json();
      const productosData = await productosRes.json();

      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (error) {
      console.error("LOAD DATA ERROR:", error);

      setCategorias([]);
      setProductos([]);

      showToast("Error", "No fue posible cargar la información", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredProductos = useMemo(() => {
    const term = search.trim().toLowerCase();

    return productos.filter((producto) =>
      producto.nombre?.toLowerCase().includes(term),
    );
  }, [productos, search]);

  const filteredCategorias = useMemo(() => {
    const term = search.trim().toLowerCase();

    return categorias.filter((categoria) =>
      categoria.nombre?.toLowerCase().includes(term),
    );
  }, [categorias, search]);

  const currentData =
    activeTab === "productos" ? filteredProductos : filteredCategorias;

  const totalPages = Math.ceil(currentData.length / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab]);

  const resetCategoria = () => {
    setCategoriaForm({
      nombre: "",
    });

    setEditingCategoria(null);
  };

  const resetProducto = () => {
    setProductoForm({
      nombre: "",
      precio: "",
      color: "",
      estado: true,
      categoriaIds: [],
      imagenes: [],
      pesosText: "",
    });

    setEditingProducto(null);
  };

  const saveCategoria = async () => {
    try {
      if (!categoriaForm.nombre.trim()) {
        showToast(
          "Campo requerido",
          "El nombre de la categoría es obligatorio",
          "error",
        );
        return;
      }

      const method = editingCategoria ? "PUT" : "POST";

      const url = editingCategoria
        ? `${API_CATEGORIAS}/${editingCategoria.id}`
        : API_CATEGORIAS;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoriaForm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al guardar categoría");
      }

      showToast(
        "Operación exitosa",
        editingCategoria
          ? "Categoría actualizada correctamente"
          : "Categoría creada correctamente",
      );

      setOpenCategoria(false);
      resetCategoria();

      await loadData();
    } catch (error) {
      console.error(error);
      showToast("Error", "No fue posible guardar la categoría", "error");
    }
  };

  const subirImagenes = async () => {
    const imagenesSubidas: ProductoImagenForm[] = [];

    for (const imagen of productoForm.imagenes) {
      let finalUrl = imagen.url;

      if (imagen.file) {
        const uploadData = new FormData();

        uploadData.append("file", imagen.file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadText = await uploadResponse.text();

        let uploadResult: {
          success?: boolean;
          imageUrl?: string;
          message?: string;
        } | null = null;

        try {
          uploadResult = JSON.parse(uploadText);
        } catch {
          console.error("UPLOAD RAW RESPONSE:", uploadText);
        }

        if (!uploadResponse.ok || !uploadResult?.success) {
          console.error("UPLOAD RESPONSE ERROR:", uploadResult || uploadText);

          throw new Error(
            uploadResult?.message ||
              `Error subiendo imagen. Status: ${uploadResponse.status}`,
          );
        }

        finalUrl = uploadResult.imageUrl || "";
      }

      if (finalUrl) {
        imagenesSubidas.push({
          ...imagen,
          url: finalUrl,
          preview: finalUrl,
        });
      }
    }

    return normalizarOrdenImagenes(imagenesSubidas);
  };

  const actualizarOrdenImagenes = async (
    productoId: string,
    imagenes: ProductoImagenForm[],
  ) => {
    const imagenesOrdenadas = normalizarOrdenImagenes(imagenes);

    const imagenesSinId = imagenesOrdenadas.filter(
      (imagen) => !tieneIdImagen(imagen),
    );

    if (imagenesSinId.length > 0) {
      throw new Error(
        "Hay imágenes nuevas sin ID. Primero guarda el producto, vuelve a abrirlo y luego actualiza el orden.",
      );
    }

    const payloadOrden = imagenesOrdenadas.map((imagen, index) => ({
      id: String(imagen.id),
      orden: String(index),
      esPrincipal: Boolean(imagen.esPrincipal),
    }));

    if (payloadOrden.length === 0) {
      throw new Error("No hay imágenes para actualizar el orden.");
    }

    console.log("PAYLOAD ORDEN IMÁGENES:", payloadOrden);

    const response = await fetch(
      `${API_PRODUCTOS}/${productoId}/imagenes/orden`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadOrden),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error("ERROR ORDEN IMÁGENES:", responseText);

      throw new Error(limpiarMensajeError(responseText));
    }

    console.log("ORDEN DE IMÁGENES ACTUALIZADO:", responseText);
  };

  const guardarSoloOrdenImagenes = async () => {
    try {
      if (!editingProducto) {
        showToast(
          "Producto no seleccionado",
          "Primero debes editar un producto existente",
          "error",
        );
        return;
      }

      await actualizarOrdenImagenes(editingProducto.id, productoForm.imagenes);

      showToast(
        "Orden actualizado",
        "El orden de las imágenes fue actualizado correctamente",
      );

      await loadData();
    } catch (error) {
      console.error(error);

      showToast(
        "Error",
        error instanceof Error
          ? error.message
          : "No fue posible actualizar el orden de imágenes",
        "error",
      );
    }
  };

  const saveProducto = async () => {
    try {
      if (!productoForm.nombre.trim()) {
        showToast(
          "Campo requerido",
          "El nombre del producto es obligatorio",
          "error",
        );
        return;
      }

      if (!productoForm.precio || Number.isNaN(Number(productoForm.precio))) {
        showToast(
          "Campo inválido",
          "El precio debe ser un número válido",
          "error",
        );
        return;
      }

      if (productoForm.categoriaIds.length === 0) {
        showToast(
          "Categoría requerida",
          "Debes seleccionar al menos una categoría",
          "error",
        );
        return;
      }

      const imagenesFinales = await subirImagenes();

      const imagenPrincipal =
        imagenesFinales.find((imagen) => imagen.esPrincipal) ||
        imagenesFinales[0];

      const payload = {
        nombre: productoForm.nombre.trim(),
        precio: Number(productoForm.precio),
        estado: productoForm.estado,
        color: productoForm.color.trim() || null,
        imagenUrl: imagenPrincipal?.url || null,

        // POST como lo tenías antes: se envían todas las imágenes nuevas.
        imagenes: imagenesFinales.map((imagen, index) => ({
          url: imagen.url,
          orden: index,
          esPrincipal: imagen.esPrincipal,
        })),

        pesos: obtenerPesosDesdeTexto(),
        categoriaIds: productoForm.categoriaIds,
      };

      console.log("PAYLOAD PRODUCTO:", payload);

      const method = editingProducto ? "PUT" : "POST";

      const url = editingProducto
        ? `${API_PRODUCTOS}/${editingProducto.id}`
        : API_PRODUCTOS;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("ERROR GUARDANDO PRODUCTO:", responseText);

        throw new Error(responseText || "Error al guardar producto");
      }

      showToast(
        "Operación exitosa",
        editingProducto
          ? "Producto actualizado correctamente"
          : "Producto creado correctamente",
      );

      setOpenProducto(false);
      resetProducto();

      await loadData();
    } catch (error) {
      console.error(error);

      showToast(
        "Error",
        error instanceof Error
          ? error.message
          : "No fue posible guardar el producto",
        "error",
      );
    }
  };

  const deleteCategoria = async (id: string) => {
    try {
      const response = await fetch(`${API_CATEGORIAS}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error eliminando categoría");
      }

      showToast(
        "Categoría eliminada",
        "La categoría fue eliminada correctamente",
      );

      await loadData();
    } catch (error) {
      console.error(error);

      showToast("Error", "No fue posible eliminar la categoría", "error");
    }
  };

  const deleteProducto = async (id: string) => {
    try {
      const response = await fetch(`${API_PRODUCTOS}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error eliminando producto");
      }

      showToast(
        "Producto eliminado",
        "El producto fue eliminado correctamente",
      );

      await loadData();
    } catch (error) {
      console.error(error);

      showToast("Error", "No fue posible eliminar el producto", "error");
    }
  };

  const confirmDelete = (
    id: string,
    nombre: string,
    type: "producto" | "categoria",
  ) => {
    setDeleteData({
      id,
      nombre,
      type,
    });

    setOpenDeleteDialog(true);
  };

  const agregarImagenes = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nuevasImagenes: ProductoImagenForm[] = Array.from(files).map(
      (file, index) => ({
        file,
        url: "",
        preview: URL.createObjectURL(file),
        orden: productoForm.imagenes.length + index,
        esPrincipal: productoForm.imagenes.length === 0 && index === 0,
      }),
    );

    setProductoForm((prev) => ({
      ...prev,
      imagenes: normalizarOrdenImagenes([...prev.imagenes, ...nuevasImagenes]),
    }));
  };

  const eliminarImagen = (index: number) => {
    setProductoForm((prev) => ({
      ...prev,
      imagenes: normalizarOrdenImagenes(
        prev.imagenes.filter((_, imageIndex) => imageIndex !== index),
      ),
    }));
  };

  const moverImagen = (index: number, direction: "up" | "down") => {
    setProductoForm((prev) => {
      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= prev.imagenes.length) {
        return prev;
      }

      const imagenes = [...prev.imagenes];

      const temporal = imagenes[index];

      imagenes[index] = imagenes[nextIndex];
      imagenes[nextIndex] = temporal;

      return {
        ...prev,
        imagenes: normalizarOrdenImagenes(imagenes),
      };
    });
  };

  const marcarPrincipal = (index: number) => {
    setProductoForm((prev) => ({
      ...prev,
      imagenes: prev.imagenes.map((imagen, imageIndex) => ({
        ...imagen,
        esPrincipal: imageIndex === index,
      })),
    }));
  };

  return (
    <>
      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[radial-gradient(circle_at_top,rgba(216,180,254,0.25),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.18),transparent_25%),linear-gradient(to_bottom_right,#faf5ff,#ffffff,#fdf2f8)]
          px-4
          py-8
          md:px-8
        "
      >
        <div className="mx-auto max-w-7xl">
          <section
            className="
              relative
              mb-10
              overflow-hidden
              rounded-[40px]
              border
              border-white/50
              bg-white/60
              shadow-[0_20px_80px_rgba(168,85,247,0.12)]
              backdrop-blur-2xl
            "
          >
            <div className="bg-gradient-to-r from-violet-500 via-fuchsia-400 to-pink-300 p-[1px]">
              <div className="rounded-[35px] bg-white/90 px-6 py-8 md:px-10 md:py-10">
                <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                      <Link href="./">
                        <Button
                          variant="outline"
                          className="
                            h-12
                            rounded-2xl
                            border-violet-200
                            bg-white
                            px-6
                            text-violet-700
                            hover:bg-violet-50
                            hover:text-violet-900
                          "
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Inicio
                        </Button>
                      </Link>
                      <LayoutGrid className="h-4 w-4" />
                      Panel administrativo
                    </div>

                    <h1 className="text-4xl font-black tracking-tight text-violet-950 md:text-6xl">
                      Dashboard Catálogo
                    </h1>

                    <p className="mt-4 max-w-2xl text-violet-500">
                      Administra categorías, productos, múltiples imágenes,
                      pesos, estado y orden visual del catálogo.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={loadData}
                      variant="outline"
                      disabled={loading}
                      className="
                        h-12
                        rounded-2xl
                        border-violet-200
                        bg-white/80
                        px-6
                        text-violet-700
                        shadow-md
                        transition-all
                        hover:-translate-y-0.5
                        hover:bg-violet-50
                        hover:shadow-xl
                      "
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      {loading ? "Cargando..." : "Recargar"}
                    </Button>

                    <Button
                      onClick={() => {
                        resetCategoria();
                        setOpenCategoria(true);
                      }}
                      className="
                        h-12
                        rounded-2xl
                        bg-gradient-to-r
                        from-violet-600
                        via-fuchsia-500
                        to-pink-500
                        px-6
                        text-white
                        shadow-[0_10px_30px_rgba(168,85,247,0.35)]
                        transition-all
                        hover:-translate-y-1
                        hover:shadow-[0_20px_40px_rgba(168,85,247,0.45)]
                      "
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Categoría
                    </Button>

                    <Button
                      onClick={() => {
                        resetProducto();
                        setOpenProducto(true);
                      }}
                      className="
                        h-12
                        rounded-2xl
                        bg-gradient-to-r
                        from-violet-600
                        via-fuchsia-500
                        to-pink-500
                        px-6
                        text-white
                        shadow-[0_10px_30px_rgba(168,85,247,0.35)]
                        transition-all
                        hover:-translate-y-1
                        hover:shadow-[0_20px_40px_rgba(168,85,247,0.45)]
                      "
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Producto
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Card
            className="
              mb-8
              rounded-[30px]
              border
              border-white/60
              bg-white/70
              shadow-[0_15px_50px_rgba(168,85,247,0.08)]
              backdrop-blur-xl
            "
          >
            <CardContent className="p-5">
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-violet-100
                  bg-gradient-to-r
                  from-violet-50
                  to-pink-50
                  px-5
                  py-4
                  shadow-inner
                "
              >
                <Search className="h-5 w-5 text-violet-400" />

                <Input
                  placeholder="Buscar..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mb-10 flex justify-center">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                className="
                  flex
                  h-20
                  items-center
                  gap-3
                  rounded-[30px]
                  border
                  border-white/60
                  bg-white/70
                  p-2
                  shadow-[0_15px_50px_rgba(168,85,247,0.12)]
                  backdrop-blur-2xl
                "
              >
                <TabsTrigger
                  value="categorias"
                  className="
                    h-14
                    min-w-[180px]
                    rounded-2xl
                    px-8
                    text-base
                    font-semibold
                    tracking-wide
                    text-violet-600
                    data-[state=active]:bg-gradient-to-r
                    data-[state=active]:from-violet-600
                    data-[state=active]:via-fuchsia-500
                    data-[state=active]:to-pink-500
                    data-[state=active]:text-white
                  "
                >
                  <LayoutGrid className="mr-3 h-5 w-5" />
                  Categorías
                </TabsTrigger>

                <TabsTrigger
                  value="productos"
                  className="
                    h-14
                    min-w-[180px]
                    rounded-2xl
                    px-8
                    text-base
                    font-semibold
                    tracking-wide
                    text-pink-600
                    data-[state=active]:bg-gradient-to-r
                    data-[state=active]:from-pink-500
                    data-[state=active]:to-fuchsia-500
                    data-[state=active]:text-white
                  "
                >
                  <Package className="mr-3 h-5 w-5" />
                  Productos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Card
            className="
              overflow-hidden
              rounded-[36px]
              border
              border-white/60
              bg-white/75
              shadow-[0_20px_80px_rgba(168,85,247,0.10)]
              backdrop-blur-2xl
            "
          >
            <div className="overflow-x-auto">
              <div
                className="
                  flex
                  flex-col
                  gap-5
                  border-t
                  border-violet-100
                  bg-gradient-to-r
                  from-violet-50/70
                  to-pink-50/70
                  px-6
                  py-5
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold text-violet-700">
                    Mostrar:
                  </p>

                  <select
                    value={rowsPerPage}
                    onChange={(event) => {
                      setRowsPerPage(Number(event.target.value));
                      setCurrentPage(1);
                    }}
                    className="
                      h-11
                      rounded-2xl
                      border
                      border-violet-200
                      bg-white
                      px-4
                      text-sm
                      font-semibold
                      text-violet-700
                      shadow-sm
                      outline-none
                      transition-all
                      focus:border-violet-400
                      focus:ring-4
                      focus:ring-violet-100
                    "
                  >
                    {[5, 10, 15, 20, 50, 100].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>

                  <p className="text-sm text-violet-500">
                    registros por página
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="
                      h-11
                      rounded-2xl
                      border-violet-200
                      bg-white
                      px-4
                      text-violet-700
                      shadow-sm
                      hover:bg-violet-50
                    "
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>

                  <div
                    className="
                      flex
                      items-center
                      rounded-2xl
                      bg-white
                      px-5
                      py-2.5
                      text-sm
                      font-bold
                      text-violet-700
                      shadow-sm
                    "
                  >
                    Página {currentPage} de {totalPages || 1}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="
                      h-11
                      rounded-2xl
                      border-violet-200
                      bg-white
                      px-4
                      text-violet-700
                      shadow-sm
                      hover:bg-violet-50
                    "
                  >
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>

              <table className="w-full min-w-[1300px] border-collapse">
                <thead>
                  <tr className="border-b border-violet-100 bg-gradient-to-r from-violet-100/70 via-fuchsia-50 to-pink-100/70">
                    {activeTab === "productos" ? (
                      <>
                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Producto
                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Imágenes
                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Precio
                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Tamaño
                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Pesos
                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Estado
                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Categorías
                        </th>

                        <th className="px-6 py-5 text-right text-sm font-bold uppercase tracking-wider text-violet-700">
                          Acciones
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Categoría
                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Productos
                        </th>

                        <th className="px-6 py-5 text-right text-sm font-bold uppercase tracking-wider text-violet-700">
                          Acciones
                        </th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {activeTab === "productos"
                    ? filteredProductos
                        .slice(
                          (currentPage - 1) * rowsPerPage,
                          currentPage * rowsPerPage,
                        )
                        .map((producto) => (
                          <tr
                            key={producto.id}
                            className="
                              border-b
                              border-violet-50
                              transition-all
                              duration-300
                              hover:bg-gradient-to-r
                              hover:from-violet-50/80
                              hover:to-pink-50/70
                            "
                          >
                            <td className="px-6 py-5">
                              <div>
                                <p className="font-bold text-violet-950">
                                  {producto.nombre}
                                </p>

                                <p className="mt-1 text-sm text-violet-400">
                                  ID: {producto.id}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <div
                                  className="
                                    relative
                                    h-20
                                    w-20
                                    overflow-hidden
                                    rounded-3xl
                                    border
                                    border-white/70
                                    shadow-[0_10px_30px_rgba(168,85,247,0.15)]
                                  "
                                >
                                  <Image
                                    src={obtenerImagenPrincipal(producto)}
                                    alt={producto.nombre}
                                    width={80}
                                    height={80}
                                    unoptimized
                                    className="h-full w-full object-cover"
                                  />
                                </div>

                                {producto.imagenes &&
                                  producto.imagenes.length > 1 && (
                                    <Badge className="rounded-full bg-violet-100 px-3 py-1 text-violet-700">
                                      +{producto.imagenes.length - 1}
                                    </Badge>
                                  )}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 font-bold text-violet-700">
                                <CircleDollarSign className="h-4 w-4" />
                                {producto.precio}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <Badge className="rounded-full bg-violet-100 px-4 py-2 text-violet-700">
                                {producto.color || "Sin tamaño"}
                              </Badge>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex flex-wrap gap-2">
                                {producto.pesos && producto.pesos.length > 0 ? (
                                  producto.pesos.map((peso) => (
                                    <Badge
                                      key={peso}
                                      className="rounded-full bg-fuchsia-100 px-4 py-2 text-fuchsia-700"
                                    >
                                      {peso}
                                    </Badge>
                                  ))
                                ) : (
                                  <Badge className="rounded-full bg-neutral-100 px-4 py-2 text-neutral-600">
                                    Sin pesos
                                  </Badge>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <Badge
                                className={`rounded-full px-4 py-2 ${
                                  producto.estado
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {producto.estado ? "Activo" : "Inactivo"}
                              </Badge>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex flex-wrap gap-2">
                                {producto.categorias?.map((categoria) => (
                                  <Badge
                                    key={categoria.id}
                                    className="rounded-full bg-pink-100 px-4 py-2 text-pink-700"
                                  >
                                    {categoria.nombre}
                                  </Badge>
                                ))}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-3">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="
                                    rounded-xl
                                    border
                                    border-violet-200
                                    bg-gradient-to-r
                                    from-violet-50
                                    to-fuchsia-50
                                    text-violet-700
                                    transition-all
                                    hover:scale-105
                                    hover:shadow-lg
                                  "
                                  onClick={() => {
                                    setEditingProducto(producto);

                                    setProductoForm({
                                      nombre: producto.nombre,
                                      precio: String(producto.precio),
                                      color: producto.color || "",
                                      estado: producto.estado,
                                      categoriaIds:
                                        producto.categorias?.map((c) => c.id) ||
                                        [],
                                      imagenes:
                                        obtenerImagenesProducto(producto),
                                      pesosText:
                                        producto.pesos?.join(", ") || "",
                                    });

                                    setOpenProducto(true);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-rose-500
                                    to-red-500
                                    text-white
                                    shadow-md
                                    transition-all
                                    hover:scale-105
                                    hover:shadow-xl
                                  "
                                  onClick={() =>
                                    confirmDelete(
                                      producto.id,
                                      producto.nombre,
                                      "producto",
                                    )
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                    : filteredCategorias
                        .slice(
                          (currentPage - 1) * rowsPerPage,
                          currentPage * rowsPerPage,
                        )
                        .map((categoria) => (
                          <tr
                            key={categoria.id}
                            className="border-b border-violet-50 hover:bg-violet-50/40"
                          >
                            <td className="px-6 py-5">
                              <div>
                                <p className="font-bold text-violet-950">
                                  {categoria.nombre}
                                </p>

                                <p className="mt-1 text-sm text-violet-400">
                                  ID: {categoria.id}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <Badge className="rounded-full bg-fuchsia-100 px-4 py-2 text-fuchsia-700">
                                {categoria.productos?.length || 0} productos
                              </Badge>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-3">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="rounded-xl border border-violet-100 bg-violet-50 text-violet-700"
                                  onClick={() => {
                                    setEditingCategoria(categoria);

                                    setCategoriaForm({
                                      nombre: categoria.nombre,
                                    });

                                    setOpenCategoria(true);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="rounded-xl"
                                  onClick={() =>
                                    confirmDelete(
                                      categoria.id,
                                      categoria.nombre,
                                      "categoria",
                                    )
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Dialog
          open={openCategoria}
          onOpenChange={(open) => {
            setOpenCategoria(open);

            if (!open) {
              resetCategoria();
            }
          }}
        >
          <DialogContent className="rounded-[32px] border border-violet-100 bg-white sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-violet-950">
                {editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
              </DialogTitle>

              <DialogDescription>
                Completa la información de la categoría.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Nombre</Label>

                <Input
                  value={categoriaForm.nombre}
                  onChange={(event) =>
                    setCategoriaForm({
                      nombre: event.target.value,
                    })
                  }
                />
              </div>

              <Button
                onClick={saveCategoria}
                className="h-12 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white"
              >
                Guardar Categoría
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openProducto}
          onOpenChange={(open) => {
            setOpenProducto(open);

            if (!open) {
              resetProducto();
            }
          }}
        >
          <DialogContent
            className="
              max-h-[95vh]
              overflow-y-auto
              rounded-[36px]
              border
              border-white/60
              bg-white/90
              shadow-[0_20px_80px_rgba(168,85,247,0.15)]
              backdrop-blur-2xl
              sm:max-w-5xl
            "
          >
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-violet-950">
                {editingProducto ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>

              <DialogDescription>
                Completa toda la información del producto. Puedes subir varias
                imágenes, cambiar su orden y seleccionar la imagen principal.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre</Label>

                <Input
                  value={productoForm.nombre}
                  maxLength={200}
                  onChange={(event) =>
                    setProductoForm({
                      ...productoForm,
                      nombre: event.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Precio</Label>

                <Input
                  type="number"
                  min={0}
                  value={productoForm.precio}
                  onChange={(event) =>
                    setProductoForm({
                      ...productoForm,
                      precio: event.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Tamaño</Label>

                <Input
                  value={productoForm.color}
                  maxLength={50}
                  onChange={(event) =>
                    setProductoForm({
                      ...productoForm,
                      color: event.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Pesos</Label>

                <Input
                  value={productoForm.pesosText}
                  placeholder="Ej: 250g, 500g, 1kg"
                  onChange={(event) =>
                    setProductoForm({
                      ...productoForm,
                      pesosText: event.target.value,
                    })
                  }
                />

                <p className="text-xs text-violet-400">
                  Sepáralos por coma. Se enviará como arreglo en el campo{" "}
                  <strong>pesos</strong>.
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Estado</Label>

                <div
                  className={`
                    flex
                    h-16
                    items-center
                    justify-between
                    rounded-3xl
                    border
                    px-5
                    transition-all
                    duration-300
                    ${
                      productoForm.estado
                        ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shadow-[0_10px_30px_rgba(16,185,129,0.12)]"
                        : "border-rose-200 bg-gradient-to-r from-rose-50 to-red-50 shadow-[0_10px_30px_rgba(244,63,94,0.10)]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        h-3
                        w-3
                        animate-pulse
                        rounded-full
                        ${productoForm.estado ? "bg-emerald-500" : "bg-rose-500"}
                      `}
                    />

                    <div>
                      <p
                        className={`
                          text-sm
                          font-black
                          ${productoForm.estado ? "text-emerald-700" : "text-rose-700"}
                        `}
                      >
                        {productoForm.estado
                          ? "Producto activo"
                          : "Producto inactivo"}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={productoForm.estado}
                    onCheckedChange={(value) =>
                      setProductoForm({
                        ...productoForm,
                        estado: value,
                      })
                    }
                    className="
                      scale-125
                      shadow-lg
                      data-[state=checked]:bg-emerald-500
                      data-[state=unchecked]:bg-rose-400
                    "
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Imágenes del producto</Label>

              <label
                className="
                  group
                  relative
                  flex
                  min-h-[220px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[32px]
                  border-2
                  border-dashed
                  border-violet-200
                  bg-gradient-to-br
                  from-violet-50
                  via-pink-50
                  to-fuchsia-50
                  transition-all
                  hover:-translate-y-1
                  hover:border-fuchsia-400
                  hover:shadow-[0_20px_60px_rgba(168,85,247,0.20)]
                "
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    agregarImagenes(event.target.files);
                    event.target.value = "";
                  }}
                />

                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 rounded-full bg-white p-5 shadow-lg">
                    <ImagePlus className="h-10 w-10 text-fuchsia-500" />
                  </div>

                  <h3 className="text-xl font-black text-violet-950">
                    Selecciona varias imágenes
                  </h3>

                  <p className="mt-2 text-sm text-violet-500">
                    Puedes cargar una o varias imágenes en un solo producto.
                  </p>
                </div>
              </label>

              {productoForm.imagenes.length > 0 && (
                <div className="grid gap-4 rounded-[30px] border border-violet-100 bg-violet-50/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                  {productoForm.imagenes.map((imagen, index) => (
                    <div
                      key={`${imagen.preview || imagen.url}-${index}`}
                      className="
                        overflow-hidden
                        rounded-[26px]
                        border
                        border-white/70
                        bg-white
                        shadow-[0_12px_35px_rgba(168,85,247,0.12)]
                      "
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={
                            imagen.preview || imagen.url || "/placeholder.png"
                          }
                          alt={`Imagen ${index + 1}`}
                          width={600}
                          height={400}
                          unoptimized
                          className="h-full w-full object-cover"
                        />

                        {imagen.esPrincipal && (
                          <Badge className="absolute left-3 top-3 rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
                            <Star className="mr-1 h-3 w-3 fill-current" />
                            Principal
                          </Badge>
                        )}

                        <button
                          type="button"
                          onClick={() => eliminarImagen(index)}
                          className="
                            absolute
                            right-3
                            top-3
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-white/90
                            text-red-500
                            shadow-lg
                            transition-all
                            hover:scale-110
                            hover:bg-red-50
                          "
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-3 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-violet-800">
                            Orden: {index}
                          </p>

                          {imagen.id && (
                            <Badge className="rounded-full bg-violet-100 text-violet-700">
                              ID: {imagen.id}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={index === 0}
                            onClick={() => moverImagen(index, "up")}
                            className="rounded-xl border-violet-200 text-violet-700"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            disabled={
                              index === productoForm.imagenes.length - 1
                            }
                            onClick={() => moverImagen(index, "down")}
                            className="rounded-xl border-violet-200 text-violet-700"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant={
                              imagen.esPrincipal ? "secondary" : "outline"
                            }
                            onClick={() => marcarPrincipal(index)}
                            className="
                              rounded-xl
                              border-violet-200
                              text-violet-700
                            "
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {editingProducto && productoForm.imagenes.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={guardarSoloOrdenImagenes}
                  className="
                    h-12
                    w-full
                    rounded-2xl
                    border-violet-200
                    bg-white
                    text-violet-700
                    hover:bg-violet-50
                  "
                >
                  Guardar solo orden de imágenes
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <Label>Categorías relacionadas</Label>

              <div className="grid gap-3 rounded-3xl border border-violet-100 bg-violet-50/60 p-5 md:grid-cols-2">
                {categorias.map((categoria) => {
                  const selected = productoForm.categoriaIds.includes(
                    categoria.id,
                  );

                  return (
                    <button
                      key={categoria.id}
                      type="button"
                      onClick={() => {
                        if (selected) {
                          setProductoForm({
                            ...productoForm,
                            categoriaIds: productoForm.categoriaIds.filter(
                              (id) => id !== categoria.id,
                            ),
                          });
                        } else {
                          setProductoForm({
                            ...productoForm,
                            categoriaIds: [
                              ...productoForm.categoriaIds,
                              categoria.id,
                            ],
                          });
                        }
                      }}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        selected
                          ? "border-violet-500 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg"
                          : "border-violet-100 bg-white text-violet-700 hover:bg-violet-100"
                      }`}
                    >
                      <p className="font-semibold">{categoria.nombre}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={saveProducto}
              className="h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white"
            >
              Guardar Producto
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent
            className="
              overflow-hidden
              rounded-[32px]
              border
              border-white/60
              bg-white/95
              shadow-[0_25px_80px_rgba(168,85,247,0.18)]
              backdrop-blur-2xl
              sm:max-w-md
            "
          >
            <div
              className="
                absolute
                inset-x-0
                top-0
                h-1
                bg-gradient-to-r
                from-rose-500
                via-red-500
                to-orange-500
              "
            />

            <DialogHeader className="pt-4">
              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-rose-100
                  to-red-100
                  shadow-inner
                "
              >
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>

              <DialogTitle className="text-center text-2xl font-black text-violet-950">
                Confirmar eliminación
              </DialogTitle>

              <DialogDescription className="text-center text-base leading-relaxed text-violet-500">
                Esta acción eliminará permanentemente el elemento seleccionado.
                <br />
                No podrás recuperarlo después.
              </DialogDescription>
            </DialogHeader>

            <div
              className="
                mt-4
                rounded-2xl
                border
                border-red-100
                bg-red-50
                p-4
                text-center
              "
            >
              <p className="text-xs uppercase tracking-widest text-red-500">
                Elemento seleccionado
              </p>

              <p className="mt-1 font-bold text-red-700">
                {deleteData?.nombre}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="
                  h-12
                  flex-1
                  rounded-2xl
                  border-violet-200
                  text-violet-700
                  hover:bg-violet-50
                "
                onClick={() => {
                  setOpenDeleteDialog(false);
                  setDeleteData(null);
                }}
              >
                Cancelar
              </Button>

              <Button
                variant="destructive"
                className="
                  h-12
                  flex-1
                  rounded-2xl
                  bg-gradient-to-r
                  from-rose-500
                  to-red-500
                  text-white
                  shadow-[0_10px_30px_rgba(244,63,94,0.30)]
                  transition-all
                  hover:scale-[1.02]
                  hover:shadow-[0_15px_40px_rgba(244,63,94,0.40)]
                "
                onClick={async () => {
                  if (!deleteData) return;

                  setOpenDeleteDialog(false);

                  if (deleteData.type === "producto") {
                    await deleteProducto(deleteData.id);
                  } else {
                    await deleteCategoria(deleteData.id);
                  }

                  setDeleteData(null);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Sí, eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Toaster richColors position="top-right" />
    </>
  );
}
