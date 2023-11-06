import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const BasicCard = ({ sx, children }) => {
  return (
    <Card sx={{ minWidth: 275, padding: "0px", ...sx }}>
      <CardContent
        sx={{
          padding: "0px",
          // border: "1px solid red",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%", // Ensures the content takes up full height
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default BasicCard;
