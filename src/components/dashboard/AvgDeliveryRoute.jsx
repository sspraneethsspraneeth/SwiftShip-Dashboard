import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/ui/dashboard/DashboardPage.css";


// Register components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Custom plugin to round bar tops
const roundedBarPlugin = {
  id: "roundedBarPlugin",
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((bar, index) => {
        const { x, y, base } = bar;
        const radius = 6; // Adjust curve radius here
        const barWidth = bar.width;
        const barHeight = base - y;

        if (barHeight > radius) {
          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = dataset.backgroundColor;

          ctx.moveTo(x - barWidth / 2, base);
          ctx.lineTo(x - barWidth / 2, y + radius);
          ctx.quadraticCurveTo(x - barWidth / 2, y, x - barWidth / 2 + radius, y);
          ctx.lineTo(x + barWidth / 2 - radius, y);
          ctx.quadraticCurveTo(x + barWidth / 2, y, x + barWidth / 2, y + radius);
          ctx.lineTo(x + barWidth / 2, base);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      });
    });
  },
};

const AvgDeliveryChart = () => {
  const data = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        label: "Route (Km)",
        data: [4, 6, 2, 5, 4, 5, 3],
        backgroundColor: "#fbbf24",
        stack: "stack1",
      },
      {
        label: "Time (Hours)",
        data: [3, 4, 1, 6, 3, 2, 2],
        backgroundColor: "#8b5cf6",
        stack: "stack1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
      },
      y: {
        stacked: true,
        grid: { color: "#f0f0f0" },
        ticks: { beginAtZero: true },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 15,
          color: "#4a4a4a",
        },
      },
    },
  };

  return (
    <div className="avg-delivery-chart-container">
      <div className="card-body d-flex flex-column">
        <h3 className="avg-delivery-title">Avg Delivery Time & Route</h3>
        <div className="chart-box w-100" style={{ minHeight: "250px" }}>
          <Bar data={data} options={options} plugins={[roundedBarPlugin]} />
        </div>
      </div>
    </div>
  );
};

export default AvgDeliveryChart;