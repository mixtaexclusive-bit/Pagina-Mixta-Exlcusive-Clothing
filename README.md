# EXCLUSIVE CLOTHING

Tienda online premium hecha con Next.js, React y TailwindCSS. El catálogo se alimenta automáticamente desde Google Sheets y permite compra directa por WhatsApp.

## Configuración rápida

1. Instala dependencias:

```bash
npm install
```

2. Copia `.env.example` como `.env.local` y completa:

```env
NEXT_PUBLIC_STORE_NAME="EXCLUSIVE CLOTHING"
NEXT_PUBLIC_WHATSAPP_NUMBER="573128704308"
GOOGLE_SHEET_ID="TU_ID_DE_GOOGLE_SHEET"
GOOGLE_SHEET_GID="0"
```

3. Ejecuta:

```bash
npm run dev
```

## Formato de Google Sheets

Publica la hoja en la web y usa estas columnas:

| nombre | precio | imagen | tallas | categoria | descripcion | galeria | fecha |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Camiseta Mundial Edición Limitada | 85000 | https://res.cloudinary.com/.../main.jpg | S,M,L,XL | Camisetas | Descripción del producto | https://res.cloudinary.com/.../1.jpg,https://res.cloudinary.com/.../2.jpg | 2026-05-22 |

Notas:

- Los productos nuevos deben ir al final de la hoja para que aparezcan primero en la tienda.
- La columna `fecha` es opcional. Si la usas, la tienda ordena por fecha más reciente.
- La columna `categoria` define las secciones del catálogo. Usa el mismo nombre exacto para agrupar.
- `imagen` debe ser una URL pública de Cloudinary.
- Usa el enlace directo del archivo, normalmente empieza por `https://res.cloudinary.com/...`.
- No uses enlaces de colección como `https://collection.cloudinary.com/...`, porque son páginas HTML y no imágenes directas.
- `galeria` es opcional y acepta URLs separadas por coma, punto y coma o barra vertical.
- `tallas` acepta valores separados por coma, por ejemplo: `S,M,L,XL`.
- Si no configuras `GOOGLE_SHEET_ID`, la tienda usa productos de muestra.

## Compra por WhatsApp

El botón genera un mensaje con:

- Producto
- Talla
- Cantidad
- Precio
- Campo para nombre del cliente

Destino actual: `https://wa.me/573128704308`.
