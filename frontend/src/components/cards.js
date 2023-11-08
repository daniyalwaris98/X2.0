import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const ReusableCard = ({ sx, children }) => {
  return (
    <Card sx={{ ...sx, position: "relative" }}>
      <CardContent style={{ padding: "0px" }}>{children}</CardContent>
    </Card>
  );
};
export default ReusableCard;
