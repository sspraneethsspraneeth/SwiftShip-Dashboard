import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import "../styles/ui/auth.css";

import logo from "../assets/logo.png";
import rightSideImage from "../assets/bg4.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInterceptor";


const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, password, source = "register" } = location.state || {};

  useEffect(() => {
    if (!email || (source === "register" && !password)) {
      toast.error(
        source === "register"
          ? "Missing registration info. Please register again."
          : "Missing email info. Please enter your email again.",
        {
          onClose: () => {
            navigate(source === "register" ? "/register" : "/forget-password");
          },
          autoClose: 3000,
        }
      );
    }
  }, [email, password, source, navigate]);

  const [code, setCode] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleBoxChange = (e, index) => {
    const val = e.target.value.toUpperCase();
    if (/^[A-Z0-9]?$/.test(val)) {
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);

      if (val && index < 4) {
        const nextInput = document.getElementById(`code-box-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = [...code];

      if (code[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        const prevInput = document.getElementById(`code-box-${index - 1}`);
        if (prevInput) prevInput.focus();
        newCode[index - 1] = "";
        setCode(newCode);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const fullCode = code.join("");
    if (fullCode.length !== 5) {
      toast.error("Please enter the full 5-character verification code.");
      return;
    }

    setLoading(true);
    try {
      if (source === "register") {
        const { data } = await axiosInstance.post("/register", {
          email,
          password,
          code: fullCode,
        });

        if (data.message === "User already exists") {
          toast.info("User already exists. Redirecting to login.", {
            onClose: () => navigate("/login"),
            autoClose: 3000,
          });
        } else {
          toast.success("Registration successful! Please log in.", {
            onClose: () => navigate("/login"),
            autoClose: 3000,
          });
        }
      } else if (source === "forgot") {
        const { data } = await axiosInstance.post("/verify-code", {
          email,
          code: fullCode,
        });

        toast.success("Code verified! Please set your new password.", {
          onClose: () => navigate("/newpass", { state: { email } }),
          autoClose: 3000,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Verification failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container container">
      <div className="auth-form-container">
        <img src={logo} alt="Logo" className="auth-logo" />
        <h2 className="auth-title">Enter Verification Code</h2>
        <p className="auth-subtitle">
          We have sent the verification code to your email.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <div className="input-boxes">
              {code.map((char, idx) => (
                <input
                  key={idx}
                  id={`code-box-${idx}`}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleBoxChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="code-box"
                  autoFocus={idx === 0}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </div>

      <img
        src={rightSideImage}
        alt="Verification Illustration"
        className="auth-right-image"
      />

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default VerificationPage;
