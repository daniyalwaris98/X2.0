import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Outlet } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import Atom from "../containers/atomModule/atom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState("Admin");

  const drawerMenuItems = [
    { name: "Admin", icon: <InboxIcon /> },
    { name: "Atom", icon: <InboxIcon /> },
    { name: "Auto Discovery", icon: <InboxIcon /> },
    { name: "IPAM", icon: <InboxIcon /> },
    { name: "Monitoring", icon: <InboxIcon /> },
    { name: "NCM", icon: <InboxIcon /> },
    { name: "UAM", icon: <InboxIcon /> },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* <AppBar position="fixed" open={open} style={{ boxShadow: "none", }}>
        <Toolbar style={{ backgroundColor: "white" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{ color: "green" }}
          >
            M
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton> */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{ color: "green" }}
          >
            M
          </Typography>
        </DrawerHeader>
        <Divider />
        <List>
          {drawerMenuItems.map((item, index) => (
            <Tooltip key={item.name} title={item.name} placement="right">
              <ListItem
                key={item.name}
                disablePadding
                sx={{ display: "block" }}
                onClick={() => setSelectedModule(item.name)}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
                {/* <Divider /> */}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <DrawerHeader
          style={{
            // backgroundColor: "grey",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <div class="text-[red]">{selectedModule}</div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                // border: "1px solid black",
                borderRadius: "100px",
                width: "40px",
                height: "40px",
                backgroundColor: "silver",
              }}
            ></div>
            &nbsp; &nbsp;
            <div
              style={{
                // border: "1px solid black",
                borderRadius: "100px",
                width: "40px",
                height: "40px",
                backgroundColor: "grey",
              }}
            ></div>
            &nbsp; &nbsp;
            <div>
              <div
                style={{
                  color: "grey",
                  fontSize: "14px",
                }}
              >
                Nadeem Khan
              </div>
              <div
                style={{
                  color: "silver",
                  fontSize: "12px",
                }}
              >
                Product Designer
              </div>
            </div>
          </div>
        </DrawerHeader>
        <div style={{ padding: "10px 20px" }}>
          <Outlet />
        </div>
      </Box>
    </Box>
  );
}
