"use client";

import PZApp from "@/pz/PZApp";
import { SITE_PRINCIPAL } from "@/lib/config";

// Plataforma de demostración: todos los módulos abiertos (como el plan Metodólogo),
// con un equipo de ejemplo. Nada se guarda, no se imprime ni se descarga.
export default function DemoPage() {
  return <PZApp plan="metodologo" modoDemo urlCompra={`${SITE_PRINCIPAL}/#precios`} />;
}
