// src/pages/Dashboard/Reports.jsx

import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import TotalShipmentsCard from "../../components/reports/TotalShipmentsCard";
import TotalDeliveriesCard from "../../components/reports/TotalDeliveriesCard";
import AvgDeliveryTimeCard from "../../components/reports/AverageDeliveryTimeCard";
import RevenueCard from "../../components/reports/RevenueCard";
import TotalDeliveriesChart from "../../components/reports/TotalDeliveriesChart";
import ShipmentStatusDoughnut from "../../components/reports/ShipmentStatusChart";
import RevenueGrowthChart from "../../components/reports/RevenueGrowthChart";

import "../../styles/ui/report.css";

const Reports = () => {
  return (
    <div className="reports-page">
      <div className="container-fluid px-4 py-4">

        {/* Row 1: Key Stats */}
        <div className="row dashboard-cards gx-4 gy-4">
          <div className="col-12 col-sm-6 col-md-6 col-lg-3"><TotalShipmentsCard /></div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-3"><TotalDeliveriesCard /></div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-3"><AvgDeliveryTimeCard /></div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-3"><RevenueCard /></div>
        </div>

        {/* Row 2: Charts */}
        <div className="row gx-4 gy-4 mt-4">
          <div className="col-12 col-md-8"><TotalDeliveriesChart /></div>
          <div className="col-12 col-md-4"><ShipmentStatusDoughnut /></div>
        </div>

        {/* Row 3: Revenue Growth */}
        <div className="row gx-4 gy-4 mt-4">
          <div className="col-12"><RevenueGrowthChart /></div>
        </div>

      </div>
    </div>
  );
};

export default Reports;