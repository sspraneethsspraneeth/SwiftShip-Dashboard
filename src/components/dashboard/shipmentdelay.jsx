import React from "react";
import "../../styles/ui/dashboard/DashboardPage.css";

const ShipmentDelays = () => {
  return (
    <div className="shipments-delays-container d-flex flex-column h-100 {
">
      <div className="card-body d-flex flex-column h-100 p-0">
        <div className="delays-header d-flex justify-content-between align-items-center px-3 pt-3">
  <h3 className="delays-title mb-0">Shipment Delays</h3>
  <div className="delays-dropdown">
    <select className="form-select form-select-sm" style={{ width: '123px' }} aria-label="Select time range">
      <option>This Month</option>
      <option>Last Month</option>
      <option>This Year</option>
    </select>
  </div>
</div>


        <div className="delays-chart-area">
          {/* Donut Chart Placeholder */}
          <div className="donut-chart-container position-relative d-flex align-items-center justify-content-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Example static donut slices */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#678AF7" strokeWidth="20" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="#FD8ADC" strokeWidth="20" strokeDasharray="94.2 150" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="#6BDAAE" strokeWidth="20" strokeDasharray="188.4 150" />
              {/* Center Label */}
              <text x="100" y="90" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#283D56">
                12%
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="14" fill="#727272">
                Delayed
              </text>
            </svg>
          </div>
        </div>

        <div className="legend d-flex justify-content-center gap-4 pb-3">
  <div className="legend-item d-flex align-items-center gap-1">
    <span className="legend-dot traffic"></span>
    <span className="legend-label">Traffic <strong>25</strong></span>
  </div>
  <div className="legend-item d-flex align-items-center gap-1">
    <span className="legend-dot weather"></span>
    <span className="legend-label">Weather <strong>15</strong></span>
  </div>
  <div className="legend-item d-flex align-items-center gap-1">
    <span className="legend-dot other"></span>
    <span className="legend-label">Other <strong>5</strong></span>
  </div>
</div>

      </div>
    </div>
  );
};

export default ShipmentDelays;