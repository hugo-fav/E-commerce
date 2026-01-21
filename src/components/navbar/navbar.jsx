"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Product", path: "/admin" },
    { name: "New Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Overview", path: "/admin/overview" },
  ];

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden fixed top-4 left-4 z-50
        bg-black text-white p-2 rounded-md shadow"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64
        bg-black text-white p-6 z-50
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* CLOSE BUTTON */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-400"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>

        {/* TITLE */}
        <h1 className="text-lg font-semibold mb-8">Online shopping</h1>

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 rounded text-sm transition
                ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
