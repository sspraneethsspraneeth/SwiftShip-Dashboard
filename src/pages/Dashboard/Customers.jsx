import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../styles/ui/transaction.css";
import axiosInstance from "../../utils/axiosInterceptor";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customersData, setCustomersData] = useState([]);

  const navigate = useNavigate();

  // ✅ Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axiosInstance.get("/customers"); // axios call
        const data = res.data; // ✅ get data from axios response

        const formatted = data.customers.map((cust, i) => ({
          id: cust.customerId || `CUST-${i.toString().padStart(6, "0")}`,
          name: cust.fullName || "N/A",
          email: cust.email || "N/A",
          contact: cust.phone || "N/A",
          totalOrders: cust.totalOrders || "0",
          status: cust.status || "Delivered",
        }));
        setCustomersData(formatted);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortClick = () => setSortAsc(!sortAsc);
  const handleFilterClick = () => setShowFilterDropdown(!showFilterDropdown);
  const handleStatusFilterSelect = (status) => {
    setFilterStatus(status);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  const handleRowClick = (customer) => {
    navigate(`/dashboard/customers/${customer.id}`, { state: { customer } });
  };

  const handleDelete = (id) => {
    setCustomersData((prev) => prev.filter((customer) => customer.id !== id));
  };

  const handleEdit = (id) => {
    const customer = customersData.find((c) => c.id === id);
    if (!customer) return;

    const name = prompt("Edit Name:", customer.name);
    const email = prompt("Edit Email:", customer.email);
    const contact = prompt("Edit Contact:", customer.contact);
    const totalOrders = prompt("Edit Total Orders:", customer.totalOrders);

    if (name && email && contact && totalOrders) {
      const updatedCustomer = { ...customer, name, email, contact, totalOrders };
      setCustomersData((prev) =>
        prev.map((c) => (c.id === id ? updatedCustomer : c))
      );
    }
  };

  const filteredCustomers = customersData
    .filter((c) =>
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((c) => (filterStatus === "" ? true : c.status === filterStatus))
    .sort((a, b) => (sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)));

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredCustomers.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const isAllSelected = currentRows.length > 0 && selectedCustomers.length === currentRows.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(currentRows.map((c) => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectOne = (e, id) => {
    e.stopPropagation();
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  return (
    <div className="container-fluid shipments-table-section">
      {/* Search and Filters */}
      <div className="row align-items-center mb-3">
        <div className="col-md-3">
          <div className="input-group search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="input-group-text">
              <i className="bi bi-search text-success"></i>
            </span>
          </div>
        </div>
        <div className="col-md-9 d-flex justify-content-end gap-2 mt-2 mt-md-0 position-relative">
          <button className="btn btn-outline-secondary" onClick={handleSortClick}>
            <i className="bi bi-funnel"></i> Sort
          </button>
          <button className="btn btn-outline-secondary" onClick={handleFilterClick}>
            <i className="bi bi-sliders"></i> Filter
          </button>
          {showFilterDropdown && (
            <div className="position-absolute bg-white border p-2" style={{ right: 0, top: "100%", zIndex: 1000 }}>
              <div onClick={() => handleStatusFilterSelect("")} className="dropdown-item">All</div>
              <div onClick={() => handleStatusFilterSelect("Active")} className="dropdown-item">Active</div>
              <div onClick={() => handleStatusFilterSelect("Inactive")} className="dropdown-item">Inactive</div>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="row align-items-center justify-content-between mb-3">
        <div className="col">
          <h4 className="fw-bold shipment-title">All Customers List</h4>
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
                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
              </th>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Total Orders</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((customer, index) => (
              <tr key={index} onClick={() => handleRowClick(customer)} style={{ cursor: "pointer" }}>
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={(e) => handleSelectOne(e, customer.id)}
                  />
                </td>
                <td className="shipment-id">{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.contact}</td>
                <td>{customer.totalOrders}</td>
                <td><span className="badge bg-success">{customer.status}</span></td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown">
                    <button className="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">⋯</button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><button className="dropdown-item" onClick={() => handleEdit(customer.id)}>Edit</button></li>
                      <li><button className="dropdown-item text-danger" onClick={() => handleDelete(customer.id)}>Delete</button></li>
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
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>‹</button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>›</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Customers;
