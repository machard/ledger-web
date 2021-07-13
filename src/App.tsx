import React, { useContext } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { context } from "./providers/apps";
import { setTransport } from "./providers/devices";
import api from "./api";
import LWEngine from "ledger-web-engine-react";

const styles = (theme: Theme) =>
  createStyles({
    engine: {
      borderWidth: 0,
      width: '100%',
      height: '100%',
    }
  });

interface HeaderProps extends WithStyles<typeof styles> {}

function App(props: HeaderProps) {
  const { classes } = props;
  const apps = useContext(context);

  console.log(apps.app);

  return (
    <React.Fragment>
      <LWEngine key="engine" app={apps.app} extraApi={api} rootClass={classes.engine} onTransport={setTransport} />
    </React.Fragment>
  );
}

export default withStyles(styles)(App);
