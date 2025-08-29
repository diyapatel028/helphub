import express from "express";
const router = express.Router();

// 🟢 In-memory responses
global.responses = global.responses || [];

// 👉 Add a response to a request
router.post("/:requestId", (req, res) => {
  const requestId = Number(req.params.requestId);
  const body = req.body || {};

  if (!requestId || !body.message) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const response = {
    requestId,
    message: body.message,
    createdAt: new Date().toISOString(),
  };
  global.responses.push(response);

  console.log("✅ New response added:", response);
  res.status(201).json(response);
});

export default router;
