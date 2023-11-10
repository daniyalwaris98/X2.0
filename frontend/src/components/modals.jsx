import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export default function DefaultModal({ style, open, children, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{children}</Box>
    </Modal>
  );
}
