import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Table,
  Badge,
  Dropdown,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import "../../styles/ui/WarehouseDetails.css";
import axiosInstance from "../../utils/axiosInterceptor"; // ✅ use interceptor

const WarehouseDetails = () => {
  const { id: warehouseId } = useParams();
  const location = useLocation();

  const warehouse = location.state?.warehouse || {
    id: "WH-000",
    name: "Default Warehouse",
    location: "Unknown",
    capacity: "0 sq. ft.",
    spaceUsed: "0 sq. ft.",
  };

  const [assignedStaff, setAssignedStaff] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editStaff, setEditStaff] = useState(null);

  // Fetch assigned staff
  useEffect(() => {
    axiosInstance
      .get(`/warehouse-staff/${warehouseId}`)
      .then((res) => setAssignedStaff(res.data))
      .catch((err) => console.error("Fetch assigned staff failed:", err));
  }, [warehouseId]);

  // Fetch all staff
  useEffect(() => {
    axiosInstance
      .get("/staff/all")
      .then((res) => setAllStaff(res.data))
      .catch((err) => console.error("Fetch all staff failed:", err));
  }, []);

  // Assign staff
  const handleAssignStaff = (staff) => {
    const payload = {
      staffId: staff._id,
      fullName: staff.fullName,
      role: staff.role,
      shift: staff.shift,
      attendance: staff.attendance || "Present",
      warehouseId,
      warehouseName: warehouse.name,
    };

    axiosInstance
      .post("/warehouse-staff/assign", payload)
      .then((res) => {
        setAssignedStaff((prev) => [...prev, res.data]);
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          alert("Staff is already assigned to another warehouse");
        } else {
          console.error("Assign failed:", err);
        }
      });
  };

  const handleSelectAll = (e) => {
    setSelectedStaff(
      e.target.checked ? assignedStaff.map((s) => s.staffId) : []
    );
  };

  const handleCheckboxChange = (staffId) => {
    setSelectedStaff((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleDelete = (assignmentId) => {
    if (window.confirm("Unassign this staff?")) {
      axiosInstance
        .delete(`/warehouse-staff/delete/${assignmentId}`)
        .then(() => {
          setAssignedStaff((prev) =>
            prev.filter((s) => s._id !== assignmentId)
          );
          setSelectedStaff((prev) =>
            prev.filter((id) => id !== assignmentId)
          );
        })
        .catch((err) => console.error("Delete failed:", err));
    }
  };

  const handleEditSubmit = () => {
    axiosInstance
      .put(`/warehouse-staff/update/${editStaff._id}`, editStaff)
      .then((res) => {
        setAssignedStaff((prev) =>
          prev.map((s) => (s._id === res.data._id ? res.data : s))
        );
        setEditStaff(null);
      })
      .catch((err) => console.error("Update failed:", err));
  };

  // Assigned staff IDs (to prevent re-assigning from list)
  const assignedStaffIds = assignedStaff.map((s) => s.staffId);

  return (
    <div className="container-fluid px-3 py-3">
      <h4 className="fw-bold mb-4">Warehouse Details</h4>

      <div className="mb-3 d-flex gap-4 flex-wrap">
        {[{ label: "Warehouse ID", value: warehouse.id },
          { label: "Warehouse Name", value: warehouse.name },
          { label: "Location", value: warehouse.location },
          { label: "Capacity", value: warehouse.capacity },
          { label: "Used Space", value: warehouse.spaceUsed },
        ].map((item, idx) => (
          <span
            key={idx}
            className="badge bg-light text-dark border rounded-pill px-3 py-2 small"
          >
            {item.label}: {item.value}
          </span>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Assigned Staff</h5>
        <Button variant="primary" onClick={() => setShowAssignModal(true)}>
          Assign Staff
        </Button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-3">
          <Table responsive hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedStaff.length === assignedStaff.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Staff ID</th>
                <th>Role</th>
                <th>Shift</th>
                <th>Attendance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assignedStaff.map((staff) => (
                <tr key={staff._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(staff.staffId)}
                      onChange={() => handleCheckboxChange(staff.staffId)}
                    />
                  </td>
                  <td>{staff.fullName}</td>
                  <td>{staff.staffCode || "N/A"}</td>
                  <td>{staff.role}</td>
                  <td>{staff.shift}</td>
                  <td>
                    <Badge
                      className="px-3 py-1"
                      bg={staff.attendance === "Absent" ? "danger-subtle" : "success-subtle"}
                      text={staff.attendance === "Absent" ? "danger" : "success"}
                    >
                      {staff.attendance}
                    </Badge>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        as="div"
                        className="btn btn-sm btn-light border-0"
                        style={{ cursor: "pointer" }}
                      >
                        ⋯
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setEditStaff(staff)}>Edit</Dropdown.Item>
                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(staff._id)}>Unassign</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Staff to Assign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Shift</th>
                <th>Attendance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allStaff.map((s) => {
                const isAlreadyAssigned = assignedStaffIds.includes(s._id);
                return (
                  <tr key={s._id}>
                    <td>{s.fullName}</td>
                    <td>{s.role}</td>
                    <td>{s.shift}</td>
                    <td>{s.attendance || "Present"}</td>
                    <td>
                      <Button
                        size="sm"
                        variant={isAlreadyAssigned ? "primary" : "outline-primary"}
                        disabled={isAlreadyAssigned}
                        onClick={() => handleAssignStaff(s)}
                      >
                        {isAlreadyAssigned ? "Already Assigned" : "Assign"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      {editStaff && (
        <Modal show onHide={() => setEditStaff(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Assigned Staff</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={editStaff.role}
                  onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })}
                >
                  <option>Warehouse Manager</option>
                  <option>Delivery Coordinator</option>
                  <option>Driver</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Shift</Form.Label>
                <Form.Select
                  value={editStaff.shift}
                  onChange={(e) => setEditStaff({ ...editStaff, shift: e.target.value })}
                >
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                  <option>Rotational</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Attendance</Form.Label>
                <Form.Select
                  value={editStaff.attendance}
                  onChange={(e) => setEditStaff({ ...editStaff, attendance: e.target.value })}
                >
                  <option>Present</option>
                  <option>Absent</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditStaff(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default WarehouseDetails;
