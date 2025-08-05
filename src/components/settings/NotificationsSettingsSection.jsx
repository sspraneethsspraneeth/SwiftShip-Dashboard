// src/components/settings/NotificationsSettingsSection.jsx
import React, { useState } from 'react';
import '../../styles/ui/SettingsPage.css'; // assuming styles are here

const NotificationsSettingsSection = () => {
  const [channels, setChannels] = useState({
    email: true,
    sms: true,
    webPush: false,
  });

  const [alerts, setAlerts] = useState({
    newOrder: true,
    lowStock: false,
    shipmentUpdates: false,
    maintenance: false,
  });

  const handleChannelToggle = (channel) => {
    setChannels((prev) => ({ ...prev, [channel]: !prev[channel] }));
  };

  const handleAlertToggle = (alertType) => {
    setAlerts((prev) => ({ ...prev, [alertType]: !prev[alertType] }));
  };

  const handleSave = () => {
    // TODO: Save logic to backend or localStorage
    console.log('Notification Settings Saved:', { channels, alerts });
  };

  return (
    <div className="card p-4 shadow-sm">
      <h6 className="fw-bold">Notification Preferences</h6>
      <p className="text-muted">Configure how you want to receive notifications and alerts</p>

      <h6 className="fw-bold mt-4">Communication Channels</h6>

      <div className="channel-option d-flex justify-content-between align-items-center border p-3 rounded mb-2">
        <div>
          <div className="fw-semibold">Email Alerts</div>
          <div className="text-muted small">Receive important notifications via email</div>
        </div>
        <div>
          <input
            type="checkbox"
            className="form-check-input"
            checked={channels.email}
            onChange={() => handleChannelToggle('email')}
          />
        </div>
      </div>

      <div className="channel-option d-flex justify-content-between align-items-center border p-3 rounded mb-2">
        <div>
          <div className="fw-semibold">SMS Alerts</div>
          <div className="text-muted small">Get critical updates via SMS</div>
        </div>
        <div>
          <input
            type="checkbox"
            className="form-check-input"
            checked={channels.sms}
            onChange={() => handleChannelToggle('sms')}
          />
        </div>
      </div>

      <div className="channel-option d-flex justify-content-between align-items-center border p-3 rounded mb-4">
        <div>
          <div className="fw-semibold">Web Push Notifications</div>
          <div className="text-muted small">Real-time browser notifications for immediate alerts</div>
        </div>
        <div>
          <input
            type="checkbox"
            className="form-check-input"
            checked={channels.webPush}
            onChange={() => handleChannelToggle('webPush')}
          />
        </div>
      </div>

      <h6 className="fw-bold mb-3">Alert Types</h6>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="form-check me-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="newOrder"
            checked={alerts.newOrder}
            onChange={() => handleAlertToggle('newOrder')}
          />
          <label className="form-check-label" htmlFor="newOrder">New Order Notifications</label>
        </div>
        <div className="form-check me-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="lowStock"
            checked={alerts.lowStock}
            onChange={() => handleAlertToggle('lowStock')}
          />
          <label className="form-check-label" htmlFor="lowStock">Inventory Low Stock Alerts</label>
        </div>
        <div className="form-check me-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="shipmentUpdates"
            checked={alerts.shipmentUpdates}
            onChange={() => handleAlertToggle('shipmentUpdates')}
          />
          <label className="form-check-label" htmlFor="shipmentUpdates">Shipment Status Updates</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="maintenance"
            checked={alerts.maintenance}
            onChange={() => handleAlertToggle('maintenance')}
          />
          <label className="form-check-label" htmlFor="maintenance">System Maintenance Notices</label>
        </div>
      </div>

      <div className="text-end">
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default NotificationsSettingsSection;
