import { NextResponse } from "next/server";
import {
  fetchProductsFromSource,
  getProductsRouteError,
} from "@/features/products/api/productsSourceApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 100);

  try {
    const data = await fetchProductsFromSource(limit);
    return NextResponse.json(data);
  } catch (error) {
    const routeError = getProductsRouteError(error);
    return NextResponse.json(
      { message: routeError.message },
      { status: routeError.status },
    );
  }
}
