/* @flow */
import React, { ReactNode, useReducer } from "react";

interface App {
  name: string;
  icon: string;
  url: string;
  isDev: boolean;
  isDefault: boolean;
}

const defaultApps: App[] = [
  {
    name: "[DEV] Catalog",
    icon: "list",
    url: "http://localhost:3001/",
    isDev: true,
    isDefault: true,
  },
  {
    name: "[DEV] Wallet BTC",
    icon: "account_balance_wallet",
    url: "http://localhost:3002/",
    isDev: true,
    isDefault: true,
  }
];

interface State {
  apps: App[];
  app: string,
};
interface Update {
  app?: string,
};

// actions
export let removeApp: (uri?: string) => void = () => {};
export let addApp: (uri?: string) => void = () => {};
export let setApp: (app: string) => void = () => {};

console.log(process.env);

// reducer
const reducer = (state: State, update: Update) => {
  return {
    ...state,
    ...update,
  };
};
const initialState: State = {
  apps: [
    ...defaultApps.filter(app => !app.isDev || process.env.REACT_APP_SHOW_DEV_APPS)
  ],
  app: defaultApps[0].url,
};

export const context = React.createContext<State>(initialState);

const ApiProvider = ({
  children,
}: {
  children: ReactNode,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  removeApp = () => {};
  addApp = () => {};
  setApp = (app: string) => dispatch({ app });

  return <context.Provider value={state}>{children}</context.Provider>;
};

export default ApiProvider;
