import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosInterceptor";

const AssignRouteModal = ({ show, handleClose, staffId, handleAddRoute }) => {
  const [routes, setRoutes] = useState([]);
  const [routeId, setRouteId] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [date, setDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [packageDetails, setPackageDetails] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch routes when modal is shown
  useEffect(() => {
    if (show) {
      axiosInstance.get("/trackings")
  .then((res) => {
    const data = res.data;
    const mappedRoutes = data.map((item) => ({
      id: item.routeId,
      start: item.start,
      end: item.end,
      eta: item.eta,
      distance: item.distance,
      vehicle: item.vehicle,
    }));
    setRoutes(mappedRoutes);
  })
  .catch((err) => console.error("Failed to fetch routes:", err));

    }
  }, [show]);

  // Autofill pickup & delivery when routeId changes
  useEffect(() => {
    const selected = routes.find((r) => r.id === routeId);
    if (selected) {
      setPickup(selected.start || "");
      setDelivery(selected.end || "");
    } else {
      setPickup("");
      setDelivery("");
    }
  }, [routeId, routes]);

  const handleSave = async () => {
    const today = new Date().toISOString().split("T")[0];

    if (!routeId.trim()) return toast.error("Please select a Route ID.");
    if (!pickup.trim()) return toast.error("Pickup location missing.");
    if (!delivery.trim()) return toast.error("Delivery location missing.");
    if (!vehicle) return toast.error("Please select a vehicle.");
    if (!date) return toast.error("Please select a scheduled date.");
    if (date < today) return toast.error("Scheduled date cannot be in the past.");
    if (!packageDetails) return toast.error("Please upload package details.");

    const task = {
      routeId,
      origin: pickup,
      destination: delivery,
      vehicle,
      date,
      packageDetails,
      instructions,
    };

    try {
      setLoading(true);
      const response = await axiosInstance.post(`/staff/assign-task/${staffId}`, task);

if (response.status === 200 || response.status === 201) {
  const data = response.data;
  toast.success("Route assigned successfully!");
  handleAddRoute(data.route);

  // Reset form
  setRouteId("");
  setPickup("");
  setDelivery("");
  setVehicle("");
  setDate("");
  setInstructions("");
  setPackageDetails("");

  setTimeout(() => handleClose(), 1500);
} else {
  toast.error(response.data.message || "Failed to assign route.");
}

      
    } catch (err) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Body className="p-4 rounded">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Assign New Task</h5>
            <button
              className="btn-close"
              onClick={handleClose}
              style={{ background: "#ffe0cc", padding: "10px", borderRadius: "50%" }}
            />
          </div>

          <Form>
            <div className="row mb-3">
              {/* Route ID Dropdown */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Route ID</Form.Label>
                  <Form.Select
                    value={routeId}
                    onChange={(e) => setRouteId(e.target.value)}
                  >
                    <option value="">Select Route</option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.id} — {route.start} → {route.end}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Pickup Location - Placeholder Only */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Pickup Location</Form.Label>
                  <Form.Control placeholder="Pickup" value={pickup} readOnly />
                </Form.Group>
              </div>

              {/* Delivery Location - Placeholder Only */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Delivery Location</Form.Label>
                  <Form.Control placeholder="Delivery" value={delivery} readOnly />
                </Form.Group>
              </div>

              {/* Package Details */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Package Details</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) =>
                      setPackageDetails(e.target.files[0]?.name || "")
                    }
                  />
                </Form.Group>
              </div>

              {/* Vehicle Assignment */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Vehicle Assignment</Form.Label>
                  <Form.Select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                  >
                    <option value="">Select Vehicle</option>
                    <option value="Truck A">Truck A</option>
                    <option value="Van B">Van B</option>
                    <option value="Truck C">Truck C</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Scheduled Date */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Scheduled Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Form.Group>
              </div>

              {/* Instructions */}
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label>Special Instructions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add any specific instructions for the task"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline-warning"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                style={{ backgroundColor: "#6C63FF", border: "none" }}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Route"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AssignRouteModal;
