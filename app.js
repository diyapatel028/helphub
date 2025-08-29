import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { authMiddleware } from "./routes/auth.js";
import requestsRouter from "./routes/requests.js";
import respondRouter from "./routes/respond.js";

const app = express();
app.use(cors({ origin: true, credentials: false }));
app.use(express.json());

app.get("/", (_,res)=>res.json({ ok:true, service:"HelpHub API" }));

// attach auth middleware that optionally decodes Firebase tokens
app.use(authMiddleware);

// API routes
app.use("/requests", requestsRouter);
app.use("/respond", respondRouter);

// Static public folder (optional)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/public", express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`HelpHub API on :${port}`));
