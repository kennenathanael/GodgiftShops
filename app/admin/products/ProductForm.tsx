"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { createProduct, updateProduct } from "@/lib/actions/product-actions";

type Category = { id: number; name: string };

type ProductFormProps = {
  categories: Category[];
  mode: "create" | "edit";
  product?: {
    id: number;
    name: string;
    categoryId: number;
    price: string;
    stockQuantity: number;
    description: string | null;
    image: string | null;
    isFeatured: boolean;
    newOverride: "AUTO" | "YES" | "NO";
  };
};

const initialState = { error: "" };

export default function ProductForm({ categories, mode, product }: ProductFormProps) {
  const action = mode === "edit" && product ? updateProduct.bind(null, product.id) : createProduct;
  const [state, formAction] = useFormState(action, initialState);

  return (
    <>
      <Link href="/admin/products" className="text-sm text-gray-500 hover:underline">
        &larr; Back to Products
      </Link>

      <div className="bg-white rounded-xl shadow p-6 mt-4 max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">{mode === "create" ? "Add New Product" : "Edit Product"}</h2>

        {state?.error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{state.error}</p>}

        {product?.image && (
          <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg mb-4" />
        )}

        <form action={formAction} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input type="text" name="name" required defaultValue={product?.name} className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category_id" required defaultValue={product?.categoryId} className="w-full border rounded-lg px-3 py-2">
              <option value="">-- Select --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (XAF)</label>
              <input type="number" step="0.01" name="price" required defaultValue={product?.price} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                required
                defaultValue={product?.stockQuantity ?? 1}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" rows={4} defaultValue={product?.description || ""} className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Image {mode === "edit" && "(leave empty to keep current)"}
            </label>
            <input type="file" name="image" accept="image/*" className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">&quot;New&quot; Badge</label>
            <select name="new_override" defaultValue={product?.newOverride || "AUTO"} className="w-full border rounded-lg px-3 py-2">
              <option value="AUTO">Auto (based on days since added)</option>
              <option value="YES">Force show &quot;New&quot;</option>
              <option value="NO">Force hide &quot;New&quot;</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_featured" defaultChecked={product?.isFeatured} className="rounded" />
            <span className="text-sm">Mark as Featured</span>
          </label>

          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold">
            {mode === "create" ? "Save Product" : "Update Product"}
          </button>
        </form>
      </div>
    </>
  );
}
