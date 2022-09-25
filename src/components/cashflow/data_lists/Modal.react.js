import React from "react";
import { Box, Button, Grid, Typography, Modal, Divider } from "@mui/material";

const modalBoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CustomModal = ({ open, closeModal, handleSubmit, title, children }) => {
  return (
    <Modal open={open} onClose={closeModal}>
      <Box sx={modalBoxStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Divider sx={{ marginY: 2 }} variant="middle" />
        <Grid container direction="column" alignItems="center" spacing={1}>
          <Grid item>
            <Divider />
          </Grid>
          {children}
          <Grid item>
            <Divider sx={{ marginY: 1 }} />
          </Grid>
          <Grid container direction="row" spacing={2} justifyContent="center">
            <Grid item>
              <ModalButton onClick={closeModal} title="Cancel" />
            </Grid>
            <Grid item>
              <ModalButton onClick={handleSubmit} title="Save" />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

const ModalButton = ({ onClick, title }) => {
  return (
    <Button variant="contained" onClick={onClick} style={{ width: "120px" }}>
      {title}
    </Button>
  );
};

export default CustomModal;
