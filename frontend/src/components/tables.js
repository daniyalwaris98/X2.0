import React from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Typography } from "@mui/material";
import Actions from "./actions";
const DefaultTable = ({ data, columns, sx, ...rest }) => {
  const theme = useTheme();

  return (
    <Paper elevation={3} sx={{ ...sx }}>
      <Table {...rest} sx={{ position: "relative" }}>
        <TableHead
          sx={{
            position: "relative",
          }}
        >
          <TableRow>
            {columns.map((column, colIndex) => (
              <>
                {console.log(column, "columns")}

                <TableCell
                  key={column.id}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.textColor.tableText,
                    borderBottom: "unset",
                    padding: "0px",
                  }}
                >
                  {colIndex === 0 ? (
                    <Checkbox
                      sx={{
                        color: theme.palette.color.checkboxBorder,
                        "&.Mui-checked": {
                          color: theme.palette.color.success,
                        },
                      }}
                    />
                  ) : (
                    column.label
                  )}
                </TableCell>
              </>
            ))}
            {/* <TableCell
              sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.textColor.tableText,
                borderBottom: "unset",
                padding: "0px",
                position: "absolute",
                right: "7px",
              }}
            >
              Actions
            </TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{
                backgroundColor:
                  rowIndex % 2 !== 0 ? theme.palette.background.default : "",
              }}
            >
              {columns.map((column, colIndex) => (
                <TableCell
                  sx={{
                    color: theme.palette.textColor.tableText,
                    // backgroundColor: theme.palette.background.default,
                    borderBottom: "unset",
                    padding: "0px",
                  }}
                  key={column.id}
                >
                  {/* {row[column.id]} */}
                  {colIndex === 0 ? ( // Check if it's the checkbox column
                    <Checkbox
                      sx={{
                        color: theme.palette.color.checkboxBorder,
                        "&.Mui-checked": {
                          color: theme.palette.color.success,
                        },
                      }}
                    />
                  ) : (
                    row[column.id]
                  )}
                </TableCell>
              ))}
              {/* <TableCell
                sx={{
                  color: theme.palette.textColor.tableText,
                  borderBottom: "unset",
                  padding: "0px",
                  position: "absolute",
                  right: "8px",
                  background: "red",
                  zIndex: "5",
                }}
              >
                <IconButton
                  onClick={() => {
                    // Handle edit button click
                    console.log("Edit button clicked for row", rowIndex);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    // Handle delete button click
                    console.log("Delete button clicked for row", rowIndex);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
        <Typography
          sx={{
            position: "absolute",
            top: "0",
            right: "0",
            zIndex: "5",
            width: "120px",
            background: "red",
          }}
        >
          <Actions />
        </Typography>
      </Table>
    </Paper>
  );
};

export default DefaultTable;
