import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/ui/report.css";
import axiosInstance from "../../utils/axiosInterceptor";


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TotalDeliveriesChart = () => {
  const [range, setRange] = useState("Yearly");
  const [chartData, setChartData] = useState({
    labels: [],
    deliveryCounts: [],
    pendingCounts: [],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await await axiosInstance.get("/deliveries/chart-stats?range=${range.toLowerCase()}"
        );
        setChartData(res.data);
      } catch (err) {
        console.error("Failed to fetch delivery chart data:", err);
      }
    };

    fetchChartData(); // initial fetch

    const interval = setInterval(fetchChartData, 10000); // fetch every 10 seconds

    return () => clearInterval(interval); // cleanup on unmount or range change
  }, [range]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Delivery",
        data: chartData.deliveryCounts,
        backgroundColor: "#2563EB",
        categoryPercentage: 0.5,
        barPercentage: 0.8,
      },
      {
        label: "Pending",
        data: chartData.pendingCounts,
        backgroundColor: "#DC2626",
        categoryPercentage: 0.5,
        barPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "start",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
          callback: (value) => `${value / 1000}K`,
        },
        grid: { color: "#f3f4f6" },
      },
    },
  };

  return (
    <div className="report-chart-card">
      <div className="d-flex justify-content-between align-items-center px-3 pt-3">
        <h6 className="report-chart-title mb-0">Total Deliveries</h6>
        <select
          className="form-select form-select-sm w-auto text-muted"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          style={{
            fontSize: "0.85rem",
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            padding: "0 15px",
          }}
        >
          <option value="Yearly">Yearly</option>
          <option value="Monthly">Monthly</option>
          <option value="Weekly">Weekly</option>
        </select>
      </div>
      <div className="report-chart-wrapper px-3">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TotalDeliveriesChart;
