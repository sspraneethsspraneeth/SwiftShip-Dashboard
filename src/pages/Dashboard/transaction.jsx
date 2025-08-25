import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../styles/ui/transaction.css";
import axiosInstance from "../../utils/axiosInterceptor";


const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get("/transactions/all");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleEdit = (item) => {
    const newCustomer = prompt("Edit Customer Name", item.customer);
    const newStatus = prompt("Edit Status", item.status);
    if (newCustomer && newStatus) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.txnId === item.txnId
            ? { ...t, customer: newCustomer, status: newStatus }
            : t
        )
      );
    }
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete transaction ${item.txnId}?`)) {
      setTransactions((prev) => prev.filter((t) => t.txnId !== item.txnId));
      setSelectedTransactions((prev) => prev.filter((id) => id !== item.txnId));
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    t.txnId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTransactions.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allCurrentIds = currentRows.map((row) => row.txnId);
      setSelectedTransactions(allCurrentIds);
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleCheckboxChange = (txnId) => {
    setSelectedTransactions((prev) =>
      prev.includes(txnId)
        ? prev.filter((id) => id !== txnId)
        : [...prev, txnId]
    );
  };

  return (
    <div className="container-fluid shipments-table-section">
      {/* Search Bar & Filter */}
      <div className="row align-items-center justify-content-between mb-3">
        <div className="col-md-3">
          <div className="input-group search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="input-group-text">
              <i className="bi bi-search text-success"></i>
            </span>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <h4 className="fw-bold shipment-title">All Transactions List</h4>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-end gap-2">
          <label className="fw-medium mb-0">Filter Date:</label>
          <input type="date" className="form-control form-control-sm" style={{ width: "15%" }} />
          <input type="date" className="form-control form-control-sm" style={{ width: "15%" }} />
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
                  checked={currentRows.length > 0 && selectedTransactions.length === currentRows.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTransactions.includes(item.txnId)}
                    onChange={() => handleCheckboxChange(item.txnId)}
                  />
                </td>
                <td className="text-orange fw-semibold">{item.txnId}</td>
                <td>{item.customer}</td>
                <td>
                  <span className={`badge bg-${item.type === "Credit" ? "warning" : "info"}`}>
                    {item.type}
                  </span>
                </td>
                <td>{typeof item.amount === "number" ? `₹${item.amount.toLocaleString()}` : item.amount}</td>
                <td>{item.method}</td>
                <td>{item.date || new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`badge bg-${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="dropdown">
                    <button
                      className="btn btn-light btn-sm"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      ⋯
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button className="dropdown-item" onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={() => handleDelete(item)}>
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="row mt-3">
        <div className="col d-flex justify-content-end">
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>‹ Back</button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next ›</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
