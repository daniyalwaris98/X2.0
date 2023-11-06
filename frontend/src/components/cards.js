import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export function ReusableCard({ sx, children }) {
  return (
    <Card sx={{ ...sx }}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
