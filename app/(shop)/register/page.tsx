"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { registerCustomer } from "@/lib/actions/customer-auth";

const initialState = { error: "" };

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerCustomer, initialState);

  return (
    <div className="max-w-md mx-auto bg-white p-6 md:p-8 rounded-xl shadow">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Create an Account</h1>

      {state?.error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{state.error}</p>}

      <form action={formAction} className="space-y-4">
        <input type="text" name="full_name" placeholder="Full Name" required className="w-full border rounded-lg px-3 py-2" />
        <input type="email" name="email" placeholder="Email" required className="w-full border rounded-lg px-3 py-2" />
        <input type="text" name="phone" placeholder="Phone Number" className="w-full border rounded-lg px-3 py-2" />
        <input type="password" name="password" placeholder="Password" required className="w-full border rounded-lg px-3 py-2" />
        <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-lg font-semibold">
          Create Account
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-brand underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
