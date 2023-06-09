import React, { useState } from 'react';

import { Row, Col } from 'antd';

const RackDeviceUnits = (props) => {
  return (
    <div
      style={{
        margin: '2px',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 1px 5px 0px',
        borderRadius: '8px',
        // marginTop: '2px',
        paddingTop: '25px',
        backgroundColor: '#fcfcfc',
        // width: "120px",
        // height: "100px",
      }}
    >
      <Row>
        <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 10 }}>
          <img
            src={props.myImg}
            alt=""
            // width="40px"
            // height="40px"
            style={{ marginLeft: '8px' }}
          />
        </Col>
        <Col xs={{ span: 12 }} md={{ span: 14 }} lg={{ span: 14 }}>
          <p
            style={{
              color: '#9F9F9F',
              fontSize: '10px',

              marginLeft: '15px',
              marginRight: '10px',
            }}
          >
            {props.Name}
          </p>
          <p
            style={{
              color: '#6C6B75',
              fontSize: '18px',
              fontWeight: 'bold',
              paddingBottom: '10px',
              marginTop: '-4px',
              marginLeft: '15px',
            }}
          >
            {props.myNumber}
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default RackDeviceUnits;
