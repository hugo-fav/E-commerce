"use client";

import { useState } from "react";
import { createProduct } from "@/lib/queries/product";
import { uploadProductImage } from "@/lib/storage/uploadImage";

const NewProductPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    images: [],
    stock: 0,
    is_active: true,
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => uploadProductImage(file))
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
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

    if (uploading) {
      alert("Images are still uploading. Please wait.");
      return;
    }

    if (form.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    await createProduct(form);
    alert("Product created successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-10 bg-white">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-medium tracking-wide uppercase">
          New Product
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Create and publish a new product
        </p>
      </div>

      {/* PRODUCT DETAILS */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-wide uppercase">
          Product Details
        </h2>

        <input
          placeholder="Product name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
        />

        <textarea
          placeholder="Description"
          rows={4}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-300 p-3 text-sm rounded resize-none focus:outline-none focus:border-black"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Price"
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
          />

          <input
            type="number"
            placeholder="Stock"
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
            className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
          />
        </div>

        <select
          onChange={(e) =>
            setForm({ ...form, category_id: Number(e.target.value) })
          }
          className="w-full border border-gray-300 p-3 text-sm rounded bg-white focus:outline-none focus:border-black"
        >
          <option value="">Select category</option>
          <option value="1">Wigs</option>
          <option value="2">Unities</option>
        </select>
      </section>

      {/* PRODUCT STATUS */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-wide uppercase">Status</h2>

        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="h-4 w-4 accent-black"
          />
          Product is active and visible to customers
        </label>
      </section>

      {/* IMAGES */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-wide uppercase">
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
          <p className="text-xs text-gray-500">
            Uploading images, please wait…
          </p>
        )}

        <div className="flex gap-4 flex-wrap">
          {form.images.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt="product"
                className="w-28 h-28 object-cover rounded border"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black text-white text-xs w-6 h-6 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SUBMIT */}
      <div className="pt-6 border-t">
        <button
          type="submit"
          disabled={uploading}
          className="px-6 py-3 bg-black text-white text-sm tracking-wide rounded disabled:opacity-50"
        >
          {uploading ? "Uploading images..." : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default NewProductPage;
