import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import "../styles/ui/Topbar.css";

import globeIcon from "../assets/icons/us.png";
import bellIcon from "../assets/icons/bell.png";
import defaultAvatar from "../assets/icons/default-avatar.png";

import { SOCKET_IO_URL } from "../utils/apiConfig";
import axiosInstance from "../utils/axiosInterceptor";

// Socket.IO connection
const socket = io(SOCKET_IO_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState({ fullName: "User", image: null });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [staffName, setStaffName] = useState(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) i18n.changeLanguage(savedLang);
  }, [i18n]);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem("email");
      if (!email) return;

      try {
        const res = await axiosInstance.get(`/user?email=${email}`);
        setUser({
          fullName: res.data.user.fullName || "User",
          image: res.data.user.image || null,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data);
      setNotificationCount(res.data.length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Socket.IO new notifications
  useEffect(() => {
    socket.on("new-notification", ({ notification }) => {
      setNotifications((prev) => [notification, ...prev]);
      setNotificationCount((prev) => prev + 1);
    });
    return () => {
      socket.off("new-notification");
    };
  }, []);

  const handleClearAll = async () => {
    try {
      await axiosInstance.delete("/notifications/clear-all");
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
    try {
      await axiosInstance.post("/logout");
    } catch (err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const getPageTitle = (path) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return t("dashboard");

    if (segments[0] === "dashboard") {
      if (segments.length === 1) return t("dashboard");
      if (segments[1] === "shipments" && segments.length === 3) {
        return `${t("dashboard")} > ${t("shipmentDetails")}`;
      }
      if (segments[1] === "staff" && segments.length === 2) {
        return `${t("dashboard")} > ${t("staff")}`;
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

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <header className="topbar">
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="page-title-container d-flex align-items-center justify-content-center">
          <h1 className="page-title">
            {pageTitle}{" "}
            {staffName && <span className="page-title">({staffName})</span>}
          </h1>
        </div>

        <div className="topbar-right d-flex align-items-center gap-4">
          {/* Language Selector */}
          <div className="language d-flex align-items-center gap-2">
            <img src={globeIcon} alt="Language" className="language-icon" />
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="language-select"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="notification position-relative">
            <img
              src={bellIcon}
              alt={t("notifications")}
              className="bell-icon"
              style={{ cursor: "pointer" }}
              onClick={handleBellClick}
            />
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
                {notifications.length > 0 && (
                  <div className="d-flex justify-content-end mb-2">
                    <button
                      onClick={handleClearAll}
                      className="btn btn-sm btn-outline-danger"
                      style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                    >
                      {t("clearAll")}
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
                  <p>{t("noNotifications")}</p>
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
                  {t("logout")}
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
