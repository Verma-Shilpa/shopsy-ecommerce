"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, PackageCheck, ShieldCheck, Star, Truck } from "lucide-react";
import { StatusPanel } from "@/components/ui/StatusPanel";
import { fetchProductById, getApiErrorMessage } from "@/features/products/api/productsApi";
import { useAppSelector } from "@/hooks/redux";
import type { Product } from "@/types/product";
import { formatCurrency, getCategoryLabel, getDiscountedPrice } from "@/utils/productUtils";

type ProductDetailsPageProps = {
  productId: number;
};

type DetailStatus = "loading" | "succeeded" | "failed";

export function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
  const router = useRouter();
  const cachedProduct = useAppSelector((state) => state.products.items.find((item) => item.id === productId));
  const isValidProductId = Number.isFinite(productId) && productId > 0;
  const [product, setProduct] = useState<Product | null>(cachedProduct ?? null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<DetailStatus>(cachedProduct ? "succeeded" : "loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isValidProductId) {
      return;
    }

    const controller = new AbortController();

    fetchProductById(productId, controller.signal)
      .then((nextProduct) => {
        setProduct(nextProduct);
        setStatus("succeeded");
      })
      .catch((requestError) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        const message = getApiErrorMessage(requestError);
        setError(message);

        if (!cachedProduct) {
          setStatus("failed");
        }
      });

    return () => controller.abort();
  }, [cachedProduct, isValidProductId, productId, reloadKey]);

  if (!isValidProductId) {
    return <StatusPanel title="Product could not be loaded" message="This product id is not valid." tone="error" />;
  }

  if (status === "loading" && !product) {
    return <StatusPanel title="Loading product" message="Fetching the latest product details." />;
  }

  if (status === "failed" && !product) {
    return (
      <StatusPanel
        title="Product could not be loaded"
        message={error ?? "The product API did not return this item."}
        actionLabel="Retry"
        onAction={handleRetry}
        tone="error"
      />
    );
  }

  if (!product) {
    return null;
  }

  const discountedPrice = getDiscountedPrice(product);
  const images = product.images.length ? product.images : [product.thumbnail];
  const activeImage = selectedImage && images.includes(selectedImage) ? selectedImage : images[0];

  function handleRetry() {
    setError(null);
    setStatus(cachedProduct ? "succeeded" : "loading");
    setReloadKey((key) => key + 1);
  }

  return (
    <section className="details-page">
      <button className="secondary-button back-button" type="button" onClick={() => router.back()}>
        <ArrowLeft size={17} aria-hidden="true" />
        Back
      </button>

      {error ? (
        <div className="inline-alert" role="status">
          Showing cached product data. {error}
        </div>
      ) : null}

      <div className="details-layout">
        <div className="gallery">
          <div className="gallery-main">
            <Image src={activeImage || product.thumbnail} alt={product.title} fill loading="eager" sizes="(max-width: 900px) 100vw, 48vw" />
          </div>
          <div className="gallery-thumbs" aria-label="Product images">
            {images.map((image) => (
              <button
                className={image === activeImage ? "active" : ""}
                type="button"
                key={image}
                onClick={() => setSelectedImage(image)}
                aria-label={`Show image for ${product.title}`}
              >
                <Image src={image} alt="" fill sizes="72px" />
              </button>
            ))}
          </div>
        </div>

        <article className="detail-copy">
          <span className="eyebrow">{getCategoryLabel(product.category)}</span>
          <h1>{product.title}</h1>
          <p className="detail-description">{product.description}</p>

          <div className="rating-row">
            <span>
              <Star size={18} aria-hidden="true" />
              {product.rating.toFixed(1)} rating
            </span>
            <span>
              <PackageCheck size={18} aria-hidden="true" />
              {product.stock} in stock
            </span>
          </div>

          <div className="purchase-box">
            <div>
              <strong>{formatCurrency(discountedPrice)}</strong>
              <del>{formatCurrency(product.price)}</del>
            </div>
            <span>{product.discountPercentage.toFixed(1)}% off</span>
          </div>

          <dl className="detail-list">
            {product.brand ? (
              <>
                <dt>Brand</dt>
                <dd>{product.brand}</dd>
              </>
            ) : null}
            {product.sku ? (
              <>
                <dt>SKU</dt>
                <dd>{product.sku}</dd>
              </>
            ) : null}
            <dt>Minimum order</dt>
            <dd>{product.minimumOrderQuantity ?? 1}</dd>
            <dt>Availability</dt>
            <dd>{product.availabilityStatus ?? "Available"}</dd>
          </dl>

          <div className="promise-grid">
            <span>
              <Truck size={18} aria-hidden="true" />
              {product.shippingInformation ?? "Standard shipping"}
            </span>
            <span>
              <ShieldCheck size={18} aria-hidden="true" />
              {product.warrantyInformation ?? "Warranty details available"}
            </span>
          </div>
        </article>
      </div>

      {product.reviews?.length ? (
        <section className="reviews-section" aria-label="Customer reviews">
          <h2>Customer reviews</h2>
          <div className="review-grid">
            {product.reviews.slice(0, 3).map((review) => (
              <article className="review-card" key={`${review.reviewerEmail}-${review.date}`}>
                <span>
                  <Star size={15} aria-hidden="true" />
                  {review.rating.toFixed(1)}
                </span>
                <p>{review.comment}</p>
                <strong>{review.reviewerName}</strong>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
