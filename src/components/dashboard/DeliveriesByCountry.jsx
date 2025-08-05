import React, { useState } from "react";
import worldMapImage from "../../assets/world 1.png";
import arrowIcon from "../../assets/icons/down-arrow.png";
import "../../styles/ui/dashboard/DashboardPage.css";

const regionFilter = {
  Asia: ["CHN", "IND", "IDN"],
  America: ["USA", "BRA"],
  Africa: ["NGA", "COD"],
  Europe: ["RUS"],
};

const DeliveriesByCountry = () => {
  const [region, setRegion] = useState("Asia");

  return (
    <div className="deliveries-container">
      <div className="card-body d-flex flex-column h-100 p-0">
        {/* Header with Title and Dropdown */}
        <div className="deliveries-header d-flex justify-content-between align-items-center px-3 pt-3">
          <h2 className="deliveries-title mb-0">Deliveries by Country</h2>
          <div className="deliveries-select-wrapper position-relative" style={{ width: "66px" }}>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="form-select form-select-sm"
              aria-label="Select region"
              style={{ borderRadius: "10px", paddingRight: "30px" }}
            >
              {Object.keys(regionFilter).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <img
              src={arrowIcon}
              alt="Dropdown Arrow"
              className="select-arrow-icon position-absolute"
              style={{
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                width: "12px",
                height: "12px",
              }}
            />
          </div>
        </div>

        {/* Map Content */}
        <div className="deliveries-map-container flex-grow-1 px-3 pb-3" style={{ position: "relative" }}>
          <img
            src={worldMapImage}
            alt="World Map showing deliveries"
            className="w-100 h-100"
            style={{
              objectFit: "contain",
              borderRadius: "0.5rem",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveriesByCountry;
