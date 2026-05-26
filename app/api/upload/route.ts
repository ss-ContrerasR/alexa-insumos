import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

// CLOUDINARY CONFIG

cloudinary.config({
  cloud_name:
    process.env
      .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
  req: Request
) {
  try {
    const data =
      await req.formData();

    const file =
      data.get(
        "file"
      ) as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    // FILE BUFFER

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // OPTIMIZE IMAGE WITH SHARP

    const optimizedBuffer =
      await sharp(buffer)

        // RESIZE
        .resize({
          width: 1200,

          withoutEnlargement:
            true,
        })

        // WEBP
        .webp({
          quality: 75,
        })

        // TO BUFFER
        .toBuffer();

    // CONVERT TO BASE64

    const base64 =
      `data:image/webp;base64,${optimizedBuffer.toString(
        "base64"
      )}`;

    // UPLOAD CLOUDINARY

    const uploadResponse =
      await cloudinary.uploader.upload(
        base64,
        {
          folder:
            "alexa-insumos/productos",

          resource_type:
            "image",

          format: "webp",
        }
      );

    return NextResponse.json({
      success: true,

      imageUrl:
        uploadResponse.secure_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Upload error",
      },
      {
        status: 500,
      }
    );
  }
}