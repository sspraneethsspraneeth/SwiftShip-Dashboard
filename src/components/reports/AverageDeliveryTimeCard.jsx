// src/components/reports/AvgDeliveryTimeCard.jsx
import React from "react";
import timeImg from "../../assets/icons/timer.png";
import "../../styles/ui/report.css";

const AvgDeliveryTimeCard = () => {
  return (
    <div className="report-card d-flex justify-content-between align-items-center">
      <div>
        <div className="report-title">Average Delivery Time</div>
        <div className="report-value">3 Days</div>
        <div className="report-subtext text-success">↑ 15% from last month</div>
      </div>
      <img src={timeImg} alt="Delivery Time" className="report-img" />
    </div>
  );
};

export default AvgDeliveryTimeCard;
