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
import HeatMap from "./components/HeatMap";
import TenSubnetTable from "../../ipamModule/dashboard/components/TenSubnetTable";


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
          <div className="container" style={{padding:"0 0 5px 0"}}>
            <h6 className="heading">Infrastructure HeatMap</h6>
     <HeatMap/>
          </div>
        </Col>

      
       
      </Row>

      <Row gutter={[24, 24]} justify="space-between" className="page_row">
        <Col span={12}>
          <div className="container">
            <h6 className="heading">Devices By CPU Utilization</h6>
            <TenSubnetTable/>

          </div>
        </Col>

        <Col span={12}>
          <div className="container">
            <h6 className="heading">Devices By Memory Utilization</h6>
<TenSubnetTable/>
          </div>
        </Col>
      </Row>
      <Row gutter={[24, 24]} justify="space-between" className="page_row">
        <Col span={12}>
          <div className="container">
            <h6 className="heading">Interfaces By Bandwidth Utilization</h6>
            <TenSubnetTable/>

          </div>
        </Col>

        <Col span={12}>
          <div className="container">
            <h6 className="heading">Infrastructure Snapshot</h6>
            <TenSubnetTable/>

          </div>
        </Col>
      </Row>
    </>
  );
}

export default Index;
