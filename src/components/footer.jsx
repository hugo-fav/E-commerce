"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className=" bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Top */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-sm font-medium tracking-wide uppercase text-gray-900">
              online shopping
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-xs">
              Premium products curated with quality and simplicity in mind. Shop
              confidently with fast delivery and trusted service.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wide uppercase text-gray-900">
              Navigation
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-black transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-black transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-black transition">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-sm font-medium tracking-wide uppercase text-gray-900">
              Follow Us
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} online shopping. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
