import "./globals.css";

export const metadata = {
  title: "EXCLUSIVE CLOTHING | Tienda premium",
  description:
    "Tienda online moderna y premium con compra directa por WhatsApp. Prendas urbanas y envío rápido."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-asphalt text-white antialiased">
        {children}
      </body>
    </html>
  );
}
