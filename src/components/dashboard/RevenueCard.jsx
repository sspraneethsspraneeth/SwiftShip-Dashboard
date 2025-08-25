import React, { useEffect, useState } from "react";
import "../../styles/ui/dashboard/DashboardPage.css";
import dollarGreen from "../../assets/icons/dollar.png";
import greenArrow from "../../assets/icons/green-arrow.png";
import axiosInstance from "../../utils/axiosInterceptor";


const RevenueCard = () => {
  const [revenue, setRevenue] = useState(0);
  const [percentChange, setPercentChange] = useState(0);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const res = await axiosInstance.get("/transactions/monthly-revenue");
        const current = res.data.currentMonthRevenue || 0;
        const last = res.data.lastMonthRevenue || 0;

        setRevenue(current);

        if (last === 0) {
          setPercentChange(current > 0 ? 100 : 0);
        } else {
          const change = ((current - last) / last) * 100;
          setPercentChange(change.toFixed(1));
        }
      } catch (err) {
        console.error("Failed to fetch revenue:", err);
      }
    };

    fetchMonthlyRevenue(); // Initial fetch

    const interval = setInterval(fetchMonthlyRevenue, 10000); // Auto-refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const formatRupees = (amount) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="stat-card">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="stat-left">
          <span className="stat-title">Revenue</span>
          <span className="stat-value">{formatRupees(revenue)}</span>
          <span className={`stat-change ${percentChange >= 0 ? "positive" : "negative"}`}>
            <img
              src={greenArrow}
              alt="Arrow"
              className="stat-arrow-icon"
              style={{
                transform: percentChange < 0 ? "rotate(180deg)" : "none",
              }}
            />
            {percentChange}% <span className="stat-month">from last month</span>
          </span>
        </div>
        <div className="stat-icon" style={{ backgroundColor: "#d5f5e3" }}>
          <img src={dollarGreen} alt="Revenue" />
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
