import React, { useEffect, useState } from "react";
import "../../styles/ui/dashboard/DashboardPage.css";
import boxOrange from "../../assets/icons/boxex.png";
import greenArrow from "../../assets/icons/green-arrow.png";
import redArrow from "../../assets/icons/red-arrow.png";
import axiosInstance from "../../utils/axiosInterceptor";



const PendingDeliveriesCard = () => {
  const [total, setTotal] = useState(0);
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/deliveries/stats");
        setTotal(res.data.totalPendingDeliveries);
        setGrowth(res.data.growth);
      } catch (error) {
        console.error("Error fetching delivery stats:", error);
      }
    };

    fetchStats(); // Initial fetch

    const interval = setInterval(fetchStats, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const isPositive = growth >= 0;
  const arrowIcon = isPositive ? greenArrow : redArrow;
  const growthClass = isPositive ? "stat-change positive" : "stat-change negative";
  const growthText = `${isPositive ? "+" : ""}${growth.toFixed(1)}%`;

  return (
    <div className="stat-card">
      <div className="stat-left">
        <span className="stat-title">Pending Deliveries</span>
        <span className="stat-value">{total.toLocaleString()}</span>
        <span className={growthClass}>
          <img src={arrowIcon} alt="Arrow" className="stat-arrow-icon" />
          {growthText} <span className="stat-month">from last month</span>
        </span>
      </div>
      <div className="stat-icon" style={{ backgroundColor: "#ffe8db" }}>
        <img src={boxOrange} alt="Pending Deliveries" />
      </div>
    </div>
  );
};

export default PendingDeliveriesCard;
