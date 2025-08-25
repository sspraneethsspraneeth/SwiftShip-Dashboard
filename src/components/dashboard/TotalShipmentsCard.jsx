import React, { useEffect, useState } from "react";
import "../../styles/ui/dashboard/DashboardPage.css";
import truckBlue from "../../assets/icons/truck.png";
import greenArrow from "../../assets/icons/green-arrow.png";
import axiosInstance from "../../utils/axiosInterceptor";



const TotalShipmentsCard = () => {
  const [total, setTotal] = useState(0);
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axiosInstance.get("/shipment/metrics");
        setTotal(res.data.total);
        setGrowth(res.data.monthGrowth);
      } catch (error) {
        console.error("Error fetching shipment metrics:", error);
      }
    };

    fetchMetrics(); // Initial fetch

    const interval = setInterval(fetchMetrics, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="stat-card">
      <div className="stat-left">
        <span className="stat-title">Total Shipments</span>
        <span className="stat-value">{total}</span>
        <span className="stat-change positive">
          <img src={greenArrow} alt="Up Arrow" className="stat-arrow-icon" />
          +{growth}% <span className="stat-month">from last month</span>
        </span>
      </div>
      <div className="stat-icon">
        <img src={truckBlue} alt="Total Shipments" />
      </div>
    </div>
  );
};

export default TotalShipmentsCard;
