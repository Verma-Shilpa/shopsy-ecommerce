import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="product-grid" aria-label="Product results">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} preload={index < 4} />
      ))}
    </section>
  );
}
