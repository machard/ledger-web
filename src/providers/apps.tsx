/* @flow */
import React, { ReactNode } from "react";
import useReducerWithLocalStorage from "../hooks/useReducerWithLocalStorage";
import { uniqBy } from "lodash";

interface App {
  name: string;
  icon: string;
  url: string;
  isDev: boolean;
  isDefault: boolean;
}

const defaultApps: App[] = [
  {
    name: "Catalog",
    icon: "list",
    url: "https://ledger-web-catalog.vercel.app/",
    isDev: false,
    isDefault: true,
  },
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
].filter(app => !app.isDev || process.env.REACT_APP_SHOW_DEV_APPS);

interface State {
  installedApps: App[];
  app: string,
};
interface Value {
  apps: App[];
  app: string,
};

// actions/methods
export let removeApp: (url: string) => void = () => {};
export let addApp: (app: App) => void = () => {};
export let list: () => App[] = () => [];
export let setApp: (url: string) => void = () => {};

// reducer
const reducer = (state: State, update: any) => {
  let installedApps, app;
  console.log("apps reducer", update, new Error().stack);
  switch(update.type) {
    case "addApp":
      installedApps = uniqBy(
        state.installedApps.concat([update.app]),
        "name"
      );
      state = {
        ...state,
        installedApps,
      };
      break
    case "setApp":
      state = {
        ...state,
        app: update.url,
      };
      break
    case "removeApp":
      installedApps = state.installedApps.filter(app => app.url !== update.url);
      if (state.app === update.url) {
        app = defaultApps[0].url
      }
      state = {
        ...state,
        app: app || state.app,
        installedApps,
      };
      break
  }
  return state;
};
const initialState: State = {
  installedApps: [],
  app: defaultApps[0].url,
};

const valueFromState = (state: State) => {
  return {
    app: state.app,
    apps: state.installedApps.concat(defaultApps),
  };
}

export const context = React.createContext<Value>(valueFromState(initialState));

const AppsProvider = ({
  children,
}: {
  children: ReactNode,
}) => {
  const [state, dispatch] = useReducerWithLocalStorage("apps", reducer, initialState);

  removeApp = (url: string) => dispatch({
    type: "removeApp",
    url,
  });;
  addApp = (app: App) => dispatch({
    type: "addApp",
    app,
  });
  list = () => state.installedApps;
  setApp = (url: string) => dispatch({
    type: "setApp",
    url,
  });

  return <context.Provider value={valueFromState(state)}>{children}</context.Provider>;
};

export default AppsProvider;
