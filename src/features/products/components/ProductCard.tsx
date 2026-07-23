import Image from "next/image";
import Link from "next/link";
import { PackageCheck, Star, Tag } from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency, getCategoryLabel, getDiscountedPrice } from "@/utils/productUtils";

type ProductCardProps = {
  product: Product;
  eager?: boolean;
};

export function ProductCard({ product, eager = false }: ProductCardProps) {
  const image = product.thumbnail || product.images[0];
  const discountedPrice = getDiscountedPrice(product);

  return (
    <article className="product-card">
      <Link className="product-card__media" href={`/products/${product.id}`} aria-label={`View details for ${product.title}`}>
        <Image
          src={image}
          alt={product.title}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 25vw"
        />
        <span className="discount-badge">
          <Tag size={14} aria-hidden="true" />
          {Math.round(product.discountPercentage)}% off
        </span>
      </Link>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{getCategoryLabel(product.category)}</span>
          <span>
            <Star size={14} aria-hidden="true" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <Link className="product-title" href={`/products/${product.id}`}>
          {product.title}
        </Link>

        <p>{product.description}</p>

        <div className="product-card__footer">
          <div>
            <strong>{formatCurrency(discountedPrice)}</strong>
            <del>{formatCurrency(product.price)}</del>
          </div>
          <span className={`stock-pill ${product.stock < 20 ? "stock-pill--low" : ""}`}>
            <PackageCheck size={14} aria-hidden="true" />
            {product.stock} left
          </span>
        </div>
      </div>
    </article>
  );
}
