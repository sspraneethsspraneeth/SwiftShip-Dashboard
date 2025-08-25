import React, { useEffect, useState } from "react";
import dotsIcon from "../../assets/icons/dots.png";
import "../../styles/ui/dashboard/DashboardPage.css";
import axiosInstance from "../../utils/axiosInterceptor";


const getStatusBadge = (status) => {
  switch (status) {
    case "Delivered":
      return "badge bg-success-subtle text-success px-3 py-1 rounded-pill";
    case "In Transit":
    case "Shipping":
      return "badge bg-warning-subtle text-warning px-3 py-1 rounded-pill";
    case "Delayed":
      return "badge bg-danger-subtle text-danger px-3 py-1 rounded-pill";
    default:
      return "badge bg-secondary";
  }
};

const RecentActivity = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchDriverName = async (origin, destination) => {
      try {
        const res = await axiosInstance.get("/staff/driver-by-route", {
          params: { origin, destination },
        });
        return res.data.driverName || "Unassigned";
      } catch {
        return "Unassigned";
      }
    };

    const fetchShipments = async () => {
      try {
        const res = await axiosInstance.get("/shipment");
        const processed = await Promise.all(
          res.data.map(async (shipment) => {
            const driverName = await fetchDriverName(shipment.start, shipment.end);
            const allDelivered = shipment.orders?.every((o) => o.status === "Delivered");
            const status = allDelivered ? "Delivered" : shipment.status || "Shipping";
            return {
              id: shipment.shipmentId,
              name: driverName,
              origin: shipment.start,
              destination: shipment.end,
              date: shipment.createdAt || "N/A",
              delivery: shipment.eta || "N/A",
              status,
            };
          })
        );
        setShipments(processed);
      } catch (err) {
        console.error("Failed to fetch recent shipments:", err);
      }
    };

    // Initial fetch
    fetchShipments();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchShipments, 10000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Recent Activity</h5>
          <select className="form-select form-select-sm w-auto">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="recent-activity" style={{ maxHeight: "320px", overflowY: "auto" }}>
          <table className="table table-borderless align-middle mb-0">
            <thead className="table-light" style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 1 }}>
              <tr>
                <th scope="col" className="ps-3">
                  <input type="checkbox" className="form-check-input" />
                </th>
                <th>Shipment ID</th>
                <th>Driver Name</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Date Shipped</th>
                <th>Estimated Delivery</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {shipments.map((item) => (
                <tr key={item.id} className="border-bottom">
                  <td className="ps-3">
                    <input type="checkbox" className="form-check-input" />
                  </td>
                  <td className="text-success">{item.id}</td>
                  <td className="text-success">{item.name}</td>
                  <td className="text-success">{item.origin}</td>
                  <td className="text-success">{item.destination}</td>
                  <td className="text-success">{item.date}</td>
                  <td className="text-success">{item.delivery}</td>
                  <td>
                    <span className={getStatusBadge(item.status)}>{item.status}</span>
                  </td>
                  <td className="text-end pe-3">
                    <img
                      src={dotsIcon}
                      alt="More Options"
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
