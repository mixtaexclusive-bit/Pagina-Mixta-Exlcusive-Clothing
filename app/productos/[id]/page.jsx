import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getProductById } from "@/lib/products";
import ProductDetailClient from "@/components/ProductDetailClient";

// 1. Dynamic Metadata Generation for Open Graph SEO
export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: "Prenda No Encontrada | Tienda Mixta",
      description: "La prenda exclusiva que estás buscando no existe o ya no está disponible.",
    };
  }

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(product.price);

  const titleText = `${product.name} - ${formattedPrice} | Tienda Mixta`;
  const descriptionText = product.description
    ? product.description.substring(0, 150) + "..."
    : `Adquiere ${product.name} de la marca ${product.brand} por ${formattedPrice} en Tienda Mixta. Compra directa por WhatsApp.`;

  return {
    title: titleText,
    description: descriptionText,
    openGraph: {
      title: `${product.name} - ${formattedPrice}`,
      description: descriptionText,
      url: `https://tienda-mixta-exclusive.netlify.app/productos/${product.id}`,
      siteName: "Tienda Mixta Exclusive Clothing",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "es_CO",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descriptionText,
      images: [product.image],
    },
  };
}

// 2. Server Component Page Render
export default async function ProductPage({ params }) {
  const product = await getProductById(params.id);

  // Fallback if product does not exist
  if (!product) {
    return (
      <div className="min-h-screen bg-asphalt text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wider mb-2">Prenda No Encontrada</h1>
        <p className="text-sm text-white/50 max-w-md mb-8">
          Lo sentimos, la prenda que buscas no existe en nuestro catálogo actual o ha sido removida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-asphalt font-black text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-black transition"
        >
          <ArrowLeft size={14} />
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
