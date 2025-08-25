import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

import "../../styles/ui/dashboard/DashboardPage.css";
import axiosInstance from "../../utils/axiosInterceptor";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip
);

const RevenueChart = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axiosInstance.get("/transactions/monthly-revenue-breakdown");
        const revenue = res.data.revenueByMonth || [];

        setMonthlyRevenue(revenue);

        const total = revenue.reduce((acc, curr) => acc + curr, 0);
        setTotalRevenue(total);
      } catch (error) {
        console.error("Failed to fetch monthly revenue:", error);
      }
    };

    fetchRevenue(); // Initial fetch

    const intervalId = setInterval(fetchRevenue, 10000); // Refresh every 10s

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedRevenue = monthlyRevenue.map(value => value);

  const data = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Revenue',
        backgroundColor: '#e5e7eb',
        borderColor: '#e5e7eb',
        borderRadius: 4,
        data: formattedRevenue,
        barThickness: 24,
        categoryPercentage: 0.5,
        maxBarThickness: 30,
      },
      {
        type: 'line',
        label: 'Trend',
        borderColor: '#ff6b6b',
        backgroundColor: '#ff6b6b',
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.4,
        data: formattedRevenue,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#9ca3af',
          font: { family: 'montserrat', size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
          color: '#9ca3af',
          font: { family: 'montserrat', size: 12 },
        },
        grid: { color: '#f3f4f6' },
      },
    },
  };

  return (
    <div className="revenue-chart-container">
      <div className="card-body d-flex flex-column h-100 p-0">
        <div className="chart-header d-flex justify-content-between align-items-center px-3 pt-3">
          <div>
            <h3 className="chart-title mb-1">Total Revenue</h3>
            <div className="chart-earnings-container d-flex align-items-center">
              <span className="chart-earnings me-2">Earnings:</span>
              <span className="chart-earnings-value text-danger fw-bold">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(totalRevenue)}
              </span>
            </div>
          </div>
          <div className="chart-dropdown">
            <select className="form-select form-select-sm" style={{ width: '123px' }}>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
        <div className="chart-content">
          <div className="chart-area">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
