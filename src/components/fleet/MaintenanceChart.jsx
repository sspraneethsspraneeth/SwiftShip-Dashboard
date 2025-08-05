// src/components/vehicle/MaintenanceChart.jsx

import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const MaintenanceChart = () => {
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Odometer Reading (km)",
        data: [60000, 70000, 71000, 68000, 74000, 78000, 82000],
        borderColor: "#ec4899",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Distance Covered (km)",
        data: [1000, 2000, 1200, 1500, 2200, 1800, 2100],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0">Maintenance</h6>
        <select className="form-select form-select-sm w-auto">
          <option>Monthly</option>
        </select>
      </div>
      <div style={{ height: "240px" }}>
        <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
      </div>
    </>
  );
};

export default MaintenanceChart;
