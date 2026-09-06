// Cloud sync configuration.
// Both values are safe to publish: the anon key only grants what the database's row-level
// security allows, which is each signed-in user reading and writing their own rows.
// Leave them empty and the app runs local-only with the account button hidden.
const CONFIG = Object.assign({
  supabaseUrl: "",
  supabaseAnonKey: "",
  // Social sign-in providers enabled in the Supabase dashboard, e.g. ["google", "apple"].
  providers: [],
}, window.SHRIMP_CONFIG || {});
