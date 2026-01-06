import Link from "next/link";
import Image from "next/image";

const ProductCard = ({ product }) => {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="mt-14">
        {/* Image */}
        <div className="relative aspect-[3/4] md:aspect-[1/1] w-full overflow-hidden bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        {/* Text */}
        <div className="mt-4 space-y-1">
          <h3 className="text-[13px] font-medium uppercase tracking-wide text-gray-800 group-hover:text-black transition-colors">
            {product.name}
          </h3>

          <p className="text-[13px] font-semibold tracking-wide text-black">
            ₦{product.price.toLocaleString()}
          </p>

          <p className="text-[11px] uppercase tracking-wider text-gray-500">
            {product.category?.name}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
