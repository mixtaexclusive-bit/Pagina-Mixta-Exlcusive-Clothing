"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Moon,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  User,
  X
} from "lucide-react";
import { getDisplayImage, isDirectImageUrl } from "@/lib/images";
import ReviewsSection from "./ReviewsSection";
import ShareButton from "./ShareButton";

const bannerImages = [
  "/brand/banner-2.png",
  "/brand/banner-5.png",
  "/brand/banner-6.png",
  "/brand/banner-4.png"
];

const getCategoryBannerImage = (categoryName) => {
  const cleanName = String(categoryName || "").trim().toLowerCase();
  if (cleanName.includes("camiseta") || cleanName.includes("t-shirt")) {
    return "/brand/banner-1.png";
  }
  if (cleanName.includes("hoodie") || cleanName.includes("buzo") || cleanName.includes("abrigo") || cleanName.includes("chaqueta")) {
    return "/brand/banner-3.png";
  }
  if (cleanName.includes("set") || cleanName.includes("conjunto")) {
    return "/brand/banner-5.png";
  }
  if (cleanName.includes("accesorio") || cleanName.includes("gorra") || cleanName.includes("gafa") || cleanName.includes("medias")) {
    return "/brand/banner-6.png";
  }
  const banners = [
    "/brand/banner-1.png",
    "/brand/banner-2.png",
    "/brand/banner-3.png",
    "/brand/banner-4.png",
    "/brand/banner-5.png",
    "/brand/banner-6.png"
  ];
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return banners[Math.abs(hash) % banners.length];
};

function CategoryBanner({ categoryName, count }) {
  const bannerImg = useMemo(() => getCategoryBannerImage(categoryName), [categoryName]);

  const categoryDescription = useMemo(() => {
    const cleanName = categoryName.toLowerCase();
    if (cleanName.includes("camiseta") || cleanName.includes("t-shirt")) {
      return "Estampados de alta definición, cortes oversized y el mejor fit urbano.";
    }
    if (cleanName.includes("hoodie") || cleanName.includes("buzo") || cleanName.includes("abrigo") || cleanName.includes("chaqueta")) {
      return "Abrigo premium, algodón de alto gramaje y estilo minimalista.";
    }
    if (cleanName.includes("set") || cleanName.includes("conjunto")) {
      return "Sets combinados con presencia visual y confort de alta costura.";
    }
    if (cleanName.includes("accesorio") || cleanName.includes("gorra")) {
      return "Completa tu estilo streetwear con los accesorios más exclusivos.";
    }
    return "Diseños exclusivos y materiales premium seleccionados para ti.";
  }, [categoryName]);

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-glow mb-6 md:mb-8 transition-all duration-300 hover:scale-[1.005] group animate-fade-up">
      <div className="absolute inset-0 -z-10">
        <Image
          src={bannerImg}
          alt={`Colección ${categoryName}`}
          fill
          sizes="100vw"
          className="object-cover object-center transition-transform duration-700 scale-100 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent md:from-black/95 md:via-black/75 md:to-black/30" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 sm:p-8 md:p-10 min-h-[12rem] md:min-h-[14rem] justify-end md:justify-between">
        <div className="max-w-xl text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-volt text-[9px] font-black uppercase tracking-[0.18em] text-asphalt px-3 py-1 mb-3">
            Colección Oficial
          </span>
          <h3 className="text-3xl md:text-5xl font-display font-black uppercase tracking-normal text-white leading-none">
            {categoryName}
          </h3>
          <p className="mt-3 text-xs md:text-sm text-white/70 font-medium leading-relaxed">
            {categoryDescription}
          </p>
        </div>
        <div className="flex items-center shrink-0 w-max">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-xs font-bold text-volt backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-volt animate-soft-pulse" />
            {count} {count === 1 ? "Producto Disponible" : "Productos Disponibles"}
          </span>
        </div>
      </div>
    </div>
  );
}

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(price || 0);

const onlyUnique = (items) => Array.from(new Set(items.filter(Boolean)));

const buildWhatsAppUrl = ({ product, size, quantity, customer }) => {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573226821174";
  const message = `Hola, quiero comprar:\n\nProducto: ${product.name}\nTalla: ${size}\nCantidad: ${quantity}\nPrecio: ${formatPrice(product.price)}\n\nDatos del comprador:\nNombre: ${customer.name}\nTelefono: ${customer.phone}\nDireccion: ${customer.address}\nCorreo: ${customer.email}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

const buildWhatsAppCartUrl = ({ cart, customer }) => {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573226821174";
  const lineItems = cart
    .map(
      (item, index) =>
        `${index + 1}. ${item.product.name} (${item.selectedSize}) x${item.quantity} - ${formatPrice(
          item.product.price
        )} c/u = ${formatPrice(item.product.price * item.quantity)}`
    )
    .join("\n");
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const message = `Hola, quiero comprar:\n\n${lineItems}\n\nTotal: ${formatPrice(totalPrice)}\n\nDatos del comprador:\nNombre: ${customer.name}\nTelefono: ${customer.phone}\nDireccion: ${customer.address}\nCorreo: ${customer.email}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

function NewProductsBanner({ products }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const currentSignature = products.map((product) => product.id).join("|");
    const previousSignature = window.localStorage.getItem("mixta-products-signature");

    if (currentSignature && previousSignature && currentSignature !== previousSignature) {
      setVisible(true);
    }

    if (!previousSignature && products.length) {
      setVisible(true);
    }

    window.localStorage.setItem("mixta-products-signature", currentSignature);
  }, [products]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 top-3 z-40 mx-auto max-w-4xl rounded-2xl border border-volt/40 bg-black/88 p-3 shadow-glow backdrop-blur-xl sm:top-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-volt text-asphalt">
          <Sparkles size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-white">
            Nuevos productos disponibles
          </p>
          <p className="truncate text-xs text-white/58">
            El catálogo se actualizó con las últimas prendas disponibles. Compra ahora y recibe rápido.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition hover:bg-white hover:text-asphalt"
          aria-label="Cerrar aviso de nuevos productos"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function Hero({ totalProducts, cartCount, onCartOpen }) {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % bannerImages.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate min-h-[88svh] overflow-hidden px-4 pb-10 pt-4 sm:px-6 lg:px-10">
      {bannerImages.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt="Campana visual MIXTA EXCLUSIVE CLOTHING"
          fill
          priority={index === 0}
          className={`-z-30 object-cover object-center transition-opacity duration-1000 ${
            index === activeBanner ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
        />
      ))}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.72)_42%,rgba(0,0,0,0.28)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-asphalt to-transparent" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a href="#catalogo" className="relative block h-16 w-36 min-w-[9rem] sm:h-20 sm:w-52 sm:min-w-[12rem]">
          <Image src="/brand/logo.png" alt="MIXTA EXCLUSIVE CLOTHING" fill priority className="object-contain" />
        </a>
        <div className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.18em] text-white/72 md:flex">
          <a className="transition hover:text-white" href="#catalogo">
            Catalogo
          </a>
          <a className="transition hover:text-white" href="#nuevos">
            Nuevos
          </a>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCartOpen}
            className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-asphalt md:inline-flex"
          >
            Carrito {cartCount > 0 ? `(${cartCount})` : ""}
            <ShoppingBag size={16} />
          </button>
          <a
            href="#catalogo"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-volt px-4 text-xs font-black uppercase tracking-[0.12em] text-asphalt transition hover:bg-white sm:px-5 sm:text-sm"
          >
            Comprar
            <ArrowUpRight size={16} />
          </a>
        </div>
      </nav>

      <div className="mx-auto flex min-h-[68svh] max-w-7xl items-end pt-16 sm:pt-20">
        <div className="w-full max-w-4xl animate-fade-up pb-4 sm:pb-8">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/38 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-volt backdrop-blur sm:text-xs">
            <Sparkles size={14} />
            Streetwear premium
          </p>
          <h1 className="max-w-5xl text-balance text-[clamp(3rem,10vw,9rem)] font-display font-black uppercase leading-[0.82] tracking-normal">
            MIXTA EXCLUSIVE CLOTHING
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:mt-7 sm:text-xl sm:leading-8">
            Tu próxima prenda favorita está aquí. Streetwear fresco, tallas oversized y pedidos directo por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
            <a
              href="#catalogo"
              className="inline-flex h-13 items-center gap-3 rounded-full bg-volt px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-asphalt transition hover:scale-[1.02] hover:bg-white sm:h-14 sm:px-7 sm:text-sm"
            >
              Ver catalogo
              <ShoppingBag size={18} />
            </a>
            <span className="inline-flex h-13 items-center rounded-full border border-white/15 bg-black/28 px-5 py-4 text-xs font-bold text-white/80 backdrop-blur sm:h-14 sm:text-sm">
              {totalProducts} productos activos
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 flex justify-center">
        <a
          href="#catalogo"
          className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white transition hover:border-volt hover:bg-white hover:text-asphalt"
          aria-label="Ir al catálogo"
        >
          <ArrowDown size={16} className="transition group-hover:-translate-y-1" />
        </a>
      </div>

      <div className="absolute bottom-5 right-5 hidden gap-2 sm:flex">
        {bannerImages.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveBanner(index)}
            className={`h-2 rounded-full transition-all ${
              activeBanner === index ? "w-10 bg-volt" : "w-2 bg-white/35"
            }`}
            aria-label={`Ver banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, onSelect, onAddToCart, index }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const rawImages = useMemo(() => {
    const gallery = Array.isArray(product.gallery) ? product.gallery.filter(Boolean) : [];
    return onlyUnique([product.image, ...gallery]);
  }, [product.image, product.gallery]);

  const images = rawImages.map(getDisplayImage);
  const defaultSize = product.sizes?.[0] || "Talla única";

  const handleAddNow = (event) => {
    event.stopPropagation();
    onAddToCart(product, defaultSize, 1);
  };

  const handleScroll = (event) => {
    const container = event.currentTarget;
    const width = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImageIndex && newIndex >= 0 && newIndex < images.length) {
      setActiveImageIndex(newIndex);
    }
  };

  return (
    <article
      className="product-card group animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
    >
      <div className="card-image-wrapper relative">
        <div
          className="flex h-full w-full overflow-x-auto scroll-snap-type-x scrollbar-none"
          style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
          onScroll={handleScroll}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative h-full w-full shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <div
                onClick={() => onSelect(product)}
                className="relative block h-full w-full cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelect(product);
                  }
                }}
              >
                <Image
                  src={img}
                  alt={`${product.name} - Imagen ${idx + 1}`}
                  fill
                  loading="lazy"
                  className="card-img"
                  style={{ objectFit: "contain" }}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-10 bg-black/50 px-2 py-1 rounded-full backdrop-blur-md">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImageIndex === idx ? "w-4 bg-volt" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="card-info">
        <div className="flex items-center justify-between gap-3">
          <span className="card-category">
            {product.brand || "MIXTA"} · {product.category}
          </span>
          <span className="card-price">{formatPrice(product.price)}</span>
        </div>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-sizes">
          {product.sizes && product.sizes.length > 0
            ? product.sizes.join(" · ")
            : "Talla única"}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="flex-1 h-10 rounded-full bg-volt text-asphalt text-xs font-black uppercase tracking-[0.12em] transition hover:bg-white flex items-center justify-center gap-1.5"
          >
            Comprar
          </button>
          <button
            type="button"
            onClick={handleAddNow}
            title="Agregar al carrito"
            className="group h-10 w-10 shrink-0 rounded-full bg-white text-asphalt transition hover:scale-105 hover:bg-volt flex items-center justify-center relative"
          >
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shopping-basket"
              >
                <path d="m5 10 3-6" />
                <path d="m19 10-3-6" />
                <path d="M2 10h20" />
                <path d="m3.5 10 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
              </svg>
              <span className="absolute -right-1.5 -bottom-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-volt text-[8px] font-black text-asphalt border border-white group-hover:border-volt transition-colors duration-300">
                +
              </span>
            </div>
          </button>
        </div>
      </div>
    </article>
  );
}

function Field({ icon: Icon, label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/48">
        {label}
      </span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={17} />
        <input
          {...props}
          className="h-12 w-full rounded-2xl border border-white/10 bg-black/32 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-white/28 focus:border-volt"
        />
      </span>
    </label>
  );
}

function ProductModal({ product, customer, updateCustomer, onAddToCart, onClose }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "Única");
  const [quantity, setQuantity] = useState(1);
  const carouselRef = useRef(null);

  const rawImages = useMemo(() => {
    const source = product.gallery?.length ? product.gallery : [product.image];
    return onlyUnique([product.image, ...source]);
  }, [product]);
  const images = rawImages.map(getDisplayImage);
  const hasValidImage = rawImages.some(isDirectImageUrl);
  const canBuy =
    selectedSize && customer.name.trim() && customer.phone.trim() && customer.address.trim() && customer.email.trim();
  const whatsappUrl = buildWhatsAppUrl({ product, size: selectedSize, quantity, customer });

  useEffect(() => {
    setActiveImage(0);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Única");
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [product]);

  const handleScroll = (event) => {
    const container = event.currentTarget;
    const width = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImage && newIndex >= 0 && newIndex < images.length) {
      setActiveImage(newIndex);
    }
  };

  const scrollToImage = (index) => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: index * width,
        behavior: "smooth"
      });
    }
    setActiveImage(index);
  };

  const handleBuy = (event) => {
    if (!canBuy) {
      event.preventDefault();
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("mixta-customer", JSON.stringify(customer));
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    onAddToCart(product, selectedSize, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/82 p-3 backdrop-blur-xl sm:p-4">
      <div className="mx-auto my-2 grid max-w-7xl overflow-hidden rounded-[1.5rem] border border-white/12 bg-graphite shadow-premium lg:my-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)] lg:rounded-[2rem]">
        <div className="bg-black p-3 sm:p-4">
          <div className="relative min-h-[21rem] overflow-hidden rounded-[1.1rem] bg-black sm:min-h-[32rem] lg:min-h-[42rem]">
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex h-full w-full overflow-x-auto scroll-snap-type-x scrollbar-none absolute inset-0"
              style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
            >
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-full w-full shrink-0"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Vista ${idx + 1}`}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-x-3 top-3 flex items-center justify-between z-10">
              <span className="rounded-full bg-black/68 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] backdrop-blur">
                {activeImage + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar producto"
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-asphalt transition hover:bg-volt"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="premium-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                onClick={() => scrollToImage(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition sm:h-24 sm:w-24 cursor-pointer ${
                  activeImage === index ? "border-volt" : "border-white/12"
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    scrollToImage(index);
                  }
                }}
              >
                <Image src={image} alt="" fill style={{ objectFit: "cover" }} sizes="96px" />
              </div>
            ))}
          </div>
        </div>

        <div id="comprar" className="p-5 sm:p-7 lg:max-h-[calc(100svh-2rem)] lg:overflow-y-auto lg:p-9">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-volt">{product.category}</p>
            <ShareButton product={product} />
          </div>
          <h2 className="mt-3 text-3xl font-black uppercase leading-none sm:text-5xl">{product.name}</h2>
          <p className="mt-5 text-3xl font-black">{formatPrice(product.price)}</p>
          <p className="mt-5 whitespace-pre-line leading-7 text-white/68">{product.description}</p>

          {!hasValidImage && (
            <div className="mt-5 rounded-2xl border border-ember/45 bg-ember/12 p-4 text-sm leading-6 text-white/78">
              La imagen debe ser un enlace directo válido para que el producto se muestre correctamente.
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-white/55">Talla</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`grid h-12 min-w-12 place-items-center rounded-full border px-4 text-sm font-black transition ${
                      selectedSize === size
                        ? "border-volt bg-volt text-asphalt"
                        : "border-white/14 text-white/78 hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-white/55">
              Cantidad
            </p>
            <div className="inline-flex h-12 items-center overflow-hidden rounded-full border border-white/14">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="h-full w-12 text-xl font-black transition hover:bg-white/10"
                aria-label="Restar cantidad"
              >
                -
              </button>
              <span className="grid h-full w-14 place-items-center border-x border-white/14 font-black">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="h-full w-12 text-xl font-black transition hover:bg-white/10"
                aria-label="Sumar cantidad"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-4 sm:p-5">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-white">Datos de compra</p>
            <p className="mt-2 text-xs leading-5 text-white/48">
              El navegador no puede detectar tu telefono automaticamente por privacidad. Si compras
              de nuevo, la tienda recordara los datos en este dispositivo.
            </p>
            <div className="mt-5 grid gap-4">
              <Field
                icon={User}
                label="Nombre"
                value={customer.name}
                onChange={(event) => updateCustomer("name", event.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                required
              />
              <Field
                icon={Phone}
                label="Telefono"
                value={customer.phone}
                onChange={(event) => updateCustomer("phone", event.target.value)}
                placeholder="Ej: 312 870 4308"
                autoComplete="tel"
                inputMode="tel"
                required
              />
              <Field
                icon={MapPin}
                label="Direccion"
                value={customer.address}
                onChange={(event) => updateCustomer("address", event.target.value)}
                placeholder="Ciudad, barrio y direccion"
                autoComplete="street-address"
                required
              />
              <Field
                icon={Mail}
                label="Correo"
                value={customer.email}
                onChange={(event) => updateCustomer("email", event.target.value)}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                type="email"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <a
              href={canBuy ? whatsappUrl : "#comprar"}
              target={canBuy ? "_blank" : undefined}
              rel="noreferrer"
              onClick={handleBuy}
              className={`inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-full px-6 text-sm font-black uppercase tracking-[0.12em] transition ${
                canBuy
                  ? "bg-volt text-asphalt hover:scale-[1.01] hover:bg-white"
                  : "cursor-not-allowed bg-white/10 text-white/38"
              }`}
            >
              Comprar por WhatsApp
              <ArrowUpRight size={18} />
            </a>
            <button
              type="button"
              onClick={handleAddToCart}
              title="Agregar al carrito"
              className="group inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-asphalt transition hover:scale-105 hover:bg-volt"
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shopping-basket"
                >
                  <path d="m5 10 3-6" />
                  <path d="m19 10-3-6" />
                  <path d="M2 10h20" />
                  <path d="m3.5 10 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
                </svg>
                <span className="absolute -right-2 -bottom-2 flex h-5 w-5 items-center justify-center rounded-full bg-volt text-[11px] font-black text-asphalt border-2 border-white group-hover:border-volt transition-colors duration-300">
                  +
                </span>
              </div>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-full border border-white/10 bg-black/30 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-volt hover:text-volt"
          >
            Volver al catalogo
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({
  cart,
  onClose,
  onRemoveItem,
  onQuantityChange,
  customer,
  updateCustomer,
  onCheckout,
  canCheckout,
  cartTotal
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Cerrar carrito"
      />
      <aside className="relative ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto bg-[#070707] p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-volt">Tu carrito</p>
            <h2 className="mt-2 text-3xl font-black uppercase">Resumen de compra</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-volt"
            aria-label="Cerrar carrito"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {cart.length ? (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="rounded-[1.7rem] border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase text-white/70">{item.product.category}</p>
                    <h3 className="mt-2 text-lg font-black">{item.product.name}</h3>
                    <p className="mt-2 text-sm text-white/60">Talla: {item.selectedSize}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(index)}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10"
                    aria-label="Eliminar producto"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 text-sm text-white/70">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 p-1">
                    <button
                      type="button"
                      onClick={() => onQuantityChange(index, item.quantity - 1)}
                      className="h-9 w-9 rounded-full bg-white/5 transition hover:bg-white/10"
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-black">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onQuantityChange(index, item.quantity + 1)}
                      className="h-9 w-9 rounded-full bg-white/5 transition hover:bg-white/10"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-black">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.7rem] border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
              Tu carrito está vacío. Agrega productos antes de finalizar.
            </div>
          )}
        </div>

        <div className="mt-6 rounded-[1.7rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between text-sm font-black uppercase tracking-[0.12em] text-white/70">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-volt">Datos para el pedido</p>
          <div className="mt-4 grid gap-4">
            <Field
              icon={User}
              label="Nombre"
              value={customer.name}
              onChange={(event) => updateCustomer("name", event.target.value)}
              placeholder="Tu nombre"
              autoComplete="name"
              required
            />
            <Field
              icon={Phone}
              label="Telefono"
              value={customer.phone}
              onChange={(event) => updateCustomer("phone", event.target.value)}
              placeholder="Ej: 312 870 4308"
              autoComplete="tel"
              inputMode="tel"
              required
            />
            <Field
              icon={MapPin}
              label="Direccion"
              value={customer.address}
              onChange={(event) => updateCustomer("address", event.target.value)}
              placeholder="Ciudad, barrio y direccion"
              autoComplete="street-address"
              required
            />
            <Field
              icon={Mail}
              label="Correo"
              value={customer.email}
              onChange={(event) => updateCustomer("email", event.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              type="email"
              required
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onCheckout}
          disabled={!canCheckout}
          className={`mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full px-6 text-sm font-black uppercase tracking-[0.12em] transition ${
            canCheckout
              ? "bg-volt text-asphalt hover:scale-[1.01] hover:bg-white"
              : "cursor-not-allowed bg-white/10 text-white/38"
          }`}
        >
          Finalizar compra completa
          <ArrowUpRight size={18} />
        </button>
      </aside>
    </div>
  );
}

export default function Storefront({ initialProducts }) {
  const [products] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [size, setSize] = useState("Todas");
  const [brand, setBrand] = useState("Todas");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const defaultCustomer = {
    name: "",
    phone: "",
    address: "",
    email: ""
  };

  const [mounted, setMounted] = useState(false);
  const [customer, setCustomer] = useState(defaultCustomer);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setMounted(true);

    try {
      const storedCustomer = window.localStorage.getItem("mixta-customer");
      const storedCart = window.localStorage.getItem("mixta-cart");

      if (storedCustomer) {
        setCustomer(JSON.parse(storedCustomer));
      }

      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch {
      // Ignore invalid storage data
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem("mixta-customer", JSON.stringify(customer));
  }, [customer, mounted]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem("mixta-cart", JSON.stringify(cart));
  }, [cart, mounted]);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );

  const brands = useMemo(
    () => ["Todas", ...Array.from(new Set(products.map((product) => product.brand || "MIXTA")))],
    [products]
  );

  const sizes = useMemo(
    () => ["Todas", ...Array.from(new Set(products.flatMap((product) => product.sizes)))],
    [products]
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const canCheckout =
    cart.length > 0 &&
    customer.name.trim() &&
    customer.phone.trim() &&
    customer.address.trim() &&
    customer.email.trim();

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const handleAddToCart = (product, selectedSize, quantity) => {
    const normalizedSize = selectedSize || product.sizes?.[0] || "Talla única";

    setCart((current) => {
      const existingIndex = current.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === normalizedSize
      );
      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }

      return [...current, { product, selectedSize: normalizedSize, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (index) => {
    setCart((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleChangeCartQuantity = (index, newQuantity) => {
    setCart((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const handleCheckout = () => {
    if (!canCheckout) return;
    const url = buildWhatsAppCartUrl({ cart, customer });
    window.open(url, "_blank");
    setIsCartOpen(false);
  };

  const filteredProducts = useMemo(() => {
    const cleanText = (text) =>
      String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const search = cleanText(query);
    const searchWords = search.split(/\s+/).filter(Boolean);

    return products.filter((product) => {
      const productName = cleanText(product.name);
      const productCategory = cleanText(product.category);
      const productDescription = cleanText(product.description);
      const productBrand = cleanText(product.brand);

      const matchesSearch =
        searchWords.length === 0 ||
        searchWords.every((word) =>
          productName.includes(word) ||
          productCategory.includes(word) ||
          productDescription.includes(word) ||
          productBrand.includes(word)
        );
      const matchesCategory = category === "Todos" || product.category === category;
      const matchesSize = size === "Todas" || product.sizes.includes(size);
      const matchesBrand = brand === "Todas" || product.brand === brand;

      return matchesSearch && matchesCategory && matchesSize && matchesBrand;
    });
  }, [products, query, category, size, brand]);

  const groupedProducts = useMemo(() => {
    const groups = {};
    filteredProducts.forEach((product) => {
      const cat = product.category || "Colección";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(product);
    });
    return groups;
  }, [filteredProducts]);

  return (
    <main className={darkMode ? "dark bg-asphalt text-white" : "bg-zinc-100 text-asphalt"}>
      <NewProductsBanner products={products} />
      <Hero totalProducts={products.length} cartCount={cartCount} onCartOpen={() => setIsCartOpen(true)} />

      {isCartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemoveItem={handleRemoveCartItem}
          onQuantityChange={handleChangeCartQuantity}
          customer={customer}
          updateCustomer={updateCustomer}
          onCheckout={handleCheckout}
          canCheckout={canCheckout}
          cartTotal={cartTotal}
        />
      )}

      <div className="fixed bottom-5 right-5 z-40 sm:hidden">
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-volt px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-asphalt shadow-glow transition hover:bg-white"
        >
          Carrito {cartCount > 0 ? `(${cartCount})` : "vacío"}
        </button>
      </div>

      <section id="catalogo" className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div id="nuevos" className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-volt">
                Nuevos productos
              </p>
              <h2 className="text-4xl font-display font-black uppercase leading-none sm:text-6xl">
                Catalogo MIXTA
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className="inline-flex h-12 w-max items-center gap-3 rounded-full border border-white/12 bg-white/8 px-5 text-sm font-black transition hover:bg-white hover:text-asphalt"
            >
              {darkMode ? <Moon size={17} /> : <Sun size={17} />}
              Modo {darkMode ? "oscuro" : "claro"}
            </button>
          </div>

          <div className="glass sticky top-2 md:top-4 z-30 mb-6 md:mb-8 rounded-[1.3rem] p-2 sm:p-3 sm:rounded-[1.5rem]">
            <div className="grid gap-2 grid-cols-1 md:grid-cols-[minmax(14rem,1fr)_minmax(10rem,auto)_minmax(10rem,auto)_minmax(8rem,auto)]">
              <div className="w-full">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.querySelector("input");
                    if (input) input.blur();
                  }}
                  className="relative block w-full"
                >
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar producto..."
                    className="h-11 w-full rounded-full border border-white/10 bg-black/28 pl-12 pr-10 text-xs sm:text-sm font-semibold text-white outline-none transition placeholder:text-white/36 focus:border-volt"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 hover:text-white transition"
                      aria-label="Borrar búsqueda"
                    >
                      <X size={16} />
                    </button>
                  )}
                </form>
              </div>

              <div className="grid grid-cols-3 gap-1.5 md:contents">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-11 rounded-full border border-white/10 bg-black/28 px-3 text-[11px] md:text-sm font-black text-white outline-none focus:border-volt w-full truncate cursor-pointer"
                  aria-label="Filtrar por categoría"
                >
                  {categories.map((item) => (
                    <option key={item} value={item} className="bg-graphite text-white">
                      {item === "Todos" ? "Categorías" : item}
                    </option>
                  ))}
                </select>

                <select
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                  className="h-11 rounded-full border border-white/10 bg-black/28 px-3 text-[11px] md:text-sm font-black text-white outline-none focus:border-volt w-full truncate cursor-pointer"
                  aria-label="Filtrar por marca"
                >
                  {brands.map((item) => (
                    <option key={item} value={item} className="bg-graphite text-white">
                      {item === "Todas" ? "Marcas" : item}
                    </option>
                  ))}
                </select>

                <select
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                  className="h-11 rounded-full border border-white/10 bg-black/28 px-3 text-[11px] md:text-sm font-black text-white outline-none focus:border-volt w-full truncate cursor-pointer"
                  aria-label="Filtrar por talla"
                >
                  {sizes.map((item) => (
                    <option key={item} value={item} className="bg-graphite text-white">
                      {item === "Todas" ? "Tallas" : item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {Object.entries(groupedProducts).map(([catName, catProducts]) => (
            <div key={catName} className="mb-16 last:mb-0">
              <CategoryBanner categoryName={catName} count={catProducts.length} />
              <div className="grid gap-3 grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {catProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onSelect={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          ))}

          {!filteredProducts.length && (
            <div className="my-20 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-10 text-center">
              <p className="text-2xl font-black">No hay productos con esos filtros.</p>
              <p className="mt-3 text-white/58">Prueba otra categoria, talla o busqueda.</p>
            </div>
          )}
        </div>
      </section>

      <ReviewsSection darkMode={darkMode} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          customer={customer}
          updateCustomer={updateCustomer}
          onAddToCart={handleAddToCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
