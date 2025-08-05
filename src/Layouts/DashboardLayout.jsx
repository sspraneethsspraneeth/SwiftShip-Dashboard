// DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";


const DashboardLayout = () => {
  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <aside className="bg-light border-end shadow-sm" style={{ width: '280px', flexShrink: 0 }}>
        <div className="d-flex flex-column h-100">
          <Logo />
          <Sidebar />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="w-100 d-flex flex-column">
        {/* Topbar */}
        <header className="bg-white py-3 px-4 border-bottom shadow-sm">
          <Topbar />
        </header>

        {/* Dashboard Page Content */}
        <main className="flex-grow-1 overflow-auto bg-light pt-4 px-4">
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;