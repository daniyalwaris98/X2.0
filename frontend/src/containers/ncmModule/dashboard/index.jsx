import React from 'react';
import { Row, Col } from 'antd';
// import ChangeByTimeLineChart from "./ChangeByTimeLineChart";


function Index() {
  return (
    <>
    <Row gutter={[16, 16]} justify="space-between" style={{ height: '332px',paddingTop:"0px" }}>
      <Col span={9}>
        <div style={{ backgroundColor:"#FFFFFF", borderRadius:"8px",height: '100%' }}><h5 style={{padding:"10px",margin:"0px", fontSize:"16px"}}>Configuration Backup Summary</h5>
        
        {/* <ChangeByTimeLineChart/> */}
        
        </div>
        
   
      </Col>
      
      <Col span={15}>
      <div style={{ backgroundColor:"#FFFFFF", borderRadius:"8px",height: '100%' }}> <h5 style={{padding:"10px",margin:"0px", fontSize:"16px"}}>Configuration Change by Time </h5></div>
      </Col>
    </Row>


    <Row gutter={[16, 16]} justify="space-between" style={{ height: '332px',paddingTop:"15px" }}>
      <Col span={16}>
        <div style={{ backgroundColor:"#FFFFFF", borderRadius:"8px",height: '100%' }}> <h5 style={{padding:"10px",margin:"0px", fontSize:"16px"}}>Recent RCM Alarms </h5></div>
        
   
      </Col>
      
      <Col span={8}>
      <div style={{ backgroundColor:"#FFFFFF", borderRadius:"8px",height: '100%' }}>Dashboard </div>
      </Col>
    </Row>
    <Row gutter={[16, 16]} justify="space-between" style={{ height: '332px',paddingTop:"15px" }}>
      <Col span={12}>
        <div style={{ backgroundColor:"#FFFFFF", borderRadius:"8px",height: '100%' }}>Recent RCM Alarms </div>
        
   
      </Col>
      
      <Col span={12}>
      <div style={{ backgroundColor:"#FFFFFF", borderRadius:"8px",height: '100%' }}>Dashboard </div>
      </Col>
    </Row>

    </>
  );
}

export default Index;
