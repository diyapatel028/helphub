import { startAuthUI } from "./firebase.js";
import { recommendCategory } from "./ai-helper.js";
import { validateRequest, validateResponse } from "./validate.js";

const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5050/requests"
    : "https://YOUR_BACKEND_HOST";

const el = (q, p = document) => p.querySelector(q);

startAuthUI();
window.addEventListener("DOMContentLoaded", async () => {
  await loadNavbar();
  await bootstrapUI();
  await refreshStats();
  await listRequests();
});

async function loadNavbar() {
  const res = await fetch("./components/navbar.html");
  el("#navbar").innerHTML = await res.text();
}

async function bootstrapUI() {
  const [tplCard, tplModal] = await Promise.all([
    fetch("./components/request-card.html").then((r) => r.text()),
    fetch("./components/modal.html").then((r) => r.text()),
  ]);
  el("#modal").innerHTML = tplModal + tplCard;

  el("#btn-post").addEventListener("click", () => openCreateModal());
  el("#btn-my").addEventListener("click", () => listRequests({ mine: true }));
  el("#search").addEventListener(
    "input",
    debounce(() => listRequests(), 300)
  );
  el("#filter-category").addEventListener("change", () => listRequests());
}

async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function refreshStats() {
  try {
    const s = await api("/requests/stats");
    el("#stat-requests").textContent = s.active || 0;
    el("#stat-helped").textContent = s.helpedToday || 0;
    el("#stat-rate").textContent = `${Math.round(
      (s.responseRate || 0) * 100
    )}%`;
    el("#stat-members").textContent = s.members || 0;
  } catch (e) {
    /* ignore for MVP */
  }
}

async function listRequests(opts = {}) {
  const q = el("#search").value.trim();
  const cat = el("#filter-category").value;
  const params = new URLSearchParams({
    q,
    category: cat,
    mine: opts.mine ? "1" : "",
  });
  const data = await api(`/requests?${params.toString()}`);
  const grid = el("#requests-grid");
  grid.innerHTML = "";
  const tpl = el("#tpl-card").content;
  data.items.forEach((item) => {
    const node = tpl.cloneNode(true);
    node.querySelector(".badge").textContent = item.category;
    node.querySelector(".title").textContent = item.title;
    node.querySelector(".desc").textContent =
      item.description.slice(0, 140) +
      (item.description.length > 140 ? "…" : "");
    node.querySelector(".meta").textContent = `${item.location} • ${timeAgo(
      item.createdAt
    )} • ${item.responseCount || 0} responses`;
    node
      .querySelector(".btn-respond")
      .addEventListener("click", () => openRespondModal(item));
    grid.appendChild(node);
  });
}

function openCreateModal() {
  const host = el("#modal");
  host.classList.remove("hidden");
  const sheet = host.querySelector(".sheet");
  sheet.querySelector(".m-title").textContent = "Create Request";
  const body = sheet.querySelector(".m-body");
  body.innerHTML = `
    <label>Title<input id="f-title" /></label><br/>
    <label>Description<textarea id="f-desc" rows="4"></textarea></label><br/>
    <label>Location<input id="f-loc" /></label><br/>
    <label>Category
      <select id="f-cat">
        <option>Lost & Found</option>
        <option>Blood Donation</option>
        <option>Study Partner</option>
        <option>Volunteer</option>
        <option>Emergency</option>
      </select>
    </label>
    <div class="meta" id="ai-suggest"></div>
  `;
  const ai = el("#ai-suggest");
  el("#f-desc").addEventListener("input", (e) => {
    const rec = recommendCategory(e.target.value);
    ai.textContent = rec ? `Suggested category: ${rec}` : "";
    if (rec) el("#f-cat").value = rec;
  });

  sheet.querySelector(".btn-cancel").onclick = () =>
    host.classList.add("hidden");
  sheet.querySelector(".btn-ok").onclick = async () => {
    const payload = {
      title: el("#f-title").value,
      description: el("#f-desc").value,
      location: el("#f-loc").value,
      category: el("#f-cat").value,
    };
    const { ok, errors } = validateRequest(payload);
    if (!ok) return alert(Object.values(errors).join("\n"));
    try {
      await api("/requests", { method: "POST", body: payload });
      host.classList.add("hidden");
      await listRequests();
      await refreshStats();
    } catch (e) {
      alert(e.message);
    }
  };
}

function openRespondModal(item) {
  const host = el("#modal");
  host.classList.remove("hidden");
  const sheet = host.querySelector(".sheet");
  sheet.querySelector(".m-title").textContent = `Respond to: ${item.title}`;
  const body = sheet.querySelector(".m-body");
  body.innerHTML = `
    <p class="meta">${item.category} • ${item.location}</p>
    <textarea id="f-msg" rows="4" placeholder="Type your response..."></textarea>
  `;
  sheet.querySelector(".btn-cancel").onclick = () =>
    host.classList.add("hidden");
  sheet.querySelector(".btn-ok").onclick = async () => {
    const payload = { message: el("#f-msg").value };
    const { ok, errors } = validateResponse(payload);
    if (!ok) return alert(Object.values(errors).join("\n"));
    try {
      await api(`/respond/${item.id}`, { method: "POST", body: payload });
      host.classList.add("hidden");
      await listRequests();
    } catch (e) {
      alert(e.message);
    }
  };
}

function timeAgo(ts) {
  const d = new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}
function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}
