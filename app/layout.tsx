import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GodGiftShop",
  description: "Quality bags & shoes, new arrivals every day.",
};

// This is the single mandatory root layout. It intentionally contains no
// header/footer — the (shop) route group adds the storefront chrome, while
// /admin pages render their own AdminShell. This keeps the admin panel
// completely separate from the public storefront layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}
