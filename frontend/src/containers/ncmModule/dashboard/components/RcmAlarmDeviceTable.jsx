import React from 'react';
import RcmAlarmTableData from './rcmAlarmTable/RcmAlarmTableData';

function RcmAlarmDeviceTable() {
  const data = [
    { Title: "Device Configuration Backup Failed", Description: "Nets - DMZ - C367-Nets- International", label: "09:43:21", date: "01-Jan-2024" },
    { Title: "Device Configuration Backup Failed", Description: "Nets - DMZ - C367-Nets- International", label: "09:43:21", date: "01-Jan-2024" },
    { Title: "Device Configuration Backup Failed", Description: "Nets - DMZ - C367-Nets- International", label: "09:43:21", date: "01-Jan-2024" },

  ];

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
              Title={item.Title}
              Description={item.Description}
              label={item.label}
              date={item.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RcmAlarmDeviceTable;
