// src/components/reports/TotalDeliveriesCard.jsx
import React, { useEffect, useState } from "react";
import deliveriesImg from "../../assets/icons/boxex.png";
import "../../styles/ui/report.css";
import axiosInstance from "../../utils/axiosInterceptor";



const TotalDeliveriesCard = () => {
  const [totalDelivered, setTotalDelivered] = useState(0);
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    const fetchDeliveredStats = async () => {
      try {
        const response = await axiosInstance.get("/deliveries/delivered-stats");
        const { totalDelivered, growth } = response.data;
        setTotalDelivered(totalDelivered);
        setGrowth(growth);
      } catch (error) {
        console.error("Failed to fetch delivery stats:", error);
      }
    };

    fetchDeliveredStats(); // Initial fetch

    const interval = setInterval(fetchDeliveredStats, 10000); // Auto-refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const isPositive = growth >= 0;
  const growthText = `${isPositive ? "↑" : "↓"} ${Math.abs(growth)}% from last month`;
  const growthClass = isPositive ? "text-success" : "text-danger";

  return (
    <div className="report-card d-flex justify-content-between align-items-center">
      <div>
        <div className="report-title">Total Deliveries</div>
        <div className="report-value">{totalDelivered}</div>
        <div className={`report-subtext ${growthClass}`}>{growthText}</div>
      </div>
      <img src={deliveriesImg} alt="Deliveries" className="report-img" />
    </div>
  );
};

export default TotalDeliveriesCard;
