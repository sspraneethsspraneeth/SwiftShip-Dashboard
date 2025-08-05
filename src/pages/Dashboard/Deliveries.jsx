import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../styles/ui/transaction.css";

const Delivery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedDeliveries, setSelectedDeliveries] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
          await axios.post("http://localhost:5000/api/deliveries/auto-create");

        const res = await axios.get("http://localhost:5000/api/deliveries");

        const updatedDeliveries = await Promise.all(
          res.data.map(async (delivery) => {
            const orders = delivery.orders || [];

            const allDelivered =
              orders.length > 0 &&
              orders.every((order) => order.status === "Delivered");

            const newStatus = allDelivered ? "Delivered" : "Onboarding";

            // Optionally update the backend if status is different
            if (delivery.status !== newStatus) {
              try {
                await axios.put(`http://localhost:5000/api/deliveries/${delivery._id}/status`, {
                  status: newStatus,
                });
              } catch (err) {
                console.warn(`Failed to update status for delivery ${delivery._id}`, err);
              }
            }

            return {
              ...delivery,
              status: newStatus,
            };
          })
        );

        setDeliveries(updatedDeliveries);
      } catch (err) {
        console.error("Failed to fetch deliveries", err);
      }
    };

    fetchDeliveries();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Pending":
        return "warning";
      case "In Transit":
        return "info";
      case "Cancelled":
        return "danger";
      case "Onboarding":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const handleEdit = (item) => {
    const newStaff = prompt("Edit Assigned Staff", item.staff || item.driverName);
    if (newStaff) {
      setDeliveries((prev) =>
        prev.map((d) =>
          d.deliveryId === item.deliveryId ? { ...d, staff: newStaff } : d
        )
      );
    }
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete delivery ${item.deliveryId}?`)) {
      setDeliveries((prev) => prev.filter((d) => d.deliveryId !== item.deliveryId));
      setSelectedDeliveries((prev) =>
        prev.filter((id) => id !== item.deliveryId)
      );
    }
  };

  const filteredShipments = deliveries.filter((shipment) =>
    (shipment.deliveryId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (shipment.shipmentId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (shipment.staff || shipment.driverName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredShipments.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredShipments.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRowClick = (shipment) => {
    navigate(`/dashboard/deliveries/${shipment.deliveryId}`, {
      state: { shipment },
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allCurrentIds = currentRows.map((row) => row.deliveryId);
      setSelectedDeliveries(allCurrentIds);
    } else {
      setSelectedDeliveries([]);
    }
  };

  const handleCheckboxChange = (deliveryId) => {
    setSelectedDeliveries((prev) =>
      prev.includes(deliveryId)
        ? prev.filter((id) => id !== deliveryId)
        : [...prev, deliveryId]
    );
  };

  return (
    <div className="container-fluid shipments-table-section">
      {/* Search */}
      <div className="row align-items-center justify-content-between mb-3">
        <div className="col-md-3">
          <div className="input-group search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="input-group-text">
              <i className="bi bi-search text-success"></i>
            </span>
          </div>
        </div>
      </div>

      {/* Header & Filter */}
      <div className="row mb-3">
        <div className="col-md-6">
          <h4 className="fw-bold shipment-title">All Delivery List</h4>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-end gap-2">
          <label className="fw-medium mb-0">Filter by Delivery Date:</label>
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: "15%" }}
          />
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: "15%" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    currentRows.length > 0 &&
                    selectedDeliveries.length === currentRows.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>Delivery ID</th>
              <th>Shipment ID</th>
              <th>Assigned Staff</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((shipment, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(shipment)}
                style={{ cursor: "pointer" }}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedDeliveries.includes(shipment.deliveryId)}
                    onChange={() => handleCheckboxChange(shipment.deliveryId)}
                  />
                </td>
                <td className="text-orange fw-semibold">{shipment.deliveryId}</td>
                <td>{shipment.shipmentId}</td>
                <td className="text-success">
                  {shipment.staff || shipment.driverName}
                </td>
                <td className="text-success">
                  {shipment.date || shipment.dateShipped || "12.04.2025"}
                </td>
                <td>
                  <span className={`badge bg-${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown">
                    <button
                      className="btn btn-light btn-sm"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      ⋯
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(shipment)}
                        >
                          Edit Staff
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(shipment)}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="row mt-3">
        <div className="col d-flex justify-content-end">
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  ‹ Back
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next ›
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
