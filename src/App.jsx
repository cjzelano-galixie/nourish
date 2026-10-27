import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ChatContainer from "./components/chat/ChatContainer";
import Layout from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ai" element={<ChatContainer />} />
      </Route>
    </Routes>
  );
}
