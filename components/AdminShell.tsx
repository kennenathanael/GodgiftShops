"use client";

import Link from "next/link";
import { useState } from "react";
import { logoutAdmin } from "@/lib/actions/admin-auth";

type AdminShellProps = {
  siteName: string;
  adminName: string;
  role: "SUPER_ADMIN" | "STAFF";
  pageTitle: string;
  children: React.ReactNode;
};

export default function AdminShell({ siteName, adminName, role, pageTitle, children }: AdminShellProps) {
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <nav className="p-4 space-y-1 text-sm">
      <Link href="/admin/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-800">📊 Dashboard</Link>
      <Link href="/admin/products" className="block px-3 py-2 rounded-lg hover:bg-gray-800">🛍️ Products</Link>
      <Link href="/admin/categories" className="block px-3 py-2 rounded-lg hover:bg-gray-800">📂 Categories</Link>
      <Link href="/admin/orders" className="block px-3 py-2 rounded-lg hover:bg-gray-800">📦 Orders</Link>
      {role === "SUPER_ADMIN" && (
        <Link href="/admin/admins" className="block px-3 py-2 rounded-lg hover:bg-gray-800">👤 Admin Accounts</Link>
      )}
      <Link href="/admin/logs" className="block px-3 py-2 rounded-lg hover:bg-gray-800">📝 Activity Logs</Link>
      <form action={logoutAdmin}>
        <button type="submit" className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-700 mt-6">🚪 Logout</button>
      </form>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block w-64 bg-gray-900 text-gray-200 flex-shrink-0">
        <div className="p-5 text-xl font-bold text-white border-b border-gray-800">🎁 {siteName}</div>
        <NavLinks />
      </aside>

      {/* Sidebar (mobile off-canvas) */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-gray-900 text-gray-200">
            <div className="p-5 flex items-center justify-between border-b border-gray-800">
              <span className="text-xl font-bold text-white">🎁 {siteName}</span>
              <button onClick={() => setOpen(false)} className="text-gray-300">✕</button>
            </div>
            <NavLinks />
          </aside>
        </div>
      )}

      <div className="flex-1 w-full">
        <header className="bg-white shadow px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base md:text-lg font-semibold">{pageTitle}</h1>
          </div>
          <div className="text-xs md:text-sm text-gray-500 text-right">
            {adminName}
            <span className="hidden md:inline"> ({role})</span>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
