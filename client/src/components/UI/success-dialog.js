import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { Button } from "@mui/material";

export const SuccessDialog = (props) => {
  return (
    <Dialog open={props.openDialog} onClose={props.closeDialog}>
      <DialogTitle sx={{ backgroundColor: '#333', color: '#fff' }}>{props.message}</DialogTitle>
      <DialogActions sx={{ backgroundColor: '#333', color: '#fff' }}>
        <Button onClick={props.closeDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
