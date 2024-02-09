import React, { useEffect } from "react";
import { Row, Col } from "antd";

import ConfigurationChangeByVendor from "../../../components/charts/ConfigurationChangeByVendor";
// import { selectTableData } from "../../../store/features/ncmModule/dashboard/selectors";
import { useSelector } from "react-redux";
import {
  selectSnmpStatus,
  selectCredentialsSummary,
  selectConfigurationChangeByDevice
} from "../../../store/features/autoDiscoveryModule/dashboard/selectors";
import {
  useGetSnmpStatusQuery,
  useGetCredentialsSummaryQuery,
  useGetConfigurationChangeByDeviceQuery
} from "../../../store/features/autoDiscoveryModule/dashboard/apis";
import "./index.css";
import TopOpenPorts from "../../ipamModule/dashboard/components/TopOpenPorts";
import CredentialSummary from "./components/CredentialSummary";
import SnmpStatus from "./components/SnmpStatus";
import TopOsAutoDiscovery from "./components/TopOsAutoDiscovery";

function Index() {
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useGetConfigurationChangeByDeviceQuery();

  const {
    data: snmpStatusData,
    isSuccess: isSnmpStatusSuccess,
    isLoading: isSnmpStatusLoading,
    isError: isSnmpStatusError,
    error: SnmpStatusError,
  } = useGetSnmpStatusQuery();
  const {
    data: credentialsSummaryData,
    isSuccess: isCredentialsSummarySuccess,
    isLoading: isCredentialsSummaryLoading,
    isError: isCredentialsSummaryError,
    error: credentialsSummaryError,
  } = useGetCredentialsSummaryQuery();
  console.log("snmpStatusData",snmpStatusData)
  console.log("credentialsSummaryData",credentialsSummaryData)

  const companyData = {
    Cisco: 50,
    Fortinet: 10,
    PaloAlto: 5,
    Huawai: 3,
    Linux: 50,
    Citrix: 10,
    Hp: 20,
    Juniper: 10,
  };


  const apiResponse = [
    {
      "name": "Sales",
      "value": 4200
    },
    {
      "name": "Admin",
      "value": 3000
    },
    {
      "name": "Inform",
      "value": 20000
    },
    {
      "name": "Customer",
      "value": 35000
    },
    {
      "name": "Develop",
      "value": 50000
    },
    {
      "name": "Market",
      "value": 0
    }
  ];
  return (
    <>
      <Row gutter={[32, 32]} justify="space-between">
        <Col span={7}>
          <div className="container">
            <h6 className="heading">SNMP Status </h6>
            <SnmpStatus
             responseData={apiResponse} 
             /> 
                      </div>
        </Col>

        <Col span={10}>
          <div className="container">
            <h6 className="heading">Credentials Summary </h6>
            <CredentialSummary />
          </div>
        </Col>
        <Col span={7}>
          <div className="container">
            <h6 className="heading">Top Vendors For Discovery</h6>
            {/* <ConfigurationBackupSummary /> */}
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]} justify="space-between" className="page_row">
        <Col span={16}>
          <div className="container">
            <h6 className="heading">Top OS in Auto Discovery</h6>
            <TopOsAutoDiscovery/>
          </div>
        </Col>

        <Col span={8}>
          <div className="container">
            <h6 className="heading">Count Per Function</h6>
            <TopOpenPorts/>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Index;
