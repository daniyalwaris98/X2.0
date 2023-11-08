import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const ReusableCard = ({ sx, children }) => {
  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ padding: "0px 0px !important" }}>
        {children}
      </CardContent>
    </Card>
  );
};
export default ReusableCard;
