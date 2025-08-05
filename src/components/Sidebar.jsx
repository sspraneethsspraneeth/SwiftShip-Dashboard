import React from "react";
import { NavLink } from "react-router-dom";

// Sidebar Icons
import dashboardIcon from "../assets/icons/dashboard.png";
import shipmentsIcon from "../assets/icons/shipments.png";
import routeIcon from "../assets/icons/route.png";
import staffIcon from "../assets/icons/staff.png";
import ordersIcon from "../assets/icons/orders.png";
import customersIcon from "../assets/icons/customers.png";
import deliveriesIcon from "../assets/icons/deliveries.png";
import reportsIcon from "../assets/icons/reports.png";
import settingsIcon from "../assets/icons/settings.png";
import Wherehouse from "../assets/icons/Wherehouse.png";
import Transaction from "../assets/icons/transaction.png";
import Truck from "../assets/icons/truck-fast.png";
import "../styles/ui/Sidebar.css";

const Sidebar = () => {
  const getActiveClass = ({ isActive }) =>
    isActive ? "menu-item active nav-link" : "menu-item nav-link";

  return (
    <div className="sidebar bg-white position-fixed top-0 start-0 h-100 shadow-sm pt-4">
      <nav className="menu d-flex flex-column px-3 gap-2">
        <NavLink to="/dashboard" end className={getActiveClass} aria-label="Dashboard">
          <img src={dashboardIcon} alt="Dashboard" className="menu-icon" />
          <span className="text">Dashboard</span>
        </NavLink>

        <NavLink to="/dashboard/shipments" className={getActiveClass}>
          <img src={shipmentsIcon} alt="Shipments" className="menu-icon" />
          <span className="text">Shipments</span>
        </NavLink>

        <NavLink to="/dashboard/route-planning" className={getActiveClass}>
          <img src={routeIcon} alt="Route Planning" className="menu-icon" />
          <span className="text">Route Planning</span>
        </NavLink>

        <NavLink to="/dashboard/staff" className={getActiveClass}>
          <img src={staffIcon} alt="Staff" className="menu-icon" />
          <span className="text">Staff Management</span>
        </NavLink>

        <NavLink to="/dashboard/fleetmanagement" className={getActiveClass}>
          <img src={Truck} alt="fleetmanagement" className="menu-icon" />
          <span className="text">Fleet Management</span>
        </NavLink>

        <NavLink to="/dashboard/orders" className={getActiveClass}>
          <img src={ordersIcon} alt="Orders" className="menu-icon" />
          <span className="text">Order Management</span>
        </NavLink>

        <NavLink to="/dashboard/customers" className={getActiveClass}>
          <img src={customersIcon} alt="Customers" className="menu-icon" />
          <span className="text">Customers</span>
        </NavLink>

        <NavLink to="/dashboard/deliveries" className={getActiveClass}>
          <img src={deliveriesIcon} alt="Deliveries" className="menu-icon" />
          <span className="text">Deliveries</span>
        </NavLink>

        <NavLink to="/dashboard/reports" className={getActiveClass}>
          <img src={reportsIcon} alt="Reports" className="menu-icon" />
          <span className="text">Reports</span>
        </NavLink>

        <NavLink to="/dashboard/Wherehouse" className={getActiveClass}>
          <img src={Wherehouse} alt="Wherehouse" className="menu-icon" />
          <span className="text">Werehouse</span>
        </NavLink>
        <NavLink to="/dashboard/transaction" className={getActiveClass}>
          <img src={Transaction} alt="Transaction" className="menu-icon" />
          <span className="text">Transaction</span>
        </NavLink>

        <NavLink to="/dashboard/settings" className={getActiveClass}>
          <img src={settingsIcon} alt="Settings" className="menu-icon" />
          <span className="text">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
