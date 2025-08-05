import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../../styles/ui/FleetPage.css";
import BASE_URL from "../../utils/apiConfig";


const AddVehicleModal = ({ show, handleClose }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    vehicleType: "Truck",
    registrationNumber: "",
    capacity: "",
    baseLocation: "",
    insuranceCompany: "",
    insuranceNumber: "",
    driverId: "",
    status: "Active"
  });

  useEffect(() => {
    fetch(`${BASE_URL}/warehouse/all`)
      .then(res => res.json())
      .then(setWarehouses);
    fetch(`${BASE_URL}/staff/all`)
    .then(res => res.json())
    .then(data => {
      const onlyDrivers = data.filter(staff => staff.role === "Driver");
      setDrivers(onlyDrivers);
    });
}, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${BASE_URL}/fleet/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save vehicle.");
      alert("Vehicle added successfully!");
      handleClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="compact-modal">
      <Modal.Header closeButton className="py-2 px-3">
        <Modal.Title className="fw-bold">Assign New Task</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-3">
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="vehicleType">
                <Form.Label>Vehicle Type</Form.Label>
                <Form.Select value={formData.vehicleType} onChange={handleChange}>
                  <option>Truck</option>
                  <option>Van</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="registrationNumber">
                <Form.Label>Registration Number</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="ABC-1234"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="capacity">
                <Form.Label>Capacity</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="3,000 kg"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="baseLocation">
                <Form.Label>Base Location</Form.Label>
                <Form.Select value={formData.baseLocation} onChange={handleChange}>
                  <option>Select Location</option>
                  {warehouses.map(w => (
                    <option key={w._id} value={w.name}>{w.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="insuranceCompany">
                <Form.Label>Insurance Company</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.insuranceCompany}
                  onChange={handleChange}
                  placeholder="XYZ Insurance Co."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="insuranceNumber">
                <Form.Label>Insurance Number</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.insuranceNumber}
                  onChange={handleChange}
                  placeholder="INS-9876543210"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="driverId">
                <Form.Label>Assign Driver</Form.Label>
                <Form.Select value={formData.driverId} onChange={handleChange}>
                  <option>Select a driver</option>
                  {drivers.map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.fullName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Select value={formData.status} onChange={handleChange}>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Maintenance</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer className="py-2 px-3">
        <Button variant="outline-secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Vehicle</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddVehicleModal;
