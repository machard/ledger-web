/* @flow */
import React, { ReactNode, useCallback, useEffect, useReducer } from "react";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

interface State {
  transport: any;
};

// actions/methods
export let getTransport = () => TransportWebUSB;
export let setTransport = (transport: any) => undefined;

// reducer
const reducer = (state: State, update: any) => {

  console.log("devices reducer", update);
  switch(update.type) {
    case "transport":
      return {
        ...state,
        transport: update.transport,
      };
      break;
  }
  return state;
};
const initialState: State = {
  transport: null,
};

export const context = React.createContext<State>(initialState);

const DevicesProvider = ({
  children,
}: {
  children: ReactNode,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  getTransport = useCallback(() => state.transport, []);
  setTransport = useCallback((transport: any) => {
    dispatch({
      type: "transport",
      transport
    });
    return undefined;
  }, []);

  return <context.Provider value={state}>{children}</context.Provider>;
};

export default DevicesProvider;
