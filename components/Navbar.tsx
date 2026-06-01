"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Inicio",
      href: "#inicio",
    },
    {
      label: "Productos",
      href: "#productos",
    },
    {
      label: "Quién Soy",
      href: "#quien-soy",
    },
    {
      label: "Contacto",
      href: "#footer",
    },
  ];

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        right-0
        z-50

        border-b
        border-white/20

        bg-white/55
        backdrop-blur-2xl

        shadow-[0_8px_32px_rgba(0,0,0,0.08)]
      "
    >
      <div
        className="
          container
          mx-auto
          flex
          h-20
          items-center
          justify-between
          px-4
        "
      >
        {/* LOGO + MARCA */}

        <a
          href="#inicio"
          className="
            group
            flex
            items-center
            gap-3
            transition-all
            duration-300
            hover:scale-[1.02]
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

              bg-white/90
              p-2

              shadow-lg

              transition-all
              duration-300

              group-hover:shadow-xl
              group-hover:scale-105
            "
          >
            <Image
              src="/logo.png"
              alt="Alexa Insumos"
              width={120}
              height={120}
              priority
              className="
                h-full
                w-full
                object-contain
              "
            />
          </div>

          <div className="hidden sm:block">
            <h1
              className="
                text-xl
                font-black
                leading-none
              "
            >
              <span
                className="
                  bg-gradient-to-r
                  from-violet-600
                  via-fuchsia-500
                  to-pink-500
                  bg-clip-text
                  text-transparent
                "
              >
                Alexa
              </span>

              <span className="ml-1 text-slate-800">
                Insumos
              </span>
            </h1>

            <p
              className="
                mt-1
                text-xs
                font-medium
                tracking-widest
                text-slate-500
                uppercase
              "
            >
              Catálogo Oficial
            </p>
          </div>
        </a>

        {/* DESKTOP */}

        <div
          className="
            hidden
            items-center
            gap-8
            md:flex
          "
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="
                group
                relative

                text-sm
                font-semibold

                text-slate-600

                transition-all
                duration-300

                hover:text-fuchsia-600
              "
            >
              {link.label}

              <span
                className="
                  absolute
                  -bottom-1
                  left-0

                  h-[2px]
                  w-0

                  rounded-full

                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-500

                  transition-all
                  duration-300

                  group-hover:w-full
                "
              />
            </a>
          ))}
        </div>

        {/* MOBILE BUTTON */}

        <button
          onClick={() =>
            setOpen(!open)
          }
          className="
            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-xl

            bg-white/50

            backdrop-blur-md

            transition-all

            hover:bg-white/80

            md:hidden
          "
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}

      <div
        className={`
          overflow-hidden
          transition-all
          duration-300

          ${
            open
              ? "max-h-96 border-t border-white/20"
              : "max-h-0"
          }
        `}
      >
        <div
          className="
            bg-white/70
            backdrop-blur-2xl
            px-4
            py-4
          "
        >
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() =>
                  setOpen(false)
                }
                className="
                  rounded-2xl
                  px-4
                  py-3

                  font-medium

                  text-slate-600

                  transition-all

                  hover:bg-white
                  hover:text-fuchsia-600
                "
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}