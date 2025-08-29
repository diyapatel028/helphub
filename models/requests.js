import { Router } from "express";
import { RequestModel } from "../models/request.js";
import { requireUser } from "./auth.js";

const router = Router();

// GET /requests?q=&category=&mine=1
router.get("/", (req, res) => {
  const q = (req.query.q || "").toString();
  const category = (req.query.category || "").toString();
  const mine = req.query.mine ? (req.user?.uid || "__nope__") : null;
  const items = RequestModel.list({ q, category, uid: mine });
  res.json({ items });
});

// GET /requests/stats
router.get("/stats", (_req, res) => {
  res.json(RequestModel.stats());
});

// POST /requests
router.post("/", requireUser, (req, res) => {
  const b = req.body || {};
  if (!b.title || !b.description || !b.category || !b.location)
    return res.status(400).json({ error: "Missing fields" });

  const rec = RequestModel.create({
    uid: req.user.uid,
    ownerEmail: req.user.email,
    ownerName: req.user.name,
    title: b.title.trim(),
    description: b.description.trim(),
    category: b.category.trim(),
    location: b.location.trim(),
  });
  res.status(201).json(rec);
});

export default router;
