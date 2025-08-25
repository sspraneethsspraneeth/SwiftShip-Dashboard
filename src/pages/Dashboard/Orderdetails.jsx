import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import FulfillmentModal from "../../components/order/FulfillmentModal";
import "../../styles/ui/ordermanagement.css";
import axiosInstance from "../../utils/axiosInterceptor";


const OrderDetails = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location?.state?.order || null);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(false);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      const res = await axiosInstance.get(`/orders/${orderId}`);
      setOrder(res.data.order || res.data);
    } catch (err) {
      console.error("Failed to fetch order:", err);
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

  if (!order) {
    fetchOrder();
  } else {
    setLoading(false);
  }

  fetchTransactions();
}, [order, orderId]);

  const handleFulfillClick = () => setShowModal(true);
  const toggleSelect = () => setSelected(!selected);

  const getLatestPaymentStatus = () => {
    if (!transactions.length || !order) return "Pending";

    const id = order.orderId || order._id;
    const relatedTxns = transactions
      .filter((txn) => txn.orderId === id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return relatedTxns[0]?.status || "Pending";
  };

  const getStatusBadgeClass = (status) => {
    const s = status.toLowerCase();
    if (s === "paid" || s === "completed") return "bg-light-success text-success border-success";
    if (s === "pending") return "bg-light-warning text-warning border-warning";
    if (s === "failed" || s === "cancelled") return "bg-light-danger text-danger border-danger";
    return "bg-light-secondary text-secondary border-secondary";
  };

  if (loading) return <div className="p-4">Loading order...</div>;
  if (!order) return <div className="p-4 text-danger">Order not found.</div>;

  const item = {
    name: order.packageType,
    qty: 1,
    price: order.cost,
    total: order.totalAmount,
  };

  const paymentStatus = getLatestPaymentStatus();

  return (
    <div className="container-fluid p-4 bg-white rounded">
      <h5 className="fw-bold mb-4 text-dark">Order Details</h5>

      <div className="row mb-4 gx-3">
        <div className="col-auto"><span className="info-label">Order ID:</span><span className="info-value">{order.orderId || order._id}</span></div>
        <div className="col-auto"><span className="info-label">Customer Name:</span><span className="info-value">{order.senderName}</span></div>
        <div className="col-auto"><span className="info-label">Contact Number:</span><span className="info-value">{order.senderPhone}</span></div>
        <div className="col-auto"><span className="info-label">Order Date:</span><span className="info-value">{new Date(order.createdAt).toLocaleDateString()}</span></div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold">Items Ordered</h6>
        <button className="btn btn-primary btn-sm px-4 fulfill-button" onClick={handleFulfillClick}>
          Fulfill Order
        </button>
      </div>

      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th><input type="checkbox" checked={selected} onChange={toggleSelect} /></th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox" checked={selected} onChange={toggleSelect} /></td>
            <td>{item.name}</td>
            <td className="text-success">{item.qty}</td>
            <td className="text-success">${item.price?.toFixed(2)}</td>
            <td className="text-success">${item.total?.toFixed(2)}</td>
            <td></td>
          </tr>
          <tr className="table-light">
            <td></td>
            <td className="fw-bold text-end">Total</td>
            <td></td>
            <td></td>
            <td className="fw-bold text-primary">${item.total?.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div className="row mt-4 gx-0">
        <div className="col-md-3">
          <h6 className="fw-bold mb-3">Payment Information</h6>
          <div className="border rounded p-2 d-inline-block me-2">
            <span className="fw-semibold">Payment Status: </span>
            <span className={`badge border ${getStatusBadgeClass(paymentStatus)}`}>
              {paymentStatus}
            </span>
          </div>
        </div>

        <div className="col-md-8">
          <h6 className="fw-bold mb-3">Shipping Information</h6>
          <div className="d-flex flex-wrap gap-2">
            <div className="info-box"><span className="fw-semibold">Shipping Method: </span><span className="text-muted">{order.deliveryType || "Standard"}</span></div>
            <div className="info-box"><span className="fw-semibold">Carrier: </span><span className="text-muted">SwiftShip Logistics</span></div>
            <div className="info-box"><span className="fw-semibold">Tracking Number: </span><span className="text-muted">TRK-{(order.orderId || order._id)?.slice(-6)}</span></div>
            <div className="info-box"><span className="fw-semibold">Estimated Delivery: </span><span className="text-muted">{order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : "TBD"}</span></div>
          </div>
        </div>
      </div>

      <FulfillmentModal show={showModal} handleClose={() => setShowModal(false)} />
    </div>
  );
};

export default OrderDetails;
