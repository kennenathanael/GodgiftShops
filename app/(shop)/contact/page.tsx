import { getDict } from "@/lib/i18n";
import { getAllSettings } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const dict = getDict();
  const settings = await getAllSettings();

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6 md:p-10 text-center">
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        {dict.contact_us} {settings.site_name}
      </h1>
      <p className="text-gray-600 mb-2">📞 {settings.contact_phone}</p>
      <p className="text-gray-600 mb-2">✉️ {settings.contact_email}</p>
    </div>
  );
}
