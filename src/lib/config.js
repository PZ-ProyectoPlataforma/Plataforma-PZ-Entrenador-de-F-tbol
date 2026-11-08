// Dirección de la web principal (adonde llevan «Ver planes y precios» y los avisos).
// Se puede cambiar en Vercel con la variable NEXT_PUBLIC_SITE_PRINCIPAL.
export const SITE_PRINCIPAL = (process.env.NEXT_PUBLIC_SITE_PRINCIPAL || "https://entrenadordesdecero.com").replace(/\/$/, "");
