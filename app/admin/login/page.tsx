"use client";

import { useFormState } from "react-dom";
import { loginAdmin } from "@/lib/actions/admin-auth";

const initialState = { error: "" };

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAdmin, initialState);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold mb-1 text-center">🎁 GodGiftShop</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Admin Panel</p>

        {state?.error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{state.error}</p>}

        <form action={formAction} className="space-y-4">
          <input type="email" name="email" placeholder="Email" required className="w-full border rounded-lg px-3 py-2" />
          <input type="password" name="password" placeholder="Password" required className="w-full border rounded-lg px-3 py-2" />
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
