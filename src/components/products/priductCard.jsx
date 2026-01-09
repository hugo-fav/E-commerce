import Link from "next/link";
import Image from "next/image";

const ProductCard = ({ product }) => {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div>
        {/* Image */}
        <div className="relative aspect-[3/4] md:aspect-[1/1] w-full overflow-hidden bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        {/* Text */}
        <div className="mt-3 space-y-0.5">
          <h3 className="text-[12px] sm:text-[13px] font-medium uppercase tracking-wide text-gray-800">
            {product.name}
          </h3>

          <p className="text-[13px] font-semibold text-gray-900">
            ₦{product.price.toLocaleString()}
          </p>

          <p className="text-[10px] uppercase tracking-wider text-gray-400">
            {product.category?.name}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
