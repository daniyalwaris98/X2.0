import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedDnsZone } from "../../../../store/features/ipamModule/dnsServerDropDown/dnsZones/selectors";
import Card from "../../../../components/cards";

function Index(props) {
  const selectedDnsZone = useSelector(selectSelectedDnsZone);

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
          <div style={{ color: "green" }}>{selectedDnsZone?.ip_address}</div>
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
          <div style={{ marginBottom: "15px" }}>Zone Name: </div>
          <div style={{ color: "green" }}>{selectedDnsZone?.zone_name}</div>
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
          <div style={{ marginBottom: "15px" }}>Zone Type: </div>
          <div style={{ color: "green" }}>{selectedDnsZone?.zone_type}</div>
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
          <div style={{ marginBottom: "15px" }}>Lookup Type: </div>
          <div style={{ color: "green" }}>{selectedDnsZone?.lookup_type}</div>
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
          <div style={{ marginBottom: "15px" }}>Zone Status: </div>
          <div style={{ color: "green" }}>{selectedDnsZone?.zone_status}</div>
        </div>
      </div>
    </Card>
  );
}

export default Index;
