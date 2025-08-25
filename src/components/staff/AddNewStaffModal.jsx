import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/ui/staff.css";
import axiosInstance from "../../utils/axiosInterceptor";

const AddNewStaffModal = ({ onClose, onStaffAdded }) => {
  const [formData, setFormData] = useState({
    profilePicture: "",
    fullName: "",
    contactInfo: "",
    role: "Driver",
    shift: "Morning",
    email: "",
    baseLocation: "New York Warehouse",
    warehouseName: "", // selected from dropdown
  });

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [warehouseOptions, setWarehouseOptions] = useState([]);

  useEffect(() => {
    // Fetch warehouses to populate dropdown
    axiosInstance
      .get("/warehouse/all")
      .then((res) => {
        const data = res.data;
        setWarehouseOptions(data);
        if (data.length > 0 && !formData.warehouseName) {
          setFormData((prev) => ({ ...prev, warehouseName: data[0].name }));
        }
      })
      .catch((err) => console.error("Failed to load warehouses", err));
  }, []);

  useEffect(() => {
    setValidationErrors(validateForm());
  }, [formData]);

  const capitalizeName = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const errors = {};
    if (!validateEmail(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!/^\d{10,15}$/.test(formData.contactInfo)) {
      errors.contactInfo = "Phone number must be 10–15 digits";
    }
    if (!formData.fullName.trim()) {
      errors.fullName = "Name is required";
    }
    if (formData.role !== "Driver" && !formData.warehouseName.trim()) {
      errors.warehouseName = "Warehouse name is required";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    } else if (name === "contactInfo") {
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, contactInfo: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    const capitalizedFullName = capitalizeName(formData.fullName);

    const payload = {
      ...formData,
      fullName: capitalizedFullName,
    };

    if (formData.role !== "Driver") {
      payload.baseLocation = formData.warehouseName;
    }

    try {
      const response = await axiosInstance.post("/staff/add", payload);
      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        toast.success("Staff added successfully!");
        setFormData({
          profilePicture: "",
          fullName: "",
          contactInfo: "",
          role: "Driver",
          shift: "Morning",
          email: "",
          baseLocation: "New York Warehouse",
          warehouseName: "",
        });
        onStaffAdded(data.staff);
        setTimeout(() => onClose(), 1500);
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="modal-overlay">
        <div className="add-staff-modal">
          <div className="modal-header-custom">
            <h5 className="modal-title-custom">Add New Staff</h5>
            <button className="modal-close-btn" onClick={onClose}>×</button>
          </div>

          <div className="modal-form-grid">
            <div className="form-group">
              <label>Profile Picture</label>
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
              {validationErrors.fullName && (
                <small className="text-danger">{validationErrors.fullName}</small>
              )}
            </div>

            <div className="form-group">
              <label>Contact Info</label>
              <input
                type="text"
                name="contactInfo"
                className="form-control"
                placeholder="9876543210"
                value={formData.contactInfo}
                onChange={handleChange}
              />
              {validationErrors.contactInfo && (
                <small className="text-danger">{validationErrors.contactInfo}</small>
              )}
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option>Driver</option>
                <option>Warehouse Manager</option>
                <option>Delivery Coordinator</option>
                <option>Security</option>
                <option>Inventory Coordinator</option>
              </select>
            </div>

            <div className="form-group">
              <label>Shift</label>
              <select
                name="shift"
                className="form-select"
                value={formData.shift}
                onChange={handleChange}
              >
                <option>Morning</option>
                <option>Evening</option>
                <option>Night</option>
                <option>Rotational</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
              />
              {validationErrors.email && (
                <small className="text-danger">{validationErrors.email}</small>
              )}
            </div>

            {formData.role === "Driver" ? (
              <div className="form-group full-width">
                <label>Base Location</label>
                <select
                  name="baseLocation"
                  className="form-select"
                  value={formData.baseLocation}
                  onChange={handleChange}
                >
                  <option>New York Warehouse</option>
                  <option>Los Angeles Hub</option>
                  <option>Chicago Delivery Zone</option>
                </select>
              </div>
            ) : (
              <div className="form-group full-width">
                <label>Warehouse Name</label>
                <select
                  name="warehouseName"
                  className="form-select"
                  value={formData.warehouseName}
                  onChange={handleChange}
                >
                  {warehouseOptions.length > 0 ? (
                    warehouseOptions.map((wh) => (
                      <option key={wh._id} value={wh.name}>
                        {wh.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No warehouses found</option>
                  )}
                </select>
                {validationErrors.warehouseName && (
                  <small className="text-danger">{validationErrors.warehouseName}</small>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer-custom">
            <button className="btn cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button className="btn save-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Staff"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewStaffModal;
