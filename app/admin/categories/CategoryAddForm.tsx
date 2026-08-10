"use client";

import { useFormState } from "react-dom";
import { createCategory } from "@/lib/actions/category-actions";

const initialState = { error: "" };

export default function CategoryAddForm() {
  const [state, formAction] = useFormState(createCategory, initialState);

  return (
    <>
      {state?.error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{state.error}</p>}
      <form action={formAction} className="space-y-3">
        <input type="text" name="name" placeholder="Category name" required className="w-full border rounded-lg px-3 py-2" />
        <textarea name="description" placeholder="Description (optional)" className="w-full border rounded-lg px-3 py-2" />
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold">
          Add Category
        </button>
      </form>
    </>
  );
}
