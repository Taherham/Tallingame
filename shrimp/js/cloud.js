// Cloud accounts and progress sync (Supabase). Local-first: the app always reads and writes
// localStorage; when a user is signed in, changes are pushed after a short debounce and the
// cloud copy is merged in at sign-in so nothing earned on either device is lost.

const Cloud = (() => {
  let client = null;
  let user = null;
  let pushTimer = null;
  const listeners = [];
  const status = { lastSync: null, error: null, pending: false };

  const isConfigured = () => !!(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey && window.supabase && window.supabase.createClient);
  const currentUser = () => user;
  const getStatus = () => ({ ...status });
  const redirectTo = () => location.origin + location.pathname;

  function subscribe(fn) { listeners.push(fn); }
  function emit(event) { listeners.forEach((fn) => { try { fn(user, event); } catch (e) { console.error(e); } }); }

  function init() {
    if (!isConfigured()) return false;
    client = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    client.auth.onAuthStateChange((event, session) => {
      const next = session ? session.user : null;
      const changed = (next && next.id) !== (user && user.id);
      user = next;
      if (changed || event === "SIGNED_IN" || event === "SIGNED_OUT") emit(event);
    });
    client.auth.getSession().then(({ data }) => {
      const next = data && data.session ? data.session.user : null;
      if ((next && next.id) !== (user && user.id)) { user = next; emit("INITIAL"); }
    }).catch(() => {});
    return true;
  }

  async function signInWithEmail(email) {
    const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo() } });
    if (error) throw error;
  }
  async function signInWithProvider(provider) {
    const { error } = await client.auth.signInWithOAuth({ provider, options: { redirectTo: redirectTo() } });
    if (error) throw error;
  }
  async function signOut() {
    clearTimeout(pushTimer);
    await client.auth.signOut();
    user = null;
    emit("SIGNED_OUT");
  }

  async function pull() {
    if (!user) return null;
    const { data, error } = await client.from("progress").select("data").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    return data ? data.data : null;
  }

  async function push(progress, summary) {
    if (!user) return;
    status.pending = true;
    const row = { user_id: user.id, data: progress, xp: summary.xp || 0, streak: summary.streak || 0, updated_at: new Date().toISOString() };
    const { error } = await client.from("progress").upsert(row, { onConflict: "user_id" });
    status.pending = false;
    if (error) { status.error = error.message; throw error; }
    status.error = null;
    status.lastSync = Date.now();
  }

  // Coalesce rapid saves into one write.
  function schedulePush(getPayload) {
    if (!user) return;
    clearTimeout(pushTimer);
    status.pending = true;
    pushTimer = setTimeout(async () => {
      try { const { progress, summary } = getPayload(); await push(progress, summary); }
      catch (e) { /* status.error already set */ }
      emit("SYNC");
    }, 1500);
  }

  async function getProfile() {
    if (!user) return null;
    const { data } = await client.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
    return data || null;
  }
  async function setDisplayName(name) {
    const { error } = await client.from("profiles").upsert({ id: user.id, display_name: name }, { onConflict: "id" });
    if (error) throw error;
  }

  // Merge two progress documents so nothing earned on either side is lost.
  // Stars, misses: higher wins. Days, videos, learn screens: union. XP: higher wins (never summed,
  // so a device that synced late can't double-count).
  function merge(local, cloud) {
    if (!cloud) return local;
    if (!local) return cloud;
    const maxMap = (x = {}, y = {}) => { const out = { ...x }; for (const [k, v] of Object.entries(y)) out[k] = Math.max(out[k] || 0, v || 0); return out; };
    const union = (x = {}, y = {}) => ({ ...y, ...x });
    let dailyXp = local.dailyXp || cloud.dailyXp || null;
    if (local.dailyXp && cloud.dailyXp) {
      if (local.dailyXp.date === cloud.dailyXp.date) dailyXp = { date: local.dailyXp.date, xp: Math.max(local.dailyXp.xp || 0, cloud.dailyXp.xp || 0) };
      else dailyXp = local.dailyXp.date > cloud.dailyXp.date ? local.dailyXp : cloud.dailyXp;
    }
    return {
      xp: Math.max(local.xp || 0, cloud.xp || 0),
      completed: maxMap(local.completed, cloud.completed),
      watched: union(local.watched, cloud.watched),
      learnSeen: union(local.learnSeen, cloud.learnSeen),
      dailyGoal: local.dailyGoal || cloud.dailyGoal || 20,
      dailyXp,
      activeDays: union(local.activeDays, cloud.activeDays),
      goalDays: union(local.goalDays, cloud.goalDays),
      misses: maxMap(local.misses, cloud.misses),
    };
  }

  return { isConfigured, init, subscribe, currentUser, getStatus, signInWithEmail, signInWithProvider, signOut, pull, push, schedulePush, getProfile, setDisplayName, merge };
})();
