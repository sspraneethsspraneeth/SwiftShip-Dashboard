import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import "../styles/ui/auth.css";

import logo from "../assets/logo1.png";
import rightSideImage from "../assets/bg6.png";

const CongratulationsPage = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/"); // Navigate to the dashboard or home page
  };

  return (
    <div className="auth-container container">
      {/* LEFT: Form container */}
      <div className="auth-form-container">
        <img src={logo} alt="Logo" className="aauth-logo" />
        <h2 className="auth-title">Congratulations</h2>
        <p className="aaaauth-subtitle">
          Your account is ready to use
        </p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {/* Continue Button */}
          <Button onClick={handleRegister} className="aauth-button">
            Continue
          </Button>
        </form>
      </div>

      {/* RIGHT: Image */}
      <img
        src={rightSideImage}
        alt="Transportation"
        className="auth-right-image"
      />
    </div>
  );
};

export default CongratulationsPage;
