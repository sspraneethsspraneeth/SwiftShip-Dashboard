import React, { useState, useEffect } from 'react';
import '../../styles/ui/SettingsPage.css';

const NotificationsSettingsSection = ({ userId }) => {
  // Load saved channels or default
  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem('notificationChannels');
    return saved ? JSON.parse(saved) : { email: true, sms: true, webPush: false };
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('notificationAlerts');
    return saved
      ? JSON.parse(saved)
      : { newOrder: true, lowStock: false, shipmentUpdates: false, maintenance: false };
  });

  useEffect(() => {
    localStorage.setItem('notificationChannels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('notificationAlerts', JSON.stringify(alerts));
  }, [alerts]);

  const handleChannelToggle = (channel) => {
    setChannels((prev) => {
      const newValue = !prev[channel];
      if (newValue && (channel === 'email' || channel === 'webPush')) {
        sendNotification(channel);
      }
      return { ...prev, [channel]: newValue };
    });
  };

  const handleAlertToggle = (alertType) => {
    setAlerts((prev) => ({ ...prev, [alertType]: !prev[alertType] }));
  };

  const sendNotification = async (channel) => {
    try {
      if (!userId) {
        console.error('User ID is required to send notifications');
        return;
      }

      const notificationData = {
        userId,
        title: channel === 'email' ? 'Email Alert Enabled' : 'Web Push Enabled',
        message:
          channel === 'email'
            ? 'You have enabled email notifications.'
            : 'You have enabled web push notifications.',
        type: channel,
      };

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send notification: ${errorText}`);
      }

      const result = await response.json();
      console.log('Notification sent:', result.notification);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleSave = () => {
    console.log('Notification Settings Saved:', { channels, alerts });
    // You can extend here to send user preferences to backend if needed
  };

  return (
    <div className="card p-4 shadow-sm">
      <h6 className="fw-bold">Notification Preferences</h6>
      <p className="text-muted">Configure how you want to receive notifications and alerts</p>

      <h6 className="fw-bold mt-4">Communication Channels</h6>

      {/* Email Alerts */}
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

      {/* SMS Alerts */}
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

      {/* Web Push */}
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

      {/* Alert Types */}
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
          <label className="form-check-label" htmlFor="newOrder">
            New Order Notifications
          </label>
        </div>
        <div className="form-check me-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="lowStock"
            checked={alerts.lowStock}
            onChange={() => handleAlertToggle('lowStock')}
          />
          <label className="form-check-label" htmlFor="lowStock">
            Inventory Low Stock Alerts
          </label>
        </div>
        <div className="form-check me-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="shipmentUpdates"
            checked={alerts.shipmentUpdates}
            onChange={() => handleAlertToggle('shipmentUpdates')}
          />
          <label className="form-check-label" htmlFor="shipmentUpdates">
            Shipment Status Updates
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="maintenance"
            checked={alerts.maintenance}
            onChange={() => handleAlertToggle('maintenance')}
          />
          <label className="form-check-label" htmlFor="maintenance">
            System Maintenance Notices
          </label>
        </div>
      </div>

      <div className="text-end">
        <button className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default NotificationsSettingsSection;
