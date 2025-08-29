// backend/integrations/firebase-admin.js

// Fake Firebase Admin stub for local demo (no real Firebase needed)
const admin = {
  auth() {
    return {
      async verifyIdToken(token) {
        if (!token) throw new Error("No token provided (stub).");
        return {
          uid: "local-user",
          email: "test@example.com",
          name: "Test User",
        };
      },
    };
  },
};

export default admin;
