"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, MessageCircle, User, Phone, MapPin, Mail, Sparkles } from "lucide-react";
import ShareButton from "./ShareButton";

export default function ProductDetailClient({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "Única");
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });
  const [currentUrl, setCurrentUrl] = useState("");

  // Load customer from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
      const saved = window.localStorage.getItem("mixta-customer-info");
      if (saved) {
        try {
          setCustomer(JSON.parse(saved));
        } catch (e) {
          console.error("Error loading customer info", e);
        }
      }
    }
  }, []);

  const updateCustomer = (field, value) => {
    const updated = { ...customer, [field]: value };
    setCustomer(updated);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mixta-customer-info", JSON.stringify(updated));
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const canBuy = customer.name.trim() && customer.phone.trim() && customer.address.trim() && selectedSize;

  // Build WhatsApp URL
  const whatsappMessage = `Hola, quiero comprar:\n\nProducto: ${product.name}\nTalla: ${selectedSize}\nCantidad: ${quantity}\nPrecio: ${formatPrice(product.price * quantity)}\n\nDatos del comprador:\nNombre: ${customer.name}\nTelefono: ${customer.phone}\nDireccion: ${customer.address}\nCorreo: ${customer.email || "No provisto"}\n\nEnlace: ${currentUrl}`;
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573226821174";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-asphalt text-white px-4 py-8 sm:px-6 lg:px-12 relative">
      {/* Botón flotante para compartir en la esquina inferior derecha */}
      <div className="fixed bottom-6 right-6 z-50">
        <ShareButton product={product} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Botón de retroceso */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-500 transition mb-8 uppercase tracking-widest font-black"
        >
          <ArrowLeft size={16} />
          Volver a la Tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Columna Izquierda: Galería de Imágenes */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl group aspect-[3/4] flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain transition duration-500 group-hover:scale-102"
              />
              <div className="absolute top-4 left-4 rounded-full bg-black/60 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-500 border border-amber-500/20 backdrop-blur-md flex items-center gap-1.5">
                <Sparkles size={10} />
                Exclusivo
              </div>
            </div>

            {/* Miniaturas de Galería */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 bg-zinc-950 flex-shrink-0 transition-all ${
                      selectedImage === imgUrl ? "border-amber-500 scale-95" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} gallery ${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Información y Compra */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Marca y Categoría */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">
                    {product.brand}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                    {product.category}
                  </span>
                </div>
                <ShareButton product={product} />
              </div>

              {/* Nombre de Producto */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Precio */}
              <div className="text-3xl font-black text-amber-500 mb-6 flex items-baseline gap-2">
                {formatPrice(product.price)}
                {quantity > 1 && (
                  <span className="text-sm font-bold text-white/40">
                    ({formatPrice(product.price * quantity)} total)
                  </span>
                )}
              </div>

              {/* Tallas */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white/50 mb-3">
                    Seleccionar Talla
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 px-4 text-xs font-black uppercase rounded-xl border transition-all ${
                          selectedSize === size
                            ? "border-amber-500 bg-amber-500/10 text-amber-500"
                            : "border-white/10 hover:border-white/30 text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div className="mb-8">
                <h3 className="text-xs font-black uppercase tracking-wider text-white/50 mb-3">
                  Cantidad
                </h3>
                <div className="inline-flex items-center rounded-xl border border-white/10 bg-zinc-950/40 p-1">
                  <button
                    onClick={handleDecrease}
                    className="p-2.5 text-white/60 hover:text-white transition"
                    aria-label="Disminuir"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-xs font-black">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="p-2.5 text-white/60 hover:text-white transition"
                    aria-label="Aumentar"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Descripción */}
              <div className="border-t border-white/5 pt-5 mb-8">
                <h3 className="text-xs font-black uppercase tracking-wider text-white/50 mb-2">
                  Descripción
                </h3>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                  {product.description || "Sin descripción detallada disponible."}
                </p>
              </div>
            </div>

            {/* Formulario de Compra Directa */}
            <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-md">
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-amber-500 mb-4 flex items-center gap-2">
                <Sparkles size={14} />
                Completa tus Datos para WhatsApp
              </h3>

              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => updateCustomer("name", e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-white/20 focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
                    Celular / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => updateCustomer("phone", e.target.value)}
                      placeholder="Ej: 312 870 4308"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-white/20 focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
                    Dirección de Envío
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                    <input
                      type="text"
                      value={customer.address}
                      onChange={(e) => updateCustomer("address", e.target.value)}
                      placeholder="Ciudad, barrio y dirección exacta"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-white/20 focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Correo (Opcional) */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
                    Correo Electrónico (Opcional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => updateCustomer("email", e.target.value)}
                      placeholder="Ej: correo@ejemplo.com"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-white/20 focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Botón WhatsApp de compra */}
              <div className="mt-6">
                <a
                  href={canBuy ? whatsappUrl : undefined}
                  target={canBuy ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`flex h-14 w-full items-center justify-center gap-3 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                    canBuy
                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black shadow-lg shadow-amber-500/10 hover:scale-[1.01] cursor-pointer"
                      : "bg-white/5 border border-white/5 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <MessageCircle size={18} />
                  Comprar por WhatsApp
                </a>
                {!canBuy && (
                  <p className="text-[10px] text-white/40 text-center mt-3 font-medium">
                    Llena los campos requeridos para habilitar la compra.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
