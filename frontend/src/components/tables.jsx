import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Popover from "@mui/material/Popover";
import { Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import Pagination from "./pagination";

export default function DefaultTable({ clients, columns, onDelete, onEdit }) {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterColumnName, setFilterColumnName] = useState("");
  const [filterColumnValue, setFilterColumnValue] = useState("");
  const [page, setPage] = useState(1); // Current page
  const pageSize = 10; // Number of rows per page

  const handleFilterOpen = (column) => (event) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterColumnName(column);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const applyColumnFilter = () => {
    handleFilterClose();
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const filteredClients = clients.slice(startIndex, endIndex);

  return (
    <Grid item xs={9}>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                padding: "0px",
                backgroundColor: theme.palette.background.default,
              }}
            >
              <TableCell
                sx={{
                  paddingLeft: "10px !important",
                  color: theme.palette.textColor.tableText,
                  borderBottom: "none !important",
                  borderRight: "1px solid #ddd",
                  padding: "0px",
                }}
              >
                <Checkbox
                  sx={{
                    color: theme.palette.color.checkboxBorder,
                    "&.Mui-checked": {
                      color: theme.palette.color.success,
                    },
                  }}
                />
              </TableCell>
              {columns.map((title) => (
                <TableCell
                  sx={{
                    paddingLeft: "10px !important",
                    borderRight: "1px solid #ddd",
                    color: theme.palette.textColor.tableText,
                    borderBottom: "none !important",
                    padding: "0px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {title.title}
                    {title.title === "Board" || title.title === "Actions" ? (
                      ""
                    ) : (
                      <IconButton onClick={handleFilterOpen("ip_address")}>
                        <SearchIcon
                          sx={{
                            color: theme.palette.textColor.tableText,
                            fontSize: "18px",
                          }}
                        />
                      </IconButton>
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client, index) => (
              <TableRow
                key={client.id}
                sx={{
                  borderBottom: "none !important",
                  backgroundColor:
                    index % 2 !== 0 ? theme.palette.background.default : "",
                }}
              >
                <TableCell
                  sx={{
                    borderRight: "1px solid #ddd",
                    paddingLeft: "10px !important",

                    color: theme.palette.textColor.tableText,
                    padding: "0px",
                    borderBottom: "none !important",
                  }}
                >
                  <Checkbox
                    sx={{
                      color: theme.palette.color.checkboxBorder,
                      "&.Mui-checked": {
                        color: theme.palette.color.success,
                      },
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "14px",
                    borderRight: "1px solid #ddd",
                    paddingLeft: "10px !important",
                    color: theme.palette.textColor.tableText,
                    borderBottom: "none !important",
                    padding: "0px",
                  }}
                >
                  {client.status === "online" ? (
                    <Icon
                      fontSize={"22px"}
                      color={theme.palette.color.primary}
                      icon="ep:success-filled"
                    />
                  ) : (
                    <Icon
                      fontSize={"23px"}
                      color={theme.palette.color.info}
                      icon="material-symbols:info"
                    />
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "14px",
                    borderRight: "1px solid #ddd",
                    paddingLeft: "10px !important",
                    color: theme.palette.color.primary,
                    borderBottom: "none !important",
                    padding: "0px",
                  }}
                >
                  {client.ip_address}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "14px",
                    borderRight: "1px solid #ddd",
                    paddingLeft: "10px !important",
                    color: theme.palette.textColor.tableText,
                    borderBottom: "none !important",
                    padding: "0px",
                  }}
                >
                  {client.device_name}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "14px",
                    borderRight: "1px solid #ddd",
                    paddingLeft: "10px !important",

                    color: theme.palette.textColor.tableText,
                    borderBottom: "none !important",

                    padding: "0px",
                  }}
                >
                  {client.device_type}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "14px",
                    borderRight: "1px solid #ddd",
                    paddingLeft: "10px !important",
                    color: theme.palette.textColor.tableText,
                    borderBottom: "none !important",
                    padding: "0px",
                  }}
                >
                  {client.onboard_status}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "14px",
                    borderRight: "1px solid #ddd",
                    paddingLeft: "10px !important",
                    color: theme.palette.textColor.tableText,
                    borderBottom: "none !important",
                    padding: "0px",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      width: "80px",
                      margin: "0 auto",
                      borderRadius: "10px",
                      background:
                        client.board === "true" ? "#F1F6EE" : "#FFECE9",
                      color: client.board === "true" ? "#3D9E47" : "#E34444",
                    }}
                  >
                    {client.board}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    color: theme.palette.textColor.tableText,
                    borderBottom: "none !important",
                    padding: "0px",
                  }}
                >
                  <IconButton onClick={() => onEdit(client)}>
                    <EditIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                  <IconButton>
                    <Icon fontSize="18px" icon="tdesign:dart-board" />
                  </IconButton>
                  <IconButton onClick={() => onDelete(client)}>
                    <DeleteIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        page={page}
        totalPageCount={Math.ceil(clients.length / pageSize)}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
      >
        <Card>
          <CardContent>
            <TextField
              label={`Filter by ${filterColumnName}`}
              value={filterColumnValue}
              onChange={(e) => setFilterColumnValue(e.target.value)}
            />
            <button onClick={applyColumnFilter}>Apply Filter</button>
          </CardContent>
        </Card>
      </Popover>
    </Grid>
  );
}
