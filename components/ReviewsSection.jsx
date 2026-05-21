"use client";

import React, { useState, useMemo } from "react";
import { Star } from "lucide-react";

const initialReviews = [
  {
    id: 1,
    name: "Mateo Rodríguez",
    rating: 5,
    text: "La tela de los hoodies es de otro nivel, súper gruesa y abrigada. El fit oversize es justo lo que buscaba para mi estilo. ¡Recomendadísimo!",
    date: "15 de Mayo, 2026",
    initials: "MR",
    color: "from-zinc-700 to-zinc-900"
  },
  {
    id: 2,
    name: "Valeria Gómez",
    rating: 5,
    text: "Pedí una camiseta de Amiri y me llegó al día siguiente a Medellín. La calidad de la tela es excelente y el estampado se siente muy duradero. Excelente servicio.",
    date: "18 de Mayo, 2026",
    initials: "VG",
    color: "from-zinc-800 to-black"
  },
  {
    id: 3,
    name: "Santiago Muñoz",
    rating: 4,
    text: "Los conjuntos deportivos son súper cómodos. Tenía dudas con la talla pero la atención al cliente por WhatsApp me guio súper bien. Me quedó perfecto.",
    date: "10 de Mayo, 2026",
    initials: "SM",
    color: "from-gray-700 to-zinc-800"
  },
  {
    id: 4,
    name: "Camila Bermúdez",
    rating: 5,
    text: "Excelente atención al cliente por WhatsApp y las telas se sienten muy prémium. El envío a Cali tardó solo dos días. Sin duda compraré de nuevo.",
    date: "19 de Mayo, 2026",
    initials: "CB",
    color: "from-zinc-800 to-neutral-900"
  },
  {
    id: 5,
    name: "Daniel Fuentes",
    rating: 5,
    text: "La calidad de las costuras y los acabados es increíble. Se nota que es ropa exclusiva. Muy contento con mi compra.",
    date: "20 de Mayo, 2026",
    initials: "DF",
    color: "from-neutral-700 to-neutral-900"
  }
];

const avatarColors = [
  "from-zinc-700 to-zinc-900",
  "from-zinc-800 to-black",
  "from-gray-700 to-zinc-800",
  "from-zinc-800 to-neutral-900",
  "from-neutral-700 to-neutral-900",
  "from-slate-700 to-slate-900",
  "from-stone-700 to-stone-900"
];

export default function ReviewsSection({ darkMode }) {
  const [reviews, setReviews] = useState(initialReviews);
  
  // Form State
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const getInitials = (fullName) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return "MX";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const initials = getInitials(name);
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const options = { day: "numeric", month: "long", year: "numeric" };
    const dateFormatted = new Date().toLocaleDateString("es-ES", options);

    const newReview = {
      id: Date.now(),
      name: name.trim(),
      rating,
      text: text.trim(),
      date: dateFormatted,
      initials,
      color: randomColor
    };

    setReviews([newReview, ...reviews]);
    
    // Reset Form
    setName("");
    setText("");
    setRating(5);
    setSuccessMessage("¡Gracias por tu opinión! Tu reseña ha sido publicada con éxito.");
    
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  // Calculations for Summary
  const stats = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = total > 0 ? (sum / total).toFixed(1) : "0.0";
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
    });

    return { total, average, distribution };
  }, [reviews]);

  return (
    <section className={`border-t ${darkMode ? "border-white/10 bg-black/10" : "border-zinc-200 bg-zinc-50"} px-4 py-16 sm:px-6 lg:px-10`}>
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="mb-12 text-center sm:text-left">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-volt">
            Reseñas reales
          </p>
          <h2 className="text-4xl font-display font-black uppercase leading-none sm:text-5xl">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          {/* Summary and Form */}
          <div className="flex flex-col gap-8">
            {/* Rating Summary Card */}
            <div className={`rounded-3xl p-6 border ${darkMode ? "bg-white/[0.03] border-white/8" : "bg-white border-zinc-200 shadow-sm"}`}>
              <h3 className="text-lg font-black uppercase tracking-[0.08em] mb-4">Resumen de opiniones</h3>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-black">{stats.average}</span>
                <div className="flex flex-col">
                  <div className="flex gap-0.5 text-volt">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= Math.round(Number(stats.average)) ? "currentColor" : "none"}
                        className={star <= Math.round(Number(stats.average)) ? "text-volt" : "text-zinc-400"}
                      />
                    ))}
                  </div>
                  <span className={`text-xs mt-1 ${darkMode ? "text-white/50" : "text-zinc-500"}`}>
                    Basado en {stats.total} {stats.total === 1 ? "opinión" : "opiniones"}
                  </span>
                </div>
              </div>

              {/* Bars chart */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((starsNum) => {
                  const count = stats.distribution[starsNum] || 0;
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={starsNum} className="flex items-center gap-3 text-xs">
                      <span className="w-3 font-semibold">{starsNum}</span>
                      <Star size={12} className="text-volt fill-volt" />
                      <div className={`h-2 flex-1 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-zinc-200"}`}>
                        <div
                          className="h-full bg-volt transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className={`w-8 text-right ${darkMode ? "text-white/50" : "text-zinc-500"}`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leave a Review Form */}
            <div className={`rounded-3xl p-6 border ${darkMode ? "bg-white/[0.03] border-white/8" : "bg-white border-zinc-200 shadow-sm"}`}>
              <h3 className="text-lg font-black uppercase tracking-[0.08em] mb-4">Escribir una reseña</h3>
              
              {successMessage && (
                <div className="mb-4 rounded-xl bg-volt/10 border border-volt/20 p-3 text-xs font-semibold text-volt">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className={`block text-xs font-black uppercase tracking-[0.08em] mb-1.5 ${darkMode ? "text-white/70" : "text-zinc-700"}`}>
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Mateo Rodríguez"
                    className={`w-full h-11 rounded-xl px-4 text-xs font-semibold outline-none border transition ${
                      darkMode 
                        ? "bg-black/28 border-white/10 text-white placeholder:text-white/30 focus:border-volt" 
                        : "bg-zinc-100 border-zinc-300 text-asphalt placeholder:text-zinc-400 focus:border-asphalt focus:bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-black uppercase tracking-[0.08em] mb-1.5 ${darkMode ? "text-white/70" : "text-zinc-700"}`}>
                    Calificación
                  </label>
                  <div className="flex gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition transform active:scale-95"
                        aria-label={`Calificar con ${star} estrellas`}
                      >
                        <Star
                          size={24}
                          className={`cursor-pointer transition-colors duration-150 ${
                            star <= (hoverRating || rating)
                              ? "text-volt fill-volt"
                              : darkMode
                              ? "text-white/20"
                              : "text-zinc-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-black uppercase tracking-[0.08em] mb-1.5 ${darkMode ? "text-white/70" : "text-zinc-700"}`}>
                    Comentario
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Cuéntanos qué te pareció la prenda, el tallaje, la tela o el envío..."
                    className={`w-full rounded-xl p-4 text-xs font-semibold outline-none border transition resize-none ${
                      darkMode 
                        ? "bg-black/28 border-white/10 text-white placeholder:text-white/30 focus:border-volt" 
                        : "bg-zinc-100 border-zinc-300 text-asphalt placeholder:text-zinc-400 focus:border-asphalt focus:bg-white"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 inline-flex items-center justify-center rounded-full bg-volt text-asphalt text-xs font-black uppercase tracking-[0.12em] transition hover:bg-white hover:text-asphalt hover:scale-[1.01]"
                >
                  Publicar reseña
                </button>
              </form>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-[0.08em] mb-4 text-center sm:text-left">
              Opiniones recientes ({reviews.length})
            </h3>
            
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-none">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`rounded-3xl p-6 border transition-all duration-300 animate-fadeIn ${
                    darkMode 
                      ? "bg-white/[0.02] border-white/8 hover:border-white/15" 
                      : "bg-white border-zinc-200 hover:shadow-md"
                  }`}
                >
                  {/* Header review */}
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar initials */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                        {review.initials}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-[0.02em]">
                          {review.name}
                        </span>
                        {/* Rating stars */}
                        <div className="flex gap-0.5 text-volt mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              fill={star <= review.rating ? "currentColor" : "none"}
                              className={star <= review.rating ? "text-volt" : "text-zinc-400"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${darkMode ? "text-white/38" : "text-zinc-400"}`}>
                      {review.date}
                    </span>
                  </div>
                  
                  {/* Comment Text */}
                  <p className={`text-xs leading-relaxed font-medium ${darkMode ? "text-white/70" : "text-zinc-600"}`}>
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
