import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/ui/report.css";
import axiosInstance from "../../utils/axiosInterceptor";


ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart) {
    const { width, height, ctx } = chart;
    const text = "Breakdown";

    ctx.save();
    ctx.font = "14px Inter, sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
    ctx.restore();
  },
};

const ShipmentStatusChart = () => {
  const [timeRange, setTimeRange] = useState("This Month");
  const [statusCounts, setStatusCounts] = useState({
    Delivery: 0,
    "In Transit": 0,
    Pending: 0,
    Cancelled: 0,
  });

  useEffect(() => {
    const fetchStatusBreakdown = async () => {
      try {
        const res = await axiosInstance.get("/shipment/status-breakdown");
        setStatusCounts(res.data);
      } catch (err) {
        console.error("Failed to fetch status breakdown:", err);
      }
    };

    fetchStatusBreakdown(); // initial fetch

    const interval = setInterval(fetchStatusBreakdown, 10000); // every 10 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  const data = {
    labels: ["Delivery", "In Transit", "Pending", "Cancelled"],
    datasets: [
      {
        label: "Shipment Status",
        data: [
          statusCounts.Delivery,
          statusCounts["In Transit"],
          statusCounts.Pending,
          statusCounts.Cancelled,
        ],
        backgroundColor: ["#678AF7", "#FD8ADC", "#6BDAAE", "#8F59EF"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="report-chart-card d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center px-3 pt-3">
        <h6 className="report-chart-title mb-0">Shipment Status</h6>
        <div>
          <select
            className="form-select form-select-sm"
            style={{ width: "123px" }}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="report-chart-wrapper px-3 d-flex align-items-center justify-content-center">
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>

      <div className="report-legend-container pb-3">
        {Object.entries(statusCounts).map(([status, count]) => {
          const colors = {
            Delivery: "#678AF7",
            "In Transit": "#FD8ADC",
            Pending: "#6BDAAE",
            Cancelled: "#8F59EF",
          };
          return (
            <div key={status} className="report-legend-item">
              <span className="legend-dot" style={{ backgroundColor: colors[status] }}></span>
              <span className="legend-label">{status} <strong>{count}</strong></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipmentStatusChart;
