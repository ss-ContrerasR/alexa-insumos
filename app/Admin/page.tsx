"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  CircleDollarSign,
  ImagePlus,
  LayoutGrid,
  Package,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
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

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

interface Categoria {
  id: string;
  nombre: string;
  fechaCreacion?: string;
  productos?: Producto[];
}

interface Producto {
  id: string;
  nombre: string;
  precio: string;
  estado: boolean;
  color: string | null;

  imagenUrl?: string;

  categorias?: Categoria[];
}

const API_CATEGORIAS =
  "https://catalogoapiv-001-site1.qtempurl.com/api/categorias";

const API_PRODUCTOS =
  "https://catalogoapiv-001-site1.qtempurl.com/api/productos";

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

    imagen: null as File | null,

    imagenUrl: "",

    preview: "",
  });

  const showToast = (
    title: string,
    description: string,
    variant: "success" | "error" = "success",
  ) => {
    if (variant === "success") {
      toast.success(title, {
        description,
      });
    } else {
      toast.error(title, {
        description,
      });
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const [categoriasRes, productosRes] = await Promise.all([
        fetch(API_CATEGORIAS),
        fetch(API_PRODUCTOS),
      ]);

      const categoriasData = await categoriasRes.json();

      const productosData = await productosRes.json();

      setCategorias(categoriasData);

      setProductos(productosData);
    } catch (error) {
      console.error(error);

      showToast("Error", "No fue posible cargar la información", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCategorias = useMemo(() => {
    return categorias.filter((categoria) =>
      categoria.nombre.toLowerCase().includes(search.toLowerCase()),
    );
  }, [categorias, search]);

  const filteredProductos = useMemo(() => {
    return productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(search.toLowerCase()),
    );
  }, [productos, search]);

  const currentData =
    activeTab === "productos" ? filteredProductos : filteredCategorias;

  const totalPages = Math.ceil(currentData.length / rowsPerPage);

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

      imagen: null,

      imagenUrl: "",

      preview: "",
    });

    setEditingProducto(null);
  };

  const saveCategoria = async () => {
    try {
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
        throw new Error("Error al guardar categoría");
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

  const saveProducto = async () => {
    try {
      let imageUrl = productoForm.imagenUrl || null;

      if (productoForm.imagen) {
        const uploadData = new FormData();

        uploadData.append("file", productoForm.imagen);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
          throw new Error("Error subiendo imagen");
        }

        imageUrl = uploadResult.imageUrl;
      }

      const payload = {
        nombre: productoForm.nombre,

        precio: Number(productoForm.precio),

        estado: productoForm.estado,

        color: productoForm.color || null,

        imagenUrl: imageUrl,

        categoriaIds: productoForm.categoriaIds,
      };

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

      if (!response.ok) {
        throw new Error("Error al guardar producto");
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

      showToast("Error", "No fue posible guardar el producto", "error");
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
        {" "}
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
            {" "}
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
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={loadData}
                      variant="outline"
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
                      Recargar
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
            {" "}
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
                  onChange={(e) => setSearch(e.target.value)}
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
                  className="h-14 min-w-[180px] rounded-2xl px-8 text-base font-semibold tracking-wide text-violet-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:via-fuchsia-500 data-[state=active]:to-pink-500  data-[state=active]:shadow-[0_10px_30px_rgba(168,85,247,0.35)] data-[state=active]:text-white"
                >
                  <LayoutGrid className="mr-3 h-5 w-5" />
                  Categorías
                </TabsTrigger>

                <TabsTrigger
                  value="productos"
                  className="h-14 min-w-[180px] rounded-2xl px-8 text-base font-semibold tracking-wide text-pink-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
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
            {" "}
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
              {/* LEFT */}
            {/* PAGINATION */}
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold text-violet-700">
                  Mostrar:
                </p>

                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));

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

                <p className="text-sm text-violet-500">registros por página</p>
              </div>

              {/* RIGHT */}

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
              <table className="w-full min-w-[1200px] border-collapse">
                <thead>
                  <tr className="border-b border-violet-100 bg-gradient-to-r from-violet-100/70 via-fuchsia-50 to-pink-100/70">
                    {activeTab === "productos" ? (
                      <>
                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Producto
                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Imagen
                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Precio
                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-violet-700">
                          Color
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
                                  src={producto.imagenUrl || "/placeholder.png"}
                                  alt={producto.nombre}
                                  fill
                                  className="object-cover"
                                />
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
                                {producto.color || "Sin color"}
                              </Badge>
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

                                      imagen: null,

                                      imagenUrl: producto.imagenUrl || "",

                                      preview: "",
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
                                  onClick={() => deleteProducto(producto.id)}
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
                                  onClick={() => deleteCategoria(categoria.id)}
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
        <Dialog open={openCategoria} onOpenChange={setOpenCategoria}>
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
                  onChange={(e) =>
                    setCategoriaForm({
                      nombre: e.target.value,
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
        <Dialog open={openProducto} onOpenChange={setOpenProducto}>
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
  sm:max-w-3xl
"
          >
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-violet-950">
                {editingProducto ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>

              <DialogDescription>
                Completa toda la información del producto.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre</Label>

                <Input
                  value={productoForm.nombre}
                  onChange={(e) =>
                    setProductoForm({
                      ...productoForm,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Precio</Label>

                <Input
                  value={productoForm.precio}
                  onChange={(e) =>
                    setProductoForm({
                      ...productoForm,
                      precio: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>

                <Input
                  value={productoForm.color}
                  onChange={(e) =>
                    setProductoForm({
                      ...productoForm,
                      color: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
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
        rounded-full
        animate-pulse
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

                      {/* <p className="text-xs text-neutral-500">
                        Estado visible del producto
                      </p> */}
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
      data-[state=checked]:bg-emerald-500
      data-[state=unchecked]:bg-rose-400
      scale-125
      shadow-lg
    "
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Imagen del producto</Label>

              <label className="group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[32px] border-2 border-dashed border-violet-200 bg-gradient-to-br from-violet-50 via-pink-50 to-fuchsia-50 transition-all hover:border-fuchsia-400 hover:shadow-[0_20px_60px_rgba(168,85,247,0.20)] hover:-translate-y-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setProductoForm({
                        ...productoForm,

                        imagen: file,

                        preview: URL.createObjectURL(file),
                      });
                    }
                  }}
                />

                {productoForm.preview || productoForm.imagenUrl ? (
                  <img
                    src={productoForm.preview || productoForm.imagenUrl}
                    alt="preview"
                    className="h-full max-h-[260px] w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-5 rounded-full bg-white p-5 shadow-lg">
                      <ImagePlus className="h-10 w-10 text-fuchsia-500" />
                    </div>

                    <h3 className="text-xl font-black text-violet-950">
                      Arrastra una imagen
                    </h3>

                    <p className="mt-2 text-sm text-violet-500">
                      o haz click para seleccionar
                    </p>
                  </div>
                )}
              </label>
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
        <Toaster richColors position="top-right" />
      </main>
    </>
  );
}
