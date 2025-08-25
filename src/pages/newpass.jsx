import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import "../styles/ui/auth.css";

import logo from "../assets/logo.png";
import passwordIcon from "../assets/lockicon.png";
import eyeShowIcon from "../assets/eyeopen.png";
import eyeHideIcon from "../assets/eyeopen.png"; // Replace with actual closed eye icon
import rightSideImage from "../assets/bg5.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInterceptor";


const NewPassPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  const isStrongPassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      toast.error("Email not found. Please restart the reset process.", {
        onClose: () => navigate("/forgetpass"),
        autoClose: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);
    try {
      // ✅ Use axiosInstance instead of fetch
      const { data } = await axiosInstance.post("/reset-password", {
        email,
        newPassword: password,
      });

      toast.success("Password updated successfully!", {
        onClose: () => navigate("/congratulations"),
        autoClose: 3000,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="auth-container container">
      <div className="auth-form-container">
        <img src={logo} alt="Logo" className="auth-logo" />
        <h2 className="auth-title">Enter New Password</h2>
        <p className="auth-subtitle">Please set your new password below</p>

        <form className="auth-form" onSubmit={handleSave}>
          {/* New Password */}
          <div className="auth-input-group">
            <img src={passwordIcon} alt="Password" className="auth-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              disabled={loading}
            />
            <img
              src={showPassword ? eyeHideIcon : eyeShowIcon}
              alt={showPassword ? "Hide" : "Show"}
              className="auth-eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Password strength hints */}
          {password && !isStrongPassword(password) && (
            <ul
              className="password-hints"
              style={{
                color: "#d9534f",
                fontSize: "0.8rem",
                marginTop: "5px",
                marginLeft: "32px",
              }}
            >
              {!/[A-Z]/.test(password) && <li>Must include an uppercase letter</li>}
              {!/[a-z]/.test(password) && <li>Must include a lowercase letter</li>}
              {!/\d/.test(password) && <li>Must include a number</li>}
              {!/[\W_]/.test(password) && <li>Must include a special character</li>}
              {password.length < 8 && <li>Must be at least 8 characters</li>}
            </ul>
          )}

          {/* Confirm Password */}
          <div className="auth-input-group" style={{ marginTop: "20px" }}>
            <img src={passwordIcon} alt="Confirm Password" className="auth-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="auth-input"
              disabled={loading}
            />
            <img
              src={showPassword ? eyeHideIcon : eyeShowIcon}
              alt={showPassword ? "Hide" : "Show"}
              className="auth-eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Error message */}
          {error && (
            <p style={{ color: "red", fontSize: "0.85rem", marginTop: "5px" }}>
              {error}
            </p>
          )}

          <Button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Saving..." : "Save Password"}
          </Button>
        </form>
      </div>

      <img src={rightSideImage} alt="Reset Illustration" className="auth-right-image" />

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default NewPassPage;
