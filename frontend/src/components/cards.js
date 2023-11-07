import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const ReusableCard = ({ sx, children }) => {
  return (
    <Card sx={{ ...sx, padding: 0 }}>
      <CardContent style={{ padding: "10px" }}>{children}</CardContent>
    </Card>
  );
};
export default ReusableCard;
