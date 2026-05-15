import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlexaInsumos — Moldes para tus Creaciones",
  description: "Descubre nuestra colección de moldes únicos para repostería, artesanía y manualidades. Calidad garantizada, diseños exclusivos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
