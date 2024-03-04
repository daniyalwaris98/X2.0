import React from "react";
import FirstNavBar from "./FirstNavBar";
import SecondNavBar from "./SecondNavBar";

import GraphLine from "./GraphLine";

const PortalDashboard = () => {
  return (
    <div style={{ backgroundColor: "#E5E5E5" }}>
      <FirstNavBar />
      <SecondNavBar />
      <GraphLine />
    </div>
  );
};

export default PortalDashboard;
