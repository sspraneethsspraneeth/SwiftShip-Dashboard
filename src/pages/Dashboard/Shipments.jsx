import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/ui/ShipmentListPage.css";
import BASE_URL from "../../utils/apiConfig";

const ShipmentsTable = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const rowsPerPage = 8;

  const fetchDriverName = async (origin, destination) => {
    try {
      const res = await axios.get(`${BASE_URL}/staff/driver-by-route`, {
        params: { origin, destination },
      });
      return res.data.driverName || "Unassigned";
    } catch {
      return "Unassigned";
    }
  };

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        // ✅ Auto-generate shipments (and deliveries) on component load
        await axios.post(`${BASE_URL}/shipment/generate`);

        const res = await axios.get(`${BASE_URL}/shipment`);

        const processed = await Promise.all(
          res.data.map(async (shipment) => {
            const driverName = await fetchDriverName(shipment.start, shipment.end);

            const allDelivered =
              shipment.orders &&
              shipment.orders.length > 0 &&
              shipment.orders.every((order) => order.status === "Delivered");

            

            return {
              _id: shipment._id,
              shipmentId: shipment.shipmentId,
              origin: shipment.start,
              destination: shipment.end,
              trackingNumber: shipment.trackingNumber || "N/A",
              vehicleType: shipment.vehicleType || "Truck",
              estimatedDelivery: shipment.eta || "2024-10-10",
              status: allDelivered ? "Delivered" : "Shipping",
              driverName,
              dateShipped: shipment.dateShipped || "2024-10-01",
              orders: shipment.orders || [],
              routeId: shipment.routeId || null,
            };
          })
        );

        setShipments(processed);
      } catch (err) {
        console.error("❌ Error fetching shipments", err);
      }
    };

    fetchShipments();
  }, []);

  const filteredShipments = shipments
    .filter((shipment) =>
      shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((shipment) => (statusFilter ? shipment.status === statusFilter : true))
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredShipments.length / rowsPerPage);
  const currentRows = filteredShipments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const statusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-success text-white";
      case "Pending":
        return "bg-warning text-dark";
      case "Shipping":
        return "bg-info text-dark";
      case "Delayed":
        return "bg-danger text-white";
      default:
        return "bg-dark text-white";
    }
  };

  const vehicleBadge = (vehicle) => {
    switch (vehicle) {
      case "Truck":
        return "bg-warning text-dark";
      case "Plane":
        return "bg-primary text-white";
      case "Ship":
        return "bg-secondary text-white";
      default:
        return "bg-light text-dark";
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedShipments(currentRows.map((s) => s.shipmentId));
    } else {
      setSelectedShipments([]);
    }
  };

  const handleSelectShipment = (shipmentId) => {
    setSelectedShipments((prev) =>
      prev.includes(shipmentId)
        ? prev.filter((id) => id !== shipmentId)
        : [...prev, shipmentId]
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="shipment-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control search-box"
          placeholder="Search Shipment ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => handleSort("shipmentId")}
          >
            Sort by ID {sortField === "shipmentId" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            Filter
          </button>

          {showFilter && (
            <select
              className="form-select mt-2"
              value={statusFilter}
              onChange={handleFilter}
              style={{ width: "200px" }}
            >
              <option value="">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
              <option value="Shipping">Shipping</option>
              <option value="Delayed">Delayed</option>
            </select>
          )}
        </div>
      </div>

      <h5 className="fw-bold mb-3">All Shipments List</h5>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    currentRows.length > 0 &&
                    currentRows.every((row) =>
                      selectedShipments.includes(row.shipmentId)
                    )
                  }
                />
              </th>
              <th>Shipment ID</th>
              <th>Driver Name</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Date Shipped</th>
              <th>Vehicle Type</th>
              <th>ETA</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, idx) => (
              <tr
                key={idx}
                onClick={() =>
                  navigate(`/dashboard/shipments/${item.shipmentId}`, {
                    state: { shipment: item },
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedShipments.includes(item.shipmentId)}
                    onChange={() => handleSelectShipment(item.shipmentId)}
                  />
                </td>
                <td className="text-primary">{item.shipmentId}</td>
                <td>{item.driverName}</td>
                <td>{item.origin}</td>
                <td>{item.destination}</td>
                <td>{item.dateShipped}</td>
                <td>
                  <span className={`badge ${vehicleBadge(item.vehicleType)}`}>
                    {item.vehicleType}
                  </span>
                </td>
                <td>{item.estimatedDelivery}</td>
                <td>
                  <span className={`badge ${statusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td><span className="dots">⋯</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-wrapper mt-4">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              &lt; Back
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(p)}>
                {p}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next &gt;
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShipmentsTable;
