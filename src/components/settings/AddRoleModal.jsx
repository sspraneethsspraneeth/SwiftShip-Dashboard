// src/components/settings/AddRoleModal.jsx
import React, { useState } from 'react';
import '../../styles/ui/UserRoleSection.css';
import axiosInstance from "../../utils/axiosInterceptor";


const PERMISSIONS = [
  'Dashboard',
  'Shipments',
  'Route Planning',
  'Staff Management',
  'Order Management',
  'Customers',
  'Deliveries',
  'Reports',
  'Warehouse',
  'Settings',
];

const AddRoleModal = ({ onClose, onSave }) => {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePermissionToggle = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  const handleSubmit = async () => {
  if (!roleName.trim()) {
    alert("Role name is required");
    return;
  }

  const newRole = {
    role: roleName,
    description,
    permissions: selectedPermissions,
  };

  try {
    setLoading(true);
    const res = await axiosInstance.post("/roles", newRole);
    const savedRole = res.data;

    onSave(savedRole); // Update parent state with new role
    onClose();
  } catch (err) {
    console.error(err);
    alert(
      "Error creating role: " +
        (err.response?.data?.error || err.response?.data?.message || err.message)
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal-card p-4 shadow">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="fw-semibold">Add New Role</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="row mb-3">
          <div className="col-6">
            <label className="form-label">Role Name</label>
            <input
              type="text"
              className="form-control"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
            />
          </div>
          <div className="col-6">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter role description"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Permissions</label>
          <div className="permissions-grid">
            {PERMISSIONS.map((perm, idx) => (
              <div key={idx} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedPermissions.includes(perm)}
                  onChange={() => handlePermissionToggle(perm)}
                  id={`perm-${idx}`}
                />
                <label className="form-check-label" htmlFor={`perm-${idx}`}>
                  {perm}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Create Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;
