import React, { useEffect, useState } from "react";
import truckIcon from "../../assets/icons/truck.png";
import "../../styles/ui/FleetCards.css";
import axiosInstance from "../../utils/axiosInterceptor";



const TotalVehiclesCard = () => {
  const [totalVehicles, setTotalVehicles] = useState(0);

  useEffect(() => {
    const fetchVehicleCount = async () => {
      try {
        const res = await axiosInstance.get("/fleet/all");
        setTotalVehicles(res.data.length); // Count of vehicles
      } catch (err) {
        console.error("Failed to fetch vehicle count:", err);
      }
    };

    fetchVehicleCount();
  }, []);

  return (
    <div className="stat-card">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="stat-left">
          <span className="stat-title">Total Vehicles</span>
          <span className="stat-value">{totalVehicles}</span>
        </div>
        <div className="stat-icon" style={{ backgroundColor: "#EAF3FF" }}>
          <img src={truckIcon} alt="Total Vehicles" />
        </div>
      </div>
    </div>
  );
};

export default TotalVehiclesCard;
