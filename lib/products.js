import { sampleProducts } from "@/lib/sample-products";

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");

const parseList = (value) =>
  Array.from(
    new Set(
      String(value || "")
        .split(/[,|;]/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

const normalizeImageUrl = (value) => String(value || "").trim();

const parsePrice = (value) => {
  if (typeof value === "number") return value;
  const normalized = String(value || "").replace(/[^\d]/g, "");
  return Number(normalized || 0);
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const csvToRows = (csv) => {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      rows.push(row);
      field = "";
      row = [];
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((items) => items.some((item) => String(item).trim()));
};

const rowToProduct = (row, index) => {
  const name = row.nombre || row.name || "";
  const image = normalizeImageUrl(row.imagen || row.image);
  const gallery = parseList(row.galeria || row.gallery || row.imagenes || row.images).map(
    normalizeImageUrl
  );
  const sizes = parseList(row.tallas || row.sizes || row.talla || row.size);
  const brand = row.marca || row.brand || "MIXTA";

  return {
    id: slugify(row.id || name || `producto-${index + 1}`),
    name,
    price: parsePrice(row.precio || row.price),
    image,
    gallery: gallery.length ? gallery : image ? [image] : [],
    sizes,
    category: row.categoria || row.category || "Colección",
    description: row.descripcion || row.description || "",
    brand: String(brand).trim() || "MIXTA"
  };
};

export async function getProducts() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const gid = process.env.GOOGLE_SHEET_GID || "0";

  if (!sheetId) {
    return [...sampleProducts].reverse();
  }

  try {
    const timestamp = Date.now();
    const url = sheetId.startsWith("2PACX-")
      ? `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv&gid=${gid}&t=${timestamp}`
      : `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}&t=${timestamp}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Google Sheets respondió ${response.status}`);
    }

    const csv = await response.text();
    const [headers, ...rows] = csvToRows(csv);
    const keys = headers.map(normalizeHeader);

    const products = rows
      .map((values, index) => {
        const row = Object.fromEntries(keys.map((key, column) => [key, values[column] || ""]));
        return rowToProduct(row, index);
      })
      .filter((product) => product.name && product.price && product.image);

    return products.length ? [...products].reverse() : [...sampleProducts].reverse();
  } catch (error) {
    console.error("No se pudieron leer productos desde Google Sheets:", error);
    return [...sampleProducts].reverse();
  }
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}
