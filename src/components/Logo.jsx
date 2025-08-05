import React from "react";
import logo from "../assets/logo.png";
import "../styles/ui/logo.css";



const Logo = () => {
  return (
    <div className="logo-wrapper">
      <div className="logo-container">
        <img src={logo} alt="Swift Ship" className="logo" />
        <h2 className="brand-name">Swift Ship</h2>
      </div>
    </div>
  );
};

export default Logo;
