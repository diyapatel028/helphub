const API = "http://localhost:3000"; // backend

let modal = document.getElementById("modal");
let modalTitle = document.getElementById("modal-title");
let modalBody = document.getElementById("modal-body");
let btnCancel = document.getElementById("btn-cancel");
let btnOk = document.getElementById("btn-ok");

let currentAction = null;
let currentId = null;

// Load requests
function loadRequests() {
  const q = document.getElementById("search").value;
  fetch(API + "/requests?q=" + encodeURIComponent(q))
    .then((res) => res.json())
    .then((data) => {
      let list = document.getElementById("requests");
      list.innerHTML = "";
      data.forEach((r) => {
        let div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <b>${r.title}</b> (${r.category})<br>
          ${r.description}<br>
          <i>${r.location}</i><br>
          <button>Respond</button>
        `;
        div.querySelector("button").onclick = () => {
          openModal(
            "Respond to " + r.title,
            `
            <textarea id="f-msg" placeholder="Your message"></textarea>
          `,
            "respond",
            r.id
          );
        };
        list.appendChild(div);
      });
    });
}

// Modal helpers
function openModal(title, body, action, id) {
  modalTitle.innerText = title;
  modalBody.innerHTML = body;
  currentAction = action;
  currentId = id;
  modal.style.display = "flex";
}
btnCancel.onclick = () => (modal.style.display = "none");
btnOk.onclick = () => {
  if (currentAction === "create") {
    let payload = {
      title: document.getElementById("f-title").value,
      description: document.getElementById("f-desc").value,
      category: document.getElementById("f-cat").value,
      location: document.getElementById("f-loc").value,
    };
    fetch(API + "/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => {
      modal.style.display = "none";
      loadRequests();
    });
  } else if (currentAction === "respond") {
    let payload = { message: document.getElementById("f-msg").value };
    fetch(API + "/respond/" + currentId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => {
      modal.style.display = "none";
      loadRequests();
    });
  }
};

// New request button
document.getElementById("btn-new").onclick = () => {
  openModal(
    "New Request",
    `
    <input id="f-title" placeholder="Title"><br><br>
    <textarea id="f-desc" placeholder="Description"></textarea><br><br>
    <input id="f-cat" placeholder="Category"><br><br>
    <input id="f-loc" placeholder="Location">
  `,
    "create"
  );
};

// Search input
document.getElementById("search").oninput = loadRequests;

// Initial load
loadRequests();

<Route>{<Route path="*" element={<Error404 />} />}</Route>;
