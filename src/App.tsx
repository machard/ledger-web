import React, { useRef, useContext, useEffect, useState } from 'react';
import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { context, addApp } from "./providers/apps";

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

  const onMessage = (raw: any) => {
    let data;
    try {
      data = JSON.parse(raw);
    } catch(e) {
      return;
    }
    console.log("app message", data);
    switch (data.type + "/" + data.method) {
      case "apps/addApp":
        addApp(data.args[0]);
        break
    }
  }

  useEffect(() => {
    if (!iframe) {
      return;
    }
    setStream(new WindowPostMessageStream({
      name: 'ledger-web-parent',
      target: 'ledger-web-app',
      // todo when updating: https://github.com/MetaMask/post-message-stream/pull/23
      // targetOrigin: "*",
      targetWindow: iframe.contentWindow,
    }));
  }, [iframe]);

  useEffect(() => {
    if (!stream) {
      return;
    }

    // @ts-ignore
    stream.on("data", onMessage);

    // @ts-ignore
    return () => stream.off("data", onMessage);
  }, [stream]);

  return (
    <React.Fragment>
      <iframe
        ref={(iframe) => {
          setIframe(iframe);
        }}
        src={apps.app}
        className={classes.iframe}
      />
    </React.Fragment>
  );
}

export default withStyles(styles)(App);
