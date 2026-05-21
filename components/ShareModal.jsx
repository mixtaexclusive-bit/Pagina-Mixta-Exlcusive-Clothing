"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Sparkles, RefreshCw, Send, Check, Link, MessageCircle, Share2 } from "lucide-react";

export default function ShareModal({ product, onClose }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  const [isShareSupported, setIsShareSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.share) {
      setIsShareSupported(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let origin = window.location.origin;
      // Fallback localhost to production domain so social media crawlers don't get stuck
      if (origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("192.168.")) {
        origin = "https://tienda-mixta-exclusive.netlify.app";
      }
      setProductUrl(`${origin}/productos/${product.id}`);
    }
  }, [product.id]);

  const generateText = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let origin = window.location.origin;
      if (origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("192.168.")) {
        origin = "https://tienda-mixta-exclusive.netlify.app";
      }
      const response = await fetch("/api/generate-share-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          description: product.description,
          url: `${origin}/productos/${product.id}`,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener el texto promocional de la IA.");
      }

      const data = await response.json();
      setText(data.text || "");
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al contactar al redactor IA. Usando plantilla alternativa.");
    } finally {
      setLoading(false);
    }
  }, [product.id, product.name, product.price, product.description]);

  // Generate copy on initial render
  useEffect(() => {
    generateText();
  }, [generateText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar texto:", err);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price || 0);

  // Social Share URLs with dynamic content
  const handleShare = (platform) => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(productUrl);

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      default:
        return;
    }

    if (typeof window !== "undefined") {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tienda Mixta - ${product.name}`,
          text: text,
          url: productUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing natively:", err);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2rem] p-6 overflow-hidden shadow-2xl animate-fade-up z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
              Redactor IA Exclusivo
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product Details Header */}
        <div className="flex gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 mb-5">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover bg-black border border-white/5 flex-shrink-0"
          />
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
              {product.brand} • {product.category}
            </span>
            <h3 className="text-sm font-bold text-white leading-snug mt-0.5">{product.name}</h3>
            <span className="text-xs font-black text-amber-500 mt-1">{formatPrice(product.price)}</span>
          </div>
        </div>

        {/* AI Text Area */}
        <div className="mb-5 relative">
          <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-2">
            Texto publicitario generado:
          </label>
          
          <div className="relative rounded-2xl border border-white/10 overflow-hidden">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              className="w-full min-h-[140px] p-4 text-xs bg-black/40 text-white/90 placeholder-white/20 focus:outline-none resize-none leading-relaxed disabled:opacity-50"
              placeholder="Generando copia persuasiva..."
            />

            {/* Loading state inside text area */}
            {loading && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-center">
                <RefreshCw size={24} className="animate-spin text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white/50">
                  Pensando texto de impacto...
                </span>
              </div>
            )}
          </div>

          {/* Regenerate and Error messages */}
          <div className="flex items-center justify-between mt-2.5 px-1">
            {error ? (
              <span className="text-[10px] font-bold text-red-500/80">{error}</span>
            ) : (
              <span className="text-[10px] text-white/30 flex items-center gap-1">
                <Sparkles size={10} className="text-amber-500" /> Puedes editar este texto antes de compartirlo
              </span>
            )}
            
            <button
              onClick={generateText}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-500 hover:text-amber-400 disabled:opacity-50 transition cursor-pointer"
            >
              <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
              Regenerar
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-3">
            Compartir en redes sociales:
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Native Device Share Sheet */}
            {isShareSupported && (
              <button
                onClick={handleNativeShare}
                disabled={loading || !text}
                className="col-span-2 flex items-center justify-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 hover:bg-amber-500/20 transition text-center cursor-pointer mb-1 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Share2 size={16} className="animate-pulse" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">Compartir en mi dispositivo</span>
              </button>
            )}

            {/* WhatsApp */}
            <button
              onClick={() => handleShare("whatsapp")}
              disabled={loading || !text}
              className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.08] hover:border-white/10 transition text-left cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                <MessageCircle size={16} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-white">WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShare("facebook")}
              disabled={loading || !text}
              className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.08] hover:border-white/10 transition text-left cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-white">Facebook</span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={() => handleShare("twitter")}
              disabled={loading || !text}
              className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.08] hover:border-white/10 transition text-left cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                <span className="text-xs font-black">X</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-white">Twitter / X</span>
            </button>

            {/* Telegram */}
            <button
              onClick={() => handleShare("telegram")}
              disabled={loading || !text}
              className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.08] hover:border-white/10 transition text-left cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z" />
                </svg>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-white">Telegram</span>
            </button>
          </div>

          {/* Copy Copied bar */}
          <button
            onClick={handleCopy}
            disabled={loading || !text}
            className="w-full mt-4 flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-black uppercase tracking-widest text-[10px] transition disabled:opacity-30 cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} />
                Texto Copiado
              </>
            ) : (
              <>
                <Link size={14} />
                Copiar Texto Completo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
