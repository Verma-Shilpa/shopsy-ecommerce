import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { ProductsPage } from "@/features/products/components/ProductsPage";

export default function ProductsRoute() {
  return (
    <AuthGuard>
      <ProductsPage />
    </AuthGuard>
  );
}
