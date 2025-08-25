import React, { useEffect, useState } from "react";
import inactiveTruck from "../../assets/icons/truck-tick.png";
import "../../styles/ui/FleetCards.css";
import axiosInstance from "../../utils/axiosInterceptor";


const InactiveVehiclesCard = () => {
  const [inactiveCount, setInactiveCount] = useState(0);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axiosInstance.get("/fleet/all");
        const vehicles = response.data || [];

        // Filter only inactive vehicles
        const inactiveVehicles = vehicles.filter(
          (vehicle) => vehicle.status?.toLowerCase() === "inactive"
        );
        setInactiveCount(inactiveVehicles.length);
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
          <span className="stat-title">Inactive Vehicles</span>
          <span className="stat-value">{inactiveCount}</span>
        </div>
        <div className="stat-icon" style={{ backgroundColor: "#FDEDEC" }}>
          <img src={inactiveTruck} alt="Inactive Vehicles" />
        </div>
      </div>
    </div>
  );
};

export default InactiveVehiclesCard;
