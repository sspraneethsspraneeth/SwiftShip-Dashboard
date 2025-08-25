import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import MaintenanceChart from "../../components/fleet/MaintenanceChart";
import InsuranceChart from "../../components/fleet/InsuranceChart";
import AddVehicleModal from "../../components/fleet/AddVehicleModal";

import "../../styles/ui/FleetPage.css";
import axiosInstance from "../../utils/axiosInterceptor"; // ✅ use axiosInstance


const VehicleDetailsPage = () => {
  const { id } = useParams();    
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const res = await axiosInstance.get(`/fleet/${id}`);
        setVehicle(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!vehicle) return <div className="text-center mt-5">Vehicle not found.</div>;

  return (
    <div className="container-fluid" style={{ padding: "2rem" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
        <h2 className="fw-bold mb-2 mb-md-0">Vehicle Details</h2>
        <button className="btn btn-primary fleet-add-btn" onClick={handleShow}>
          Add New Vehicle
        </button>
      </div>

      {/* Vehicle Info */}
      <div className="d-flex flex-wrap gap-4 mb-4">
        <div className="info-box">
          Vehicle ID: <span className="text-warning fw-semibold">{vehicle.vehicleId}</span>
        </div>
        <div className="info-box">
          Vehicle Type:{" "}
          <span className="badge bg-primary">
            {vehicle.vehicleType?.toUpperCase()}
          </span>
        </div>
        <div className="info-box">
          Insurance Policy Number:{" "}
          <a href="#" className="text-primary fw-semibold text-decoration-none">
            {vehicle.insuranceNumber || "N/A"}
          </a>
        </div>
        <div className="info-box">
          Insurance Company: {vehicle.insuranceCompany || "N/A"}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-4 mb-4">
        <div className="info-box">
          Registration Number: {vehicle.registrationNumber || "N/A"}
        </div>
        <div className="info-box">Capacity: {vehicle.capacity || "N/A"}</div>
        <div className="info-box">
          Base Location: {vehicle.baseLocation || "N/A"}
        </div>
        <div className="info-box">
          Driver Assigned: {vehicle.driverId?.fullName || "N/A"}
        </div>
        <div className="info-box">
          Status:{" "}
          <span
            className={`badge ${
              vehicle.status === "Active"
                ? "bg-success"
                : vehicle.status === "Inactive"
                ? "bg-danger"
                : vehicle.status === "Maintenance"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {vehicle.status}
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mt-1">
        <div className="col-lg-8">
          <div
            className="card shadow-sm p-3 h-100"
            style={{ borderRadius: "12px", minHeight: "300px" }}
          >
            <MaintenanceChart />
          </div>
        </div>
        <div className="col-lg-4">
          <div
            className="card shadow-sm p-3 h-100"
            style={{ borderRadius: "12px", minHeight: "300px" }}
          >
            <InsuranceChart />
          </div>
        </div>
      </div>

      <AddVehicleModal show={showModal} handleClose={handleClose} />
    </div>
  );
};

export default VehicleDetailsPage;
