import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../styles/ui/Topbar.css";
import globeIcon from "../assets/icons/us.png";
import bellIcon from "../assets/icons/bell.png";
import defaultAvatar from "../assets/icons/default-avatar.png";
import BASE_URL from "../utils/apiConfig";

// Connect to Socket.IO backend (adjust URL/port as needed)
const socket = io(BASE_URL);

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({ fullName: "User", image: null });
  const [language, setLanguage] = useState("en");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [staffName, setStaffName] = useState(null);

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Notification count badge state
  const [notificationCount, setNotificationCount] = useState(0);

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
          headers: { Authorization: `Bearer ${token}` },
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

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoadingNotifications(true);
      const res = await fetch(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data);
        setNotificationCount(data.length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // On mount fetch notifications once
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Socket.IO: Listen for new notifications for instant update
  useEffect(() => {
    socket.on("new-notification", ({ notification }) => {
      console.log("Received new notification", notification);
  console.log("Notification count from server:", count);
  setNotifications(prev => [notification, ...prev]);
  setNotificationCount(prev => prev + 1);
});


    return () => {
      socket.off("new-notification");
    };
  }, []);

  // Clear all notifications
  const handleClearAll = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/notifications/clear-all`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
      setNotificationCount(0);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
    const isStaffDetailPage =
      location.pathname.startsWith("/dashboard/staff/") &&
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
            {pageTitle}{" "}
            {staffName && <span className="page-title">({staffName})</span>}
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
          <div className="notification position-relative">
            <img
              src={bellIcon}
              alt="Notifications"
              className="bell-icon"
              style={{ cursor: "pointer" }}
              onClick={handleBellClick}
            />
            {/* Notification count badge */}
            {notificationCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle"
                style={{
                  fontSize: "12px",
                  color: "#f31212ff",
                  padding: 0,
                  backgroundColor: "transparent",
                  fontWeight: "bold",
                  pointerEvents: "none",
                  transform: "translate(-20%, -50%)",
                }}
              >
                {notificationCount}
              </span>
            )}

            {showNotifications && (
              <div
                className="notification-dropdown position-absolute bg-white shadow p-2 rounded"
                style={{
                  top: "120%",
                  right: 0,
                  width: "240px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  zIndex: 999,
                  fontSize: "0.85rem",
                }}
              >
                {/* Clear All Button */}
                {notifications.length > 0 && (
                  <div className="d-flex justify-content-end mb-2">
                    <button
                      onClick={handleClearAll}
                      className="btn btn-sm btn-outline-danger"
                      style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                    >
                      Clear All
                    </button>
                  </div>
                )}

                {loadingNotifications ? (
                  <p>Loading...</p>
                ) : notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className="notification-item p-2 mb-1 border-bottom"
                      style={{
                        background: n.isRead ? "#f9f9f9" : "#eaf4ff",
                        cursor: "pointer",
                      }}
                    >
                      <strong style={{ display: "block", fontSize: "0.9rem" }}>
                        {n.userId?.fullName || "Unknown User"}
                      </strong>

                      <span style={{ display: "block", fontWeight: 500 }}>
                        {n.title}
                      </span>

                      <small className="text-muted">
                        {new Date(n.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p>No notifications</p>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
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

            {showUserMenu && (
              <div
                className="user-dropdown position-absolute bg-white shadow p-2 rounded"
                style={{ top: "100%", right: 0, zIndex: 999, minWidth: "120px" }}
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
