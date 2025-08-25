import React, { useEffect, useState } from "react";
import revenueImg from "../../assets/icons/dollar.png";
import "../../styles/ui/report.css";
import axiosInstance from "../../utils/axiosInterceptor";


const RevenueCard = () => {
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [lastRevenue, setLastRevenue] = useState(0);

  const fetchRevenue = async () => {
    try {
      const res = await axiosInstance.get("/transactions/monthly-revenue");
      setCurrentRevenue(res.data.currentMonthRevenue || 0);
      setLastRevenue(res.data.lastMonthRevenue || 0);
    } catch (error) {
      console.error("Error fetching revenue:", error);
    }
  };

  useEffect(() => {
    fetchRevenue(); // Initial fetch

    const interval = setInterval(() => {
      fetchRevenue(); // Refresh every 10 seconds
    }, 10000);

    return () => clearInterval(interval); // Cleanup
  }, []);

  const getPercentageChange = () => {
    if (lastRevenue === 0) return currentRevenue === 0 ? 0 : 100;
    return ((currentRevenue - lastRevenue) / lastRevenue) * 100;
  };

  const percentageChange = getPercentageChange();
  const isPositive = percentageChange >= 0;

  return (
    <div className="report-card d-flex justify-content-between align-items-center">
      <div>
        <div className="report-title">Revenue</div>
        <div className="report-value">₹{currentRevenue.toLocaleString("en-IN")}</div>
        <div className={`report-subtext ${isPositive ? "text-success" : "text-danger"}`}>
          {isPositive ? "↑" : "↓"} {Math.abs(percentageChange).toFixed(1)}%{" "}
          {isPositive ? "Up" : "Down"} from last month
        </div>
      </div>
      <img src={revenueImg} alt="Revenue" className="report-img" />
    </div>
  );
};

export default RevenueCard;
