import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInterceptor";

const AddTrackingModal = ({ show, handleClose, handleAdd }) => {
  const [tracking, setTracking] = useState({
    start: "",
    end: "",
    eta: "",
    distance: "",
    vehicle: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          const vehicleRes = await axiosInstance.get("/fleet/all");
          setVehicles(vehicleRes.data);

          const warehouseRes = await axiosInstance.get("/warehouse/all");
          setWarehouses(warehouseRes.data);
        } catch (err) {
          console.error("Error fetching vehicles or warehouses:", err);
        }
      };
      fetchData();
    }
  }, [show]);

  const handleChange = (e) => {
    setTracking({ ...tracking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post("/trackings", tracking);
      console.log("Server response:", response.data);

      alert("Tracking saved successfully!");
      if (handleAdd) handleAdd(response.data.tracking);
      setTracking({ start: "", end: "", eta: "", distance: "", vehicle: "" });
      handleClose();
    } catch (error) {
      console.error("Error saving tracking:", error);
      alert(
        "Failed to save tracking: " +
          (error.response?.data?.error ||
            error.response?.data?.message ||
            error.message)
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Add New Tracking</h5>
          <Button
            variant="light"
            onClick={handleClose}
            className="rounded-circle px-2"
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </div>

        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="start">
                <Form.Label>Select Start Warehouse</Form.Label>
                <Form.Select
                  name="start"
                  value={tracking.start}
                  onChange={handleChange}
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((wh) => (
                    <option key={wh._id} value={wh.name}>
                      {wh.name} - {wh.location}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="end">
                <Form.Label>End Point</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter End Point"
                  name="end"
                  value={tracking.end}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="eta">
                <Form.Label>ETA</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="YYYY-MM-DD HH:MM"
                  name="eta"
                  value={tracking.eta}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="distance">
                <Form.Label>Distance (km)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="0"
                  name="distance"
                  value={tracking.distance}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="vehicle">
            <Form.Label>Select Vehicle</Form.Label>
            <Form.Select
              name="vehicle"
              value={tracking.vehicle}
              onChange={handleChange}
            >
              <option value="">Select a Vehicle</option>
              {vehicles.map((veh) => (
                <option key={veh._id} value={veh.vehicleType}>
                  {veh.vehicleType} - {veh.vehicleType}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#7b61ff",
                borderColor: "#7b61ff",
                color: "#fff",
              }}
            >
              Save Tracking
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddTrackingModal;
