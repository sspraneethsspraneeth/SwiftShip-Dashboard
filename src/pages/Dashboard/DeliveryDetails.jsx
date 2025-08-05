import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/ui/delivery.css";

const DeliveryDetails = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const shipment = useLocation().state?.shipment;

  if (!shipment) {
    return (
      <div className="container mt-5">
        <h4>No Delivery Details Available for ID: {deliveryId}</h4>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="delivery-container">
      <div className="delivery-card">
        {/* Delivery & Shipment Info */}
        <h5 className="fw-bold mb-4">Delivery Information</h5>
        <div className="row mb-3">
          <div className="col-md-3"><strong>Delivery ID:</strong> {shipment.deliveryId}</div>
          <div className="col-md-3"><strong>Shipment ID:</strong> {shipment.shipmentId}</div>
          <div className="col-md-3"><strong>Origin:</strong> {shipment.origin || "New York, NY"}</div>
          <div className="col-md-3"><strong>Destination:</strong> {shipment.destination || "Los Angeles, CA"}</div>
        </div>
        <div className="row mb-4">
          <div className="col-md-3"><strong>Items:</strong> 5 boxes of electronics</div> {/* Static */}
        </div>

        {/* Titles for Staff + Status */}
        <div className="row mb-2">
          <div className="col-md-6">
            <h5 className="fw-bold">Staff Member</h5>
          </div>
          <div className="col-md-6">
            <h5 className="fw-bold">Status & Delivery Date</h5>
          </div>
        </div>

        {/* Staff Info + Status/Date */}
        <div className="row mb-4">
          <div className="col-md-3"><strong>Name:</strong> {shipment.staff || shipment.driverName || "Unassigned"}</div>
          <div className="col-md-3"><strong>Contact:</strong> +91-9876543210</div> {/* Static/mock */}
          <div className="col-md-3"><strong>Performance Rating:</strong> 4.5/5</div> {/* Static */}
          <div className="col-md-2"><strong>Delivery Date:</strong> 2024-10-12</div> {/* Static */}
          <div className="col-md-1">
            <span className={`badge px-3 py-2 bg-${getStatusColor(shipment.status)}`}>
              {shipment.status}
            </span>
          </div>
        </div>

        {/* Confirmation Form */}
        <h5 className="fw-bold mb-3">Delivery Confirmation</h5>
        <Form>
          <div className="row mb-3">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Delivery Confirmation Code</Form.Label>
                <Form.Control type="text" placeholder="Enter Confirmation Code" />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Recipient's Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Recipient's Name" />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Delivery Proof (Optional)</Form.Label>
                <Form.Control type="file" />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Date and Time of Delivery</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2">Cancel</Button>
            <Button variant="primary" className="px-4">Confirm Delivery</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered": return "success";
    case "Pending": return "warning";
    case "In Transit": return "info";
    case "Cancelled": return "danger";
    default: return "secondary";
  }
};

export default DeliveryDetails;
