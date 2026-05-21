import Storefront from "@/components/Storefront";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return <Storefront initialProducts={products} />;
}
