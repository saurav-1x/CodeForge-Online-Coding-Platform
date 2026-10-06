# CodeForge — Online Coding Platform

A LeetCode/HackerRank-style web coding platform built with React (Create React App, no Vite) and Node.js/Express.

## Stack
- Frontend: React, React Router, Axios, Monaco Editor
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt
- Code execution: Judge0-compatible API
- UI: responsive dark coding-platform interface

## Run
### 1. Server
```bash
cd server
npm install
copy .env.example .env
# edit .env with MongoDB URI and JWT secret
node seed.js
npm run dev
```

Running `node seed.js` adds missing sample problems by slug and preserves
existing problem records.

### 2. Client
```bash
cd client
npm install
npm start
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## Deploy

Deploy the frontend and API as separate Vercel projects from this repository.

### Backend Vercel project

1. Import this GitHub repository as a new Vercel project.
2. Set **Root Directory** to `server`.
3. Add these environment variables:
   - `MONGO_URI`: a reachable MongoDB Atlas connection string.
   - `JWT_SECRET`: a strong random secret.
   - `CLIENT_URL`: the exact deployed frontend origin, for example,
     `https://your-app.vercel.app`.
   - `JUDGE0_URL`: `https://ce.judge0.com`.
4. Deploy the project. The API endpoints will be under
   `https://your-api.vercel.app/api`.

### Frontend Vercel project

Set **Root Directory** to `client` and add this environment variable:

- `REACT_APP_API_URL`: the backend URL ending in `/api`, for example,
  `https://your-api.vercel.app/api`.

Redeploy the frontend after setting the variable. Do not use `localhost` in a
deployed frontend; it points to the visitor's own computer.

Do not set `REACT_APP_API_URL` to `localhost` in the Vercel project. In a
deployed browser, `localhost` points to the visitor's own computer.

## Required server .env
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/codeforge
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
JUDGE0_URL=https://ce.judge0.com
```

For production, use a managed/self-hosted Judge0 instance and do not expose secrets in the React app.
