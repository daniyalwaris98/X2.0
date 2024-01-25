import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedDnsServer } from "../../../../store/features/ipamModule/dnsServerDropDown/dnsServers/selectors";
import Card from "../../../../components/cards";

function Index(props) {
  const selectedDnsServer = useSelector(selectSelectedDnsServer);

  return (
    <Card
      sx={{
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "14px",
          height: "90px",
        }}
      >
        <div
          style={{
            border: "1px solid #DBDBDB",
            borderRadius: "7px",
            width: "20%",
            backgroundColor: "#FAFAFA",
            padding: "10px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>IP Address: </div>
          <div style={{ color: "green" }}>{selectedDnsServer?.ip_address}</div>
        </div>
        &nbsp; &nbsp;
        <div
          style={{
            border: "1px solid #DBDBDB",
            borderRadius: "7px",
            width: "20%",
            backgroundColor: "#FAFAFA",
            padding: "10px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>Server Name: </div>
          <div style={{ color: "green" }}>{selectedDnsServer?.server_name}</div>
        </div>
        &nbsp; &nbsp;
        <div
          style={{
            border: "1px solid #DBDBDB",
            borderRadius: "7px",
            width: "20%",
            backgroundColor: "#FAFAFA",
            padding: "10px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>Type: </div>
          <div style={{ color: "green" }}>{selectedDnsServer?.type}</div>
        </div>
        &nbsp; &nbsp;
        <div
          style={{
            border: "1px solid #DBDBDB",
            borderRadius: "7px",
            width: "20%",
            backgroundColor: "#FAFAFA",
            padding: "10px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>No. of Zones: </div>
          <div style={{ color: "green" }}>{selectedDnsServer?.no_of_zones}</div>
        </div>
        &nbsp; &nbsp;
        <div
          style={{
            border: "1px solid #DBDBDB",
            borderRadius: "7px",
            width: "20%",
            backgroundColor: "#FAFAFA",
            padding: "10px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>User Name: </div>
          <div style={{ color: "green" }}>{selectedDnsServer?.user_name}</div>
        </div>
      </div>
    </Card>
  );
}

export default Index;
