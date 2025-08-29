import express from "express";
const router = express.Router();

// 🟢 In-memory storage (resets when server restarts)
global.requests = global.requests || [];
let idCounter = 1;

// 👉 Get all requests
router.get("/", (req, res) => {
  res.json({ items: global.requests });
});

// 👉 Post a new request
router.post("/", (req, res) => {
  const body = req.body || {};
  const newRequest = {
    id: idCounter++,
    title: body.title || "Untitled",
    description: body.description || "",
    category: body.category || "General",
    location: body.location || "Unknown",
    createdAt: new Date().toISOString(),
  };
  global.requests.push(newRequest);
  console.log("✅ New request added:", newRequest);
  res.status(201).json(newRequest);
});

export default router;
