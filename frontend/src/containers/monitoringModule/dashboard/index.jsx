import React, { useEffect } from "react";
import { Row, Col } from "antd";
import ConfigurationChangeByVendor from "../../../components/charts/ConfigurationChangeByVendor";
import { selectTableData } from "../../../store/features/ncmModule/dashboard/selectors";
import { useSelector } from "react-redux";

import {
  useGetConfigurationChangeByDeviceQuery,
  useDeleteRecordsMutation,
  useBulkBackupNcmConfigurationsByDeviceIdsMutation,
} from "../../../store/features/ncmModule/dashboard/apis";
// import "./index.css";
// import ConfigurationByTimeLineChart from "../../../components/charts/ConfigurationByTimeLineChart";
// import ConfigurationBackupSummary from "../../ncmModule/dashboard/components/ConfigurationBackupSummary";
// import TopSubnet from "../../ipamModule/dashboard/components/TopSubnet";
// import TopOpenPorts from "../../ipamModule/dashboard/components/TopOpenPorts";
// import CredentialSummary from "./components/CredentialSummary";
// import SnmpStatus from "./components/SnmpStatus";
// import TopOsAutoDiscovery from "./components/TopOsAutoDiscovery";

function Index() {
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useGetConfigurationChangeByDeviceQuery();



  const dataSource = useSelector(selectTableData);

  console.log("dataaaaaaaaa", dataSource);
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
  return (
    <>
      <Row gutter={[32, 32]} justify="space-between">
        <Col span={24}>
          <div className="container">
            <h6 className="heading">Infrastructure HeatMap</h6>
     
          </div>
        </Col>

      
       
      </Row>

      <Row gutter={[24, 24]} justify="space-between" className="page_row">
        <Col span={12}>
          <div className="container">
            <h6 className="heading">Devices By CPU Utilization</h6>
      
          </div>
        </Col>

        <Col span={12}>
          <div className="container">
            <h6 className="heading">Devices By Memory Utilization</h6>

          </div>
        </Col>
      </Row>
      <Row gutter={[24, 24]} justify="space-between" className="page_row">
        <Col span={12}>
          <div className="container">
            <h6 className="heading">Interfaces By Bandwidth Utilization</h6>
      
          </div>
        </Col>

        <Col span={12}>
          <div className="container">
            <h6 className="heading">Infrastructure Snapshot</h6>

          </div>
        </Col>
      </Row>
    </>
  );
}

export default Index;
