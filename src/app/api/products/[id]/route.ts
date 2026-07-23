import { NextResponse } from "next/server";
import {
  fetchProductByIdFromSource,
  getProductsRouteError,
} from "@/features/products/api/productsSourceApi";

type ProductRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: ProductRouteContext) {
  const { id } = await params;

  try {
    const product = await fetchProductByIdFromSource(Number(id));
    return NextResponse.json(product);
  } catch (error) {
    const routeError = getProductsRouteError(error);
    return NextResponse.json(
      { message: routeError.message },
      { status: routeError.status },
    );
  }
}
