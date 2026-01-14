import Image from "next/image";
import Link from "next/link";

function DashboardProductGrid({ products }) {
  return (
    <div className="divide-y divide-gray-200">
      {products.map((product) => (
        <div key={product.id} className="flex items-center gap-6 py-4">
          {/* Image */}
          <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product info */}
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-medium text-gray-900">
              {product.name}
            </h3>

            <p className="text-sm text-gray-700">
              ₦{product.price.toLocaleString()}
            </p>

            <div className="flex gap-4 text-xs text-gray-500 uppercase tracking-wide">
              <span>{product.category?.name}</span>
              <span>
                {product.stock > 0 ? (
                  <span className="text-green-600">
                    {product.stock} in stock
                  </span>
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
              </span>
            </div>
          </div>

          {/* Edit button */}
          <Link
            href={`/admin/products/${product.id}`}
            className="text-sm px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
}

export default DashboardProductGrid;
