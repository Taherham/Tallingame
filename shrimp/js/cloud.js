// Cloud accounts and progress sync (Firebase Auth + Firestore). Local-first: the app always reads
// and writes localStorage; when a user is signed in, changes are pushed after a short debounce and
// the cloud copy is merged in at sign-in so nothing earned on either device is lost.
//
// Firestore layout:
//   progress/{uid}  { data, xp, streak, updatedAt }        owner only
//   profiles/{uid}  { displayName, xp, streak, updatedAt } public read, owner write (leaderboards)

const Cloud = (() => {
  const EMAIL_KEY = "shrimp_signin_email";
  let auth = null;
  let db = null;
  let user = null;
  let pushTimer = null;
  const listeners = [];
  const status = { lastSync: null, error: null, pending: false };

  const isConfigured = () => !!(CONFIG.firebase && CONFIG.firebase.apiKey && window.firebase && window.firebase.initializeApp);
  const currentUser = () => user;
  const getStatus = () => ({ ...status });
  const redirectTo = () => location.origin + location.pathname;

  function subscribe(fn) { listeners.push(fn); }
  function emit(event) { listeners.forEach((fn) => { try { fn(user, event); } catch (e) { console.error(e); } }); }

  function init() {
    if (!isConfigured()) return false;
    if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(CONFIG.firebase);
    auth = firebase.auth();
    db = firebase.firestore();
    let first = true;
    auth.onAuthStateChanged((u) => {
      const next = u ? { id: u.uid, email: u.email || null } : null;
      const changed = (next && next.id) !== (user && user.id);
      user = next;
      if (changed) emit(next ? (first ? "INITIAL" : "SIGNED_IN") : "SIGNED_OUT");
      first = false;
    });
    completeEmailLink();
    return true;
  }

  // If this page load is the landing of a sign-in email link, finish the sign-in.
  async function completeEmailLink() {
    try {
      if (!auth.isSignInWithEmailLink(location.href)) return;
      let email = null;
      try { email = localStorage.getItem(EMAIL_KEY); } catch (e) { /* ignore */ }
      if (!email) email = window.prompt("Confirm the email you used to sign in");
      if (!email) return;
      await auth.signInWithEmailLink(email, location.href);
      try { localStorage.removeItem(EMAIL_KEY); } catch (e) { /* ignore */ }
      history.replaceState(null, "", redirectTo());
    } catch (e) {
      status.error = e.message;
      emit("SYNC");
    }
  }

  async function signInWithEmail(email) {
    await auth.sendSignInLinkToEmail(email, { url: redirectTo(), handleCodeInApp: true });
    try { localStorage.setItem(EMAIL_KEY, email); } catch (e) { /* ignore */ }
  }

  async function signInWithProvider(name) {
    let provider;
    if (name === "google") provider = new firebase.auth.GoogleAuthProvider();
    else if (name === "apple") { provider = new firebase.auth.OAuthProvider("apple.com"); provider.addScope("email"); provider.addScope("name"); }
    else throw new Error(`Unknown provider: ${name}`);
    await auth.signInWithRedirect(provider);
  }

  async function signOut() {
    clearTimeout(pushTimer);
    await auth.signOut();
    user = null;
    emit("SIGNED_OUT");
  }

  async function pull() {
    if (!user) return null;
    const snap = await db.collection("progress").doc(user.id).get();
    return snap.exists ? (snap.data().data || null) : null;
  }

  async function push(progress, summary) {
    if (!user) return;
    status.pending = true;
    try {
      const ts = firebase.firestore.FieldValue.serverTimestamp();
      const xp = summary.xp || 0, streak = summary.streak || 0;
      await db.collection("progress").doc(user.id).set({ data: progress, xp, streak, updatedAt: ts }, { merge: true });
      await db.collection("profiles").doc(user.id).set({ xp, streak, updatedAt: ts }, { merge: true });
      status.error = null;
      status.lastSync = Date.now();
    } catch (e) {
      status.error = e.message;
      throw e;
    } finally {
      status.pending = false;
    }
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
    const snap = await db.collection("profiles").doc(user.id).get();
    if (!snap.exists) return null;
    const d = snap.data();
    return { display_name: d.displayName || null };
  }
  async function setDisplayName(name) {
    await db.collection("profiles").doc(user.id).set({ displayName: name, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
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
