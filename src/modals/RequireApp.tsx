import React, { useContext, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { DialogActions, DialogContent, DialogTitle } from "../components/Dialog";
import { Button, Dialog } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { context as devicesContext } from "../providers/devices";

const styles = (theme: Theme) =>
  createStyles({});

interface Props extends WithStyles<typeof styles> {
  app: any;
  handleCancel: (event?: {}, reason?: "backdropClick" | "escapeKeyDown") => void;
  handleSuccess: Function;
}

function RequireApp(props: Props) {
    const { classes, app, handleCancel, handleSuccess } = props;
    const devices = useContext(devicesContext);

    useEffect(() => {
      if (devices.app?.name === app.name) {
        handleSuccess()
      }
    })
  
    return (
      <Dialog onClose={handleCancel} aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle id="customized-dialog-title" onClose={handleCancel}>
          {app.name} is needed
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Please open the {app.name} app on your device and make sure the device is not connected to an other tab.
          </Typography>
          <Typography gutterBottom>
            If you don't have the app, please install it.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="secondary">
            I don't want
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  export default withStyles(styles)(RequireApp);
