# Plataforma PZ — Demostración

Proyecto aparte, solo para que cualquiera pruebe la plataforma antes de comprar.

- Sin cuentas ni contraseña: se entra directamente.
- Todos los módulos abiertos (como el plan Metodólogo), con un equipo de ejemplo.
- Nada se guarda: los datos viven en memoria y al recargar todo vuelve al inicio.
- Imprimir abre solo una vista previa con la marca de agua «DEMOSTRACIÓN»; no se puede imprimir ni guardar en PDF.
- No se puede descargar nada (copias de seguridad, imágenes, exportaciones).
- Las tareas se pueden ver pero no modificar.
- Contenido limitado: 2 sesiones por objetivos con sus tareas, 4 tareas del libro y 3 sesiones de cada guía del Sistema Tipo. El resto aparece con candado.
- No se conecta a la base de datos real ni a Stripe.

La plataforma es la misma que la del proyecto principal (`src/pz/PZApp.jsx`), con `modoDemo` activado.
Cuando cambie la plataforma principal, copiar aquí el `PZApp.jsx` nuevo.

Variable opcional en Vercel: `NEXT_PUBLIC_SITE_PRINCIPAL` (por defecto https://entrenadordesdecero.com).
