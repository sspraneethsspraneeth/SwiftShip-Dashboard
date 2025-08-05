import React, { useState } from 'react';
import AddRoleModal from '../../components/settings/AddRoleModal';
import '../../styles/ui/UserRoleSection.css';

const initialRolesData = [
  {
    role: 'Admin',
    description: 'Full Access',
    permissions: ['All Permissions'],
  },
  {
    role: 'Manager',
    description: 'Operational Control',
    permissions: ['Dashboard', 'Shipments', 'Order Management', 'Staff Management'],
  },
  {
    role: 'Dispatcher',
    description: 'Limited to Delivery & Routes',
    permissions: ['Shipments', 'Order Management'],
  },
  {
    role: 'Finance Lead',
    description: 'Access to Billing & Transactions',
    permissions: ['Transactions', 'Reports'],
  },
  {
    role: 'Warehouse Manager',
    description: 'Warehouse & Inventory Management',
    permissions: ['Warehouse', 'Shipments', 'Staff Management'],
  },
];

const UserRolesSection = () => {
  const [roles, setRoles] = useState(initialRolesData);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const currentRows = roles;

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [fieldValue, setFieldValue] = useState('');

  const handleAddRole = (newRole) => {
    setRoles([...roles, newRole]);
    setShowModal(false);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIndexes = currentRows.map((_, i) => i);
      setSelectedTransactions(allIndexes);
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

  const handleFieldEdit = () => {
    if (!editField || fieldValue.trim() === '') return;

    const updatedRoles = [...roles];
    if (editField === 'role') updatedRoles[editIndex].role = fieldValue;
    else if (editField === 'description') updatedRoles[editIndex].description = fieldValue;
    else if (editField === 'permissions')
      updatedRoles[editIndex].permissions = fieldValue.split(',').map((p) => p.trim());

    setRoles(updatedRoles);
    setShowEditModal(false);
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter((_, i) => i !== index));
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
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
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
                <tr key={idx}>
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
                        className={`badge me-1 px-3 py-2 text-capitalize ${
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
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditModal(idx)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(idx)}>
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
                  <button className="btn btn-outline-primary" onClick={() => setEditField('role')}>Role Name</button>
                  <button className="btn btn-outline-primary" onClick={() => setEditField('description')}>Description</button>
                  <button className="btn btn-outline-primary" onClick={() => setEditField('permissions')}>Permissions (comma-separated)</button>
                  <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
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
                  placeholder={editField === 'permissions' ? 'e.g., Dashboard, Shipments' : ''}
                />
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleFieldEdit}>Save</button>
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
