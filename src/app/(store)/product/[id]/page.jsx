"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";

import ProductCard from "@/components/products/priductCard";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import { getProductById, getRelatedProducts } from "@/lib/queries/product";
import LoadingSpinner from "@/utils/loadingSpinner";

const ProductDetailPage = () => {
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const foundProduct = await getProductById(id);

      if (!foundProduct) return notFound();

      setProduct(foundProduct);
      setMainImage(foundProduct.images[0]);

      // Fetch related products
      if (foundProduct.category_id) {
        const related = await getRelatedProducts(
          foundProduct.category_id,
          foundProduct.id
        );
        setRelatedProducts(related);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto  px-6 sm:px-8 lg:px- py-8">
      {/* MAIN PRODUCT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-4 flex gap-3">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className={`relative w-20 aspect-square overflow-hidden border transition ${
                  mainImage === img
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-medium uppercase tracking-wide text-gray-900">
            {product.name}
          </h1>

          <p className="mt-2 text-lg font-semibold tracking-wide text-black">
            ₦{product.price.toLocaleString()}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>

          <p className="mt-4 text-xs uppercase tracking-wider text-gray-500">
            {product.category.name}
          </p>

          {/* Quantity */}
          <div className="mt-8">
            <p className="text-xs uppercase tracking-wide text-gray-600 mb-3">
              Quantity
            </p>
            <div className="inline-flex items-center border border-gray-300">
              <button
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                className="w-10 h-10 text-lg hover:bg-gray-100"
              >
                −
              </button>

              <span className="w-12 text-center text-sm font-medium">
                {quantity}
              </span>

              <button
                disabled={quantity >= product.stock}
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 text-lg hover:bg-gray-100"
              >
                {quantity <= product.stock ? "+" : ""}
              </button>
            </div>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {product.stock > 0
              ? `(${product.stock} available)`
              : "Out of Stock"}
          </p>

          {/* Add to Cart */}
          <button
            disabled={product.stock <= 0}
            onClick={() => addToCart(product, quantity)}
            className="mt-10 w-full bg-black text-white py-4 text-sm uppercase tracking-wide hover:bg-gray-900 transition"
          >
            {quantity <= product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-lg font-medium uppercase tracking-wide mb-8">
            Related Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetailPage;
