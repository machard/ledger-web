import Typography from '@material-ui/core/Typography';
import { DialogContent, DialogTitle } from "../components/Dialog";
import { Dialog } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({});

interface Props extends WithStyles<typeof styles> {}

function RequireDeviceAction(props: Props) {
    return (
      <Dialog disableBackdropClick aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle id="customized-dialog-title">
          A device action is needed
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Please check your device and validate the interaction.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  export default withStyles(styles)(RequireDeviceAction);
