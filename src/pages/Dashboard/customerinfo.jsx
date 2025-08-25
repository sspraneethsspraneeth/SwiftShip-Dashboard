import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FulfillmentModal from "../../components/order/FulfillmentModal";
import "../../styles/ui/ordermanagement.css";
import axiosInstance from "../../utils/axiosInterceptor";

const CustomerInfo = () => {
  const { state } = useLocation();
  const customer = state?.customer;

  const [showModal, setShowModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState("N/A");

  useEffect(() => {
    const fetchCustomerOrdersByPhone = async () => {
      if (!customer?.contact) return;

      try {
        // ✅ Changed fetch to axiosInstance
        const response = await axiosInstance.get(`/orders/by-phone/${customer.contact}`);
        const data = response.data;
        console.log("Fetched orders by phone:", data);

        const mappedOrders = (data.orders || []).map(order => ({
          ...order,
          orderId: order.orderId || order._id,
          date: new Date(order.createdAt).toLocaleDateString(),
          amount: parseFloat(order.totalAmount) || 0,
        }));
        setItems(mappedOrders);

        // FIX: If address is an object, extract its fields
        if (data.user?.address) {
          const addr = data.user.address;
          if (typeof addr === "string") {
            setAddress(addr);
          } else if (typeof addr === "object") {
            setAddress(`${addr.address || ''} (${addr.latitude}, ${addr.longitude})`);
          }
        } else {
          setAddress("N/A");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchCustomerOrdersByPhone();
  }, [customer?.contact]);

  const handleFulfillClick = () => setShowModal(true);

  const handleEdit = (item) => {
    const newDate = prompt("Enter new date:", item.date);
    const newAmount = prompt("Enter new amount:", item.amount);
    const newStatus = prompt("Enter new status:", item.status);

    if (newDate && newAmount && newStatus) {
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.orderId === item.orderId
            ? { ...i, date: newDate, amount: parseFloat(newAmount), status: newStatus }
            : i
        )
      );
    }
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete order ${item.orderId}?`)) {
      setItems((prevItems) => prevItems.filter((i) => i.orderId !== item.orderId));
      setSelectedOrders((prevSelected) => prevSelected.filter((id) => id !== item.orderId));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(items.map((item) => item.orderId));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  if (!customer) {
    return <div className="p-4">No customer data found.</div>;
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="container-fluid p-4 bg-white rounded">
      <h5 className="fw-bold mb-4 text-dark">Customer Information</h5>
      <div className="row mb-4 gx-3">
        <div className="col-auto"><span className="info-label">Customer ID:</span> <span className="info-value">{customer.id}</span></div>
        <div className="col-auto"><span className="info-label">Name:</span> <span className="info-value">{customer.name}</span></div>
        <div className="col-auto"><span className="info-label">Phone:</span> <span className="info-value">{customer.contact}</span></div>
        <div className="col-auto"><span className="info-label">Email:</span> <span className="info-value">{customer.email}</span></div>
        <div className="col-auto"><span className="info-label">Address:</span> <span className="info-value">{address}</span></div>
      </div>

      <h6 className="fw-bold mb-3">Order History</h6>
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>
              <input type="checkbox" checked={selectedOrders.length === items.length} onChange={handleSelectAll} />
            </th>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(item.orderId)}
                  onChange={() => handleCheckboxChange(item.orderId)}
                />
              </td>
              <td>{item.orderId}</td>
              <td className="text-success">{item.date}</td>
              <td className="text-success">
                ${typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00'}
              </td>
              <td>
                <span className="badge bg-light-success text-success border border-success">
                 {"Delivered"}
                </span>
              </td>
              <td className="position-relative">
                <div className="dropdown">
                  <span className="dots" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    •••
                  </span>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item text-primary" onClick={() => handleEdit(item)}>Edit</button>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={() => handleDelete(item)}>Delete</button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
          <tr className="table-light fw-bold">
            <td></td>
            <td>Total</td>
            <td></td>
            <td className="text-primary">${totalAmount.toFixed(2)}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4">
        <h6 className="fw-bold mb-2">Feedback and Ratings</h6>
        <div className="border p-3 rounded bg-light">
          <div className="mb-2">
            <span className="fw-semibold">Feedback:</span>
            <span className="text-warning ms-2">
              ★★★★☆ <span className="text-success">(4.0)</span>
            </span>
          </div>
          <p className="mb-0 text-muted">Great service, but delivery was delayed by one day.</p>
        </div>
      </div>

      <FulfillmentModal show={showModal} handleClose={() => setShowModal(false)} />
    </div>
  );
};

export default CustomerInfo;
