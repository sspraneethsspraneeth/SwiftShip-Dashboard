import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ui/ordermanagement.css";
import axiosInstance from "../../utils/axiosInterceptor";


const OrderManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders");
setOrderList(res.data.orders || res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async () => {
      try {
       const res = await axiosInstance.get("/transactions/all");
      setTransactions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchOrders();
    fetchTransactions();
  }, []);

  const getPaymentStatusForOrder = (order) => {
  if (!order.orderId && !order._id) return "Pending";

  const orderId = order.orderId || order._id;

  // Get all transactions for this orderId
  const relatedTxns = transactions
    .filter((txn) => txn.orderId === orderId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // most recent first

  const latestTxn = relatedTxns[0];

  return latestTxn?.status || "Pending";
};

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const filteredOrders = orderList.filter(
    (order) =>
      (order.customer || order.senderName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.orderId || order._id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRowClick = (order) => {
    navigate(`/dashboard/orders/${order.orderId || order._id}`, { state: { order } });
  };

  const handleEdit = (order) => {
    const newCustomer = prompt("Enter new customer name:", order.customer || order.senderName);
    if (newCustomer && newCustomer.trim()) {
      setOrderList((prev) =>
        prev.map((o) =>
          (o.orderId === order.orderId || o._id === order._id)
            ? { ...o, customer: newCustomer }
            : o
        )
      );
    }
    setActiveDropdown(null);
  };

  const handleDelete = (order) => {
    if (window.confirm(`Are you sure you want to delete ${order.orderId || order._id}?`)) {
      setOrderList((prev) =>
        prev.filter((o) => o.orderId !== order.orderId && o._id !== order._id)
      );
      setSelectedOrders((prev) =>
        prev.filter((id) => id !== order.orderId && id !== order._id)
      );
    }
    setActiveDropdown(null);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleSelectRow = (e, orderId) => {
    if (e.target.checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const isAllSelected =
    currentRows.length > 0 &&
    currentRows.every((order) =>
      selectedOrders.includes(order.orderId || order._id)
    );

  const handleSelectAll = (e) => {
    const currentPageIds = currentRows.map((o) => o.orderId || o._id);
    if (e.target.checked) {
      setSelectedOrders((prev) => [...new Set([...prev, ...currentPageIds])]);
    } else {
      setSelectedOrders((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading orders...</div>;
  }

  return (
    <div className="container-fluid shipments-table-section">
      {/* Search Bar */}
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="input-group search-box" style={{ width: "50%" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search order"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="input-group-text">
              <i className="bi bi-search text-success"></i>
            </span>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-end gap-2 mt-2 mt-md-0">
          <button className="btn btn-outline-secondary">
            <i className="bi bi-funnel"></i> Sort
          </button>
          <button className="btn btn-outline-secondary">
            <i className="bi bi-sliders"></i> Filter
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="row align-items-center justify-content-between mb-3">
        <div className="col">
          <h4 className="fw-bold shipment-title">All Order List</h4>
        </div>
        <div className="col-auto">
          <select className="form-select form-select-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Order Date</th>
              <th>Contact Number</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((order, index) => (
              <tr
                key={order.orderId || order._id}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(order)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.orderId || order._id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleSelectRow(e, order.orderId || order._id)
                    }
                  />
                </td>
                <td className="order-id text-warning">{order.orderId || order._id}</td>
                <td>{order.customer || order.senderName}</td>
                <td>{new Date(order.date || order.createdAt).toLocaleDateString()}</td>
                <td>{order.contact || order.senderPhone}</td>
                <td>
                  <span className={`badge bg-${getStatusColor(getPaymentStatusForOrder(order))}`}>
                    {getPaymentStatusForOrder(order)}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()} className="position-relative">
                  <div className="dropdown">
                    <span
                      className="dots"
                      role="button"
                      onClick={() => toggleDropdown(index)}
                    >
                      •••
                    </span>
                    {activeDropdown === index && (
                      <ul
                        className="dropdown-menu show"
                        style={{ display: "block", position: "absolute" }}
                      >
                        <li>
                          <button
                            className="dropdown-item text-primary"
                            onClick={() => handleEdit(order)}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleDelete(order)}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {currentRows.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="row mt-3">
        <div className="col d-flex justify-content-end">
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  &lt; Back
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                  <button
                    className={`page-link ${currentPage === page ? "bg-dark text-white border-dark" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  Next &gt;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
