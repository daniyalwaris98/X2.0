// import React from "react";
// import Table from "@mui/material/Table";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import TableCell from "@mui/material/TableCell";
// import TableBody from "@mui/material/TableBody";
// import Checkbox from "@mui/material/Checkbox";
// import Paper from "@mui/material/Paper";
// import { useTheme } from "@mui/material/styles";
// import IconButton from "@mui/material/IconButton";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import { Typography } from "@mui/material";
// import Actions from "./actions";
// const DefaultTable = ({ data, columns, sx, ...rest }) => {
//   const theme = useTheme();

//   return (
//     <Paper elevation={3} sx={{ ...sx }}>
//       <Table {...rest} sx={{ position: "relative" }}>
//         <TableHead
//           sx={{
//             position: "relative",
//           }}
//         >
//           <TableRow>
//             {columns.map((column, colIndex) => (
//               <>
//                 {console.log(column, "columns")}

//                 <TableCell
//                   key={column.id}
//                   sx={{
//                     backgroundColor: theme.palette.background.default,
//                     color: theme.palette.textColor.tableText,
//                     borderBottom: "unset",
//                     padding: "0px",
//                   }}
//                 >
//                   {colIndex === 0 ? (
//                     <Checkbox
//                       sx={{
//                         color: theme.palette.color.checkboxBorder,
//                         "&.Mui-checked": {
//                           color: theme.palette.color.success,
//                         },
//                       }}
//                     />
//                   ) : (
//                     column.label
//                   )}
//                 </TableCell>
//               </>
//             ))}
//             {/* <TableCell
//               sx={{
//                 backgroundColor: theme.palette.background.default,
//                 color: theme.palette.textColor.tableText,
//                 borderBottom: "unset",
//                 padding: "0px",
//                 position: "absolute",
//                 right: "7px",
//               }}
//             >
//               Actions
//             </TableCell> */}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {data.map((row, rowIndex) => (
//             <TableRow
//               key={rowIndex}
//               sx={{
//                 backgroundColor:
//                   rowIndex % 2 !== 0 ? theme.palette.background.default : "",
//               }}
//             >
//               {columns.map((column, colIndex) => (
//                 <TableCell
//                   sx={{
//                     color: theme.palette.textColor.tableText,
//                     // backgroundColor: theme.palette.background.default,
//                     borderBottom: "unset",
//                     padding: "0px",
//                   }}
//                   key={column.id}
//                 >
//                   {/* {row[column.id]} */}
//                   {colIndex === 0 ? ( // Check if it's the checkbox column
//                     <Checkbox
//                       sx={{
//                         color: theme.palette.color.checkboxBorder,
//                         "&.Mui-checked": {
//                           color: theme.palette.color.success,
//                         },
//                       }}
//                     />
//                   ) : (
//                     row[column.id]
//                   )}
//                 </TableCell>
//               ))}
//               {/* <TableCell
//                 sx={{
//                   color: theme.palette.textColor.tableText,
//                   borderBottom: "unset",
//                   padding: "0px",
//                   position: "absolute",
//                   right: "8px",
//                   background: "red",
//                   zIndex: "5",
//                 }}
//               >
//                 <IconButton
//                   onClick={() => {
//                     // Handle edit button click
//                     console.log("Edit button clicked for row", rowIndex);
//                   }}
//                 >
//                   <EditIcon />
//                 </IconButton>
//                 <IconButton
//                   onClick={() => {
//                     // Handle delete button click
//                     console.log("Delete button clicked for row", rowIndex);
//                   }}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </TableCell> */}
//             </TableRow>
//           ))}
//         </TableBody>
//         <Typography
//           sx={{
//             position: "absolute",
//             top: "0",
//             right: "0",
//             zIndex: "5",
//             width: "120px",
//             background: "red",
//           }}
//         >
//           <Actions />
//         </Typography>
//       </Table>
//     </Paper>
//   );
// };

// export default DefaultTable;

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

function TableRows({
  clients,
  setClients,
  columns,
  onDelete,
  onEdit,
  onUpdate,
}) {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterColumnName, setFilterColumnName] = useState("");
  const [filterColumnValue, setFilterColumnValue] = useState("");

  const handleFilterOpen = (column) => (event) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterColumnName(column);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const applyColumnFilter = () => {
    // Apply your column filter logic here
    // Update the filterColumnValue state based on the selected filter
    handleFilterClose();
  };

  const [editing, setEditing] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    age: "",
    percentage: "",
  });
  const [activeClient, setActiveClient] = useState(null);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = () => {
    setEditing(false);
    onUpdate(clients);
  };
  const handleDelete = (client) => {
    const updatedClients = clients.filter((c) => c !== client);
    setClients(updatedClients);
    // Delete the client data
  };

  return (
    <Grid item xs={9}>
      <TableContainer>
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
                    <IconButton onClick={handleFilterOpen("ip_address")}>
                      <SearchIcon
                        sx={{
                          color: theme.palette.textColor.tableText,
                          fontSize: "18px",
                        }}
                      />
                    </IconButton>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client, index) => (
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
                  {client.status}
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
                  {client.board}
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
                  <IconButton onClick={() => onDelete(client)}>
                    <DeleteIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

export default TableRows;
