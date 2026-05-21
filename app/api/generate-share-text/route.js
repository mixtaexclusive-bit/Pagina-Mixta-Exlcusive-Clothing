import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, description, url } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: "El nombre y el precio del producto son requeridos." },
        { status: 400 }
      );
    }

    const priceText = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.warn("ANTHROPIC_API_KEY no configurada. Usando fallback de marketing.");
      const fallbackText = generateFallbackText(name, priceText, description, url);
      return NextResponse.json({ text: fallbackText, isFallback: true });
    }

    // Call Anthropic Claude API
    const systemPrompt = "Eres un experto en marketing de moda. Crea publicaciones cortas, persuasivas y de estilo streetwear.";
    const userPrompt = `Eres un experto en marketing de moda. Crea una publicación corta, llamativa y persuasiva en español para vender este producto en redes sociales. Incluye emojis, resalta el precio, la calidad y un llamado a la acción para comprar. Producto: ${name}, precio: ${priceText}, descripción: ${description || "Sin descripción"}. Máximo 5 líneas.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error de la API de Anthropic:", errorData);
      throw new Error(`Anthropic respondió con código ${response.status}`);
    }

    const data = await response.json();
    let generatedText = data.content?.[0]?.text || "";

    // Clean up any extra quotes or text wrappers
    generatedText = generatedText.trim().replace(/^["']|["']$/g, "");

    // Ensure the product URL is included at the end
    if (url && !generatedText.includes(url)) {
      generatedText = `${generatedText}\n\n👉 Compra aquí: ${url}`;
    }

    return NextResponse.json({ text: generatedText, isFallback: false });
  } catch (error) {
    console.error("Error generando texto publicitario:", error);
    // Return fallback copy so the frontend remains functional
    try {
      const body = await request.json().catch(() => ({}));
      const priceText = body.price
        ? new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          }).format(body.price)
        : "";
      const fallbackText = generateFallbackText(body.name || "Prenda", priceText, body.description, body.url);
      return NextResponse.json({ text: fallbackText, isFallback: true, error: error.message });
    } catch (fallbackError) {
      return NextResponse.json(
        { error: "Error interno del servidor al procesar la solicitud." },
        { status: 500 }
      );
    }
  }
}

function generateFallbackText(name, priceText, description, url) {
  const emojis = ["🔥", "✨", "💎", "💯", "👑", "⚡"];
  const selectEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const urlSuffix = url ? `\n\n👉 Adquiérelo aquí: ${url}` : "";
  return `${selectEmoji} ¡LLEGÓ LO NUEVO! Vestir exclusivo marca la diferencia. ${name} ya disponible. \n\n✨ Calidad prémium y corte perfecto para elevar tu estilo urbano. Llévatelo por solo ${priceText}. \n\n📲 Compra rápida y directa por WhatsApp con envío inmediato.${urlSuffix}`;
}
