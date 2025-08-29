// Minimal Firebase client placeholder — fill with your Firebase config to enable Auth.
// This file exports startAuthUI() which the app calls. If you don't want auth, leave as no-op.

export const firebaseConfig = {
  apiKey: "YOUR_PUBLIC_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};

export const auth = null;
export function startAuthUI(){
  // No-op for the beginner demo. Replace with firebase/web SDK init if you want
  // to enable sign in/out later.
  const btnIn = document.getElementById("btn-signin");
  const btnOut = document.getElementById("btn-signout");
  const chip = document.getElementById("user-chip");
  btnIn?.addEventListener("click", ()=>{ alert("Auth not set in demo — add Firebase config."); });
  btnOut?.addEventListener("click", ()=>{ alert("Auth not set in demo."); });
}
