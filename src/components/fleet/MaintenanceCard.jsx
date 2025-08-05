import React, { useEffect, useState } from "react";
import maintenanceIcon from "../../assets/icons/truck-time.png";
import "../../styles/ui/FleetCards.css";
import axios from "axios";
import BASE_URL from "../../utils/apiConfig";


const MaintenanceCard = () => {
  const [maintenanceCount, setMaintenanceCount] = useState(0);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/fleet/all`);
        const vehicles = response.data || [];

        const maintenanceVehicles = vehicles.filter(
          (vehicle) => vehicle.status?.toLowerCase() === "maintenance"
        );
        setMaintenanceCount(maintenanceVehicles.length);
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
          <span className="stat-title">Maintenance</span>
          <span className="stat-value">{maintenanceCount}</span>
        </div>
        <div className="stat-icon" style={{ backgroundColor: "#FFF3E0" }}>
          <img src={maintenanceIcon} alt="Maintenance" />
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCard;
