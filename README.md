# 🦅 FinLingvo

Kyrgyz financial literacy learning app — Duolingo-style.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL
- **Auth**: JWT

## Local Development

```bash
# 1. Backend
cd server
cp .env.example .env          # fill in your PostgreSQL URL
npm install
npx prisma migrate dev
npm run dev                   # → http://localhost:4000

# 2. Frontend
cd client
npm install
npm run dev                   # → http://localhost:5173
```

## Deployment

### Backend → Render.com (NOT PythonAnywhere — Node.js only)

1. Go to [render.com](https://render.com) → **New** → **Blueprint**
2. Connect your GitHub repo → select `render.yaml` → Deploy
3. Render will auto-create PostgreSQL + Node.js service
4. Copy the generated service URL (e.g. `https://finlingvo-api.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
2. **Root directory**: `client`
3. **Framework**: Vite
4. Add **Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://finlingvo-api.onrender.com/api`
5. Deploy → copy your Vercel URL (e.g. `https://finlingvo.vercel.app`)

### After both are deployed

Update `CLIENT_URL` on Render to your Vercel URL:
- Render dashboard → finlingvo-api → Environment → `CLIENT_URL` = `https://finlingvo.vercel.app`
