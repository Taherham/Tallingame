// Cloud sync configuration (Firebase).
// The web config below is safe to publish: it identifies the project, and Firestore security
// rules (firebase/firestore.rules) decide what a signed-in user can read and write.
// Leave apiKey empty and the app runs local-only with the account button hidden.
const CONFIG = Object.assign({
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: "",
  },
  // Social sign-in providers enabled in the Firebase console, e.g. ["google", "apple"].
  providers: [],
}, window.SHRIMP_CONFIG || {});
