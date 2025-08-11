import React, { useState, useEffect } from 'react';
import AddRoleModal from '../../components/settings/AddRoleModal';
import '../../styles/ui/UserRoleSection.css';

const UserRolesSection = () => {
  const [roles, setRoles] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [fieldValue, setFieldValue] = useState('');

  const currentRows = roles;

  // ✅ Fetch roles from backend on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/roles');
      if (!res.ok) throw new Error('Failed to fetch roles');
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  // ✅ Add new role to state (AddRoleModal does POST)
  const handleAddRole = (savedRole) => {
    setRoles([...roles, savedRole]);
    setShowModal(false);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTransactions(currentRows.map((_, i) => i));
    } else {
      setSelectedTransactions([]);
    }
  };

  const openEditModal = (index) => {
    setEditIndex(index);
    setShowEditModal(true);
    setEditField('');
    setFieldValue('');
  };

  const handleFieldEdit = async () => {
    if (!editField || fieldValue.trim() === '') return;

    const updatedRoles = [...roles];
    if (editField === 'role') {
      updatedRoles[editIndex].role = fieldValue;
    } else if (editField === 'description') {
      updatedRoles[editIndex].description = fieldValue;
    } else if (editField === 'permissions') {
      updatedRoles[editIndex].permissions = fieldValue.split(',').map((p) => p.trim());
    }

    setRoles(updatedRoles);

    // ✅ Send update to backend
    try {
      await fetch(`http://localhost:5000/api/roles/${updatedRoles[editIndex]._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoles[editIndex]),
      });
    } catch (err) {
      console.error('Error updating role:', err);
    }

    setShowEditModal(false);
    setEditIndex(null);
  };

  const handleDelete = async (index) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      const roleToDelete = roles[index];
      try {
        await fetch(`http://localhost:5000/api/roles/${roleToDelete._id}`, {
          method: 'DELETE',
        });
        setRoles(roles.filter((_, i) => i !== index));
      } catch (err) {
        console.error('Error deleting role:', err);
      }
    }
  };

  return (
    <>
      <div className="card p-4 shadow-sm user-roles-card">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="fw-semibold mb-1">User Roles Management</h6>
            <p className="text-muted small mb-0">
              Manage user roles and their permissions across the system
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            Add Role
          </button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      currentRows.length > 0 &&
                      selectedTransactions.length === currentRows.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Role</th>
                <th>Description</th>
                <th>Permissions</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, idx) => (
                <tr key={role._id || idx}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(idx)}
                      onChange={() => {
                        const isSelected = selectedTransactions.includes(idx);
                        setSelectedTransactions((prev) =>
                          isSelected
                            ? prev.filter((i) => i !== idx)
                            : [...prev, idx]
                        );
                      }}
                    />
                  </td>
                  <td className="fw-medium">{role.role}</td>
                  <td>{role.description}</td>
                  <td>
                    {role.permissions.map((perm, i) => (
                      <span
                        key={i}
                        className={`badge me-1 px-3 py-2 text-capitalize  ${
                          perm === 'All Permissions'
                            ? 'badge-all-permissions'
                            : perm === 'Dashboard'
                            ? 'badge-dashboard'
                            : perm === 'Shipments'
                            ? 'badge-shipments'
                            : perm === 'Order Management'
                            ? 'badge-orders'
                            : perm === 'Staff Management'
                            ? 'badge-staff'
                            : perm === 'Transactions'
                            ? 'badge-transactions'
                            : perm === 'Reports'
                            ? 'badge-reports'
                            : perm === 'Warehouse'
                            ? 'badge-warehouse'
                            : 'bg-secondary'
                        }`}
                      >
                        {perm}
                      </span>
                    ))}
                  </td>
                  <td>
                    <div className="d-flex justify-content-end gap-2 flex-wrap flex-md-nowrap">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openEditModal(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>

      {/* Add Role Modal */}
      {showModal && (
        <AddRoleModal
          onClose={() => setShowModal(false)}
          onSave={handleAddRole}
        />
      )}

      {/* Edit Role Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-card p-4">
            <h6 className="mb-3">Edit Role Field</h6>
            {!editField ? (
              <div>
                <p className="mb-2">What would you like to edit?</p>
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setEditField('role')}
                  >
                    Role Name
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setEditField('description')}
                  >
                    Description
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setEditField('permissions')}
                  >
                    Permissions (comma-separated)
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="form-label">
                  Enter new value for <strong>{editField}</strong>
                </label>
                <input
                  type="text"
                  className="form-control mb-3"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  placeholder={
                    editField === 'permissions'
                      ? 'e.g., Dashboard, Shipments'
                      : ''
                  }
                />
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleFieldEdit}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserRolesSection;
