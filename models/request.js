import Database from "better-sqlite3";

const dbPath = process.env.DATABASE_URL || "./database.db";
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT,
  ownerEmail TEXT,
  ownerName TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requestId INTEGER NOT NULL,
  uid TEXT,
  responderEmail TEXT,
  responderName TEXT,
  message TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(requestId) REFERENCES requests(id)
);
CREATE INDEX IF NOT EXISTS idx_requests_created ON requests(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_responses_request ON responses(requestId);
`);

export const RequestModel = {
  create(req) {
    const st = db.prepare(`
      INSERT INTO requests (uid, ownerEmail, ownerName, title, description, category, location)
      VALUES (@uid, @ownerEmail, @ownerName, @title, @description, @category, @location)
    `);
    const info = st.run(req);
    return { id: info.lastInsertRowid, ...req, createdAt: new Date().toISOString() };
  },
  list({ q="", category="", uid=null }) {
    const where = [];
    const params = {};
    if (q) { where.push("(title LIKE @q OR description LIKE @q OR location LIKE @q)"); params.q = `%${q}%`; }
    if (category) { where.push("category = @category"); params.category = category; }
    if (uid) { where.push("uid = @uid"); params.uid = uid; }
    const sql = `
      SELECT r.*, (SELECT COUNT(*) FROM responses WHERE requestId = r.id) AS responseCount
      FROM requests r
      ${where.length? "WHERE " + where.join(" AND "): ""}
      ORDER BY datetime(r.createdAt) DESC
      LIMIT 200
    `;
    return db.prepare(sql).all(params);
  },
  stats() {
    const active = db.prepare("SELECT COUNT(*) AS n FROM requests").get().n;
    const since = db.prepare("SELECT COUNT(*) AS n FROM responses WHERE datetime(createdAt) >= datetime('now','-1 day')").get().n;
    const members = db.prepare("SELECT COUNT(DISTINCT uid) AS n FROM requests").get().n;
    const totalReqsWithResp = db.prepare(`
      SELECT COUNT(*) AS n FROM (
        SELECT requestId FROM responses GROUP BY requestId
      )
    `).get().n;
    const responseRate = active ? (totalReqsWithResp / active) : 0;
    return { active, helpedToday: since, responseRate, members };
  }
};

export const ResponseModel = {
  create(resp) {
    const st = db.prepare(`
      INSERT INTO responses (requestId, uid, responderEmail, responderName, message)
      VALUES (@requestId, @uid, @responderEmail, @responderName, @message)
    `);
    const info = st.run(resp);
    return { id: info.lastInsertRowid, ...resp, createdAt: new Date().toISOString() };
  }
};
