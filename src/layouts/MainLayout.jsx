import React from "react";
import { Outlet } from "react-router-dom";
const Sidebar = React.lazy(() => import("./Sidebar"));
const Header = React.lazy(() => import("./Header"));

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-sky-100 to-cyan-100 p-3 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex" style={{ minHeight: "95vh" }}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

