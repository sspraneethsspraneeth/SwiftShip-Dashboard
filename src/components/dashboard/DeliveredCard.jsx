import React, { useEffect, useState } from "react";
import "../../styles/ui/dashboard/DashboardPage.css";
import truckPink from "../../assets/icons/checkmark.png";
import greenArrow from "../../assets/icons/green-arrow.png";
import redArrow from "../../assets/icons/red-arrow.png";
import axiosInstance from "../../utils/axiosInterceptor";



const DeliveredCard = () => {
  const [total, setTotal] = useState(0);
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/deliveries/delivered-stats");

        setTotal(res.data.totalDelivered);
        setGrowth(res.data.growth);
      } catch (error) {
        console.error("Error fetching delivered stats:", error);
      }
    };

    fetchStats(); // Initial fetch

    const interval = setInterval(fetchStats, 10000); // Auto-refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const isPositive = growth >= 0;
  const arrowIcon = isPositive ? greenArrow : redArrow;
  const growthClass = isPositive ? "stat-change positive" : "stat-change negative";
  const growthText = `${isPositive ? "+" : ""}${growth.toFixed(1)}%`;

  return (
    <div className="stat-card">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="stat-left">
          <span className="stat-title">Delivered</span>
          <span className="stat-value">{total.toLocaleString()}</span>
          <span className={growthClass}>
            <img src={arrowIcon} alt="Arrow" className="stat-arrow-icon" />
            {growthText} <span className="stat-month">from last month</span>
          </span>
        </div>
        <div className="stat-icon" style={{ backgroundColor: "#fbe7f4" }}>
          <img src={truckPink} alt="Delivered" />
        </div>
      </div>
    </div>
  );
};

export default DeliveredCard;
