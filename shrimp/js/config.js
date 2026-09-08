// Cloud sync configuration (Firebase).
// The web config below is safe to publish: it identifies the project, and Firestore security
// rules (firebase/firestore.rules) decide what a signed-in user can read and write.
// Leave apiKey empty and the app runs local-only with the account button hidden.
const CONFIG = Object.assign({
  firebase: {
    apiKey: "AIzaSyCqx8HJ6Gev7Gaui87MWdLSzC3WX5RgHBY",
    authDomain: "shrimp-5b29d.firebaseapp.com",
    projectId: "shrimp-5b29d",
    appId: "1:1056461056229:web:a848711c926b399d7bcc0c",
  },
  // Social sign-in providers enabled in the Firebase console, e.g. ["google", "apple"].
  providers: ["google"],
}, window.SHRIMP_CONFIG || {});
