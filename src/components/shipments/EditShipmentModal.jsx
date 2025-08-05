import React, { useState, useEffect } from "react";
import "../../styles/ui/pop.css";

const EditShipmentModal = ({ show, onClose, shipmentData, onSave }) => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    status: "",
    deliveryDate: ""
  });

  useEffect(() => {
    if (shipmentData) {
      setFormData({
        origin: shipmentData.origin || "",
        destination: shipmentData.destination || "",
        status: shipmentData.status || "",
        deliveryDate: shipmentData.deliveryDate || ""
      });
    }
  }, [shipmentData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="edit-shipment-modal">
      <div className="edit-shipment-card">
        <button className="close-btn" onClick={onClose}>×</button>
        <h4 className="modal-title">Edit Shipment</h4>

        <div className="form-grid">
          <div className="form-group">
            <label>Origin Address</label>
            <input
              type="text"
              name="origin"
              className="form-control"
              value={formData.origin}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Destination Address</label>
            <input
              type="text"
              name="destination"
              className="form-control"
              value={formData.destination}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Shipment Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Delivery Date</label>
            <input
              type="date"
              name="deliveryDate"
              className="form-control"
              value={formData.deliveryDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn cancel-btn" onClick={onClose}>Cancel</button>
          <button className="btn save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditShipmentModal;

