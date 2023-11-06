import React from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";
import DefaultButton from "../../../components/buttons";
import DefaultTable from "../../../components/tables";
import { ReusableCard } from "../../../components/cards";
import { Typography } from "@mui/material";
const Index = () => {
  const theme = useTheme();

  // const data = [
  //   {
  //     id: 1,
  //     status: "Online",
  //     ipAddress: "192.168.1.1",
  //     deviceName: "Device 1",
  //     deviceType: "Router",
  //     onboardStatus: "true",
  //     board: "Board A",
  //   },
  //   {
  //     id: 1,
  //     status: "Online",
  //     ipAddress: "192.168.1.1",
  //     deviceName: "Device 1",
  //     deviceType: "Router",
  //     onboardStatus: "true",
  //     board: "Board A",
  //   },
  //   {
  //     id: 2,
  //     status: "Offline",
  //     ipAddress: "192.168.1.2",
  //     deviceName: "Device 2",
  //     deviceType: "Switch",
  //     onboardStatus: "true",
  //     board: "Board B",
  //   },
  //   {
  //     id: 3,
  //     status: "Offline",
  //     ipAddress: "192.168.1.3",
  //     deviceName: "Device 3",
  //     deviceType: "Switch",
  //     onboardStatus: "true",
  //     board: "Board B",
  //   },
  //   {
  //     id: 3,
  //     status: "Offline",
  //     ipAddress: "192.168.1.3",
  //     deviceName: "Device 3",
  //     deviceType: "Switch",
  //     onboardStatus: "true",
  //     board: "Board B",
  //   },
  //   {
  //     id: 3,
  //     status: "Offline",
  //     ipAddress: "192.168.1.3",
  //     deviceName: "Device 3",
  //     deviceType: "Switch",
  //     onboardStatus: "true",
  //     board: "Board B",
  //   },
  //   {
  //     id: 1,
  //     status: "Online",
  //     ipAddress: "192.168.1.1",
  //     deviceName: "Device 1",
  //     deviceType: "Router",
  //     onboardStatus: "true",
  //     board: "Board A",
  //   },
  //   {
  //     id: 1,
  //     status: "Online",
  //     ipAddress: "192.168.1.1",
  //     deviceName: "Device 1",
  //     deviceType: "Router",
  //     onboardStatus: "true",
  //     board: "Board A",
  //   },
  //   {
  //     id: 2,
  //     status: "Offline",
  //     ipAddress: "192.168.1.2",
  //     deviceName: "Device 2",
  //     deviceType: "Switch",
  //     onboardStatus: "true",
  //     board: "Board B",
  //   },
  //   {
  //     id: 3,
  //     status: "Offline",
  //     ipAddress: "192.168.1.3",
  //     deviceName: "Device 3",
  //     deviceType: "Switch",
  //     onboardStatus: "true",
  //     board: "Board B",
  //   },
  //   {
  //     id: 3,
  //     status: "Offline",
  //     ipAddress: "192.168.1.3",
  //     deviceName: "Device 3",
  //     deviceType: "Switch",
  //     onboardStatus: "true",
  //     board: "Board B",
  //   },
  //   {
  //     id: 3,
  //     status: "Offline",
  //     ipAddress: "192.168.1.3",
  //     deviceName: "Device 3",
  //     deviceType: "Switch",
  //     onboardStatus: "true",
  //     board: "Board B",
  //   },
  //   // Add more data here
  // ];

  // const columns = [
  //   // { id: "checkbox", label: <Checkbox /> },
  //   { id: "status", label: "Status" },
  //   { id: "ipAddress", label: "IP Address" },
  //   { id: "deviceName", label: "Device Name" },
  //   { id: "deviceType", label: "Device Type" },
  //   { id: "onboardStatus", label: "Onboard Status" },
  //   { id: "board", label: "Board" },
  // ];

  return (
    <>
      <h1>failed devices</h1>
      {/* <ReusableCard
      sx={{
        backgroundColor: theme.palette.color.main,
        width: "95%",
        height: "80vh",

        // marginTop: "40px !important",
        margin: "0 auto",
        padding: "30px 5px 30px 5px",
        // position: "relative",
      }}
    >
      <Typography
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: theme.palette.textColor.tableText }}>
          AUTO DISCOVERY
        </Typography>
        <DefaultButton
          // sx={{ position: "absolute", right: "0", top: "0" }}
          handleClick={() => {
            console.log("clicked");
          }}
        >
          Import
        </DefaultButton>
      </Typography>
      <DefaultTable
        sx={{
          backgroundColor: theme.palette.color.main,
          margin: "0 auto",
        }}
        data={data}
        columns={columns}
      />
    </ReusableCard> */}
    </>
  );
};

export default Index;
