import { Router } from "express";
import { ResponseModel, RequestModel } from "../models/request.js";
import { requireUser } from "./auth.js";
import { sendMail } from "../integrations/emailjs.js";

const router = Router();

// POST /respond/:requestId
router.post("/:requestId", requireUser, (req, res) => {
  const id = Number(req.params.requestId);
  const msg = (req.body?.message || "").trim();
  if (!id || !msg) return res.status(400).json({ error: "Invalid input" });

  // ensure request exists
  const target = RequestModel.list({}).find(r => r.id === id);
  if (!target) return res.status(404).json({ error: "Request not found" });

  const rec = ResponseModel.create({
    requestId: id,
    uid: req.user.uid,
    responderEmail: req.user.email,
    responderName: req.user.name,
    message: msg,
  });

  // Notify owner if email present
  if (target.ownerEmail) {
    sendMail({
      to: target.ownerEmail,
      subject: `New response to "${target.title}"`,
      html: `
        <p>Hi ${target.ownerName || "there"},</p>
        <p><strong>${req.user.name || req.user.email}</strong> responded to your request:</p>
        <blockquote>${escapeHTML(msg)}</blockquote>
        <p>View responses in the HelpHub app.</p>
      `
    }).catch(()=>{ /* ignore for MVP */ });
  }

  res.status(201).json(rec);
});

function escapeHTML(s=""){return s.replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]))}

export default router;
