import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <section className="not-found">
      <ShoppingBag size={34} aria-hidden="true" />
      <h1>Page not found</h1>
      <p>The page you are looking for is not available in shopsy.</p>
      <Link className="primary-button" href="/products">
        Back to products
      </Link>
    </section>
  );
}
