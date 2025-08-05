import React from "react";
import "../../styles/ui/staff.css";



const AssignNewTaskModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="assign-task-modal">
        <div className="modal-header-custom">
          <h5 className="modal-title-custom">Assign New Task</h5>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-form-grid">
          <div className="form-group">
            <label>Employee Name</label>
            <input type="text" className="form-control" placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select className="form-select">
              <option>Manager</option>
              <option>Driver</option>
              <option>Coordinator</option>
            </select>
          </div>

          <div className="form-group">
            <label>Task Type</label>
            <select className="form-select">
              <option>Select Task Type</option>
              <option>Pickup</option>
              <option>Drop-off</option>
              <option>Inventory Check</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select className="form-select">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input type="date" className="form-control" />
          </div>
          <div className="form-group">
            <label>Reports</label>
            <select className="form-select">
              <option>Daily</option>
              <option>Medium</option>
              <option>None</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Special Instructions</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Add any specific instructions for the task"
            ></textarea>
          </div>
        </div>

        <div className="modal-footer-custom">
          <button className="btn cancel-btn" onClick={onClose}>Cancel</button>
          <button className="btn save-btn">Save Route</button>
        </div>
      </div>
    </div>
  );
};

export default AssignNewTaskModal;
