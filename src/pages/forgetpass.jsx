import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import "../styles/ui/auth.css";

import logo from "../assets/logo.png";
import rightSideImage from "../assets/bg3.png";
import emailIcon from "../assets/email.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../utils/apiConfig";


const ForgetPassPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/request-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success toast and navigate after it's closed
        toast.success("Verification code sent to your email!", {
          onClose: () => {
            navigate("/verification", {
              state: { email, source: "forgot" },
            });
          },
          autoClose: 3000, // close after 3 seconds
        });
      } else {
        toast.error(data.message || "Email not found or failed to send code.");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container container">
      <div className="auth-form-container">
        <img src={logo} alt="Logo" className="auth-logo" />
        <h2 className="auth-title">Forget Password</h2>
        <p className="auth-subtitle">
          Select which contact details should we use to reset your password
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

          <Button
            onClick={handleRegister}
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Sending code..." : "Continue"}
          </Button>
        </form>
      </div>

      <img
        src={rightSideImage}
        alt="Transportation"
        className="auth-right-image"
      />

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default ForgetPassPage;
