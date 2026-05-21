"use client";

import React, { useState } from "react";
import { Share2 } from "lucide-react";
import ShareModal from "./ShareModal";

export default function ShareButton({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!product) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black shadow-lg hover:shadow-yellow-500/20 hover:scale-105 transition transform active:scale-95 duration-200"
        aria-label="Compartir producto"
        type="button"
      >
        <Share2 size={18} className="text-black" />
      </button>

      {isModalOpen && (
        <ShareModal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
