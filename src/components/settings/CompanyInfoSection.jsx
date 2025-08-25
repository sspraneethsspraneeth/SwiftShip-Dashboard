// src/components/settings/CompanyInfoSection.jsx
import React, { useState } from 'react';
import axiosInstance from "../../utils/axiosInterceptor";


const CompanyInfoSection = () => {
  const [companyInfo, setCompanyInfo] = useState({
    logo: null,
    companyName: 'Swift Ship',
    email: 'support@swiftship.com',
    phone: '9876543210',
    address: '201, Logistics Tower, Mumbai, Maharashtra 400001',
  });

  const [preferences, setPreferences] = useState({
    currency: '₹ INR - Indian Rupee',
    timezone: 'Asia/Kolkata (GMT+5:30)',
    language: 'English',
  });

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setCompanyInfo({ ...companyInfo, logo: e.target.files[0] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo({ ...companyInfo, [name]: value });
  };

  const handlePrefChange = (e) => {
    const { name, value } = e.target;
    setPreferences({ ...preferences, [name]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Append company info
      formData.append('companyName', companyInfo.companyName);
      formData.append('email', companyInfo.email);
      formData.append('phone', companyInfo.phone);
      formData.append('address', companyInfo.address);
      if (companyInfo.logo) {
        formData.append('logo', companyInfo.logo);
      }

      // Append preferences
      formData.append('currency', preferences.currency);
      formData.append('timezone', preferences.timezone);
      formData.append('language', preferences.language);

      await axiosInstance.post("/company-info", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Company information saved successfully!');
    } catch (err) {
      console.error('Error saving company info:', err);
      alert('Failed to save company information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card p-4 mb-4 shadow-sm">
        <h6 className="fw-semibold mb-3">Company Information</h6>
        <div className="row g-4">
          <div className="col-md-3">
            <label className="form-label">Company Logo</label>
            <div className="d-flex align-items-center">
              <div
                className="form-control"
                style={{
                  backgroundColor: '#f9f9fc',
                  height: '38px',
                  fontSize: '14px',
                  color: '#6c757d',
                  borderTopRightRadius: '0',
                  borderBottomRightRadius: '0',
                }}
              >
                {companyInfo.logo ? companyInfo.logo.name : 'Select file'}
              </div>
              <label
                htmlFor="company-logo-input"
                className="btn"
                style={{
                  backgroundColor: '#7f56d9',
                  color: '#fff',
                  height: '35px',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                }}
              >
                Browse
              </label>
              <input
                type="file"
                id="company-logo-input"
                accept="image/*"
                className="d-none"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-control"
              name="companyName"
              value={companyInfo.companyName}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Contact Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={companyInfo.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Contact Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={companyInfo.phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              rows="2"
              name="address"
              value={companyInfo.address}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <h6 className="fw-semibold mb-3">Preferences</h6>
        <div className="row g-4">
          <div className="col-md-4">
            <label className="form-label">Default Currency</label>
            <select
              className="form-select"
              name="currency"
              value={preferences.currency}
              onChange={handlePrefChange}
            >
              <option>₹ INR - Indian Rupee</option>
              <option>$ USD - US Dollar</option>
              <option>€ EUR - Euro</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Timezone</label>
            <select
              className="form-select"
              name="timezone"
              value={preferences.timezone}
              onChange={handlePrefChange}
            >
              <option>Asia/Kolkata (GMT+5:30)</option>
              <option>America/New_York (GMT-4)</option>
              <option>Europe/London (GMT+1)</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Language</label>
            <select
              className="form-select"
              name="language"
              value={preferences.language}
              onChange={handlePrefChange}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary px-4"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </>
  );
};

export default CompanyInfoSection;
