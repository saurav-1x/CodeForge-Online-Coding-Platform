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

### 2. Client
```bash
cd client
npm install
npm start
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## Required server .env
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/codeforge
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
JUDGE0_URL=https://ce.judge0.com
```

For production, use a managed/self-hosted Judge0 instance and do not expose secrets in the React app.
