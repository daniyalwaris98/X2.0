import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import DefaultButton from "../../../components/buttons";
import DefaultTable from "../../../components/tables";
const Index = () => {
  const theme = useTheme();

  const columns = [
    { id: "name", label: "Name" },
    { id: "status", label: "Status" },
    { id: "status", label: "Status" },

    // Add more columns as needed
  ];

  const data = [
    { name: "Device 1", status: "Failed" },
    { name: "Device 2", status: "Failed" },
    { name: "Device 2", status: "Failed" },
    // Add more data rows as needed
  ];

  return (
    <div>
      <div
        className="text-[red]"
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
        }}
      >
        Failed Devices
      </div>

      <DefaultButton
        sx={{}}
        handleClick={() => {
          console.log("clicked");
        }}
      >
        Default Button
      </DefaultButton>

      <DefaultTable data={data} columns={columns} />
    </div>
  );
};

export default Index;
