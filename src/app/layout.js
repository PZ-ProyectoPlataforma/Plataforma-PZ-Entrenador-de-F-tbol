import "./pz-tailwind.css";

export const metadata = {
  title: "Demostración — Plataforma Puntualización Zonal",
  description: "Prueba la plataforma de Entrenador de Fútbol desde Cero con un equipo de ejemplo.",
  robots: { index: false, follow: false },
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="pz-scope">{children}</div>
      </body>
    </html>
  );
}
