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

const Index = ({
  title,
  submitText,
  open,
  setOpen,
  handleClose,
  sx,
  children,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ ...sx }}
      PaperComponent={StyledPaper}
      {...rest}
    >
      <DialogTitle sx={{ backgroundColor: theme.palette.color.modalTitle }}>
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>{submitText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Index;
