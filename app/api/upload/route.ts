import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded",
        },
        { status: 400 }
      );
    }

    // BUFFER

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // UNIQUE NAME

    const fileName = `${Date.now()}.webp`;

    // PATH

    const uploadPath = path.join(
      process.cwd(),
      "public/uploads/productos",
      fileName
    );

    // OPTIMIZE IMAGE

    await sharp(buffer)

      // REDIMENSIONAR
      .resize(1200)

      // WEBP
      .webp({
        quality: 75,
      })

      // SAVE
      .toFile(uploadPath);

    return NextResponse.json({
      success: true,

      imageUrl: `/uploads/productos/${fileName}`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload error",
      },
      { status: 500 }
    );
  }
}