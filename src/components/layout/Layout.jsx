// import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";

/** The shared layout for all pages of the app */
export default function Layout() {
  return (
    <>
      <main>
        <Navbar />
        <Outlet />
      </main>
    </>
  );
}
