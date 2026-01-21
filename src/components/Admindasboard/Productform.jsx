"use client";

import { useEffect, useState } from "react";
import { createProduct, updateProduct } from "@/lib/queries/product";
import { uploadProductImage } from "@/lib/storage/uploadImage";
import { createNewCategory, getCategories } from "@/lib/queries/category";

const ProductForm = ({ initialData }) => {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      description: "",
      price: "",
      category_id: "",
      images: [],
      stock: 0,
      is_active: true,
    },
  );

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(console.error("failed to fetch categories:", err));
      }
    }
    fetchCategories();
  }, []);

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => uploadProductImage(file)),
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading || form.images.length === 0) return;

    if (initialData) {
      //   console.log("Updating product id:", initialData.id);
      await updateProduct(initialData.id, {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        category_id: form.category_id,
        images: form.images,
        is_active: form.is_active,
      });
      alert("Product updated successfully");
    } else {
      await createProduct(form);
      alert("Product created successfully");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="space-y-12 bg-white border border-gray-200 rounded-lg p-8"
      >
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-medium tracking-wide uppercase">
            {initialData ? "Edit Product" : "New Product"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {initialData
              ? "Update product details"
              : "Add a new product to your store"}
          </p>
        </div>

        {/* DETAILS */}
        <section className="space-y-6">
          <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Product Details
          </h2>

          <input
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
          />

          <textarea
            placeholder="Description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 p-3 text-sm rounded resize-none focus:outline-none focus:border-black"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price (₦)"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
            />

            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
              className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex gap-2 items-center mt-2">
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border border-gray-300 p-2 rounded text-sm flex-1"
            />
            <button
              type="button"
              onClick={async () => {
                if (!newCategoryName) return;
                const cat = await createNewCategory({ name: newCategoryName });
                setCategories((prev) => [...prev, cat]);
                setForm({ ...form, category_id: cat.id });
                setNewCategoryName("");
              }}
              className="px-3 py-2 bg-black text-white text-sm rounded"
            >
              Add
            </button>
          </div>

          {/* category sectiom */}
          <select
            value={form.category_id}
            onChange={(e) =>
              setForm({ ...form, category_id: Number(e.target.value) })
            }
            className="w-full border border-gray-300 p-3 text-sm rounded bg-white focus:outline-none focus:border-black"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </section>

        {/* STATUS */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Visibility
          </h2>

          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
              className="h-4 w-4 accent-black"
            />
            Active product (visible to customers)
          </label>
        </section>

        {/* IMAGES */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Product Images
          </h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="text-sm"
          />

          {uploading && (
            <p className="text-xs text-gray-500">Uploading images…</p>
          )}

          <div className="flex gap-4 flex-wrap">
            {form.images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt="product"
                  className="w-28 h-28 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/80 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ACTION */}
        <div className="pt-6 border-t flex justify-end">
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 bg-black text-white text-sm tracking-wide rounded hover:bg-gray-900 disabled:opacity-50"
          >
            {initialData ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
