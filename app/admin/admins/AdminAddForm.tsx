"use client";

import { useFormState } from "react-dom";
import { createAdminAccount } from "@/lib/actions/admin-management-actions";

const initialState = { error: "" };

export default function AdminAddForm() {
  const [state, formAction] = useFormState(createAdminAccount, initialState);

  return (
    <>
      {state?.error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{state.error}</p>}
      <form action={formAction} className="space-y-3">
        <input type="text" name="full_name" placeholder="Full Name" required className="w-full border rounded-lg px-3 py-2" />
        <input type="email" name="email" placeholder="Email" required className="w-full border rounded-lg px-3 py-2" />
        <input type="password" name="password" placeholder="Password" required className="w-full border rounded-lg px-3 py-2" />
        <select name="role" className="w-full border rounded-lg px-3 py-2">
          <option value="STAFF">Staff (limited access)</option>
          <option value="SUPER_ADMIN">Super Admin (full access)</option>
        </select>
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold">
          Add Account
        </button>
      </form>
    </>
  );
}
