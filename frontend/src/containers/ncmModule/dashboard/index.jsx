import React, { useEffect } from "react";
import { Row, Col } from "antd";
import ConfigurationBackupSummary from "./components/ConfigurationBackupSummary";
// import ConfigurationByTimeLineChart from './ConfigurationByTimeLineChart';
import Compliance from "./components/Compliance";
import ChangeByTimeChart from "./components/ChangeByTimeChart";
import RecentRcmAlarmsChart from "./components/RecentRcmAlarmsChart";
import NcmDeviceSummaryTable from "./components/NcmDeviceSummaryTable";
import ConfigurationChangeByVendor from "../../../components/charts/ConfigurationChangeByVendor";
import { selectConfigurationBackupSummary, selectConfigurationChangeByDevice } from "../../../store/features/ncmModule/dashboard/selectors";
import { useSelector } from "react-redux";

import {
  useGetConfigurationChangeByDeviceQuery,
  useGetConfigurationBackupSummaryQuery,
  useDeleteRecordsMutation,
  useBulkBackupNcmConfigurationsByDeviceIdsMutation,
} from "../../../store/features/ncmModule/dashboard/apis";
import "./index.css";
import ConfigurationByTimeLineChart from "../../../components/charts/ConfigurationByTimeLineChart";


function Index() {
  // const {
  //   data: fetchRecordsData,
  //   isSuccess: isFetchRecordsSuccess,
  //   isLoading: isFetchRecordsLoading,
  //   isError: isFetchRecordsError,
  //   error: fetchRecordsError,
  // } = useGetConfigurationChangeByDeviceQuery();
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useGetConfigurationChangeByDeviceQuery();
  
  const {
    data: backupSummaryData,
    isSuccess: isBackupSummarySuccess,
    isLoading: isBackupSummaryLoading,
    isError: isBackupSummaryError,
    error: backupSummaryError,
  } = useGetConfigurationBackupSummaryQuery();
  



  const dataSource1 = useSelector(selectConfigurationBackupSummary);
  const dataSource2 = useSelector( selectConfigurationChangeByDevice);

  console.log("dataaaaaaaaa1", dataSource1);
  console.log("dataaaaaaaaa2", dataSource2);
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
  const backsummary={
     backupSuccess: 4.2, backupFailure: 2, notBackup: 1 
  }
  return (
    <>
   <Row gutter={[32, 32]} justify="space-between">
  <Col span={8}>
    <div className="container">
      <h6 className="heading">
        Configuration Backup Summary
      </h6>
      <ConfigurationBackupSummary data={dataSource1} />

    </div>
  </Col>

  <Col span={16}>
    <div className="container">
      <h6 className="heading">
        Configuration Change by Device
      </h6>
      {/* <ChangeByTimeChart /> */}
      <ConfigurationByTimeLineChart 
       companyData={dataSource2}
  />
    </div>
  </Col>
</Row>

<Row gutter={[24, 24]} justify="space-between" className="page_row">
  <Col span={14}>
    <div className="container">
      <h6 className="heading">
        Recent RCM Alarms
      </h6>
      <RecentRcmAlarmsChart />
    </div>
  </Col>

  <Col span={10}>
    <div className="container">
      <h6 className="heading">
        Compliance
      </h6>
      <Compliance />
    </div>
  </Col>
</Row>

<Row gutter={[24, 24]} justify="space-between" className="page_row">
  <Col span={12}>
    <div className="container">
      <h6 className="heading">
        Configuration Change by Vendor
      </h6>
      <ConfigurationChangeByVendor />
    </div>
  </Col>

  <Col span={12}>
    <div className="container">
      <h6 className="heading">
        NCM Device Summary
      </h6>
      <NcmDeviceSummaryTable />
    </div>
  </Col>
</Row>

    </>
  );
}

export default Index;
