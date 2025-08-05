// src/pages/Dashboard/DashboardPage.jsx

import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import TotalShipmentsCard from "../../components/dashboard/TotalShipmentsCard";
import PendingDeliveriesCard from "../../components/dashboard/PendingDeliveriesCard";
import DeliveredCard from "../../components/dashboard/DeliveredCard";
import RevenueCard from "../../components/dashboard/RevenueCard";
import RevenueChart from "../../components/dashboard/revenuechart";
import ShipmentDelays from "../../components/dashboard/shipmentdelay";
import RecentActivity from "../../components/dashboard/RecentActivity";
import DeliveriesByCountry from "../../components/dashboard/DeliveriesByCountry";
import FleetStatusGauge from "../../components/dashboard/FleetStatusGauge";
import AvgDeliveryRoute from "../../components/dashboard/AvgDeliveryRoute";

import "../../styles/ui/dashboard/DashboardPage.css";

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <div className="container-fluid dashboard-main-container px-0">

        {/* Row 1: Key Stats */}
        <div className="row dashboard-cards gx-4 gy-4">
          <div className="col-12 col-sm-6 col-md-6 col-lg-3"><TotalShipmentsCard /></div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-3"><PendingDeliveriesCard /></div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-3"><DeliveredCard /></div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-3"><RevenueCard /></div>
        </div>

        {/* Row 2: Charts */}
        <div className="row gx-4 gy-4 mt-4">
          <div className="col-12 col-md-8"><RevenueChart /></div>
          <div className="col-12 col-md-4"><ShipmentDelays /></div>
        </div>

        {/* Row 3: Recent Activity - Responsive 2 Columns */}
        <div className="row row-responsive-2 gx-4 gy-4 mt-4">
          <div><RecentActivity /></div>
          <div></div> {/* Optional empty column to balance grid if only one component */}
        </div>

        {/* Row 4: Map + Gauges */}
        <div className="row row-custom-two gx-4 gy-4 mt-4">
  <div className="col"><DeliveriesByCountry /></div>
   <div className="col"><AvgDeliveryRoute /></div>
  <div className="col"><FleetStatusGauge /></div>
 
</div>


      </div>
    </div>
  );
};

export default DashboardPage;
