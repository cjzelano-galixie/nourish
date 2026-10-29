import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ChatContainer from "./components/chat/ChatContainer";
import Dashboard from "./components/dashboard/Dashboard";
import Layout from "./components/layout/Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "./components/profile/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route index element={<Navigate to="/ai" replace />} />
        <Route path="/ai" element={<ChatContainer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
