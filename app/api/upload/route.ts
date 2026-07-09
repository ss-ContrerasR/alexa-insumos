import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CLOUDINARY_CLOUD_NAME = "dxnymmjj6";
const CLOUDINARY_API_KEY = "664247473663381";
const CLOUDINARY_API_SECRET = "1zjBIWPUwEs8DiE5A3Gpy_QgWsQ";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 120000,
});

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  try {
    return JSON.stringify(error);
  } catch {
    return "Error desconocido subiendo imagen";
  }
};

function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "alexa-insumos/productos",
        resource_type: "image",
        format: "webp",
        use_filename: false,
        unique_filename: true,
        overwrite: false,
        timeout: 120000,
      },
      (error, result) => {
        if (error) {
          console.error("ERROR CLOUDINARY CALLBACK:", error);
          reject(new Error(getErrorMessage(error)));
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary no devolvió secure_url"));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    console.log("UPLOAD API EJECUTÁNDOSE");

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Faltan datos de Cloudinary en app/api/upload/route.ts",
        },
        { status: 500 },
      );
    }

    const data = await req.formData();
    const file = data.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No se recibió ninguna imagen en el campo file",
        },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "El archivo seleccionado no es una imagen válida",
        },
        { status: 400 },
      );
    }

    const maxSize = 15 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "La imagen no puede pesar más de 15 MB",
        },
        { status: 400 },
      );
    }

    console.log("Archivo recibido:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Optimizando imagen con sharp...");

    const optimizedBuffer = await sharp(buffer)
      .resize({
        width: 1200,
        withoutEnlargement: true,
      })
      .webp({
        quality: 70,
      })
      .toBuffer();

    console.log("Peso original:", file.size);
    console.log("Peso optimizado:", optimizedBuffer.length);

    console.log("Subiendo a Cloudinary...");

    const imageUrl = await uploadToCloudinary(optimizedBuffer);

    console.log("Imagen subida correctamente:", imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    const message = getErrorMessage(error);

    console.error("UPLOAD ERROR REAL:", message);
    console.error("UPLOAD ERROR COMPLETO:", error);

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}