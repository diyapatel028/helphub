# HelpHub — Minimal MVP (Frontend + Backend)

## Quick Start

### Backend
1. cd backend
2. cp .env.example .env  # fill values (optional for email/firebase)
3. npm install
4. npm run init:db       # optional seeding
5. npm run dev           # starts on http://localhost:5050

### Frontend
- Serve frontend either by opening index.html directly or using a static server:
  cd frontend
  npx serve

- Edit `frontend/scripts/firebase.js` with your Firebase web config if you want auth.
- In `frontend/scripts/app.js`, set `API_BASE` to your backend URL if not localhost.

## Deploy
- Frontend: GitHub Pages / Netlify
- Backend: Render / Railway / Vercel (Node). Ensure proper .env values.

## Notes
- Auth: optional Firebase Admin verification. If not configured, endpoints requiring auth will return 401.
- Email: SMTP optional (Nodemailer). If not configured, notifications are logged to console.
- DB: SQLite file at `DATABASE_URL` (default `./database.db`).
