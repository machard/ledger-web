/* @flow */
import React, { ReactNode } from "react";
import useReducerWithLocalStorage from "../hooks/useReducerWithLocalStorage";
import { uniqBy } from "lodash";
import appsData from "../apps.json";

interface App {
  name: string;
  icon: string;
  url: string;
}

interface State {
  installedApps: App[];
  defaultApps: App[];
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
  console.log("apps reducer", update);
  switch(update.type) {
    case "addApp":
      installedApps = uniqBy(
        state.installedApps.concat([update.app]),
        "url"
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
        app = appsData.defaultApps[0].url
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
  defaultApps: appsData.defaultApps,
  app: appsData.defaultApps[0].url,
};

export const context = React.createContext<State>(initialState);

const AppsProvider = ({
  children,
}: {
  children: ReactNode,
}) => {
  const [state, dispatch] = useReducerWithLocalStorage("apps2", reducer, initialState);

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

  return <context.Provider value={state}>{children}</context.Provider>;
};

export default AppsProvider;
