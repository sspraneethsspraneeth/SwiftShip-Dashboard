// src/components/reports/TotalShipmentsCard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import shipmentImg from "../../assets/icons/truck.png";
import "../../styles/ui/report.css";
import BASE_URL from "../../utils/apiConfig";


const TotalShipmentsCard = () => {
  const [totalShipments, setTotalShipments] = useState(0);
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    const fetchShipmentMetrics = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/shipment/metrics`);
        setTotalShipments(response.data.total || 0);
        setGrowth(response.data.monthGrowth || 0);
      } catch (error) {
        console.error("Failed to fetch shipment metrics:", error);
      }
    };

    fetchShipmentMetrics(); // Initial call

    const intervalId = setInterval(fetchShipmentMetrics, 10000); // Repeat every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const isPositive = growth >= 0;

  return (
    <div className="report-card d-flex justify-content-between align-items-center">
      <div>
        <div className="report-title">Total Shipments</div>
        <div className="report-value">{totalShipments}</div>
        <div className={`report-subtext ${isPositive ? "text-success" : "text-danger"}`}>
          {isPositive ? "↑" : "↓"} {Math.abs(growth)}% {isPositive ? "up" : "down"} from last month
        </div>
      </div>
      <img src={shipmentImg} alt="Shipments" className="report-img" />
    </div>
  );
};

export default TotalShipmentsCard;
