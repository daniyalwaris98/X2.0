import React from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";

const DefaultTable = ({ data, columns, sx, ...rest }) => {
  const theme = useTheme();

  return (
    <Paper elevation={3} sx={{ ...sx }}>
      <Table {...rest}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <>
                {console.log(column, "columns")}

                <TableCell
                  key={column.id}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.textColor.tableText,
                    borderBottom: "unset",
                  }}
                >
                  {column.label}
                </TableCell>
              </>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell
                  sx={{
                    color: theme.palette.textColor.tableText,
                    backgroundColor: theme.palette.background.default,
                    borderBottom: "unset",
                  }}
                  key={column.id}
                >
                  {row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DefaultTable;
