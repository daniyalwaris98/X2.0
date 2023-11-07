import React, { useState } from "react";

import { useTheme } from "@mui/material/styles";
import DefaultButton from "../../../components/buttons";
import DefaultTable from "../../../components/tables";
// import { ReusableCard } from "../../../components/cards";
import ReusableCard from "../../../components/cards";
import { Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import AccountMenu from "../../../components/navTabs";
import Actions from "../../../components/actions";
import TableRow from "../../../components/tables";
const Index = () => {
  const theme = useTheme();

  const data = [
    {
      id: 1,
      checkBox: "checkbox",
      status: "Online",
      ipAddress: "192.168.1.1",
      deviceName: "Device 1",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board A",
    },
    {
      id: 1,
      checkBox: "checkbox",
      status: "Online",
      ipAddress: "192.168.1.1",
      deviceName: "Device 1",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board A",
    },
    {
      id: 2,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.2",
      deviceName: "Device 2",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 1,
      checkBox: "checkbox",
      status: "Online",
      ipAddress: "192.168.1.1",
      deviceName: "Device 1",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board A",
    },
    {
      id: 1,
      checkBox: "checkbox",
      status: "Online",
      ipAddress: "192.168.1.1",
      deviceName: "Device 1",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board A",
    },
    {
      id: 2,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.2",
      deviceName: "Device 2",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board B",
    },
    {
      id: 3,
      checkBox: "checkbox",
      status: "Offline",
      ipAddress: "192.168.1.3",
      deviceName: "Device 3",
      deviceType: "cisco_ios",
      onboardStatus: "true",
      board: "Board B",
    },
    // Add more data here
  ];

  const columns = [
    { id: "2", title: "Status" },
    { id: "3", title: "IP Address" },
    { id: "4", title: "Device Name" },
    { id: "5", title: "Device Type" },
    { id: "6", title: "Onboard Status" },
    { id: "7", title: "Board" },
    { id: "8", title: "Actions" },
  ];

  const [clients, setClients] = useState([
    {
      id: 1,
      status: "online",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1s",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "false",
    },
    {
      id: 2,
      status: "offline",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "true",
    },
    {
      id: 3,
      status: "online",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1e",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "false",
    },
    {
      id: 4,
      status: "offline",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "true",
    },
    {
      id: 5,
      status: "online",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "true",
    },
    {
      id: 5,
      status: "offline",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "true",
    },
  ]);

  const onEdit = (client) => {
    console.log(client, "client");
  };

  const onDelete = (item) => {
    console.log(item, "delete");
    setClients(
      clients.filter((data) => {
        return data !== item;
      })
    );
  };
  return (
    <>
      <ReusableCard
        sx={{
          backgroundColor: theme.palette.color.main,
          margin: "0 auto",
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

        <Typography component="div"></Typography>
        <TableRow
          onDelete={onDelete}
          onEdit={onEdit}
          clients={clients}
          setClients={setClients}
          columns={columns}
        />
      </ReusableCard>
    </>
  );
};

export default Index;
