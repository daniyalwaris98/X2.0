import React from "react";
import { Row, Col } from "antd";
import TypeSummaryChart from "./components/TypeSummaryChart";
import TopSubnet from "./components/TopSubnet";
import IpAvailble from "./components/IpAvailble";
import DNSChart from "./components/DNSChart";
import TenSubnetTable from "./components/TenSubnetTable";
import TopOpenPorts from "./components/TopOpenPorts";
import { useSelector } from "react-redux";


import {
selectTopTenSubnet,
selectNcmChangeByVendor, selectIpAvailbility, selectTypeSummary, selectSubnetSummary

} from "../../../store/features/ipamModule/dashboard/selectors";


import {
useGetTopTenSubnetQuery,
useGetNcmChangeByVendorQuery, useGetIpAvailibilityQuery,useGetTypeSummaryQuery, useGetSubnetSummaryQuery

} from "../../../store/features/ipamModule/dashboard/apis";


function Index() {
  const {
    data: ipAvailibilityData,
    isSuccess: isIpAvailibilitySuccess,
    isLoading: isIpAvailibilityLoading,
    isError: isIpAvailibilityError,
    error: ipAvailibilityError,
   
  } = useGetIpAvailibilityQuery();
  const {
    data: typeSummaryData,
    isSuccess: isTypeSummarySuccess,
    isLoading: isTypeSummaryLoading,
    isError: isTypeSummaryError,
    error: typeSummaryError,
   
  } = useGetTypeSummaryQuery();
  const {
    data: subnetSummaryData,
    isSuccess: isSubnetSummarySuccess,
    isLoading: isSubnetSummaryLoading,
    isError: isSubnetSummaryError,
    error: subnetSummaryError,
   
  } = useGetSubnetSummaryQuery();
  const apiResponse = {
    "total_ip": 1048,
   "used_ip": 580,
    "available_ip": 735
  };
  const data = [
    { vender: 'A', counts: 50 },
    { vender: 'B', counts: 80 },
    { vender: 'C', counts: 90 },
    { vender: 'D', counts: 50 },
    { vender: 'E', counts: 80 },
    { vender: 'F', counts: 90 },
    // Add more data as needed
  ];

  console.log("ip availble", ipAvailibilityData)
  console.log("typeSummaryData",typeSummaryData)
  console.log("subnetSummaryData",subnetSummaryData)

  return (
    <>
      <Row
        gutter={[16, 16]}
        justify="space-between"
        style={{ height: "332px", paddingTop: "5px" }}
      >
        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Type Summary
            </h5>
            <TypeSummaryChart data={typeSummaryData !== undefined? typeSummaryData:[]} />
                    </div>
        </Col>

        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
            Top 10 Subnets by % IP Address Used{" "}
            </h5>
            <TenSubnetTable />
          </div>
        </Col>
        <Col span={8}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
            Subnet Summary
            </h5>
            <TopSubnet />
          </div>
        </Col>
      </Row>
      <Row
        gutter={[16, 16]}
        justify="space-between"
        style={{ height: "332px", paddingTop: "140px" }}
      >
        <Col span={7}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              IP Availability Summary{" "}
            </h5>

            <IpAvailble  
          data={ipAvailibilityData !== undefined? ipAvailibilityData:[]} 
          // data={apiResponse}
        />
          </div>
        </Col>

        <Col span={10}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              Top 10 Open Ports
            </h5>
            <TopOpenPorts />
          </div>
        </Col>
        <Col span={7}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5 style={{ padding: "10px", margin: "0px", fontSize: "16px" }}>
              DNS{" "}
            </h5>
            <div style={{ display: "flex" }}>
              <DNSChart/>
              {/* <DNSChart/> */}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Index;
