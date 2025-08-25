// AddWarehouseModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../../styles/ui/WarehouseDetails.css";
import axiosInstance from "../../utils/axiosInterceptor";


const AddWarehouseModal = ({ show, handleClose, onWarehouseAdded }) => {
  const [form, setForm] = useState({
    name: "",
    capacity: "",
    spaceUsed: "",
    location: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.name.trim() ||
      !form.capacity.trim() ||
      !form.spaceUsed.trim() ||
      !form.location.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      try {
  const response = await axiosInstance.post("/warehouse/add", form);
  const data = response.data;

  alert("✅ Warehouse added successfully!");
  if (onWarehouseAdded) onWarehouseAdded(data.warehouse); // 🚀 Send back to parent
  handleClose();
  setForm({
    name: "",
    capacity: "",
    spaceUsed: "",
    location: "",
    status: "Active",
  });
} catch (err) {
  console.error("Add warehouse error:", err);
  alert(err.response?.data?.message || "❌ Server error");
} finally {
  setLoading(false);
}

    } catch (err) {
      console.error("Add warehouse error:", err);
      alert("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      className="fulfillment-modal"
    >
      <Modal.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="fw-bold">Add New Warehouse</h5>
          <button className="btn-close" onClick={handleClose}></button>
        </div>

        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Label>Warehouse Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Warehouse Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 150,000 sq.ft."
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Space Used</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 75,000 sq.ft."
                name="spaceUsed"
                value={form.spaceUsed}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter warehouse location"
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Full Capacity</option>
                <option>Under Maintenance</option>
              </Form.Select>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddWarehouseModal;
