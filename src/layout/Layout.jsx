// import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

/** The shared layout for all pages of the app */
export default function Layout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}
