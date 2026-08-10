import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDict, getLang } from "@/lib/i18n";
import { getAllSettings } from "@/lib/utils";
import { getCart, cartCount } from "@/lib/cart";
import { getCustomerSession } from "@/lib/auth";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const dict = getDict();
  const lang = getLang();
  const settings = await getAllSettings();
  const cart = getCart();
  const session = await getCustomerSession();

  const siteName = settings.site_name || "GodGiftShop";

  return (
    <>
      <Header
        siteName={siteName}
        dict={dict}
        lang={lang}
        cartCount={cartCount(cart)}
        isLoggedIn={!!session}
      />
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">{children}</main>
      <Footer
        siteName={siteName}
        dict={dict}
        phone={settings.contact_phone || ""}
        email={settings.contact_email || ""}
      />
    </>
  );
}
