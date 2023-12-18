import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";

export default function DefaultCard({ sx, children }) {
  const theme = useTheme();

  return (
    <div
      style={{
        ...sx,
        position: "relative",
        backgroundColor: theme?.palette?.default_card?.background,
        borderRadius: "7px",
      }}
    >
      <CardContent style={{ padding: "0px" }}>{children}</CardContent>
    </div>
  );
}
