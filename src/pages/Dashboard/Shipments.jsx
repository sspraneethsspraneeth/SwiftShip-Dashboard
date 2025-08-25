import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/ui/ShipmentListPage.css";
import axiosInstance from "../../utils/axiosInterceptor";

const ShipmentsTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);

  const rowsPerPage = 8;

  const fetchDriverName = async (origin, destination) => {
    try {
      const res = await axiosInstance.get("/staff/driver-by-route", {
        params: { origin, destination },
      });
      return res.data.driverName || "Unassigned";
    } catch {
      return "Unassigned";
    }
  };

  const fetchShipments = async () => {
    try {
      const res = await axiosInstance.get("/shipment");

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
            status: allDelivered ? t("shipments.delivered") : t("shipments.shipping"),
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

  useEffect(() => {
    fetchShipments();
  }, [t]);

  const generateShipments = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/shipment/generate");
      await fetchShipments();
    } catch (err) {
      console.error("❌ Error generating shipments", err);
    } finally {
      setLoading(false);
    }
  };

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
      case t("shipments.delivered"):
        return "bg-success text-white";
      case t("shipments.pending"):
        return "bg-warning text-dark";
      case t("shipments.shipping"):
        return "bg-info text-dark";
      case t("shipments.delayed"):
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
          placeholder={t("shipments.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => handleSort("shipmentId")}
          >
            {t("shipments.sortById")}{" "}
            {sortField === "shipmentId" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </button>

          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            {t("shipments.filter")}
          </button>

          <button
            className="btn btn-primary"
            onClick={generateShipments}
            disabled={loading}
          >
            {loading ? t("shipments.generating") : t("Add shipment")}
          </button>

          {showFilter && (
            <select
              className="form-select mt-2"
              value={statusFilter}
              onChange={handleFilter}
              style={{ width: "200px" }}
            >
              <option value="">{t("shipments.allStatuses")}</option>
              <option value={t("shipments.delivered")}>
                {t("shipments.delivered")}
              </option>
              <option value={t("shipments.pending")}>
                {t("shipments.pending")}
              </option>
              <option value={t("shipments.shipping")}>
                {t("shipments.shipping")}
              </option>
              <option value={t("shipments.delayed")}>
                {t("shipments.delayed")}
              </option>
            </select>
          )}
        </div>
      </div>

      <h5 className="fw-bold mb-3">{t("shipments.title")}</h5>

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
              <th>{t("shipments.shipmentId")}</th>
              <th>{t("shipments.driverName")}</th>
              <th>{t("shipments.origin")}</th>
              <th>{t("shipments.destination")}</th>
              <th>{t("shipments.dateShipped")}</th>
              <th>{t("shipments.vehicleType")}</th>
              <th>{t("shipments.eta")}</th>
              <th>{t("shipments.status")}</th>
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
                <td>
                  <span className="dots">⋯</span>
                </td>
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
              {t("shipments.back")}
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li
              key={p}
              className={`page-item ${p === currentPage ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(p)}>
                {p}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              {t("shipments.next")}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShipmentsTable;
