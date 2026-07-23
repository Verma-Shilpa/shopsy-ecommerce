import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { ProductDetailsPage } from "@/features/products/components/ProductDetailsPage";

type ProductDetailsRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailsRoute({ params }: ProductDetailsRouteProps) {
  const { id } = await params;

  return (
    <AuthGuard>
      <ProductDetailsPage productId={Number(id)} />
    </AuthGuard>
  );
}
