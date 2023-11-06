import React from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";
import DefaultButton from "../../../components/buttons";
import DefaultTable from "../../../components/tables";
import { ReusableCard } from "../../../components/cards";
import { Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import AccountMenu from "../../../components/NavTabs";
import Actions from "../../../components/actions";
const Index = () => {
  const theme = useTheme();

  const data = [
    {
      id: 1,
      checkBox: "checkbox",
      status: "Online",
      ipAddress: "192.168.1.1",
      deviceName: "Device 1",
      deviceType: "Router",
      onboardStatus: "true",
      board: "Board A",
    },
    {
      id: 1,
      checkBox: "checkbox",
      status: "Online",
      ipAddress: "192.168.1.1",
      deviceName: "Device 1",
      deviceType: "Router",
      onboardStatus: "true",
      board: "Board A",
    },
    {
      id: 2,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.2",
      deviceName: "Device 2",
      deviceType: "Switch",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "Switch",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "Switch",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "Switch",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 1,
      checkBox: "checkbox",
      status: "Online",
      ipAddress: "192.168.1.1",
      deviceName: "Device 1",
      deviceType: "Router",
      onboardStatus: "true",
      board: "Board A",
    },
    {
      id: 1,
      checkBox: "checkbox",
      status: "Online",
      ipAddress: "192.168.1.1",
      deviceName: "Device 1",
      deviceType: "Router",
      onboardStatus: "true",
      board: "Board A",
    },
    {
      id: 2,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.2",
      deviceName: "Device 2",
      deviceType: "Switch",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "Switch",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "Switch",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "Switch",
      onboardStatus: "true",
      board: "Board B",
    },
    // Add more data here
  ];

  const columns = [
    { id: "checkbox", label: "checkbox" },
    { id: "status", label: "Status" },
    { id: "ipAddress", label: "IP Address" },
    { id: "deviceName", label: "Device Name" },
    { id: "deviceType", label: "Device Type" },
    { id: "onboardStatus", label: "Onboard Status" },
    { id: "board", label: "Board" },
  ];

  return (
    <>
      <ReusableCard
        sx={{
          backgroundColor: theme.palette.color.main,
          width: "100%",
          height: "100vh",

          // marginTop: "40px !important",
          margin: "0 auto",
          //   padding: "30px 5px 30px 5px",
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
            ATOM
          </Typography>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "17px",
            }}
          >
            <DefaultButton
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                // width: "150px",
                padding: "7px 25px",

                border: `1px solid ${theme.palette.color.checkboxBorder}`,
              }}
              handleClick={() => {
                console.log("clicked");
              }}
            >
              <Icon
                color={theme.palette.textColor.tableText}
                fontSize="16px"
                icon="ic:baseline-plus"
              />
              <Typography
                sx={{
                  fontSize: "16px",
                  textTransform: "capitalize",
                  color: theme.palette.textColor.tableText,
                }}
              >
                Export
              </Typography>
            </DefaultButton>
            <DefaultButton
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                // width: "150px",
                padding: "7px 25px",

                backgroundColor: theme.palette.color.primary,
                color: theme.palette.color.main,
                "&:hover": {
                  backgroundColor: theme.palette.color.primary,
                },
              }}
              handleClick={() => {
                console.log("clicked");
              }}
            >
              <Icon fontSize="16px" icon="pajamas:import" />
              <Typography
                sx={{ fontSize: "16px", textTransform: "capitalize" }}
              >
                Import
              </Typography>
            </DefaultButton>
          </Typography>
        </Typography>
        <DefaultTable
          sx={{
            backgroundColor: theme.palette.color.main,
            margin: "0 auto",
          }}
          data={data}
          columns={columns}
        />
      </ReusableCard>
    </>
  );
};

export default Index;
