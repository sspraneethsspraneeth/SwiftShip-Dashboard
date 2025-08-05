// src/components/vehicle/InsuranceChart.jsx

import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";


const InsuranceChart = () => {
  const pieChartData = {
    labels: ["Remaining", "Expired"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#836efe", "#fd7e14"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0">Insurance</h6>
        <select className="form-select form-select-sm w-auto">
          <option>Monthly</option>
        </select>
      </div>
      <div style={{ height: "240px", maxWidth: "240px", margin: "0 auto" }}>
        <Doughnut data={pieChartData} options={{ maintainAspectRatio: false }} />
      </div>
    </>
  );
};

export default InsuranceChart;
