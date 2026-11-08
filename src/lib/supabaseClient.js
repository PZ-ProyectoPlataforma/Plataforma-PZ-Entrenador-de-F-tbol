// Demostración: no hay cuentas ni base de datos. Este sustituto evita cualquier
// conexión con la base de datos real.
export const urlInicial = { hash: "", search: "" };
export const supabase = {
  auth: { getSession: async () => ({ data: { session: null } }) },
};
