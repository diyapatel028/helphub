const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// In-memory data
let requests = [];
let responses = [];
let idCounter = 1;

// GET requests (with optional search)
app.get("/requests", (req, res) => {
  let q = (req.query.q || "").toLowerCase();
  let result = requests.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.description.toLowerCase().includes(q) ||
    r.category.toLowerCase().includes(q) ||
    r.location.toLowerCase().includes(q)
  );
  res.json(result);
});

// POST new request
app.post("/requests", (req, res) => {
  let r = {
    id: idCounter++,
    title: req.body.title || "Untitled",
    description: req.body.description || "",
    category: req.body.category || "General",
    location: req.body.location || "Unknown"
  };
  requests.push(r);
  console.log("New request:", r);
  res.json(r);
});

// POST respond
app.post("/respond/:id", (req, res) => {
  let id = Number(req.params.id);
  let msg = req.body.message;
  let resp = { requestId: id, message: msg };
  responses.push(resp);
  console.log("Response to request", id, ":", msg);
  res.json(resp);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
