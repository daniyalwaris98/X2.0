import React, { useState } from "react";
import Button from "@mui/material/Button";

import { useTheme } from "@mui/material/styles";
import DefaultButton from "../../../components/buttons";
import DefaultTable from "../../../components/tables";
// import { ReusableCard } from "../../../components/cards";
import ReusableCard from "../../../components/cards";
import { Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import AccountMenu from "../../../components/moduleMenu";
import Actions from "../../../components/actions";
import TableRow from "../../../components/tables";
import ReusableModal from "../../../components/modal";
import Form from "../form";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Index = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log(open, "check open");
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
      id: 6,
      status: "offline",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "true",
    },
    {
      id: 7,
      status: "online",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1s",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "false",
    },
    {
      id: 8,
      status: "offline",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "true",
    },
    {
      id: 9,
      status: "online",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1e",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "false",
    },
    {
      id: 10,
      status: "offline",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "true",
    },
    {
      id: 11,
      status: "online",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "true",
    },
    {
      id: 12,
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
      <Button onClick={handleOpen}>Open modal</Button>

      <ReusableModal
        style={style}
        open={open}
        setOpen={setOpen}
        handleClose={handleClose}
      >
        <Form />
      </ReusableModal>

      <ReusableCard
        sx={{
          backgroundColor: theme.palette.color.main,
          margin: "0 auto",
          padding: "10px",
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
              // handleClick={() => {
              //   console.log("clicked");
              // }}
              onClick={handleOpen}
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
