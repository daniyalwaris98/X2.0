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
  // ======================================

  // ==========================================

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
      board: "true",
    },
    {
      id: 2,
      status: "online",
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
      board: "true",
    },
    {
      id: 4,
      status: "online",
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
      status: "online",
      ip_address: "192.168.1.1",
      device_name: "Edge_Ro-1",
      device_type: "cisco_ios",
      onboard_status: "true",
      board: "true",
    },
  ]);

  return (
    <>
      <ReusableCard
        sx={{
          backgroundColor: theme.palette.color.main,
          // width: "100%",
          // height: "100vh",

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
        {/* <DefaultTable
          sx={{
            backgroundColor: theme.palette.color.main,
            margin: "0 auto",
          }}
          data={data}
          columns={columns}
        /> */}
        {/* <div className="app-page">
          <Grid container>
            <Grid item xs={12}>
              <TextField
                label="Search..."
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={9}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>Id</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Percentage</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clients
                      .filter((client) => client.name.includes(search))
                      .map((client) => (
                        <TableRow
                          key={client.id}
                          client={client}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onUpdate={handleUpdate}
                        />
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={3}>
              <Card variant="outlined">
                <CardContent>
                  <h2>Create User</h2>
                  <TextField
                    label="Name"
                    variant="outlined"
                    value={newClient.name}
                    onChange={(e) =>
                      setNewClient({ ...newClient, name: e.target.value })
                    }
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                    fullWidth
                  >
                    Save
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div> */}
        <TableRow clients={clients} setClients={setClients} columns={columns} />
      </ReusableCard>
    </>
  );
};

export default Index;
