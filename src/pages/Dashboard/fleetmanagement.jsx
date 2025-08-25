import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import TotalVehiclesCard from "../../components/fleet/TotalVehiclesCard";
import ActiveVehiclesCard from "../../components/fleet/ActiveVehiclesCard";
import InactiveVehiclesCard from "../../components/fleet/InactiveVehiclesCard";
import MaintenanceCard from "../../components/fleet/MaintenanceCard";
import AddVehicleModal from "../../components/fleet/AddVehicleModal";

import searchIcon from "../../assets/icons/icon.png";

import "../../styles/ui/FleetPage.css";
import "../../styles/ui/FleetCards.css";
import axiosInstance from "../../utils/axiosInterceptor";


const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Active":
      return "bg-success";
    case "Inactive":
      return "bg-danger";
    case "Maintenance":
      return "bg-warning text-dark";
    case "Present":
      return "bg-info";
    default:
      return "bg-secondary";
  }
};

const getTypeBadgeClass = (type) => {
  return type === "TRUCK"
    ? "badge bg-primary text-primaryy"
    : "badge bg-warning-subtle text-warning";
};

const FleetManagementPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [fleetData, setFleetData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
  const fetchFleetData = async () => {
    try {
      const res = await axiosInstance.get("/fleet/all");
      setFleetData(res.data);
    } catch (err) {
      console.error("Error fetching fleet data:", err);
    }
  };
  fetchFleetData();
}, []);

  const filteredData = fleetData.filter((vehicle) =>
    vehicle.vehicleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.driverId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fleet-page">
      <div className="container-fluid px-0">

        {/* Search + Add Button */}
        <div className="row align-items-center mb-4 px-2">
          <div className="col-md-6 col-sm-12 mb-2 mb-md-0">
            <div className="input-group fleet-search-group w-75">
              <input
                type="text"
                className="form-control fleet-search-input"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="input-group-text search-icon-wrapper">
                <img src={searchIcon} alt="Search" className="search-icon" />
              </span>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 text-md-end text-sm-start">
            <button className="btn btn-primary fleet-add-btn" onClick={handleShow}>
              Add New Vehicle
            </button>
          </div>
        </div>

        {/* Stat Cards Row */}
        <div className="row gx-4 gy-4 mb-4">
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <TotalVehiclesCard />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <ActiveVehiclesCard />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <InactiveVehiclesCard />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <MaintenanceCard />
          </div>
        </div>

        {/* Table Section */}
        <div className="fleet-table-container px-2">
          <h5 className="fw-bold mb-3">All Fleet List</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Vehicle ID</th>
                  <th>Vehicle Type</th>
                  <th>Driver Name</th>
                  <th>Insurance Number</th>
                  <th>Current Location</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((vehicle, idx) => (
                  <tr
                    key={vehicle._id}
                    onClick={() => navigate(`/dashboard/fleetmanagement/${vehicle._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td><input type="checkbox" /></td>
                    <td className="text-primary fw-semibold">{vehicle.vehicleId}</td>
                    <td>
                      <span className={getTypeBadgeClass(vehicle.vehicleType)}>
                        {vehicle.vehicleType}
                      </span>
                    </td>
                    <td>{vehicle.driverId?.fullName || "N/A"}</td>
                    <td>
                      <a href="#" className="text-primaryy text-decoration-none">
                        {vehicle.insuranceNumber}
                      </a>
                    </td>
                    <td className="text-muted">{vehicle.baseLocation}</td>
                    <td className="text-muted">
                      {vehicle.lastUpdated
                        ? new Date(vehicle.lastUpdated).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusBadgeClass(vehicle.status)}`}
                        style={{
                          width: "100px",
                          display: "inline-block",
                          textAlign: "center",
                          borderRadius: "0.25rem"
                        }}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                    <td><button className="btn btn-light btn-sm">⋯</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <AddVehicleModal show={showModal} handleClose={handleClose} />
    </div>
  );
};

export default FleetManagementPage;
