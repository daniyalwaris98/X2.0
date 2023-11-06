import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import DefaultButton from "../../../components/buttons";
import DefaultTable from "../../../components/tables";
const Index = () => {
  const theme = useTheme();

  const data = [
    {
      id: 1,
      status: "Online",
      ipAddress: "192.168.1.1",
      deviceName: "Device 1",
      deviceType: "Router",
      onboardStatus: "Onboarded",
      board: "Board A",
    },
    {
      id: 2,
      status: "Offline",
      ipAddress: "192.168.1.2",
      deviceName: "Device 2",
      deviceType: "Switch",
      onboardStatus: "Not Onboarded",
      board: "Board B",
    },
    {
      id: 3,
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "Switch",
      onboardStatus: "Not Onboarded",
      board: "Board B",
    },
    {
      id: 3,
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "Switch",
      onboardStatus: "Not Onboarded",
      board: "Board B",
    },
    {
      id: 3,
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "Switch",
      onboardStatus: "Not Onboarded",
      board: "Board B",
    },
    // Add more data here
  ];

  const columns = [
    { id: "status", label: "Status" },
    { id: "ipAddress", label: "IP Address" },
    { id: "deviceName", label: "Device Name" },
    { id: "deviceType", label: "Device Type" },
    { id: "onboardStatus", label: "Onboard Status" },
    { id: "board", label: "Board" },
  ];

  return (
    <div>
      {/* <div
        className="text-[red]"
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
        }}
      >
        Failed Devices
      </div> */}

      <DefaultButton
        sx={{}}
        handleClick={() => {
          console.log("clicked");
        }}
      >
        Default Button
      </DefaultButton>

      <DefaultTable
        sx={{
          marginTop: "50px !important",
          backgroundColor: theme.palette.color.main,
          padding: "50px 20px",
          width: "90%",
          margin: "0 auto",
        }}
        data={data}
        columns={columns}
      />
    </div>
  );
};

export default Index;
