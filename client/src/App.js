import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Problems from "./pages/Problems";
import Problem from "./pages/Problem";
import Submissions from "./pages/Submissions";
import Contests from "./pages/Contests";
import SectionPlaceholder from "./pages/SectionPlaceholder";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login adminOnly />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problem/:slug" element={<Problem />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/certifications" element={<SectionPlaceholder />} />
          <Route path="/leaderboard" element={<SectionPlaceholder />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/discuss" element={<SectionPlaceholder />} />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;