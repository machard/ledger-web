/* @flow */
import React, { ReactNode, useCallback, useEffect, useReducer } from "react";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { uniqBy } from "lodash";

interface State {
  transport: any;
  app: any;
  ensuring: boolean;
};

// actions/methods

// reducer
const reducer = (state: State, update: any) => {

  console.log("devices reducer", update);
  switch(update.type) {
    case "ensuring":
      return {
        ...state,
        ensuring: update.value
      };
      break;
    case "transport":
      return {
        ...state,
        ensuring: false,
        transport: update.transport
      };
      break;
    case "app":
      return {
        ...state,
        app: update.app
      };
      break;
    case "disconnected":
      return {
        ...state,
        transport: null
      };
      break;
  }
  return state;
};
const initialState: State = {
  transport: null,
  ensuring: false,
  app: null,
};

export const context = React.createContext<State>(initialState);

export let ensureConnected = (): Transport | any => {};

const DevicesProvider = ({
  children,
}: {
  children: ReactNode,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  ensureConnected = useCallback(async () => {
    if (state.transport) {
      return state.transport;
    }

    dispatch({
      type: "ensuring",
      value: true
    });
    
    let transport = await TransportWebUSB.openConnected();
    if (transport) {
      return dispatch({
        type: "transport",
        transport
      });
    }

    try {
      transport = await TransportWebUSB.request();
    } catch(e) {}

    if (transport) {
      return dispatch({
        type: "transport",
        transport
      });
    }

    throw "No transport established";
  }, [state.transport, dispatch])

  const monitor = useCallback(async () => {
    const r = await state.transport.send(0xb0, 0x01, 0x00, 0x00);
    let i = 0;
    const format = r[i++];
    if (format !== 1) {
      return dispatch({
        type: "app",
        app: null
      });
    }
    const nameLength = r[i++];
    const name = r.slice(i, (i += nameLength)).toString("ascii");
    const versionLength = r[i++];
    const version = r.slice(i, (i += versionLength)).toString("ascii");
    const flagLength = r[i++];
    const flags = r.slice(i, (i += flagLength));

    dispatch({
      type: "app",
      app: { name, version, flags },
    });
  }, [state.transport, dispatch])

  useEffect(() => {
    if (!state.transport) {
      return;
    }
    state.transport._events.once("disconnect", () => {
      dispatch({
        type: "disconnected"
      });
    })
  }, [state.transport, dispatch])

  useEffect(() => {
    if (!state.transport) {
      return;
    }
    
    const ensure = async () => {
      try {
        await monitor();
      } catch(e) {}
    };
    const interval = setInterval(ensure, 3000);
    ensure();

    return () => clearInterval(interval)
  }, [state.transport, monitor])

  useEffect(() => {
    const ensure = async () => {
      try {
        await ensureConnected();
      } catch(e) {}
    };
    const interval = setInterval(ensure, 3000);
    ensure();

    return () => clearInterval(interval)
;  }, [ensureConnected]);

  return <context.Provider value={state}>{children}</context.Provider>;
};

export default DevicesProvider;
