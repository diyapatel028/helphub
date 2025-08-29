import admin from "../integrations/firebase-admin.js";

// Verifies Firebase ID token if Authorization: Bearer <token> present
export async function authMiddleware(req, _res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return next(); // public
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || decoded.email,
    };
  } catch (e) {
    console.warn("Token verify failed:", e.message || e);
  }
  next();
}

export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Auth required" });
  next();
}
