import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme, styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const StyledPaper = styled(Paper)`
  & {
    border-radius: 10px;
  }
`;

export default function DefaultDialog({ title, open, sx, children, ...rest }) {
  const theme = useTheme();

  return (
    <Dialog open={open} sx={{ ...sx }} PaperComponent={StyledPaper} {...rest}>
      <DialogTitle sx={{ backgroundColor: theme.palette.color.modalTitle }}>
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>{submitText}</Button>
      </DialogActions> */}
    </Dialog>
  );
}
