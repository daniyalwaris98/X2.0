import React from "react";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Typography from "@mui/material/Typography";

export default function Pagination({ page, totalPageCount, onPageChange }) {
  // console.log(totalPageCount, "total page count");
  const handlePrevClick = () => {
    onPageChange(page - 1);
  };

  const handleNextClick = () => {
    onPageChange(page + 1);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconButton onClick={handlePrevClick} disabled={page === 1}>
        <KeyboardArrowLeft />
      </IconButton>
      <Typography variant="body1" component="span">
        {page}
      </Typography>
      <IconButton onClick={handleNextClick} disabled={page === totalPageCount}>
        <KeyboardArrowRight />
      </IconButton>
    </div>
  );
}
