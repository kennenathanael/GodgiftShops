import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDict } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
  const dict = getDict();
  const order = await prisma.order.findUnique({ where: { id: parseInt(params.id, 10) } });
  if (!order) notFound();

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6 md:p-10 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-xl md:text-2xl font-bold mb-2">{dict.order_confirmed}</h1>
      <p className="text-gray-600 mb-4">
        Order #{order.id} — {dict.total}: {formatPrice(order.totalAmount.toString())}
      </p>
      <p className="text-gray-600 mb-6">
        {dict.order_contact_note} <strong>{order.guestPhone}</strong> {dict.order_confirm_delivery}
      </p>
      <Link href="/" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-semibold inline-block">
        {dict.continue_shopping}
      </Link>
    </div>
  );
}
