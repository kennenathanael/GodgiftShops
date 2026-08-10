"use client";

import { useFormState } from "react-dom";
import { placeOrder } from "@/lib/actions/checkout-actions";
import type { Dict } from "@/lib/i18n";

const initialState = { error: "" };

export default function CheckoutForm({ dict, defaultName }: { dict: Dict; defaultName: string }) {
  const [state, formAction] = useFormState(placeOrder, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">{state.error}</p>}
      <input
        type="text"
        name="name"
        placeholder={dict.full_name}
        required
        defaultValue={defaultName}
        className="w-full border rounded-lg px-3 py-2"
      />
      <input type="text" name="phone" placeholder={dict.phone_number} required className="w-full border rounded-lg px-3 py-2" />
      <input type="email" name="email" placeholder={dict.email_optional} className="w-full border rounded-lg px-3 py-2" />
      <textarea name="address" placeholder={dict.delivery_address} required rows={3} className="w-full border rounded-lg px-3 py-2" />
      <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-lg font-semibold">
        {dict.place_order}
      </button>
    </form>
  );
}
