import React, { useContext, useEffect, useState } from 'react';
import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { context } from "./providers/apps";
import api from "./api";

const styles = (theme: Theme) =>
  createStyles({
    iframe: {
      borderWidth: 0,
      width: '100%',
      height: '100%',
    }
  });

interface HeaderProps extends WithStyles<typeof styles> {}

function App(props: HeaderProps) {
  const { classes } = props;
  const [iframe, setIframe]: [any, Function] = useState();
  const [stream, setStream]: [WindowPostMessageStream | undefined, Function] = useState();
  const apps = useContext(context);

  useEffect(() => {
    if (!iframe) {
      return;
    }
    setStream(new WindowPostMessageStream({
      name: 'ledger-web-parent',
      target: apps.app,
      // todo when updating: https://github.com/MetaMask/post-message-stream/pull/23
      // targetOrigin: "*",
      targetWindow: iframe.contentWindow,
    }));
  }, [iframe]);

  useEffect(() => {
    if (!stream) {
      return;
    }

    const onMessage = (data: any) => api(stream, data);

    // @ts-ignore
    stream.on("data", onMessage);

    // @ts-ignore
    return () => stream.off("data", onMessage);
  }, [stream]);

  return (
    <React.Fragment>
      <iframe
        key={apps.app}
        ref={(iframe) => {
          setIframe(iframe);
        }}
        title={apps.app}
        src={apps.app}
        className={classes.iframe}
        allow="clipboard-write"
      />
    </React.Fragment>
  );
}

export default withStyles(styles)(App);
