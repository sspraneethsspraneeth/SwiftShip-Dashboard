import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/ui/ordermanagement.css";

const FulfillmentModal = ({ show, handleClose }) => {
  const [shippingDate, setShippingDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);

  return (
    <Modal show={show} onHide={handleClose} centered className="fulfillment-modal">
      <Modal.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="fw-bold text-dark">Add Fulfillment Details</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </div>

        <Form>
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Label className="fw-semibold">Carrier</Form.Label>
              <Form.Select defaultValue="SwiftShip Logistics">
                <option>SwiftShip Logistics</option>
                <option>BlueDart</option>
                <option>FedEx</option>
              </Form.Select>
            </div>
            <div className="col-md-6">
              <Form.Label className="fw-semibold">Tracking Number</Form.Label>
              <Form.Control type="text" placeholder="Enter Tracking Number" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Label className="fw-semibold">Shipping Date</Form.Label>
              <div className="position-relative">
                <DatePicker
                  selected={shippingDate}
                  onChange={(date) => setShippingDate(date)}
                  placeholderText="Select Shipping Date"
                  className="form-control"
                />
                <i className="bi bi-calendar datepicker-icon"></i>
              </div>
            </div>
            <div className="col-md-6">
              <Form.Label className="fw-semibold">Estimated Delivery Date</Form.Label>
              <div className="position-relative">
                <DatePicker
                  selected={deliveryDate}
                  onChange={(date) => setDeliveryDate(date)}
                  placeholderText="Select Delivery Date"
                  className="form-control"
                />
                <i className="bi bi-calendar datepicker-icon"></i>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="light"
              className="me-2 px-4"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button className="btn-submit-fulfillment px-4">Submit Fulfillment</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FulfillmentModal;
