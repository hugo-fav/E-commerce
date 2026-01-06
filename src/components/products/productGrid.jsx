import ProductCard from "./priductCard";

const ProductGrid = ({ products }) => {
  return (
    <div className="bg-sky-100 px-9 py-15 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
