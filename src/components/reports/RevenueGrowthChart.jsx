import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import axiosInstance from "../../utils/axiosInterceptor";


ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend
);

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const RevenueGrowthChart = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));

  const fetchRevenueData = async () => {
    try {
      const res = await axiosInstance.get("/transactions/monthly-revenue-breakdown");
      if (res.data?.revenueByMonth) {
        setMonthlyRevenue(res.data.revenueByMonth);
      } else {
        setMonthlyRevenue(Array(12).fill(0));
      }
    } catch (err) {
      console.error("Error fetching monthly revenue:", err);
      setMonthlyRevenue(Array(12).fill(0));
    }
  };

  useEffect(() => {
    fetchRevenueData(); // initial fetch
    const interval = setInterval(fetchRevenueData, 10000); // refresh every 30 sec

    return () => clearInterval(interval); // cleanup
  }, []);

  const data = {
    labels: monthLabels,
    datasets: [
      {
        label: "Revenue Growth",
        data: monthlyRevenue,
        fill: true,
        backgroundColor: "rgba(99, 132, 255, 0.1)",
        borderColor: "#4169e1",
        pointBackgroundColor: "#4169e1",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          color: "#111",
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
        },
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          drawBorder: false,
        },
      },
    },
    hover: {
      mode: "nearest",
      intersect: false,
    },
  };

  return (
    <div className="report-card-full p-4">
      <h6 className="fw-bold mb-3">Revenue Growth</h6>
      <div className="chart-container" style={{ height: "300px", cursor: "pointer" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueGrowthChart;
