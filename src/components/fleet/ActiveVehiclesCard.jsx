import React, { useEffect, useState } from "react";
import activeTruck from "../../assets/icons/truckk.png";
import "../../styles/ui/FleetCards.css";
import axiosInstance from "../../utils/axiosInterceptor";



const ActiveVehiclesCard = () => {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axiosInstance.get("/fleet/all");
        const vehicles = response.data || [];

        // Filter only active vehicles
        const activeVehicles = vehicles.filter(vehicle => vehicle.status === "Active");
        setActiveCount(activeVehicles.length);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="stat-card">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="stat-left">
          <span className="stat-title">Active Vehicles</span>
          <span className="stat-value">{activeCount}</span>
        </div>
        <div className="stat-icon" style={{ backgroundColor: "#E2F7ED" }}>
          <img src={activeTruck} alt="Active Vehicles" />
        </div>
      </div>
    </div>
  );
};

export default ActiveVehiclesCard;
