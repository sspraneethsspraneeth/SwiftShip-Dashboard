import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AddNewStaffModal from "../../components/staff/AddNewStaffModal";
import AssignNewTaskModal from "../../components/staff/AssignNewTaskModal";
import "../../styles/ui/staff.css";
import axiosInstance from "../../utils/axiosInterceptor";

const StaffManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [menuIndex, setMenuIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [editStaff, setEditStaff] = useState(null);
  const menuRef = useRef();

  // Fetch all staff
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await axiosInstance.get("/staff/all");
        setStaffData(res.data);
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    loadStaff();
  }, []);

  const totalPages = Math.ceil(staffData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = staffData.slice(indexOfFirstRow, indexOfLastRow);

  const toggleMenu = (index, e) => {
    e.stopPropagation();
    setMenuIndex(menuIndex === index ? null : index);
  };

  const handleSelectAll = (e) => {
    const pageIndexes = currentRows.map((_, idx) => (currentPage - 1) * rowsPerPage + idx);
    if (e.target.checked) {
      setSelectedStaff((prev) => Array.from(new Set([...prev, ...pageIndexes])));
    } else {
      setSelectedStaff((prev) => prev.filter((index) => !pageIndexes.includes(index)));
    }
  };

  const handleSelectRow = (e, index) => {
    const globalIndex = (currentPage - 1) * rowsPerPage + index;
    if (e.target.checked) {
      setSelectedStaff((prev) => [...prev, globalIndex]);
    } else {
      setSelectedStaff((prev) => prev.filter((i) => i !== globalIndex));
    }
  };

  const isAllSelected = currentRows.every((_, idx) =>
    selectedStaff.includes((currentPage - 1) * rowsPerPage + idx)
  );

  const handleRowClick = (staff) => {
    navigate(`/dashboard/staff/${encodeURIComponent(staff.fullName)}`, { state: { staff } });
  };

  // Delete staff
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        await axiosInstance.delete(`/staff/delete/${id}`);
        setStaffData(prev => prev.filter(s => s._id !== id));
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleSaveEdit = (updatedStaff) => {
    setStaffData(prev =>
      prev.map((s) => (s._id === updatedStaff._id ? updatedStaff : s))
    );
    setEditStaff(null);
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

  return (
    <div className="staff-container">
      <div className="top-bar">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>Add New Staff</button>
        </div>
      </div>

      <h5 className="fw-bold mb-3">All Staff List</h5>

      <div className="table-responsive">
        <table className="table align-middle table-hover">
          <thead className="table-light">
            <tr>
              <th><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /></th>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Shift Timing</th>
              <th>Location</th>
              <th>Performance Rating</th>
              <th>Attendance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((staff, index) => {
              const globalIndex = (currentPage - 1) * rowsPerPage + index;
              return (
                <tr
                  key={staff._id}
                  onClick={() => handleRowClick(staff)}
                  style={{ cursor: staff.role === "Driver" ? "pointer" : "default" }}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(globalIndex)}
                      onChange={(e) => handleSelectRow(e, index)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td>{staff.staffId?.toUpperCase() || "--"}</td>
                  <td>{staff.fullName}</td>
                  <td>{staff.role}</td>
                  <td>{staff.shift || "--"}</td>
                  <td>{staff.baseLocation}</td>
                  <td><span className="text-warning">★★★★☆</span> <span className="ms-1 text-muted">(4.0)</span></td>
                  <td>
                    <span
                      className={`badge clickable ${staff.attendance === "Absent" ? "bg-danger" : "bg-success"}`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const newStatus = staff.attendance === "Absent" ? "Present" : "Absent";
                        try {
                          const res = await axiosInstance.put(`/staff/update/${staff._id}`, { attendance: newStatus });
                          const updatedStaff = res.data.staff;
                          if (updatedStaff) {
                            setStaffData(prev =>
                              prev.map(s =>
                                s._id === updatedStaff._id ? { ...s, attendance: updatedStaff.attendance } : s
                              )
                            );
                          }
                        } catch (err) {
                          console.error("Failed to update attendance:", err);
                        }
                      }}
                    >
                      {staff.attendance || "Present"}
                    </span>
                  </td>
                  <td
                    className="position-relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span onClick={(e) => toggleMenu(index, e)} className="dots">⋯</span>
                    {menuIndex === index && (
                      <div
                        ref={menuRef}
                        className="dropdown-menu show"
                        style={{ position: "absolute", top: "20px", right: "0", zIndex: 1000 }}
                      >
                        <button
                          className="dropdown-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditStaff(staff);
                            setMenuIndex(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="dropdown-item text-danger"
                          onClick={(e) => {
                            handleDelete(e, staff._id);
                            setMenuIndex(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination-wrapper mt-4">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
              &lt; Back
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(p)}>{p}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
              Next &gt;
            </button>
          </li>
        </ul>
      </div>

      {showAddModal && (
        <AddNewStaffModal
          onClose={() => setShowAddModal(false)}
          onStaffAdded={(newStaff) => setStaffData((prev) => [...prev, newStaff])}
        />
      )}
      {showAssignModal && (
        <AssignNewTaskModal onClose={() => setShowAssignModal(false)} />
      )}

      {editStaff && (
        <div className="modal-overlay">
          <div className="add-staff-modal">
            <div className="modal-header-custom">
              <h5 className="modal-title-custom">Edit Staff</h5>
              <button className="modal-close-btn" onClick={() => setEditStaff(null)}>×</button>
            </div>
            <div className="modal-form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editStaff.fullName}
                  onChange={(e) => setEditStaff({ ...editStaff, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Contact Info</label>
                <input
                  type="text"
                  className="form-control"
                  value={editStaff.contactInfo}
                  onChange={(e) => setEditStaff({ ...editStaff, contactInfo: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  className="form-select"
                  value={editStaff.role}
                  onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })}
                >
                  <option>Driver</option>
                  <option>Warehouse Manager</option>
                  <option>Delivery Coordinator</option>
                </select>
              </div>
              <div className="form-group">
                <label>Shift</label>
                <select
                  className="form-select"
                  value={editStaff.shift}
                  onChange={(e) => setEditStaff({ ...editStaff, shift: e.target.value })}
                >
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                  <option>Rotational</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editStaff.email}
                  onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                />
              </div>
              <div className="form-group full-width">
                <label>Base Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={editStaff.baseLocation}
                  onChange={(e) => setEditStaff({ ...editStaff, baseLocation: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer-custom">
              <button className="btn cancel-btn" onClick={() => setEditStaff(null)}>Cancel</button>
              <button
                className="btn save-btn"
                onClick={async () => {
                  try {
                    const res = await axiosInstance.put(`/staff/update/${editStaff._id}`, editStaff);
                    if (res.data.staff) {
                      handleSaveEdit(res.data.staff);
                    }
                  } catch {
                    alert("Update failed");
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
