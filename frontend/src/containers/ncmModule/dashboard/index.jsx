import React from 'react';
import { Row, Col } from 'antd';
import ConfigurationBackupSummary from "./components/ConfigurationBackupSummary";
// import ConfigurationByTimeLineChart from './ConfigurationByTimeLineChart';
import Compliance from './components/Compliance';
import ChangeByTimeChart from './components/ChangeByTimeChart';
import RecentRcmAlarmsChart from './components/RecentRcmAlarmsChart';
import NcmDeviceSummaryTable from './components/NcmDeviceSummaryTable';
import ConfigurationChangeByVendor from '../../../components/charts/ConfigurationChangeByVendor';

function Index() {
  return (
    <>
      <Row gutter={[16, 16]} justify="space-between" style={{ height: '332px', paddingTop: "5px" }}>
        <Col span={8}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', height: '100%' }}>
            <h5 style={{ padding: '10px', margin: '0px', fontSize: '16px' }}>Configuration Backup Summary</h5>
                        <ConfigurationBackupSummary />


          </div>
        </Col>

        <Col span={16}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', height: '100%' }}>
            <h5 style={{ padding: '10px', margin: '0px', fontSize: '16px' }}>Configuration Change by Time </h5>
          <ChangeByTimeChart/>
        

          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="space-between" style={{ height: '332px', paddingTop: "140px" }}>
        <Col span={14}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', height: '100%' }}>
            <h5 style={{ padding: '10px', margin: '0px', fontSize: '16px' }}>Recent RCM Alarms </h5>
                        {/* <ConfigurationBackupSummary /> */}

                        <RecentRcmAlarmsChart/>


          </div>
        </Col>

        <Col span={10}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', height: '100%' }}>
            <h5 style={{ padding: '10px', margin: '0px', fontSize: '16px' }}>Compliance </h5>
          {/* <ChangeByTimeChart/> */}
            <Compliance/>

          </div>
        </Col>
      </Row>








      <Row gutter={[16, 16]} justify="space-between" style={{ height: '332px', paddingTop: "280px" }}>
        <Col span={12}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', height: '100%' }}>
            <h5 style={{ padding: '10px', margin: '0px', fontSize: '16px' }}>Configuration Change by Vendor</h5>
                       
  <ConfigurationChangeByVendor/>

          </div>
        </Col>

        <Col span={12}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', height: '100%' }}>
            <h5 style={{ padding: '10px', margin: '0px', fontSize: '16px' }}>NCM Device Summary </h5>
         
<NcmDeviceSummaryTable/>
          </div>
        </Col>
      </Row>



  


    </>
  );
}

export default Index;
