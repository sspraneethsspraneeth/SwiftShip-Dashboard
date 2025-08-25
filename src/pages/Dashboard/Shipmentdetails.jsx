import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import EditShipmentModal from "../../components/shipments/EditShipmentModal";
import AddNoteModal from "../../components/shipments/AddNoteModal";
import Cancelshipment from "../../components/shipments/cancelshipment";
import "../../styles/ui/transaction.css";
import axiosInstance from "../../utils/axiosInterceptor";


const ShipmentDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  const [shipment, setShipment] = useState(null);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadShipmentData = async () => {
      try {
        let shipmentData;

        if (location.state?.shipment) {
          shipmentData = location.state.shipment;
        } else {
          const res = await axiosInstance.get(`/shipment/${id}`);
          shipmentData = res.data;
        }

        if (shipmentData.driverName) {
          try {
            const driverRes = await axiosInstance.get("/staff/driver-by-name", {
              params: { name: shipmentData.driverName },
            });

            shipmentData.emailAddress = driverRes.data.email;
            shipmentData.contactNumber = driverRes.data.contact;
          } catch (driverErr) {
            console.warn("Driver not found in staff collection:", driverErr);
          }
        }

        setShipment(shipmentData);

        const orders = shipmentData.orders || [];
        const history = orders.map((order) => ({
          _id: order._id,
          name: order.receiverName,
          billing: order.deliveryAddress,
          dateTime: new Date(order.pickupDate).toLocaleString(),
          location: order.deliveryAddress,
          notes: order.notes || "",
          delayedDate: "12/01/25", // Example static
          status: order.status,
        }));
        setDeliveryHistory(history);
      } catch (error) {
        console.error("Error loading shipment:", error);
      } finally {
        setLoading(false);
      }
    };

    loadShipmentData();
  }, [id, location.state]);

  const handleModalSave = (updatedData) => {
    setShipment((prev) => ({ ...prev, ...updatedData }));
    setShowEditModal(false);
  };

  const totalPages = Math.ceil(deliveryHistory.length / itemsPerPage);
  const paginatedHistory = deliveryHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditEvent = (index) => {
    const absoluteIndex = (currentPage - 1) * itemsPerPage + index;
    const eventToEdit = deliveryHistory[absoluteIndex];
    console.log("Edit Event:", eventToEdit);
  };

  const handleDeleteEvent = (index) => {
    const absoluteIndex = (currentPage - 1) * itemsPerPage + index;
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updated = [...deliveryHistory];
      updated.splice(absoluteIndex, 1);
      setDeliveryHistory(updated);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleStatusClick = async (index) => {
    const absoluteIndex = (currentPage - 1) * itemsPerPage + index;
    const order = deliveryHistory[absoluteIndex];
    const currentStatus = order.status;

    // Toggle status
    const newStatus = currentStatus === "Pending" ? "Delivered" : "Pending";

    try {
      const orderId = shipment.orders[absoluteIndex]._id;

      const res = await axiosInstance.post("/shipment/update-order-status", {
        orderId,
        newStatus,
      });

      const updatedOrder = res.data.updatedOrder;
      const updatedShipmentStatus = res.data.shipmentStatus;

      // Update local deliveryHistory
      const updatedHistory = [...deliveryHistory];
      updatedHistory[absoluteIndex] = {
        ...updatedHistory[absoluteIndex],
        status: updatedOrder.status,
      };
      setDeliveryHistory(updatedHistory);

      // Update shipment status if needed
      setShipment((prev) => ({
        ...prev,
        status: updatedShipmentStatus,
      }));
    } catch (err) {
      console.error("Failed to update order status", err);
      alert("Error updating order status");
    }
  };

  if (loading) return <div className="text-center">Loading shipment details...</div>;
  if (!shipment) return <div className="text-danger">Shipment not found.</div>;

  return (
    <div className="shipment-details-container container-fluid">
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
        <h2 className="shipment-title">Shipment Details</h2>
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>Edit Shipment</button>
          <button className="btn btn-outline-secondary" onClick={() => setShowAddNoteModal(true)}>Add Note</button>
          <button className="btn btn-outline-secondary" onClick={() => setShowCancelModal(true)}>Cancel Shipment</button>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
        <div className="info-box">Shipment ID: <span className="text-orange fw-semibold">{shipment.shipmentId}</span></div>
        <div className="info-box">Driver Name: {shipment.driverName}</div>
        <div className="info-box">Email Address: {shipment.emailAddress || "Not Available"}</div>
        <div className="info-box">Contact Number: {shipment.contactNumber || "Not Available"}</div>
      </div>

      <div className="d-flex flex-wrap gap-3 mb-2">
        <div className="info-box">Origin Address: {shipment.origin}</div>
        <div className="info-box">Destination Address: {shipment.destination}</div>
        <div className="info-box">Tracking Number: <span className="text-primary fw-semibold">{shipment.trackingNumber}</span></div>
        <div className="info-box">Carrier: {shipment.carrier}</div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="badge bg-info text-dark">{shipment.status}</span>
        <div className="text-muted small">
          Created At: {shipment.createdAt ? new Date(shipment.createdAt).toLocaleString() : "N/A"}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Delivery History</h4>
        <select className="form-select form-select-sm w-auto">
          <option>This Month</option>
          <option>Last Month</option>
          <option>Custom Range</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
              <th>Customer Name</th>
              <th>Billing Address</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Additional Notes</th>
              <th>Delayed Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((item, index) => (
              <tr key={index}>
                <td><input type="checkbox" checked={selectAll} readOnly /></td>
                <td>{item.name}</td>
                <td>{item.billing}</td>
                <td>{item.dateTime}</td>
                <td>{item.location}</td>
                <td>{item.notes}</td>
                <td>{item.delayedDate}</td>
                <td>
                  <span
                    className={`badge pointer ${
                      item.status === "Delivered" ? "bg-primary" :
                      item.status === "Pending" ? "bg-warning text-dark" :
                      "bg-secondary"
                    }`}
                    onClick={() => handleStatusClick(index)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="dropdown">
                    <button className="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown">⋯</button>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item" onClick={() => handleEditEvent(index)}>Edit</button></li>
                      <li><button className="dropdown-item text-danger" onClick={() => handleDeleteEvent(index)}>Delete</button></li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>‹ Back</button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next ›</button>
            </li>
          </ul>
        </nav>
      </div>

      <EditShipmentModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        shipmentData={shipment}
        onSave={handleModalSave}
      />

      <Cancelshipment
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        shipmentId={shipment.shipmentId}
      />

      <AddNoteModal
        show={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        shipmentId={shipment.shipmentId}
      />
    </div>
  );
};

export default ShipmentDetails;
