import React, { useState, useEffect } from "react";
import "../../styles/ui/RoutePlanning.css";
import { Button } from "react-bootstrap";
import AddRouteModal from "../../components/route/AddRouteModel";
import axiosInstance from "../../utils/axiosInterceptor";



const RoutePlanning = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
    const [loadingRoutes, setLoadingRoutes] = useState(true);



useEffect(() => {
  const fetchRoutes = async () => {
    try {
      const res = await axiosInstance.get("/trackings");
      const mappedData = res.data.map((item) => ({
        id: item.routeId,
        start: item.start,
        end: item.end,
        eta: item.eta,
        distance: item.distance + " miles",
        stops: "3 stops (Atlanta, GA)",
        vehicle: item.vehicle,
        tracking: `#${item.trackingId}`,
      }));
      setRoutes(mappedData);
    } catch (err) {
      console.error("Failed to fetch tracking data", err);
    } finally {
      setLoadingRoutes(false);
    }
  };

  fetchRoutes();
}, []);



  const handleRowSelect = (route) => setSelectedRoute(route);

  const handleSave = () => {
    if (selectedRoute) {
      const updated = routes.filter((r) => r.id !== selectedRoute.id);
      setRoutes([selectedRoute, ...updated]);
      setSelectedRoute(null);
    }
  };

  const handleAddOrUpdate = (routeData) => {
    const existingIndex = routes.findIndex((r) => r.id === routeData.id);
    if (existingIndex !== -1) {
      const updatedRoutes = [...routes];
      updatedRoutes[existingIndex] = routeData;
      setRoutes(updatedRoutes);
    } else {
      setRoutes([routeData, ...routes]);
    }
    setShowModal(false);
  };

  const filteredRoutes = routes.filter((route) =>
    route.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.start?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.end?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.tracking?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="route-planning-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Route Planning</h5>
        <Button size="sm" onClick={() => setShowModal(true)}>
          Add/Edit Route
        </Button>
      </div>

      {/* Search */}
      <div className="row mb-2">
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="input-group-text">
              <i className="bi bi-search text-secondary"></i>
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table table-hover route-table">
        <thead>
          <tr>
            <th>Route ID</th>
            <th>Start Point</th>
            <th>End Point</th>
            <th>ETA</th>
            <th>Distance</th>
            <th>Stops</th>
            <th>Vehicle Type</th>
            <th>Tracking Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoutes.map((route) => (
            <tr key={route.id} onClick={() => handleRowSelect(route)} style={{ cursor: "pointer" }}>
              <td className="text-primary fw-semibold">{route.id}</td>
              <td>{route.start}</td>
              <td>{route.end}</td>
              <td>{route.eta}</td>
              <td className="text-success">{route.distance}</td>
              <td>{route.stops}</td>
              <td>{route.vehicle}</td>
              <td className="text-secondary">{route.tracking}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <AddRouteModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleAdd={handleAddOrUpdate}
        routes={routes}
      />

      {/* Live Tracking */}
      {selectedRoute && (
        <div className="mt-4">
          <h6 className="fw-bold">Live Tracking</h6>
          <div className="map-container mb-4">
            <iframe
              title="Live Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250644.76835058338!2d76.80241690808158!3d11.01426149003874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1749797907540!5m2!1sen!2sin"              width="100%"
              height="360"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          <div className="status-overview p-4 rounded shadow-sm bg-white">
            <div className="row g-2 mb-2">
              <div className="col">
                <strong>Vehicle ID:</strong> <span className="text-warning">{selectedRoute.vehicle}</span>
              </div>
             <div className="col"><strong>Route ID:</strong> <span className="text-warning">{selectedRoute.id}</span></div>
              <div className="col"><strong>Current Location:</strong> Chicago, IL</div>
              <div className="col"><strong>ETA to Next Stop:</strong> 1 hour 15 minutes</div>
              <div className="col"><strong>Overall ETA:</strong> {selectedRoute.eta}</div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="half-width">
                <strong>Distance Covered:</strong> 1,000 miles out of {selectedRoute.distance}
              </div>
              <span className="badge bg-success">On Time</span>
            </div>

            <div className="mt-3 d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={() => setSelectedRoute(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlanning;
