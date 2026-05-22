# Publicar cambios en https://tienda-mixta-exclusive.netlify.app/

La tienda en vivo **no se actualiza sola** hasta que Netlify reciba un deploy nuevo.

## Opción 1 — GitHub Actions (automático en cada push)

En GitHub: repositorio **Pagina-Mixta-Exlcusive-Clothing** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Crea estos secretos (copia los valores de tu `.env.local`):

| Secreto | Valor |
| --- | --- |
| `NETLIFY_AUTH_TOKEN` | Token en [Netlify → Applications](https://app.netlify.com/user/applications#personal-access-tokens). **Nombre exacto:** `NETLIFY_AUTH_TOKEN` (en **Actions**, no en Dependabot) |
| `GOOGLE_SHEET_ID` | Tu ID de hoja publicada |
| `GOOGLE_SHEET_GID` | `0` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Ej. `573226821174` |
| `NEXT_PUBLIC_STORE_NAME` | `EXCLUSIVE CLOTHING` |

Luego en GitHub → **Actions** → **Deploy Netlify Production** → **Run workflow**.

## Opción 2 — Desde tu PC

```powershell
npx netlify login
$env:NETLIFY_AUTH_TOKEN="tu_token"
npm run deploy:netlify
```

## Opción 3 — Panel Netlify

1. [app.netlify.com](https://app.netlify.com/) → sitio **tienda-mixta-exclusive**
2. **Link repository** → `mixtaexclusive-bit/Pagina-Mixta-Exlcusive-Clothing` → rama `main`
3. Variables de entorno (mismas que `.env.local`)
4. **Deploy site**

## Cómo comprobar que ya quedó

Recarga con **Ctrl+F5**. Debes ver:

- Título **Catálogo por categorías**
- Secciones con banner (Bermudas, Camisetas, etc.)
- Botón **WhatsApp** en tarjetas
- Solo icono de **canasta +** en el modal (sin texto "Agregar al carrito")
