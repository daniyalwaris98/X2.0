import React from 'react';
import RcmAlarmTableData from './rcmAlarmTable/RcmAlarmTableData';

function RcmAlarmDeviceTable({ data }) {

  return (
    <div style={{ display: "flex", justifyContent: "center", overflowY: "auto" }}>
      <div style={{ width: "597px", height: "350px", backgroundColor: "#fafafa", borderRadius: "7px", overflowY: "auto" }}>
        <div style={{ padding: "1px 0px 0px 10px" }}>
          <h3>Device</h3>
        </div>
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", padding: "0px 0px 0px 20px", gap: "10px" }}>
          {data.map((item, index) => (
            <RcmAlarmTableData
              key={index}
              Title={item.alarm_title}
              Description={item.alarm_description}
              label={item.modification_date}
              date={item.creation_date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RcmAlarmDeviceTable;
