"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { updateCategory } from "@/lib/actions/category-actions";

const initialState = { error: "" };

export default function EditCategoryForm({ category }: { category: { id: number; name: string; description: string | null } }) {
  const action = updateCategory.bind(null, category.id);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <>
      <Link href="/admin/categories" className="text-sm text-gray-500 hover:underline">
        &larr; Back to Categories
      </Link>

      <div className="bg-white rounded-xl shadow p-6 mt-4 max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
        {state?.error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{state.error}</p>}
        <form action={formAction} className="space-y-4">
          <input type="text" name="name" required defaultValue={category.name} className="w-full border rounded-lg px-3 py-2" />
          <textarea name="description" defaultValue={category.description || ""} className="w-full border rounded-lg px-3 py-2" />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold">
            Update
          </button>
        </form>
      </div>
    </>
  );
}
