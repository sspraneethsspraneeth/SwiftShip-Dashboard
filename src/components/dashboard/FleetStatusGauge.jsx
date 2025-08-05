import React from "react";
import "../../styles/ui/dashboard/DashboardPage.css"; // reuses same styles as FleetStatusGauge

const ActivityOverview = () => {
  const activities = [
    {
      id: 1,
      text: "Shipment #12345 assigned to Driver #456.",
      time: "Jan 15, 2024, 10:45 AM",
    },
    {
      id: 2,
      text: "Shipment #78901 delivered to customer.",
      time: "Jan 15, 2025, 03:00 PM",
    },
    {
      id: 3,
      text: "Shipment #78902 Delay for deliviery.",
      time: "Jan 15, 2025, 03:00 PM",
    },
  ];

  return (
    <div className="card h-100 p-3 activity-overview-card">
     <h5 className="fw-bold text-dark mb-1">Activity Overview</h5>
<div className="mb-3">
  <span className="text-success" style={{ fontSize: "14px" }}>
    <i className="bi bi-arrow-up-short" /> 16% this month
  </span>
</div>


      <div className="timeline-wrapper mt-3">
        {activities.map((activity, index) => (
          <div key={activity.id} className="timeline-item d-flex mb-4 position-relative">
            <div className="timeline-indicator">
              <span className="dot" />
              {index !== activities.length - 1 && <div className="line" />}
            </div>
            <div className="timeline-content ps-3">
              <p className="mb-1 fw-semibold text-dark" style={{ fontSize: "15px" }}>
                {activity.text}
              </p>
              <small className="text-muted" style={{ fontSize: "13px" }}>
                {activity.time}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityOverview;
