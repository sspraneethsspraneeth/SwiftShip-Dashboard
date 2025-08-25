import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import "../styles/ui/auth.css";

import logo from "../assets/logo.png";
import googleIcon from "../assets/google-color-icon.svg";
import rightSideImage from "../assets/bg1.png";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/lockicon.png";
import eyeShowIcon from "../assets/eyeopen.png";
import eyeHideIcon from "../assets/eyeopen.png"; // Use correct closed-eye icon here

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInterceptor";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isStrongPassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const handleRegister = async () => {
    setError("");

    if (!email || !password) {
      const msg = "Please enter both email and password.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!isValidEmail(email)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!isStrongPassword(password)) {
      const msg =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      // ✅ Use axiosInstance instead of fetch
      const { data } = await axiosInstance.post("/request-code", {
        email,
        source: "register",
      });

      if (data.message === "User already exists") {
        toast.info("User already exists. Please log in instead.", {
          onClose: () => navigate("/login"),
          autoClose: 3000,
        });
        return;
      }

      toast.success("Verification code sent to your email!", {
        onClose: () =>
          navigate("/verification", {
            state: { email, password, source: "register" },
          }),
        autoClose: 3000,
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Error sending verification code";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="authh-form-container">
        <img src={logo} alt="Logo" className="auth-logo" />
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">
          Sign up now to gain access to member-only discounts and personalized
          recommendations.
        </p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="auth-input-group">
            <img src={emailIcon} alt="Email" className="auth-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              disabled={loading}
            />
          </div>

          <div className="auth-input-group">
            <img src={passwordIcon} alt="Password" className="auth-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              disabled={loading}
            />
            <img
              src={showPassword ? eyeHideIcon : eyeShowIcon}
              alt={showPassword ? "Hide Password" : "Show Password"}
              className="auth-eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Password strength guidance */}
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

          {/* Error message */}
          {error && (
            <p style={{ color: "red", fontSize: "0.85rem", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <label className="auth-agreement-label">
            <input type="checkbox" required disabled={loading} />
            By clicking the Register button, you agree to the public offer.
          </label>

          <Button onClick={handleRegister} className="auth-button" disabled={loading}>
            {loading ? "Sending Code..." : "Sign Up"}
          </Button>

          <div className="auth-divider">Or continue with</div>

          <button className="auth-google-button" type="button" disabled={loading}>
            <span className="auth-google-icon-wrapper">
              <img src={googleIcon} alt="Google" className="auth-google-icon" />
            </span>
            Continue With Google
          </button>

          <div className="auth-signup-link">
            Already have an account? <a href="/">Log in</a>
          </div>
        </form>
      </div>

      <img src={rightSideImage} alt="Transportation" className="authh-right-image" />
    </div>
  );
};

export default RegisterPage;
