import React from "react";
import Card from "../../../../components/cards";
import { useSelector } from "react-redux";
import { selectSelectedInterface } from "../../../../store/features/monitoringModule/devicesLanding/interfaces/selectors";

function Index(props) {
  const selectedInterface = useSelector(selectSelectedInterface);

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
          <div style={{ color: "green" }}>{selectedInterface?.ip_address}</div>
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
          <div style={{ color: "green" }}>{selectedInterface?.server_name}</div>
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
          <div style={{ color: "green" }}>{selectedInterface?.type}</div>
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
          <div style={{ color: "green" }}>{selectedInterface?.no_of_zones}</div>
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
          <div style={{ color: "green" }}>{selectedInterface?.user_name}</div>
        </div>
      </div>
    </Card>
  );
}

export default Index;
