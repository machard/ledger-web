import React, { useContext, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { DialogActions, DialogContent, DialogTitle } from "../components/Dialog";
import { Button, Dialog } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { context as devicesContext } from "../providers/devices";
import { context as modalsContext } from "../providers/modals";

const styles = (theme: Theme) =>
  createStyles({});

interface Props extends WithStyles<typeof styles> {}

function Placeholder(props: Props) {
  const modals = useContext(modalsContext);

  const Modal = modals.Component;
  if (!Modal) {
    return null;
  }

  return <modals.Component {...modals.props} />
}

export default withStyles(styles)(Placeholder);
