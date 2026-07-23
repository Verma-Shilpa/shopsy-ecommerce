export function ProductSkeleton() {
  return (
    <section className="product-grid" aria-label="Loading products">
      {Array.from({ length: 8 }, (_item, index) => (
        <article className="product-card product-card--skeleton" key={index}>
          <div className="skeleton skeleton-media" />
          <div className="product-card__body">
            <div className="skeleton skeleton-line skeleton-line--short" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line--short" />
          </div>
        </article>
      ))}
    </section>
  );
}
