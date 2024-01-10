import React from 'react';
import { Row, Col } from 'antd';
import ConfigurationBackupSummary from "./ConfigurationBackupSummary";
// import ConfigurationByTimeLineChart from './ConfigurationByTimeLineChart';
import Compliance from './Compliance';
import ChangeByTimeChart from './ChangeByTimeChart';
import RecentRcmAlarmsChart from './RecentRcmAlarmsChart';

function Index() {
  return (
    <>
      <Row gutter={[16, 16]} justify="space-between" style={{ height: '332px', paddingTop: "5px" }}>
        <Col span={7}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', height: '100%' }}>
            <h5 style={{ padding: '10px', margin: '0px', fontSize: '16px' }}>Configuration Backup Summary</h5>
                        <ConfigurationBackupSummary />


          </div>
        </Col>

        <Col span={16}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', height: '100%' }}>
            <h5 style={{ padding: '10px', margin: '0px', fontSize: '16px' }}>Configuration Change by Time </h5>
          {/* <ChangeByTimeChart/> */}
            {/* <Compliance/> */}

          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="space-between" style={{ height: '332px', paddingTop: "15px" }}>
        <Col span={13}>
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



  


    </>
  );
}

export default Index;
