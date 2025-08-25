import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AssignRouteModal from "../../components/staff/AssignRouteModal";
import "../../styles/ui/staff.css";
import axiosInstance from "../../utils/axiosInterceptor";

const StaffOverview = () => {
  const location = useLocation();
  const staff = location.state?.staff || {};
  const staffId = staff._id;

  const [showModal, setShowModal] = useState(false);
  const [assignedRoutes, setAssignedRoutes] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [menuIndex, setMenuIndex] = useState(null);
  const [editRoute, setEditRoute] = useState(null);
  const menuRef = useRef();

  // Fetch assigned routes
  useEffect(() => {
    const loadRoutes = async () => {
      if (staffId && staff.role === "Driver") {
        try {
          const res = await axiosInstance.get(`/staff/${staffId}/tasks`);
          setAssignedRoutes(res.data.tasks || []);
        } catch (err) {
          console.error("Error fetching tasks:", err);
        }
      }
    };
    loadRoutes();
  }, [staffId, staff.role]);

  const handleAddRoute = (newRoute) => {
    setAssignedRoutes((prev) => [...prev, newRoute]);
    setShowModal(false);
  };

  const toggleMenu = (index, e) => {
    e.stopPropagation();
    setMenuIndex(menuIndex === index ? null : index);
  };

  const handleEdit = (route) => {
    setEditRoute({ ...route });
    setMenuIndex(null);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axiosInstance.put(
        `/staff/${staffId}/update-task/${editRoute.routeId}`,
        editRoute
      );
      if (res.data.route) {
        setAssignedRoutes((prev) =>
          prev.map((r) =>
            r.routeId === res.data.route.routeId ? res.data.route : r
          )
        );
        setEditRoute(null);
      }
    } catch {
      alert("Failed to update route");
    }
  };

  const handleDelete = async (routeId) => {
    if (window.confirm(`Are you sure you want to delete route ${routeId}?`)) {
      try {
        await axiosInstance.delete(`/staff/${staffId}/remove-task/${routeId}`);
        setAssignedRoutes((prev) =>
          prev.filter((r) => r.routeId !== routeId)
        );
        setSelectedRoutes((prev) => prev.filter((id) => id !== routeId));
      } catch {
        alert("Delete failed");
      }
    }
    setMenuIndex(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAllSelected =
    assignedRoutes.length > 0 &&
    assignedRoutes.every((route) => selectedRoutes.includes(route.routeId));

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRoutes(assignedRoutes.map((route) => route.routeId));
    } else {
      setSelectedRoutes([]);
    }
  };

  const handleSelectRow = (e, routeId) => {
    if (e.target.checked) {
      setSelectedRoutes((prev) => [...prev, routeId]);
    } else {
      setSelectedRoutes((prev) => prev.filter((id) => id !== routeId));
    }
  };

  return (
    <div className="staff-overview-container container-fluid px-4 py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Staff Overview</h2>
      </div>

      <div className="mb-3">
        <h5 className="fw-bold">Personal Information</h5>
      </div>

      <div className="bg-light p-4 rounded mb-3 d-flex flex-wrap gap-4">
        <div><strong>Name:</strong> {staff.fullName}</div>
        <div><strong>Role:</strong> {staff.role}</div>
        <div><strong>Email:</strong> {staff.email}</div>
        <div><strong>Contact:</strong> {staff.contactInfo}</div>
        <div><strong>Base Location:</strong> {staff.baseLocation}</div>
      </div>

      {staff.role === "Driver" ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold">Assigned Routes</h5>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Assign New</button>
          </div>

          <AssignRouteModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            handleAddRoute={handleAddRoute}
            staffId={staffId}
          />

          <div className="bg-white p-4 rounded shadow-sm" style={{ marginTop: "-40px" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /></th>
                    <th>Route ID</th>
                    <th>Start Location</th>
                    <th>End Location</th>
                    <th>Scheduled Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {assignedRoutes.map((route, index) => (
                    <tr key={route.routeId}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRoutes.includes(route.routeId)}
                          onChange={(e) => handleSelectRow(e, route.routeId)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="text-warning fw-semibold">{route.routeId}</td>
                      <td>{route.origin}</td>
                      <td>{route.destination}</td>
                      <td>{route.date}</td>
                      <td>
                        {route.status === "Completed" ? (
                          <span className="badge bg-success-subtle text-success px-2 py-1 rounded">Completed</span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning px-2 py-1 rounded">Pending</span>
                        )}
                      </td>
                      <td className="position-relative">
                        <span
                          onClick={(e) => toggleMenu(index, e)}
                          className="dots"
                          style={{ cursor: "pointer" }}
                        >
                          ⋯
                        </span>
                        {menuIndex === index && (
                          <div
                            ref={menuRef}
                            className="dropdown-menu show"
                            style={{ position: "absolute", top: "20px", right: "0", zIndex: 1000 }}
                          >
                            <button className="dropdown-item" onClick={() => handleEdit(route)}>Edit</button>
                            <button className="dropdown-item text-danger" onClick={() => handleDelete(route.routeId)}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="alert  mt-4">
        </div>
      )}

      {/* Edit Route Modal */}
      {editRoute && (
        <div className="modal-overlay">
          <div className="add-staff-modal">
            <div className="modal-header-custom">
              <h5>Edit Route</h5>
              <button className="modal-close-btn" onClick={() => setEditRoute(null)}>×</button>
            </div>
            <div className="modal-form-grid">
              <div className="form-group">
                <label>Route ID</label>
                <input className="form-control" value={editRoute.routeId} disabled />
              </div>
              <div className="form-group">
                <label>Start Location</label>
                <input
                  className="form-control"
                  value={editRoute.origin}
                  onChange={(e) => setEditRoute({ ...editRoute, origin: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Location</label>
                <input
                  className="form-control"
                  value={editRoute.destination}
                  onChange={(e) => setEditRoute({ ...editRoute, destination: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={editRoute.date}
                  onChange={(e) => setEditRoute({ ...editRoute, date: e.target.value })}
                />
              </div>
              <div className="form-group full-width">
                <label>Status</label>
                <select
                  className="form-select"
                  value={editRoute.status}
                  onChange={(e) => setEditRoute({ ...editRoute, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="modal-footer-custom">
              <button className="btn cancel-btn" onClick={() => setEditRoute(null)}>Cancel</button>
              <button className="btn save-btn" onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffOverview;
