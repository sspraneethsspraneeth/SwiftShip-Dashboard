import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ui/Topbar.css";
import globeIcon from "../assets/icons/us.png";
import bellIcon from "../assets/icons/bell.png";
import defaultAvatar from "../assets/icons/default-avatar.png";
import BASE_URL from "../utils/apiConfig";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "User",
    image: null,
  });

  const [language, setLanguage] = useState("en");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [staffName, setStaffName] = useState(null);

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) return;

      try {
        const res = await fetch(`${BASE_URL}/user?email=${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser({
            fullName: data.user.fullName || "User",
            image: data.user.image || null,
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Logout failed", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const getPageTitle = (path) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";

    if (segments[0] === "dashboard") {
      if (segments.length === 1) return "Dashboard";
      if (segments[1] === "shipments" && segments.length === 3) {
        return "Dashboard > Shipment Details";
      }
      if (segments[1] === "staff" && segments.length === 2) {
        return "Dashboard > Staff";
      }

      return `Dashboard > ${segments[1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())}`;
    }

    return segments[segments.length - 1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    const isStaffDetailPage = location.pathname.startsWith("/dashboard/staff/") &&
      location.pathname.split("/").filter(Boolean).length === 3;

    if (isStaffDetailPage && location.state?.staff?.fullName) {
      setStaffName(location.state.staff.fullName);
    } else {
      setStaffName(null);
    }
  }, [location]);

  return (
    <header className="topbar">
      <div className="d-flex align-items-center justify-content-between w-100">
        {/* Page Title */}
        <div className="page-title-container d-flex align-items-center justify-content-center">
          <h1 className="page-title">
            {pageTitle} {staffName && <span className="page-title">({staffName})</span>}
          </h1>
        </div>

        {/* Right Side */}
        <div className="topbar-right d-flex align-items-center gap-4">
          {/* Language Selector */}
          <div className="language d-flex align-items-center gap-2">
            <img src={globeIcon} alt="Language" className="language-icon" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          {/* Notification Icon */}
          <div className="notification">
            <img src={bellIcon} alt="Notifications" className="bell-icon" />
          </div>

          {/* User Profile with Dropdown */}
          <div
            className="user-profile position-relative d-flex align-items-center gap-2"
            onClick={() => setShowUserMenu((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={user.image || defaultAvatar}
              alt="Profile"
              className="profile-avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10%",
                objectFit: "cover",
              }}
            />
            <span>{user.fullName}</span>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div
                className="user-dropdown position-absolute bg-white shadow p-2 rounded"
                style={{
                  top: "100%",
                  right: 0,
                  zIndex: 999,
                  minWidth: "120px",
                }}
              >
                <button
                  className="btn btn-sm btn-outline w-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
