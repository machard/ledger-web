import React, { useRef, useContext } from 'react';
import IframeResizer from "iframe-resizer-react";
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { context } from "./providers/apps";

const styles = (theme: Theme) =>
  createStyles({
    iframe: {
      borderWidth: 0,
      width: '100%',
      height: '100%'
    }
  });

interface HeaderProps extends WithStyles<typeof styles> {}

function App(props: HeaderProps) {
  const { classes } = props;
  const apps = useContext(context);
  const iFrame = useRef();

  const onMessage = (msg: any) => {
    console.log("message", msg);
  }

  return (
    <React.Fragment>
      <IframeResizer
        forwardRef={iFrame}
        log
        onMessage={onMessage}
        src={apps.app}
        className={classes.iframe}
      />
    </React.Fragment>
  );
}

export default withStyles(styles)(App);
