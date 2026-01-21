"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Twitter, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/product" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`w-full bg-white transition-all duration-300 ${
        scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.06)]" : ""
      } mb-15`}
    >
      <div className="relative max-w-6xl mx-auto px-6 h-[88px] flex items-center">
        {/* MOBILE ONLY */}
        <button
          className="sm:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* LEFT – DESKTOP LINKS */}
        <nav className="hidden sm:flex flex-1 items-center gap-12 text-[13px] font-medium tracking-wide text-gray-700 uppercase">
          {navLinks.map((link) => {
            const active = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative transition-colors duration-200 hover:text-black ${
                  active ? "text-black" : ""
                }`}
              >
                {link.name}
                <span
                  className={`absolute left-0 -bottom-2 h-[2px] w-full bg-black transition-transform duration-300 origin-left ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* CENTER – LOGO */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image
            src="/logo2.jfif"
            alt="Brang logo"
            width={44}
            height={44}
            priority
          />
        </Link>

        {/* RIGHT – SOCIALS */}
        <div className="hidden sm:flex flex-1 justify-end items-center gap-6 text-gray-500">
          <Link href="#" aria-label="Twitter">
            <Twitter size={18} className="hover:text-black transition-colors" />
          </Link>
          <Link href="#" aria-label="Instagram">
            <Instagram
              size={18}
              className="hover:text-black transition-colors"
            />
          </Link>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`sm:hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <nav className="flex flex-col items-center gap-6 py-8 text-sm font-medium tracking-wide uppercase text-gray-700 border-t border-gray-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`transition-colors hover:text-black ${
                pathname === link.path ? "text-black" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
