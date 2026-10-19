import Login from "./auth/Login";
import Register from "./auth/Register";
import Layout from "./layout/Layout";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
