"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { setLanguage } from "@/lib/actions/lang-actions";
import { logoutCustomer } from "@/lib/actions/customer-auth";
import type { Dict, Lang } from "@/lib/i18n";

type HeaderProps = {
  siteName: string;
  dict: Dict;
  lang: Lang;
  cartCount: number;
  isLoggedIn: boolean;
};

export default function Header({ siteName, dict, lang, cartCount, isLoggedIn }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const LangToggle = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "flex items-center gap-2 pt-2 border-t" : "flex items-center border rounded-full overflow-hidden text-xs font-semibold"}>
      <form action={setLanguage.bind(null, "en", pathname)}>
        <button
          type="submit"
          className={`px-2 py-1 ${mobile ? "rounded-full" : ""} ${lang === "en" ? "bg-brand text-white" : mobile ? "bg-gray-100" : "text-gray-500"}`}
        >
          EN
        </button>
      </form>
      <form action={setLanguage.bind(null, "fr", pathname)}>
        <button
          type="submit"
          className={`px-2 py-1 ${mobile ? "rounded-full" : ""} ${lang === "fr" ? "bg-brand text-white" : mobile ? "bg-gray-100" : "text-gray-500"}`}
        >
          FR
        </button>
      </form>
    </div>
  );

  const CartIcon = () => (
    <Link href="/cart" className="relative flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span className="bg-brand text-white text-[10px] rounded-full px-1.5 absolute -top-2 -right-2">{cartCount}</span>
    </Link>
  );

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-xl md:text-2xl font-bold text-brand">
          🎁 {siteName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 font-medium">
          <Link href="/" className="hover:text-brand">{dict.nav_home}</Link>
          <Link href="/products" className="hover:text-brand">{dict.nav_products}</Link>
          <Link href="/contact" className="hover:text-brand">{dict.nav_contact}</Link>
          {isLoggedIn ? (
            <form action={logoutCustomer}>
              <button type="submit" className="hover:text-brand">{dict.nav_logout}</button>
            </form>
          ) : (
            <Link href="/login" className="hover:text-brand">{dict.nav_login}</Link>
          )}
          <LangToggle />
          <CartIcon />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <CartIcon />
          <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" className="p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3 font-medium">
          <Link href="/" className="block hover:text-brand">{dict.nav_home}</Link>
          <Link href="/products" className="block hover:text-brand">{dict.nav_products}</Link>
          <Link href="/contact" className="block hover:text-brand">{dict.nav_contact}</Link>
          {isLoggedIn ? (
            <form action={logoutCustomer}>
              <button type="submit" className="block hover:text-brand">{dict.nav_logout}</button>
            </form>
          ) : (
            <Link href="/login" className="block hover:text-brand">{dict.nav_login}</Link>
          )}
          <LangToggle mobile />
        </div>
      )}
    </header>
  );
}
