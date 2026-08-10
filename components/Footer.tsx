import Link from "next/link";
import type { Dict } from "@/lib/i18n";

type FooterProps = {
  siteName: string;
  dict: Dict;
  phone: string;
  email: string;
};

export default function Footer({ siteName, dict, phone, email }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">🎁 {siteName}</h3>
          <p className="text-sm">{dict.footer_tagline}</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">{dict.footer_contact}</h4>
          <p className="text-sm">📞 {phone}</p>
          <p className="text-sm">✉️ {email}</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">{dict.footer_categories}</h4>
          <Link href="/products?category=bags" className="block text-sm hover:text-white">Bags</Link>
          <Link href="/products?category=shoes" className="block text-sm hover:text-white">Shoes</Link>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-800">
        &copy; {new Date().getFullYear()} {siteName}. {dict.footer_rights}
      </div>
    </footer>
  );
}
