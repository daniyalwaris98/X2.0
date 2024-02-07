import React, { useEffect } from "react";
import { Row, Col } from "antd";
// import ConfigurationBackupSummary from "./components/ConfigurationBackupSummary";
// import ConfigurationByTimeLineChart from './ConfigurationByTimeLineChart';
// import Compliance from "./components/Compliance";
// import ChangeByTimeChart from "./components/ChangeByTimeChart";
// import RecentRcmAlarmsChart from "./components/RecentRcmAlarmsChart";
// import NcmDeviceSummaryTable from "./components/NcmDeviceSummaryTable";
import ConfigurationChangeByVendor from "../../../components/charts/ConfigurationChangeByVendor";
// import { selectTableData } from "../../../store/features/ncmModule/dashboard/selectors";
import { useSelector } from "react-redux";

import {
  useGetConfigurationChangeByDeviceQuery,
  useDeleteRecordsMutation,
  useBulkBackupNcmConfigurationsByDeviceIdsMutation,
} from "../../../store/features/ncmModule/dashboard/apis";
import "./index.css";
import ConfigurationByTimeLineChart from "../../../components/charts/ConfigurationByTimeLineChart";
import ConfigurationBackupSummary from "../../ncmModule/dashboard/components/ConfigurationBackupSummary";
import TopSubnet from "../../ipamModule/dashboard/components/TopSubnet";
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



  // const dataSource = useSelector(selectTableData);

  // console.log("dataaaaaaaaa", dataSource);
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
        <Col span={7}>
          <div className="container">
            <h6 className="heading">SNMP Status </h6>
            <SnmpStatus />
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
